# fraud-detection-system

## Tech Stack
### 🔧 Backend
---

Node.js + Express – REST API/microservice

MongoDB – Transaction & user behavior storage

Redis – For real-time rule checking & caching

Socket.IO or Kafka/NATS – For real-time stream handling (we can start with simulated events)

Jest – Testing

---

### 🔐 Security
Rate limiting, input validation, JWT-based auth

---
### 🎯 MVP Feature Scope
 Ingest and store transactions

 Apply fraud rules (e.g., location mismatch, time anomalies, amount thresholds)

 Flag suspicious transactions

 Store flag history

 Real-time detection simulation

 REST endpoints for querying flagged activity