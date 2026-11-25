---
title: "Rust's borrow checker remembers my old bugs better than I do"
date: "2026-03-24"
tags: ["Rust", "Systems Programming", "Memory Safety"]
excerpt: "After months of fighting Rust's borrow checker, I noticed that every error it threw was a mistake I would have shipped to production in any other language. Here's how ownership, borrowing and lifetimes catch them."
coverImage: "/images/blog/understanding-rust-ownership/cover.svg"
readTime: 12
---

# Rust's borrow checker remembers my old bugs better than I do

My first month with Rust was more humbling than any other language I've learned.

I'm not new to systems programming. I've written C, I've debugged segfaults at 2am, I've read the Valgrind output and felt the specific dread of a use-after-free buried three layers deep in a callback chain. I thought Rust would feel familiar. Pointers are pointers, right?

It did not feel familiar. The compiler rejected code that _looked_ correct. It rejected code that _was_ correct by C standards. And the error messages (while excellent) pointed at problems I had trained myself to not think about.

Things changed when I noticed that every error the borrow checker threw at me was a bug I had shipped before, in another language, and that bug had cost real time and real money to debug. The borrow checker was remembering my history better than I was.

---

## Where the complexity lives

Memory management usually gets framed as GC vs. manual vs. ownership. I find it more useful to ask _where you want the complexity to live_.

Garbage-collected languages (Go, Java, Python, JavaScript) push complexity into the runtime. You get safety, but you also get stop-the-world pauses, unpredictable latency, and a memory footprint you can't fully reason about. For a web server handling requests at the 99th percentile, that GC pause at the worst possible moment is a real problem. This is why Go teams spend time tuning `GOGC`, and why Java services get restarted to "clean up memory". The complexity is still there, just harder to see.

Manual management (C, C++) puts all the complexity on the programmer. You get maximum control and maximum footguns. The [Chrome Security team reported](https://www.chromium.org/Home/chromium-security/memory-safety/) that ~70% of their high-severity CVEs are memory safety issues. The NSA has literally published guidance recommending organizations move away from C and C++. However good the C programmers are, this category of bug is hard to prevent at scale, across teams, over years.

Rust puts the complexity in the type system, at compile time. The programmer pays the cost upfront, in friction and learning curve, in exchange for guarantees that neither of the other approaches can make. And the cost doesn't grow with the size of your team or the age of your codebase the way it does with manual management.

So Rust's difficulty has a reason. It moves the complexity to the only place where it's cheap to fix: before the program runs.

---

## Ownership: the one rule behind everything else

The entire model follows from a single constraint:

> Every value has exactly one owner. When the owner goes out of scope, the value is dropped.

Everything else in the ownership system comes from enforcing that one rule consistently.

```rust
fn main() {
    let s = String::from("hello"); // s owns the heap allocation
    println!("{}", s);
} // s goes out of scope; Rust inserts the equivalent of free() here
```

There is no garbage collector racing in the background. There is no `free()` you might forget. The compiler determines exactly when memory is released and inserts the call for you, based purely on lexical scope. The runtime cost is zero.

Most people first hit the wall when assignment moves ownership instead of copying it:

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // ownership moves to s2

    println!("{}", s1); // compile error: s1 was moved
}
```

In C++, this would compile. At runtime, both `s1` and `s2` would point to the same heap memory. When both go out of scope, `free()` gets called twice. That's a double-free: undefined behavior and a potential security vulnerability. In Rust you can't write it at all, so there's nothing to remember to avoid.

Rust has a reason for not copying here. For cheap, stack-allocated types (integers, booleans, floats), Rust does copy automatically (via the `Copy` trait). But for heap-allocated types like `String` or `Vec`, a copy means allocating new memory and duplicating the data. That's not free, and Rust's philosophy is that you should pay for what you use, knowingly. If you want a copy, call `.clone()` and mean it.

---

## Borrowing: what makes ownership practical

Pure ownership would be unworkable. You'd have to transfer ownership into every function and back out again. Rust solves this with borrowing: you can lend access to a value without transferring ownership.

```rust
fn print_length(s: &String) {
    println!("Length: {}", s.len());
}

fn main() {
    let s = String::from("hello");
    print_length(&s); // lend s to the function
    println!("{}", s); // s is still ours
}
```

The `&` creates a reference, a view into data you don't own. When `print_length` returns, the reference disappears, but the original `s` is untouched.

Two rules govern references, and each one prevents a specific class of bug:

1. You can have any number of immutable (`&T`) references simultaneously.
2. Or exactly one mutable (`&mut T`) reference, with no immutable references active at the same time.

```rust
let mut v = vec![1, 2, 3];
let first = &v[0];  // immutable borrow
v.push(4);          // ERROR: cannot mutate while borrowed
println!("{}", first);
```

This looks annoying. It is annoying. It's also _eliminating iterator invalidation_, the class of bug where you iterate over a collection while simultaneously modifying it, causing the iterator to point at freed or relocated memory. C++ developers know this bug intimately. Rust refuses to compile it.

The single mutable reference rule also makes data races impossible to express in safe Rust. You don't depend on remembering to hold a mutex, because the type system won't allow two threads to hold mutable references to the same data simultaneously without synchronization. That's what Rust means by fearless concurrency. The compiler enforces the rules concurrent code needs, at compile time.

---

## Lifetimes, which everyone dreads

I wish someone had told me earlier that you don't need to understand lifetimes to be productive in Rust. Rust's _lifetime elision rules_ handle the common cases automatically. You only need explicit lifetime annotations when the compiler can't figure out the relationship itself.

The canonical example where you do need them:

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

Without the `'a` annotation, the compiler doesn't know which input the returned reference points to. If it guessed wrong and you used the result after one of the inputs was dropped, you'd have a dangling pointer. The annotation is your promise to the compiler: "the return value lives no longer than either of the inputs." The compiler holds you to that promise everywhere the function is called.

The mental model I've found most useful: a lifetime annotation expresses _relationships between_ lifetimes that already exist, how long things live _relative to each other_. Nothing you write in one changes how long a value actually lives.

---

## Who adapts to Rust quickest

I've noticed that the experienced programmers who adapt to Rust quickest are the ones who've _debugged_ the most C++, which isn't always the ones who've written the most. They've spent time understanding why a buffer overflow happened, why that pointer was invalid, why the refcount was off by one.

They recognize the borrow checker's complaints because they've seen what happens when you ignore them.

The borrow checker is, essentially, a formalization of the implicit rules that careful systems programmers already follow. "Don't use memory after freeing it." "Don't alias a mutable pointer." "Don't invalidate iterators while iterating." Experienced C developers learn these rules over years of painful debugging. Rust writes them down, enforces them automatically, and applies them to juniors and seniors alike.

I think that's underappreciated in the "Rust vs. everything else" arguments. Beyond preventing individual bugs, Rust makes safe code the path of least resistance. A team of mixed experience levels can write systems code without the senior developers constantly firefighting memory issues introduced by the juniors, and you can refactor with confidence, because the compiler will tell you exactly what broke.

---

## Practical patterns

When you don't need mutation, don't take ownership: accept `&T` instead of `T`. It's cheaper and more flexible.

When the ownership question gets complicated, return an owned value instead of a reference. A `String` is easier to deal with than a `&str` whose lifetime is unclear.

```rust
fn build_greeting(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

When you need a truly independent copy, clone it explicitly. The cost is then visible in the code, which is the point.

```rust
let original = String::from("hello");
let copy = original.clone(); // intentional allocation
```

Use `Rc<T>` only when you really have shared ownership (graph nodes, UI trees, cases where multiple owners are semantically correct). If you reach for `Rc` as a way to avoid thinking about ownership, you're usually fighting the design.

```rust
use std::rc::Rc;

let shared = Rc::new(vec![1, 2, 3]);
let another_ref = Rc::clone(&shared); // reference counted clone
```

---

## Where I've landed

I don't think Rust is the right tool for every problem. If you're building a CRUD API, the marginal safety gains don't justify the learning curve over Go or TypeScript. Rust's strength compounds in specific contexts: systems-level code, long-lived services where memory efficiency matters, anything where correctness is non-negotiable and you can't afford to learn about bugs at runtime in production.

But I've come to believe that the _ideas_ in Rust are worth understanding regardless of what you write. The ownership model forces you to think clearly about who is responsible for a piece of data and for how long. The borrowing rules make aliasing and mutation relationships explicit. These are questions you should be asking in any language. Rust just won't let you skip them.

The borrow checker encodes what people learned the hard way about why systems software fails, and it checks every line of your code against that at compile time, with no runtime cost.

Fight it long enough and it starts to feel like the most honest feedback you've ever gotten on your code.

My advice is the usual one: write Rust, read the errors carefully (they're some of the best compiler messages in any language), work out what the compiler is protecting you from, and then write more Rust.
