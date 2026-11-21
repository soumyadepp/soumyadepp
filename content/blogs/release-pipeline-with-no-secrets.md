---
title: "A Release Pipeline With No Secrets (Because I Can't Keep Them Anyway)"
date: "2026-11-21"
tags: ["CI/CD", "GitHub Actions", "Security", "Releases"]
excerpt: "PopSub ships to six places from one git tag, and no registry token is stored anywhere. Here is the pipeline, the seven rules behind it, and every way it broke on the way."
coverImage: "/images/blog/release-pipeline-with-no-secrets/cover.svg"
---

# A Release Pipeline With No Secrets (Because I Can't Keep Them Anyway)

Every project eventually reaches the moment where "release" stops meaning "push to main and feel good" and starts meaning "publish to six registries without typing a password into the wrong terminal". For [PopSub](/projects/popsub), my small pub/sub broker, that moment arrived when it grew clients in TypeScript, Python and Go. One version now has to land on GitHub Releases, ghcr.io, crates.io, npm, PyPI and the Go module proxy, ideally at the same time, ideally with the same number.

Doing that by hand is six chances to typo. Doing it with long-lived tokens in CI is six keys under six doormats. So I built a pipeline where a release is one command, one click, and zero stored secrets:

```bash
git tag v0.2.0
git push origin v0.2.0
```

Then I approve one deployment and go make tea. This post is how it works, the rules I followed, and the honest list of everything that blew up along the way.

---

## The whole thing on one page

![A pushed tag runs a check job. Then two lanes start: the build lane makes binaries and images and ships them to GitHub and ghcr.io with the run's own token, while the publish lane waits for a human to approve before publishing to crates.io, npm and PyPI with OIDC. Both lanes end at a verify job.](/images/blog/release-pipeline-with-no-secrets/pipeline.svg)

There are two lanes after the check. The build lane needs nothing but GitHub's own permissions, so it starts immediately. The publish lane talks to outside registries, where mistakes are permanent, so it waits for me. Everything ends at a job whose only purpose is to distrust everything before it.

Seven rules got it there.

## Rule 1: the tag is the button

The workflow runs on exactly one thing:

```yaml
on:
  push:
    tags: ["v[0-9]+.[0-9]+.[0-9]+"]

concurrency:
  group: release-${{ github.ref_name }}
  cancel-in-progress: false
```

Not on merges to main, not on a cron, not on a button in someone's browser. A tag is a permanent, reviewable pointer to a commit that already passed review, which makes it the best "I mean it" signal git has. The pattern also refuses `v2`, `v0.2.0-final` and `version-two-for-real`, which is exactly the kind of creativity you don't want at release time.

The `concurrency` block makes two pushes of the same tag queue up instead of racing each other to the registries. `cancel-in-progress: false` matters: cancelling a release halfway through publishing is how you get a crate on crates.io and no matching package on npm.

## Rule 2: argue with yourself before you argue with a registry

The first job publishes nothing. It reads the version from the tag and checks every file that also claims to know the version:

```bash
$ scripts/check-version.sh 0.2.0
version mismatch: clients/python/pyproject.toml is '0.1.0', the release is '0.2.0'
CHANGELOG.md has no '## [0.2.0]' section
```

Five manifests, one dependency pin and a changelog heading all have to agree. Then it runs formatting, lints, the tests and a dry run of the crate packaging. If any of that fails, nothing has left the building, and the fix is to delete the tag and try again. Registries are the opposite of forgiving. crates.io, npm and PyPI never let you replace a version once it's out, so every mistake caught here is a mistake that doesn't need a `0.2.1` and an apology.

The same changelog section becomes the GitHub release notes, through a ten-line `awk` script. One source of truth, zero copy-pasting into a text box at midnight.

## Rule 3: the best secret is the one that doesn't exist

This is the part I'm proudest of. The classic way to publish from CI goes like this: open the registry, make a token, copy it, paste it into a GitHub secret, and then forget it exists until it either expires on a Friday or leaks on a Saturday.

![Two rows. The old way: the registry makes a token, you copy it, it sits in a GitHub secret for months, and the workflow sends it. Trusted publishing: the workflow asks GitHub for an ID token, GitHub signs the repository, workflow and environment, the registry checks those claims, and the workflow gets a token that lasts minutes.](/images/blog/release-pipeline-with-no-secrets/oidc.svg)

Trusted publishing flips it around. GitHub can sign a short statement about a running job: this is repository `soumyadepp/popsub`, workflow `release.yml`, environment `release`. That statement is an OIDC ID token. You tell the registry once, in its settings, "trust statements that look exactly like this". At publish time the workflow shows the statement, the registry checks the signature and the claims, and hands back a token that expires in minutes.

There is nothing to rotate, nothing to leak, and nothing that works from a laptop. If someone copies the job's token out of a log, they hold something that expires before they finish being pleased with themselves.

The workflow side is pleasantly boring:

```yaml
  pypi:
    needs: check
    runs-on: ubuntu-latest
    environment: release
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - working-directory: clients/python
        run: uv build
      - uses: pypa/gh-action-pypi-publish@release/v1
        with:
          packages-dir: clients/python/dist
          skip-existing: true
```

No `secrets.` anywhere. `id-token: write` lets the job ask GitHub for the signed statement, and the publish action does the rest. crates.io (through `rust-lang/crates-io-auth-action`) and npm (with npm 11.5.1 or newer) work the same way.

The container image and the GitHub release don't need OIDC at all, because they live on GitHub. The run's own `GITHUB_TOKEN` is created for the run and dies with it.

## Rule 4: hand out keys one at a time

GitHub Actions jobs get a token with whatever permissions you give them, and by default that can be a lot. So the workflow starts everyone at read only:

```yaml
permissions:
  contents: read
```

and each job asks for the one extra key it needs:

![A grid of jobs against permissions. Every job can read code. Only the image jobs can push images, only the GitHub release job can write releases and tags, and only the three publish jobs can ask for an ID token and must wait for approval.](/images/blog/release-pipeline-with-no-secrets/permissions.svg)

The test job can't push an image. The image job can't create a release. Only the three publish jobs can ask for an ID token, and they also have to wait for a human. If a dependency in the test step turns out to be evil, the worst it can do is read code that is already public.

## Rule 5: put a human at the door

The publish jobs run in a GitHub environment called `release`, which has two settings that do a lot of work:

- **Required reviewers.** The jobs sit at "Waiting" until I click Approve.
- **Deployment tags `v*`.** Only a release tag can deploy to it, so a random branch can't wander in.

Automation should do the typing. A person should own the moment something becomes permanent. One click is a fair price for that.

A trap worth knowing: if a workflow names an environment that doesn't exist yet, GitHub creates it on the spot, with no reviewers and no rules. Your carefully designed approval gate becomes a decorative archway. Create the environment before you push the first tag.

## Rule 6: make every step safe to run twice

Releases fail in the middle. A registry has a bad minute, a runner dies, you forgot to configure something (foreshadowing). The question is what happens when you click "Re-run failed jobs".

Every publish step checks first and skips a version that already exists. The crates job asks the crates.io API about each crate before publishing it, the npm job runs `npm view` first, and PyPI gets `skip-existing: true`. The Go module tag and the GitHub release check for themselves too. So a half-finished release is never a crisis: fix the cause, rerun, and the jobs that already succeeded shrug and move on.

If a step can't safely run twice, you'll find out at the worst possible time, which is the second time.

## Rule 7: don't trust the green tick

A green workflow means every command exited 0. It doesn't mean a human on the internet can install your package. Registries take minutes to show new versions, the Go proxy discovers modules lazily, and images can be created private.

So the last job, `verify`, goes shopping. It asks each registry for the exact version, the two crates, npm, PyPI, the Go module proxy, the image, and all three binary downloads, and keeps asking every 20 seconds for up to 15 minutes. If anything is still missing, the run goes red. A release is done when it is installable, not when the YAML is happy.

## Things that blew up, so yours don't

None of these are hypothetical. Each one cost me at least one red run.

- **The chicken and the egg.** crates.io and npm only let you set up trusted publishing on a package that already exists. So the very first version had to be published from my machine, with a short-lived token, before the workflow could take over. PyPI is kinder: a "pending publisher" lets the workflow create the project. It doesn't reserve the name, though, so don't leave it sitting for a week.
- **crates.io wants your email verified.** It refuses to publish otherwise, with an error that is perfectly clear once you've already spent ten minutes being confused by it.
- **npm wants two-factor authentication.** My first manual publish failed with E403 until 2FA covered writes. The fix is turning it on, not finding a token that skips it.
- **Trusted publishing is per package.** For 0.2.0 the crates job first said "No Trusted Publishing config found". After I added one, it said the token was "not valid for crate popsub_sdk", because I had configured `popsub_protocol` and assumed its sibling would figure it out. It did not. Two crates, two configurations.
- **Go modules in a subfolder need their own tag.** The Go client lives in `clients/go`, so Go looks for the tag `clients/go/v0.2.0`, not `v0.2.0`. The release job now pushes both.
- **`go get` from inside your own repo doesn't work.** "Package is in the main module, so can't request version" means you're standing inside the module you're trying to download. Test installs from an empty folder.
- **The Go proxy remembers disappointment.** Ask it for a version before the tag exists and it caches "not found" for a while, so a perfectly good release looks missing for up to half an hour. Don't check early.
- **New container images may start private.** The first push to ghcr.io created a package only I could pull. One visibility toggle, once.

## What I haven't hardened yet

Honesty section. The workflow pins actions to major versions like `actions/checkout@v4`, which trusts those maintainers not to move the tag to something nasty. Pinning every action to a full commit SHA, with Dependabot to bump them, is the stricter option, and it's next on my list. Two other habits I'd recommend even though PopSub barely needs them: pass any value that could come from a stranger, like a PR title or a branch name, into scripts through `env:` instead of pasting `${{ }}` straight into `run:`, and treat `pull_request_target` like a power tool with the guard removed.

## The checklist

If you only take one thing from this post, take this list:

1. Release on a tag that matches a strict version pattern, and never cancel a release halfway.
2. Check versions, changelog and tests before anything is published.
3. Use trusted publishing (OIDC) and delete your registry tokens.
4. Start every job at `contents: read` and grant extra permissions one job at a time.
5. Put the publish jobs behind an environment with a required reviewer, and create it before the first tag.
6. Make every publish step skip versions that already exist, so reruns are safe.
7. End with a job that asks every registry for the new version, because green isn't the same as shipped.

PopSub's full workflow and the runbook I follow are in the [repository](https://github.com/soumyadepp/popsub), in `.github/workflows/release.yml` and `docs/RELEASING.md`. Steal them. They contain no secrets, which is rather the point.
