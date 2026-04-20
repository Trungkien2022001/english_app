# EnglishApp API Documentation

## Base URL
```
Development: http://localhost:8080/api/v1
Production: https://api.englishapp.com/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All responses follow this format:
```json
{
  "message": "string",
  "data": { ... }
}
```

Error responses:
```json
{
  "error": "string"
}
```

---

## Endpoints

### 1. Authentication

#### 1.1 Register
Creates a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "full_name": "John Doe",
    "level": "beginner",
    "total_xp": 0,
    "streak_days": 0,
    "is_verified": false,
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### 1.2 Login
Authenticates a user and returns tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900,
    "token_type": "Bearer"
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "full_name": "John Doe",
    "level": "beginner",
    "total_xp": 500,
    "streak_days": 7,
    "is_verified": true
  }
}
```

#### 1.3 Refresh Token
Refreshes an expired access token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

#### 1.4 Get Current User
Get the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "level": "intermediate",
  "total_xp": 1500,
  "streak_days": 14,
  "is_verified": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### 1.5 Logout
Logout the current user.

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 2. Exercises

#### 2.1 Get Categories
Get all vocabulary categories.

**Endpoint:** `GET /exercises/categories`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": "550e8400-cat-0000-0000-000000000001",
      "name": "TOEIC",
      "slug": "toeic",
      "description": "Từ vựng TOEIC",
      "icon": "📚",
      "color": "#3B82F6",
      "sort_order": 1,
      "is_active": true
    }
  ]
}
```

#### 2.2 Get Exercises
Get exercises with optional filters.

**Endpoint:** `GET /exercises`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `category_id` (optional, UUID): Filter by category
- `difficulty` (optional, string): Filter by difficulty (beginner, intermediate, advanced)
- `exercise_type_id` (optional, UUID): Filter by exercise type
- `page` (optional, integer): Page number (default: 1)
- `limit` (optional, integer): Items per page (default: 20)

**Example:** `GET /exercises?category_id=xxx&difficulty=intermediate&page=1&limit=10`

**Response (200 OK):**
```json
{
  "exercises": [
    {
      "id": "550e8400-ex01-0000-0000-000000000001",
      "title": "TOEIC Vocabulary Test 1",
      "description": "Kiểm tra từ vựng TOEIC cơ bản",
      "category": {
        "id": "550e8400-cat-0000-0000-000000000001",
        "name": "TOEIC",
        "icon": "📚"
      },
      "exercise_type": {
        "id": "550e8400-type-0000-0000-000000000001",
        "name": "Multiple Choice Anh-Việt",
        "slug": "multiple_choice_anh_viet"
      },
      "difficulty": "beginner",
      "question_count": 10,
      "pass_score": 70,
      "time_limit_seconds": 600
    }
  ],
  "page": 1,
  "limit": 20
}
```

#### 2.3 Get Exercise by ID
Get details of a specific exercise.

**Endpoint:** `GET /exercises/:id`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "id": "550e8400-ex01-0000-0000-000000000001",
  "title": "TOEIC Vocabulary Test 1",
  "description": "Kiểm tra từ vựng TOEIC cơ bản",
  "category": { ... },
  "exercise_type": { ... },
  "difficulty": "beginner",
  "question_count": 10,
  "pass_score": 70
}
```

#### 2.4 Start Test
Start a new test session.

**Endpoint:** `POST /exercises/start`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "exercise_id": "550e8400-ex01-0000-0000-000000000001",
  "device_info": {
    "user_agent": "Mozilla/5.0...",
    "ip": "192.168.1.1"
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Test started successfully",
  "session": {
    "id": "550e8400-sess-0000-0000-000000000001",
    "exercise": { ... },
    "questions": [
      {
        "id": "550e8400-q001-0000-0000-000000000001",
        "question_text": "Accommodate nghĩa là gì?",
        "question_type": "multiple_choice",
        "hint_text": "Đây là từ liên quan đến chứa đựng",
        "order_index": 1,
        "answers": [
          {
            "id": "550e8400-a001-0000-0000-000000000001",
            "answer_text": "Chứa đựng, chứa được",
            "is_correct": true,
            "order_index": 1
          },
          {
            "id": "550e8400-a002-0000-0000-000000000002",
            "answer_text": "Phân chia, phân bổ",
            "is_correct": false,
            "order_index": 2
          }
        ]
      }
    ],
    "started_at": "2025-01-01T10:00:00Z",
    "status": "in_progress",
    "total_questions": 10
  }
}
```

#### 2.5 Submit Answer
Submit an answer for a question.

**Endpoint:** `POST /exercises/:session_id/answer`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "question_id": "550e8400-q001-0000-0000-000000000001",
  "answer_id": "550e8400-a001-0000-0000-000000000001",
  "is_hint_used": false,
  "hint_type": null,
  "time_spent_seconds": 15
}
```

**Response (200 OK):**
```json
{
  "message": "Answer submitted successfully",
  "result": {
    "test_answer": {
      "id": "550e8400-ta-0000-0000-000000000001",
      "is_correct": true,
      "is_hint_used": false,
      "time_spent_seconds": 15
    },
    "is_correct": true,
    "correct_answer": {
      "id": "550e8400-a001-0000-0000-000000000001",
      "answer_text": "Chứa đựng, chứa được"
    },
    "explanation": "Accommodate có nghĩa là chứa đựng, cung cấp chỗ ở"
  }
}
```

#### 2.6 Complete Test
Complete a test session and calculate final score.

**Endpoint:** `POST /exercises/complete`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "test_session_id": "550e8400-sess-0000-0000-000000000001"
}
```

**Response (200 OK):**
```json
{
  "message": "Test completed successfully",
  "session": {
    "id": "550e8400-sess-0000-0000-000000000001",
    "correct_answers": 8,
    "score": 80.0,
    "time_spent_seconds": 300,
    "status": "completed",
    "completed_at": "2025-01-01T10:05:00Z"
  }
}
```

---

### 3. Test History

#### 3.1 Get Test History
Get user's test history with pagination.

**Endpoint:** `GET /history/tests`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `category_id` (optional, UUID): Filter by category
- `page` (optional, integer): Page number (default: 1)
- `limit` (optional, integer): Items per page (default: 20)

**Example:** `GET /history/tests?page=1&limit=10`

**Response (200 OK):**
```json
{
  "history": [
    {
      "id": "550e8400-sess-0000-0000-000000000001",
      "exercise": {
        "id": "550e8400-ex01-0000-0000-000000000001",
        "title": "TOEIC Vocabulary Test 1"
      },
      "category_name": "TOEIC",
      "exercise_type": "Multiple Choice Anh-Việt",
      "started_at": "2025-01-01T10:00:00Z",
      "completed_at": "2025-01-01T10:05:00Z",
      "total_questions": 10,
      "correct_answers": 8,
      "score": 80.0,
      "status": "completed",
      "answers": [
        {
          "question_id": "550e8400-q001-0000-0000-000000000001",
          "is_correct": true,
          "is_hint_used": false,
          "time_spent_seconds": 15,
          "answered_at": "2025-01-01T10:00:15Z"
        }
      ]
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 50
}
```

#### 3.2 Get Test Detail
Get detailed information about a specific test session.

**Endpoint:** `GET /history/tests/:id`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "id": "550e8400-sess-0000-0000-000000000001",
  "exercise": { ... },
  "category_name": "TOEIC",
  "exercise_type": "Multiple Choice Anh-Việt",
  "started_at": "2025-01-01T10:00:00Z",
  "completed_at": "2025-01-01T10:05:00Z",
  "total_questions": 10,
  "correct_answers": 8,
  "score": 80.0,
  "status": "completed",
  "answers": [
    {
      "id": "550e8400-ta-0000-0000-000000000001",
      "question": {
        "id": "550e8400-q001-0000-0000-000000000001",
        "question_text": "Accommodate nghĩa là gì?",
        "vocabulary": {
          "word": "accommodate",
          "meaning": "chứa đựng, chứa được",
          "pronunciation": "/əˈkɒmədeɪt/",
          "example_sentence": "This hotel can accommodate 200 guests."
        }
      },
      "answer": {
        "id": "550e8400-a001-0000-0000-000000000001",
        "answer_text": "Chứa đựng, chứa được",
        "is_correct": true
      },
      "is_correct": true,
      "is_hint_used": false,
      "time_spent_seconds": 15,
      "answered_at": "2025-01-01T10:00:15Z"
    }
  ]
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., user already exists) |
| 500 | Internal Server Error |

## Rate Limiting
- 100 requests per 15 minutes per IP address
- 1000 requests per hour per user

## WebSocket Support (Coming Soon)
Real-time updates for:
- Live leaderboard
- Progress tracking
- Multiplayer challenges
