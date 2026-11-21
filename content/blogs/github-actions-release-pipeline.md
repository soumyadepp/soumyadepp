---
title: "My CI Doesn't Know My Passwords"
date: "2026-11-21"
tags: ["GitHub Actions", "CI/CD", "Trusted Publishing", "OIDC", "Security"]
excerpt: "Build a GitHub Actions release pipeline with no stored secrets: tag releases, matrix builds, fail-fast, OIDC trusted publishing to npm and PyPI, and approvals."
coverImage: "/images/blog/github-actions-release-pipeline/cover.svg"
---

# My CI Doesn't Know My Passwords

For a long time I released side projects the way most people do. Bump the version, run a few publish commands from my laptop, and hope I didn't miss one. That works fine while there's one place to publish. Add a second and a third, and you start forgetting things.

This post walks through a GitHub Actions release pipeline that publishes everything from a single git tag, without keeping any passwords or tokens in CI. On the way I'll explain matrix builds, fail-fast, trusted publishing with OIDC, job permissions and approvals.

## The example: dotcheck

To keep it concrete, say we maintain **dotcheck**, a small tool that compares your `.env` file with `.env.example` and complains before you deploy with a missing variable. It's made up, but I've wanted it more than once. And yes, a tool for checking secrets is about to get a release pipeline with no secrets. I didn't plan that.

People want it in a few places:

- on npm, for Node apps to check at startup
- on PyPI, for Python apps
- as a download on GitHub Releases, for Linux and macOS
- as a Docker image on ghcr.io, for CI pipelines

So every release is four uploads, and all four need the same version number. By hand, that's four commands I can get wrong at 11pm. In a typical CI setup, it's also an npm token and a PyPI token sitting in the repo settings for months.

What I want instead is this:

```bash
git tag v1.4.0
git push origin v1.4.0
```

Push a tag, click approve once, and get on with my evening.

## The release pipeline at a glance

![A pushed tag runs a check job. Then two lanes start: the build lane makes downloads and an image and ships them to GitHub and ghcr.io with the run's own token, while the publish lane waits for a human to approve before publishing to npm and PyPI with OIDC. Both lanes end at a verify job.](/images/blog/github-actions-release-pipeline/pipeline.svg)

If you haven't used GitHub Actions much:

- A **workflow** is a YAML file in `.github/workflows/`.
- A **job** is one box. Each job runs on a fresh machine, a runner, that's thrown away afterwards.
- A **step** is one command or action inside a job.
- **`needs`** is the arrows. Jobs with no arrow between them run in parallel.

Now each part, in the order it runs.

## 1. Start the release from a git tag

```yaml
on:
  push:
    tags: ["v[0-9]+.[0-9]+.[0-9]+"]

concurrency:
  group: release-${{ github.ref_name }}
  cancel-in-progress: false
```

The workflow only runs when someone pushes a tag that looks like a version, never on merges or a schedule. Nobody creates a tag by accident, so it's a good trigger for something you can't undo. The pattern also means a tag like `v1.4.0-final-FINAL` doesn't start anything. We've all named a file like that.

A tag can point at any commit, though, including one that was never reviewed. So a repository ruleset lets only maintainers create `v*` tags, and the first job runs `git merge-base --is-ancestor "$GITHUB_SHA" origin/main` to refuse a tag on a commit that never reached main.

The `concurrency` block stops two runs for the same tag from racing each other. I keep `cancel-in-progress: false` because a release cancelled halfway is how you end up with 1.4.0 on npm and nothing on PyPI.

## 2. Check versions and tests before you publish

The version changes in an ordinary pull request, following semver: fixes bump the last number, features the middle, breaking changes the first. Tools like release-please, Changesets and semantic-release can pick the bump from commit messages; for a small project I pick it myself, then tag the merge commit.

The first job of the release doesn't publish anything. It takes the version from the tag and compares it with every file that has a version number in it:

```bash
$ scripts/check-version.sh 1.4.0
version mismatch: pyproject.toml is '1.3.0', the release is '1.4.0'
CHANGELOG.md has no '## [1.4.0]' section
```

Then it runs the linters and the tests. If any of that fails, nothing has gone out yet. I delete the tag, fix the problem and tag again.

This job is there because registries don't let you take anything back. Once 1.4.0 is on npm or PyPI, you can't replace it, not even to fix a typo in the README. You publish 1.4.1 and move on, slightly embarrassed. If 1.4.0 is actually broken, `npm deprecate` warns anyone who installs it, and yanking it on PyPI hides it from new installs.

The same job turns the 1.4.0 section of `CHANGELOG.md` into the GitHub release notes.

## 3. Build every platform at once with a matrix

The download needs a build for Linux x64, Linux ARM and macOS. Instead of three copies of the same job, I write one job with a matrix:

```yaml
  binaries:
    needs: check
    strategy:
      fail-fast: true
      matrix:
        include:
          - platform: linux-x64
            runner: ubuntu-latest
          - platform: linux-arm64
            runner: ubuntu-24.04-arm
          - platform: macos-arm64
            runner: macos-latest
    runs-on: ${{ matrix.runner }}
    steps:
      - uses: actions/checkout@v4
      - run: make build
      - uses: actions/upload-artifact@v4
        with:
          name: dotcheck-${{ matrix.platform }}
          path: dist/
```

### What is a matrix in GitHub Actions?

A [matrix](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations) runs the same job several times with different values. Here GitHub makes three copies of `binaries`, fills in `matrix.runner` and `matrix.platform` for each, and runs them in parallel on three machines.

`include` lists exact combinations. Give it lists instead and you get every combination: `os: [ubuntu-latest, macos-latest]` and `node: [20, 22, 24]` make six jobs, which is how test suites cover every Node version on every operating system.

![One binaries job becomes three runners: Linux x64 finishes, Linux ARM fails, and macOS is cancelled by GitHub because fail-fast is on.](/images/blog/github-actions-release-pipeline/matrix.svg)

### What does fail-fast do?

`fail-fast` decides what happens when one copy fails. It's `true` by default: as soon as one copy fails, GitHub cancels the others that are still running. For a release, that's what I want. If the ARM build is broken, waiting for the macOS build is pointless, and I never want a release that has two of its three downloads.

### When should you turn fail-fast off?

For test matrices I usually set `fail-fast: false`, so every copy runs to the end and I see all the failures at once, instead of fixing one, pushing, and meeting the next one twenty minutes later. Related settings: `max-parallel` caps how many copies run at once, and `continue-on-error: true` lets one entry fail without failing the run.

### How do jobs pass files to each other?

Every job gets a fresh machine, so whatever `binaries` builds disappears when it ends. `upload-artifact` saves the files, and the release job fetches them with `download-artifact`.

## 4. Use trusted publishing instead of tokens

The usual way to publish from CI is to create an access token on the registry's website, paste it into a GitHub secret and forget about it. It keeps working for months, and anyone who gets hold of it can publish as you, from anywhere.

![Two rows. The old way: the registry makes a token, you copy it, it sits in a GitHub secret for months, and the workflow sends it. Trusted publishing: the workflow asks GitHub for an ID token, GitHub signs the repository, workflow and environment, the registry checks those claims, and the workflow gets a token that lasts minutes.](/images/blog/github-actions-release-pipeline/oidc.svg)

### What is trusted publishing?

With trusted publishing there's no saved token at all. While a job runs, GitHub can hand it a signed token that says which repository, workflow and environment it belongs to, for example `you/dotcheck`, `release.yml` and `release`. That's an OIDC ID token.

On [npm](https://docs.npmjs.com/trusted-publishers) and [PyPI](https://docs.pypi.org/trusted-publishers/), you register that combination once in the package's settings. When the job publishes, it sends its ID token, the registry checks the signature and the details, and gives back a publish token that lasts a few minutes. It's useless on anyone's laptop, and if it ever ended up in a log, it would expire before anyone could do much with it.

Here's the npm job:

```yaml
  npm:
    needs: check
    runs-on: ubuntu-latest
    environment: release
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org
      - run: npm install -g npm@^11.5.1
      - run: npm ci
      - run: npm publish --access public
```

There's no `secrets.` in it. `id-token: write` lets the job ask GitHub for the ID token, and npm 11.5.1 and later do the rest. PyPI works the same way through `pypa/gh-action-pypi-publish`.

A nice side effect: npm attaches provenance to packages published this way, and the PyPI action uploads attestations by default, so anyone can check a package came from this workflow and not from someone's laptop. For the downloads, `actions/attest-build-provenance` does the same, and each file gets a SHA-256 checksum next to it.

The Docker image is built with `docker/build-push-action` for `linux/amd64` and `linux/arm64`. It and the GitHub release don't need OIDC, because they're already on GitHub. They use the `GITHUB_TOKEN` every run gets automatically, which expires when the job ends.

## 5. Give each job only the permissions it needs

The token a job gets can do as much as you let it. I start the whole workflow at read-only:

```yaml
permissions:
  contents: read
```

and then add one permission to each job that needs one:

![A grid of jobs against permissions. Every job can read code. Only the image jobs can push images, only the GitHub release job can write releases, and only the npm and PyPI jobs can ask for an ID token and must wait for approval.](/images/blog/github-actions-release-pipeline/permissions.svg)

So the test job can't push images, the image job can't create releases, and only the npm and PyPI jobs can ask for an ID token. If some package installed during the tests turns out to be malicious, all it can do is read the code, which is public anyway.

## 6. Put a human approval in front of publishing

The npm and PyPI jobs run in a GitHub environment called `release`. Two settings on it do most of the work:

- **Required reviewers.** The jobs wait until I click Approve.
- **Deployment tags `v*`.** Only version tags can use the environment, so a branch can't trigger a publish.

Publishing can't be undone, so I like being the one who says go.

One thing that caught me out: if a workflow names an environment that doesn't exist yet, GitHub creates it with no reviewers and no rules, and your approval step simply isn't there. Create it before the first tag.

## 7. Make every publish step safe to rerun

Releases fail halfway through: a registry times out, a runner dies, you forgot a setting. Then you click **Re-run failed jobs**, so every publish step first checks whether the version is already there:

```bash
if npm view "dotcheck@$VERSION" version > /dev/null 2>&1; then
  echo "dotcheck $VERSION is already on npm"
else
  npm publish --access public
fi
```

The PyPI action has this built in (`skip-existing: true`), and the release job checks for an existing GitHub release first. Jobs that already published just skip.

## 8. Check the release is really published

A green run only means every command exited with 0. It doesn't mean anyone can install the package. A new version can take a few minutes to show up, and a new Docker image can end up private.

So the last job asks each registry for the new version, every 20 seconds for up to 15 minutes, and goes red if anything is still missing:

```bash
for attempt in $(seq 1 45); do
  curl -sf "https://registry.npmjs.org/dotcheck/$VERSION" > /dev/null &&
    curl -sf "https://pypi.org/pypi/dotcheck/$VERSION/json" > /dev/null &&
    docker manifest inspect "ghcr.io/you/dotcheck:$VERSION" > /dev/null &&
    exit 0
  sleep 20
done
exit 1
```

## Mistakes I made on my own first release

dotcheck is made up. These mistakes, from a real project, are not.

- **npm and crates.io only let you set up trusted publishing on a package that already exists.** So the first version has to be published by hand. PyPI lets you add a "pending publisher" so the workflow can create the project, but that doesn't reserve the name, so don't wait long before releasing.
- **My first npm publish failed with E403.** Two-factor authentication wasn't covering publishes. Turning it on fixed it. A token that bypasses 2FA would also have "fixed" it, which is the wrong fix.
- **Trusted publishing is configured per package.** I set it up for one package and assumed the second would just work. It didn't.
- **My first image on ghcr.io was private.** One setting makes it public, but until then `docker pull` works for exactly one person.
- **Install from an empty folder when you test.** Inside the project's own repo, the package manager can pick up the local copy and hide problems your users will hit.

## Before your first real tag

Try the pipeline where mistakes are free: `npm publish --dry-run`, an upload to [TestPyPI](https://test.pypi.org/), or a practice run on a fork with throwaway package names.

Then tighten three things. Pin actions to full commit hashes (with Dependabot to update them) instead of tags like `@v4`, which their maintainers can move. Pass anything a stranger controls, like a PR title, to scripts through `env:`, never as `${{ }}` inside `run:`. And never let `pull_request_target`, which runs with your secrets, run code from the pull request.

## Release pipeline checklist

1. Release from protected version tags, and never cancel halfway.
2. Check versions, changelog and tests before publishing.
3. Build every platform with a matrix, `fail-fast` on.
4. Use trusted publishing and delete your tokens.
5. Start jobs read-only; add permissions one at a time.
6. Require an approval, in an environment created first.
7. Skip versions that already exist.
8. Check every registry at the end.

I use this setup for [PopSub](/projects/popsub), which publishes to six places. Its `release.yml` is public if you want a complete one to copy from.
