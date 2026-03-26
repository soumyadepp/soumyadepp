---
title: "Code for Scale: What Every Python Developer Should Know About '__slots__'"
date: "2025-03-10"
tags: ["Python", "Performance", "Memory", "Backend"]
excerpt: "By default, Python class instances carry a hidden memory cost. Learn how __slots__ can cut object memory usage by ~58% — and when it's actually worth using."
coverImage: "https://miro.medium.com/v2/resize:fit:1400/format:webp/0*ypl0UwFbcEfKaGv_"
readTime: 8
---

# Code for Scale: What Every Python Developer Should Know About '\_\_slots\_\_'

Imagine this:

You're developing a web scraper to gather product data from thousands of e-commerce pages. For each product, you store a name, price, and availability status. You create a `Product` class, and before you know it, you're dealing with millions of instances across different categories and sites.

Everything works fine at first — until your script starts slowing down and memory usage shoots through the roof.

But hey — each product only stores three simple values. Why is Python being so wasteful?

Turns out, the default Python object model keeps a memory-hungry secret. Unless you know about `__slots__`, your minimalist class is secretly using more memory than it should.

In this post, let's explore how Python stores object attributes, how `__slots__` can drastically reduce memory overhead, and when (and when not) to use it.

## Python Classes Are Flexible — And Heavy

By default, Python class instances are extremely flexible. You can dynamically add attributes to them at runtime, delete them, even monkey-patch methods. This flexibility is made possible because Python stores attributes in a dictionary: `__dict__`.

```python
class Regular:
    def __init__(self, name, price, available):
        self.name = name
        self.price = price
        self.available = available

obj = Regular("Laptop", 999.99, True)
print(obj.__dict__)  # {'name': 'Laptop', 'price': 999.99, 'available': True}
```

Each instance carries its own `__dict__`, which adds memory overhead. If you're only creating a handful of instances, that overhead doesn't matter. But scale that to millions of objects, and you're in for a surprise.

## How `__slots__` Slims Down Your Classes

`__slots__` is a special attribute that tells Python not to use a dynamic dictionary for attribute storage. Instead, it creates a more memory-efficient structure internally, closer to how objects work in statically typed languages like C.

```python
class Slotted:
    __slots__ = ('name', 'price', 'available')

    def __init__(self, name, price, available):
        self.name = name
        self.price = price
        self.available = available
```

Here, `Slotted` instances won't have a `__dict__`, and Python stores attributes in a predefined internal structure, reducing per-object memory footprint.

## Real-World Memory Comparison

Let's pit our `Regular` class against the `Slotted` one with a little help from the `pympler` library.

**Step 1: Install pympler**

```bash
pip install pympler
```

**Step 2: Run the benchmark**

```python
from pympler import asizeof

class Regular:
    def __init__(self, name, price, available):
        self.name = name
        self.price = price
        self.available = available

class Slotted:
    __slots__ = ('name', 'price', 'available')

    def __init__(self, name, price, available):
        self.name = name
        self.price = price
        self.available = available

# Create a million objects
regular_objs = [Regular("Laptop", 999.99, True) for _ in range(10**6)]
slotted_objs = [Slotted("Laptop", 999.99, True) for _ in range(10**6)]

size_of_regular_objs = asizeof.asizeof(regular_objs)
size_of_slotted_objs = asizeof.asizeof(slotted_objs)

percentage_memory_saved = ((size_of_regular_objs - size_of_slotted_objs) / size_of_regular_objs) * 100

print("Total memory for Regular objects:", size_of_regular_objs, "bytes")
print("Total memory for Slotted objects:", size_of_slotted_objs, "bytes")
print(f"Percentage of memory saved: {percentage_memory_saved:.2f}%")
```

Output:

```bash
Total memory for Regular objects: 152448984 bytes
Total memory for Slotted objects: 64448832 bytes
Percentage of memory saved: 57.72%
```

That's ~58% less memory usage — a massive win for large-scale systems.

## When Does `__slots__` Deserve a Spot in Your Code?

`__slots__` isn't a silver bullet. For many Python classes it's overkill. If your class needs to stay dynamic, support monkey-patching, or work well with certain libraries and frameworks, sticking with the default is often the better choice.

That said, `__slots__` can be a game-changer in the right scenarios.

**Consider using `__slots__` when:**

- You're defining simple data containers
- You're creating a large number of objects
- You don't need dynamic attributes

**Common use cases:**

- Product or data model classes in scrapers
- Geometry points, vectors, game entities
- Simulation entities (e.g. particles, agents)

## Where `__slots__` Falls Short

- You cannot add new attributes at runtime that aren't listed in `__slots__`. This restricts the flexibility Python is known for.
- Without `__dict__`, introspection, debugging, and certain serialization techniques can become more complex.
- Multiple inheritance becomes tricky, especially if only some parent classes define `__slots__`.

## Slotting It All Together

Python's `__slots__` is a low-effort, high-reward optimization technique. If you're building performance-sensitive applications or simply want to write cleaner and leaner code, it's worth adding this tool to your arsenal.

In a world obsessed with scaling, even the tiniest savings per object can have a huge impact. Try it out — your RAM will thank you.
