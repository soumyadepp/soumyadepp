---
title: "Code for scale: what every Python developer should know about '__slots__'"
date: "2025-03-10"
tags: ["Python", "Performance", "Memory", "Backend"]
excerpt: "By default, every Python object keeps its attributes in a dictionary, and that costs memory. How __slots__ cut memory use by ~58% across a million objects, and when it's worth using."
coverImage: "/images/blog/python-slots-memory-optimization/cover.svg"
readTime: 8
---

# Code for scale: what every Python developer should know about '\_\_slots\_\_'

Say you're writing a web scraper to gather product data from thousands of e-commerce pages. For each product you store a name, a price and whether it's in stock. You create a `Product` class, and before you know it you're dealing with millions of instances across different categories and sites.

Everything works fine at first, until the script starts slowing down and memory usage shoots through the roof.

But each product only stores three simple values. Why is Python being so wasteful?

It comes down to how Python stores attributes by default. Unless you know about `__slots__`, your three-field class uses more memory than it needs to.

This post covers how Python stores object attributes, how much memory `__slots__` saves, and when to use it (and when not to).

## Python classes are flexible, and heavy

By default, Python class instances are very flexible. You can add attributes at runtime, delete them, even monkey-patch methods. That works because Python keeps each instance's attributes in a dictionary, `__dict__`.

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

## How `__slots__` slims down your classes

`__slots__` is a special class attribute that tells Python to store attributes in a more compact internal structure instead of a per-instance dictionary. That's closer to how objects work in statically typed languages like C.

```python
class Slotted:
    __slots__ = ('name', 'price', 'available')

    def __init__(self, name, price, available):
        self.name = name
        self.price = price
        self.available = available
```

`Slotted` instances have no `__dict__`. Their attributes go into slots fixed when the class is defined, so each object takes less memory.

## Real-world memory comparison

Let's pit our `Regular` class against the `Slotted` one with a little help from the `pympler` library. Install it first:

```bash
pip install pympler
```

The benchmark creates a million objects of each class and measures both lists:

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

That's ~58% less memory, roughly 152 MB down to 64 MB for the same million products.

## When does `__slots__` deserve a spot in your code?

For many Python classes, `__slots__` is overkill. If your class needs to stay dynamic, support monkey-patching or work well with certain libraries and frameworks, sticking with the default is often the better choice.

It earns its place when you're defining simple data containers, creating a large number of them, and don't need dynamic attributes. Some common cases:

- product or data model classes in scrapers
- geometry points, vectors and game entities
- simulation entities, such as particles or agents

## Where `__slots__` falls short

- You cannot add new attributes at runtime that aren't listed in `__slots__`, so you give up some of the flexibility Python is known for.
- Without `__dict__`, introspection, debugging, and certain serialization techniques can become more complex.
- Multiple inheritance becomes tricky, especially if only some parent classes define `__slots__`.

## Slotting it all together

`__slots__` takes one line to add, and for a class you create by the million it can cut memory by more than half. If you're building performance-sensitive applications or just want leaner classes, it's worth knowing.

Small savings per object add up once you have millions of objects, so try it on the class you create most. Your RAM will thank you.
