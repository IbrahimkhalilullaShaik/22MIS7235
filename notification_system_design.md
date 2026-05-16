# Stage 1

## Overview

This document contains the REST API design and contract for a notification system used to display notifications to logged-in users.

The system supports:
- Creating notifications
- Fetching notifications
- Marking notifications as read
- Deleting notifications
- Fetching unread notification count
- Real-time notification delivery

---

## API Design Principles

The following standards are used while designing the APIs:

- RESTful API design
- JSON request and response format
- Consistent endpoint naming
- API versioning using `/api/v1`
- Standard HTTP methods
- Predictable response structures

Example:
- Good: `/api/v1/notifications`
- Bad: `/getNotifications`

---

## Notification Schema

```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "INFO | ALERT | ORDER",
  "isRead": false,
  "createdAt": "timestamp"
}
```

---

## Common Headers

```http
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>
```

Authentication is assumed to be pre-authorized as mentioned in the evaluation instructions.

---

# APIs

## 1. Create Notification

### Endpoint

```http
POST /api/v1/notifications
```

### Request Body

```json
{
  "userId": "user_101",
  "title": "Order Confirmed",
  "message": "Your order has been placed successfully",
  "type": "ORDER"
}
```

### Response

```json
{
  "success": true,
  "notificationId": "notif_001",
  "createdAt": "2026-05-16T10:30:00Z"
}
```

### Status Codes

- 201 Created
- 400 Bad Request
- 500 Internal Server Error

---

## 2. Get User Notifications

### Endpoint

```http
GET /api/v1/users/{userId}/notifications?page=1&limit=10
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "title": "Order Confirmed",
      "message": "Your order has been placed successfully",
      "type": "ORDER",
      "isRead": false,
      "createdAt": "2026-05-16T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

### Status Codes

- 200 OK
- 404 Not Found
- 500 Internal Server Error

---

## 3. Mark Notification as Read

### Endpoint

```http
PATCH /api/v1/notifications/{notificationId}/read
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### Status Codes

- 200 OK
- 404 Not Found
- 500 Internal Server Error

---

## 4. Delete Notification

### Endpoint

```http
DELETE /api/v1/notifications/{notificationId}
```

### Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### Status Codes

- 200 OK
- 404 Not Found
- 500 Internal Server Error

---

## 5. Get Unread Notification Count

### Endpoint

```http
GET /api/v1/users/{userId}/notifications/unread-count
```

### Response

```json
{
  "success": true,
  "unreadCount": 5
}
```

### Status Codes

- 200 OK
- 404 Not Found
- 500 Internal Server Error

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Notification not found"
  }
}
```

---

# Real-Time Notification Design

The system uses WebSockets for real-time notification delivery.

### Flow

1. User logs into the application
2. Client establishes a WebSocket connection
3. Server generates a notification
4. Notification is pushed instantly to the client
5. Frontend updates the notification section in real time

### Advantages

- Instant notification delivery
- Low latency communication
- Better user experience
- Persistent connection between client and server

---

# Additional Considerations

- Pagination is used while fetching notifications
- API versioning is included for future updates
- Consistent response structures are maintained
- Notification delivery can be processed asynchronously for better performance
- The design can be extended to support email and push notifications in future

---

# Stage 2

## Database Choice

For this notification system, PostgreSQL is used as the primary database because:
- Structured data storage
- Easy querying
- Good support for indexing
- Reliable for large scale applications

---

## Database Schema

### notifications table

```sql
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Why PostgreSQL

- Supports structured relational data
- Fast read and write operations
- Supports indexing and pagination
- Easy to scale in future

---

## Possible Problems as Data Increases

1. Slow query performance  
When notifications become very large, fetching data may become slower.

2. High storage usage  
Millions of notifications will increase database size.

3. Increased server load  
Many users requesting notifications at the same time can increase load.

---

## Solutions

- Add indexing on `user_id`
- Use pagination while fetching notifications
- Archive old notifications
- Use caching for unread counts
- Scale database vertically or horizontally if needed

---

## Sample Queries

### Insert Notification

```sql
INSERT INTO notifications (
    id,
    user_id,
    title,
    message,
    type
)
VALUES (
    'notif101',
    '22MIS7235',
    'Order Confirmed',
    'Your order was placed successfully',
    'INFO'
);
```

---

### Get User Notifications

```sql
SELECT *
FROM notifications
WHERE user_id = '22MIS7235'
ORDER BY created_at DESC
LIMIT 10;
```

---

### Mark Notification as Read

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = 'notif101';
```

---

### Delete Notification

```sql
DELETE FROM notifications
WHERE id = 'notif101';
```

---

### Get Unread Notification Count

```sql
SELECT COUNT(*)
FROM notifications
WHERE user_id = '22MIS7235'
AND is_read = FALSE;
```

---

# Stage 3

## Existing Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

## Problems in Existing Query

### 1. Using SELECT *

Using `SELECT *` fetches unnecessary columns and increases query execution time.

### 2. Missing Composite Index

Without proper indexing, the database performs a full table scan.

### 3. Sorting Overhead

Sorting millions of rows using `ORDER BY` is expensive.

---

## Optimized Query

```sql
SELECT id, type, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

---

## Recommended Index

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

---

## Complexity Analysis

### Without Index

```text
O(N)
```

Full table scan across millions of notifications.

### With Composite Index

```text
O(log N)
```

Efficient indexed lookup with faster sorting.

---

## Why Adding Indexes on Every Column is Bad

Adding indexes on all columns is not effective because:

- Increases storage consumption
- Slows down INSERT and UPDATE operations
- Increases maintenance overhead

Indexes should only be added on:
- Frequently searched columns
- Filtering columns
- Sorting columns

---

## Query to Find Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4

## Problem

Notifications are fetched on every page load for every student.

This causes:
- High database load
- Increased latency
- Slow application response
- Poor user experience

---

## Solutions

### 1. Redis Caching

Store frequently accessed data like:
- unread notification count
- latest notifications

#### Advantages
- Extremely fast reads
- Reduces DB load

#### Tradeoffs
- Cache invalidation complexity
- Additional infrastructure cost

---

### 2. Pagination

Load notifications in smaller chunks.

#### Advantages
- Smaller response payload
- Faster API responses

#### Tradeoffs
- Additional frontend handling

---

### 3. Lazy Loading

Load notifications only when user opens notification panel.

#### Advantages
- Reduces unnecessary API calls

#### Tradeoffs
- Slight delay when opening notifications

---

### 4. WebSocket Push Notifications

Push notifications directly to users in real-time.

#### Advantages
- No repeated polling
- Real-time updates

#### Tradeoffs
- Persistent socket connection management

---

### 5. Read Replicas

Use separate database replicas for read operations.

#### Advantages
- Scales read-heavy systems

#### Tradeoffs
- Replication lag
- Additional infrastructure

---

# Stage 5

## Existing Pseudocode

```python
function notify_all(student_ids: array, message: string):

    for student_id in student_ids:

        send_email(student_id, message)

        save_to_db(student_id, message)

        push_to_app(student_id, message)
```

---

## Problems in Existing Design

### 1. Sequential Processing

Processing 50,000 students one by one is extremely slow.

### 2. No Failure Recovery

If `send_email()` fails midway:
- some students receive notifications
- others do not

This creates inconsistent system state.

### 3. Tight Coupling

Email sending, database writes, and app pushes are tightly coupled.

### 4. No Retry Mechanism

Temporary failures are not retried automatically.

---

## Better Architecture

Use:
- Queue-based processing
- Event-driven architecture
- Async workers

Recommended Technologies:
- Kafka
- RabbitMQ
- BullMQ

---

## Improved System Flow

1. Notification request received
2. Events pushed into queue
3. Worker services process tasks independently
4. Failed jobs are retried automatically

---

## Improved Pseudocode

```python
function notify_all(student_ids, message):

    for student_id in student_ids:

        event = {
            "student_id": student_id,
            "message": message
        }

        queue.publish(event)
```

---

## Worker Example

```python
worker():

    while True:

        event = queue.consume()

        try:

            save_to_db(event)

            send_email(event)

            push_to_app(event)

        except:

            retry(event)
```

---

## Advantages

- Faster processing
- Better scalability
- Fault tolerance
- Retry support
- Parallel execution
- Reliable notification delivery

---

# Stage 6

## Requirement

The system should display top priority unread notifications first.

Priority depends on:
- Notification type weight
- Recency

Priority Order:
- Placement > Result > Event

---

## Notification Weight Table

| Notification Type | Weight |
|-------------------|--------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

---

## Priority Formula

```text
priority_score =
type_weight * 1000 + recency_score
```

---

## Efficient Approach

Use:
- Min Heap
- Priority Queue

Only maintain top 10 notifications in memory.

---

## Complexity Comparison

### Full Sorting

```text
O(N log N)
```

### Heap-Based Solution

```text
O(N log K)
```

Where:

```text
K = 10
```

This is much more efficient for large datasets.

---

## TypeScript Implementation

```typescript
type NotificationType = "Event" | "Result" | "Placement";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
}

const weights = {
  Event: 1,
  Result: 2,
  Placement: 3
};

function calculateScore(notification: Notification): number {

  const weight = weights[notification.type];

  const recency =
    new Date(notification.timestamp).getTime() / 1000;

  return weight * 1000000000 + recency;
}

function getTopNotifications(
  notifications: Notification[],
  topN: number = 10
): Notification[] {

  return notifications
    .sort(
      (a, b) =>
        calculateScore(b) - calculateScore(a)
    )
    .slice(0, topN);
}
```

---

## Maintaining Top 10 Efficiently

Whenever a new notification arrives:

1. Calculate priority score
2. Compare with heap root
3. Replace lower-priority notification if needed

This avoids sorting the full dataset repeatedly.

---

## Conclusion

The proposed notification system is:

- Scalable
- Fault tolerant
- Real-time capable
- Production ready
- Optimized for high traffic systems

Recommended Technologies:
- Node.js / TypeScript
- PostgreSQL
- Redis
- Kafka / RabbitMQ
- WebSockets
- React / Next.js
- Material UI

The architecture ensures:
- Low latency
- Reliable delivery
- Efficient querying
- High performance
- Better user experience
```