# Backend – Scale, Performance & Reliability

## Requirements

- **1,000,000 users per day** using the app
- **50,000 users online at the same time** at peak
- **No two users should ever book the same seat** at the same time

---

## 1. Scale — 1,000,000 DAU / 50,000 Concurrent Users

```
1,000,000 users/day
× roughly 10 API calls per visit (browse events, view tiers, book)
= 10,000,000 requests/day

10,000,000 ÷ 86,400 seconds in a day
≈ 115 requests/second on a normal day

But at peak (flash sale, popular event drop):
50,000 users online at the same time
≈ a few thousand requests/second hitting the server
```

A single Express server can handle 500–1,000 req/s comfortably. So on a normal day it is fine. During a peak, needs scaling.

---

### Run More Than One Server

Express apps are **stateless** — the server does not remember anything between requests. We can run multiple copies of the same app and put a **load balancer**.

```
Users
  │
  ▼
Load Balancer
  │
  ├── Express App (1)
  ├── Express App (2)
  └── Express App (3)
        │
        ▼
    PostgreSQL
```

A load balancer forwards each request to whichever server is least busy. If one server crashes, the load balancer stops sending traffic to it and the other two keep running.

**Tools:**
- **NGINX** as a load balancer (free, runs in Docker)
- **Docker Compose** can run multiple replicas of the backend container on the same machine as a starting point.

---

### Database scaling

As the app grows:

**Step 1 — Cache the reads**

About 95% of requests are reading data, listing events, checking ticket availability. These do not change every second. Instead of hitting the database every time, store the result in **Redis** (an in-memory store) for 30–60 seconds.

```
GET /events request comes in
  │
  ├── Check Redis first
  │     ├── Found → return it immediately
  │     └── Not found → ask PostgreSQL → save to Redis → return
```

## 2. Performance — Booking p95 Under 500ms

**Keep the booking handler specific to the requirement**

The booking route should do only specific things required for boooking tickets synchronously (in the same request):
1. Validate the input
2. Lock the tier, check availability, decrement and insert booking.
3. Return the booking ID with booking data.

Everything else (sending a confirmation email) should be done after responding, or in a background job. The user does not need to wait for an email to be sent.

**Adding database indexes**

With indexes, a lookup that takes 200ms on 100,000 rows takes ~1ms.

## 3. No Double Booking — Pessimistic Write Lock

`PESSIMISTIC_WRITE` to handle no two bookings are made for the same tier tickets for an event.


### How Pessimistic Write Lock Fixes It

`PESSIMISTIC_WRITE` tells PostgreSQL: **"Trying to update the row, lock it so nobody else can touch it until the process is done."**

## Summary

| Requirement | Solution |
|---|---|
| 1M DAU / 50K concurrent | Multiple Express instances + load balancer + Redis cache |
| Booking p95 < 500ms | Lean booking handler + database indexes |
| No double booking | TypeORM `PESSIMISTIC_WRITE` lock |