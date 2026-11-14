---
title: "Building PopSub: A Pub/Sub Broker Small Enough to Read in an Afternoon"
date: "2026-11-10"
tags: ["Rust", "Pub/Sub", "WebSockets", "Distributed Systems"]
excerpt: "I wanted to understand what a message broker does when a subscriber goes quiet, so I wrote one. Topics, at-least-once delivery, replay and persistence, in a codebase you can hold in your head."
coverImage: "/images/blog/building-popsub/cover.svg"
readTime: 8
---

# Building PopSub: A Pub/Sub Broker Small Enough to Read in an Afternoon

A pub/sub broker is three hash maps and a retry loop. Everything hard about it is deciding what happens when a message is not acknowledged. PopSub is my attempt to make those decisions in the open, in Rust, in a codebase small enough to read end to end.

Most of us use message brokers for years without opening one up. We know the vocabulary: topics, subscribers, at-least-once. We know the symptoms when it goes wrong: duplicates, lost messages, consumers that fall behind. What we rarely see is the forty lines of code where "at-least-once" stops being a phrase and becomes a table of messages waiting for a reply. I built PopSub to look at those forty lines.

---

## What it is

PopSub is a WebSocket server. Clients connect, authenticate with a signed token, subscribe to topics and publish to them. It is one process with no external dependencies, meant for local development, demos and small deployments at the edge.

The workspace is split into small crates, each with one job:

| Crate | Job |
|---|---|
| `popsub_transport` | Speaks WebSocket and parses the JSON protocol |
| `popsub_broker` | Holds topics, routes messages, tracks acknowledgements |
| `popsub_persistence` | Stores recent messages on disk with sled |
| `popsub_client` | A handle to one connected client |
| `popsub_config` | Loads settings from a file or the environment |

![Publishers send messages into the broker, which holds topics, clients, a table of pending acknowledgements and a sled store, and fans messages out to subscribers who send acknowledgements back.](/images/blog/building-popsub/architecture.svg)

---

## The whole broker is one struct

This is the centre of the system:

```rust
pub struct Broker {
    pub topics: HashMap<String, Topic>,
    pub clients: HashMap<SubscriberId, Client>,
    pub pending_acks: HashMap<String, PendingMessage>,
    persistence: Persistence,
    settings: BrokerSettings,
}
```

`topics` maps a name to the set of subscriber identifiers. `clients` maps an identifier to a channel that writes to that client's socket. Those two maps are enough to route a message: look up the topic, walk its subscribers, send to each one's channel.

Keeping identifiers in the topic, and sockets in a separate map, matters more than it looks. When a client disconnects, the broker removes one entry from `clients` and the socket is gone, even if a topic still briefly lists the identifier. A send to a missing client is a warning in the log, never a crash.

---

## The protocol is plain JSON

I chose readability over efficiency. Every frame is a JSON object with a `type`:

```json
{ "type": "subscribe", "topic": "chat" }
{ "type": "publish", "topic": "chat", "payload": "Hello" }
{ "type": "publish", "topic": "critical", "payload": "Important", "message_id": "id-123", "qos": 1 }
{ "type": "ack", "message_id": "id-123" }
```

You can drive the server from a browser console or a command-line WebSocket client. A binary protocol would be smaller and faster. It would also make the broker harder to learn from, which is the opposite of the point.

---

## Publishing, step by step

When a publish arrives, the broker does five things in order:

1. Stamps the message with the current time.
2. Gives it an identifier if the publisher did not.
3. If the message asked for delivery guarantees, records it as pending.
4. Writes it to the store.
5. Sends it to every subscriber of the topic.

Step three is the interesting one.

---

## At-least-once is a table and a timer

A publisher can mark a message `qos: 1`, meaning "keep trying until someone confirms it". The broker's side of that promise is small:

```rust
if msg.qos == 1 {
    self.pending_acks.insert(
        msg.message_id.clone(),
        PendingMessage {
            message: msg.clone(),
            sent_at: chrono::Utc::now().timestamp_millis(),
            retries: 0,
        },
    );
}
```

A background task wakes once a second and scans that table. Any message that has waited longer than the timeout is sent again and its retry count goes up. After the last retry, it is dropped. An acknowledgement at any point removes the entry.

![A timeline of an unacknowledged message: published at zero seconds, retried every five seconds, and dropped after the fifth retry at thirty seconds.](/images/blog/building-popsub/retries.svg)

The defaults are a five second timeout and five retries, both configurable. That is the entire mechanism. "At-least-once" means the broker would rather send a message twice than lose it, so subscribers have to tolerate duplicates.

---

## Replay: what a late subscriber sees

A subscriber that connects after a message was published has missed it. For chat or live dashboards, that is a poor experience. So every published message is also written to sled, an embedded key-value store, in a tree named after its topic.

The key design does most of the work:

```rust
let key = format!("{:020}_{}", msg.timestamp, Uuid::new_v4());
```

A zero-padded timestamp comes first, so keys sort in time order and reading a tree from the start gives the oldest message first. The random suffix keeps two messages in the same millisecond from colliding.

Two limits keep the store from growing without bound. A cap per topic deletes the oldest entries on write. A time-to-live removes expired entries when the topic is next read. When a client subscribes, the broker reads the tree and sends what is there before any new messages arrive.

---

## Where the simple version runs out

Writing a small broker is a good way to find out why real ones are large. These are the places where PopSub's simplicity costs something.

**One acknowledgement clears the message for everyone.** The pending table is keyed by message identifier alone. If a topic has three subscribers and one of them acknowledges, the entry is removed, and the other two are no longer retried. A production broker tracks delivery per subscriber.

**A retry goes to every subscriber.** For the same reason, when a message times out it is sent again to the whole topic, including subscribers that already received it.

**Replayed messages are best effort.** On subscribe, stored messages are sent with fresh identifiers and without delivery guarantees. History is a convenience, not a contract.

**The broker sits behind one lock.** All state lives in a single mutex, so one slow operation holds up every other client. That is fine for hundreds of connections and wrong for many thousands, where state would be split by topic.

**There is no back-pressure.** A slow subscriber's channel simply fills. A real broker has to decide whether to buffer, drop or disconnect.

None of these is hard to see once the code is in front of you. That was the reason for building it.

---

## What I took from it

Three things changed how I think about messaging systems.

**Guarantees live in data structures.** "At-least-once" sounded like a property of the network until I saw it was a map and a loop. Reading the pending table tells you exactly what the system promises and what it does not.

**The failure path is most of the design.** Delivering a message to a connected, healthy subscriber took an hour to write. Every decision after that was about subscribers that are slow, gone, or late.

**Small systems are worth building.** PopSub will not replace anything in production. It replaced a vague picture in my head with a precise one, which is a better use of a weekend than it sounds.

---

## Try it

```bash
git clone https://github.com/soumyadepp/popsub.git
cd popsub
cargo run -p popsub -- server
```

In a second terminal:

```bash
cargo run -p popsub -- client --url ws://127.0.0.1:8080
```

The example client connects, authenticates, subscribes to a topic and publishes a message. From there, the broker crate is the place to start reading.
