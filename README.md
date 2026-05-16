# Affordmed Full Stack Evaluation — Notification System

## Candidate Information

- Name: Shaik Ibrahim Khalilulla
- Roll Number: 22MIS7235

---

# Project Overview

This project contains the complete solution for the Affordmed Full Stack Evaluation.

The system is a scalable Notification Management Platform supporting:

- Notification APIs
- Real-time notification delivery
- Query optimization
- Scalable architecture
- Priority inbox system
- Logging middleware integration

---

# Features

## Stage 1
- REST API Design
- Notification APIs
- Real-time notification architecture

## Stage 2
- PostgreSQL database design
- SQL schema
- Indexing strategies

## Stage 3
- Query optimization
- Complexity analysis
- Index recommendations

## Stage 4
- Performance optimization
- Redis caching
- Pagination
- WebSocket push mechanism

## Stage 5
- Queue-based scalable notification processing
- Kafka/RabbitMQ architecture
- Retry mechanism

## Stage 6
- Priority inbox system
- Heap/Priority Queue optimization
- TypeScript implementation

---

# Logging Middleware

The project includes reusable logging middleware integrated with the Affordmed evaluation logging APIs.

Features:
- Token-based authentication
- Centralized logging utility
- Backend logging support
- Production-style environment variable management

---

# Tech Stack

- TypeScript
- Node.js
- Axios
- PostgreSQL
- Redis
- Kafka / RabbitMQ
- WebSockets

---

# Project Structure

```text
22MIS7235/
│
├── src/
│   ├── logger.ts
│   └── test.ts
│
├── notification_system_design.md
├── README.md
├── package.json
├── tsconfig.json
└── .gitignore
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example:

```env
EMAIL=
NAME=
ROLL_NO=
ACCESS_CODE=
CLIENT_ID=
CLIENT_SECRET=
```

---

# Install Dependencies

```bash
npm install
```

---

# Run Logging Middleware Test

```bash
npx ts-node src/test.ts
```

---

# Expected Output

```text
LOG SUCCESS:
{
  logID: "...",
  message: "log created successfully"
}
```

---

# Scalability Considerations

The architecture is designed to support:
- millions of notifications
- thousands of concurrent users
- low latency reads
- real-time delivery
- fault tolerance

---

# Future Improvements

- Push notifications
- Email notifications
- Mobile app integration
- Notification analytics
- AI-based priority ranking

---

# Conclusion

This project demonstrates:
- scalable backend system design
- database optimization
- distributed architecture
- real-time systems
- production-level middleware integration
- performance optimization techniques