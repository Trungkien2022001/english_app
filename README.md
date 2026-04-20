# 🇬🇧 English Learning App

Ứng dụng học tiếng Anh đa nền tảng với hệ thống bài tập đa dạng và tracking progress chi tiết.

## 🏗️ Architecture

```
EnglishApp/
├── frontend/          # Next.js 15 (Web App)
├── backend/           # Go (Clean Architecture)
├── mobile/            # React Native (Expo)
├── database/          # PostgreSQL Migrations
├── docker-compose.yml # PostgreSQL, Redis
└── docs/              # API Documentation
```

## 🎯 Features

### Core Features
- ✅ **Multi-platform**: Web (Next.js), Mobile (React Native)
- 🔐 **Authentication**: JWT-based auth
- 📚 **Vocabulary Categories**: TOEIC, IELTS, Phrasal Verb, Business English
- 📝 **Exercise Types**:
  - Multiple Choice (Anh-Việt, Việt-Anh)
  - Fill in the Blank
- 💡 **Smart Hints**:
  - 50/50 (bỏ 2 đáp án sai)
  - Reveal Answer
- 📊 **Detailed History**:
  - Track mỗi câu trả lời
  - Thời gian làm từng câu
  - Sử dụng hint
  - Chi tiết đáp án đã chọn

## 🛠️ Tech Stack

### Frontend (Web)
- **Framework**: Next.js 15
- **UI**: shadcn/ui + TailwindCSS
- **State**: Zustand / React Query
- **Auth**: NextAuth.js

### Backend
- **Language**: Go 1.23
- **Architecture**: Clean Architecture (bxcodec/go-clean-arch)
- **Framework**: Gin
- **ORM**: GORM
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT

### Mobile
- **Framework**: React Native
- **Navigation**: React Navigation
- **UI**: NativeBase / React Native Paper
- **State**: Zustand / React Query

## 📦 Database Schema

Xem chi tiết tại [database/schema.sql](database/schema.sql)

### Main Tables
- `users` - User accounts
- `vocabulary_categories` - TOEIC, IELTS, Phrasal Verb
- `vocabularies` - Từ vựng với meanings, examples
- `exercises` - Bài tập
- `questions` - Câu hỏi
- `answers` - Đáp án
- `test_sessions` - Phiên làm bài
- `test_answers` - Chi tiết câu trả lời
- `user_progress` - Progress tracking

## 🚀 Quick Start

### Prerequisites
- Go 1.23+
- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
go mod download
go run main.go
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Mobile Setup
```bash
cd mobile
npm install
npx expo start
```

## 📁 Project Structure

### Backend (Clean Architecture)
```
backend/
├── domain/
│   ├── entity/          # Business entities
│   └── repository/      # Repository interfaces
├── usecase/             # Business logic
├── delivery/            # Handlers (HTTP)
│   └── http/
│       ├── handler.go
│       └── middleware.go
├── repository/          # Repository implementations
│   └── postgres/
├── infrastructure/      # External services
│   └── database/
└── config/              # Config
```

### Frontend (Next.js App Router)
```
frontend/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── exercises/
│   └── api/
├── components/
│   ├── ui/
│   └── features/
├── lib/
│   └── api/
└── hooks/
```

### Mobile (React Native)
```
mobile/
├── app/
│   ├── (auth)/
│   ├── (tabs)/
│   └── exercises/
├── components/
├── lib/
│   └── api/
└── hooks/
```

## 🔐 Authentication

JWT-based authentication với refresh tokens:
- Access Token: 15 phút
- Refresh Token: 7 ngày
- Refresh token rotation
- Device tracking

## 📊 Exercise System

### Exercise Types
1. **Multiple Choice (Anh-Việt)**: Chọn nghĩa tiếng Việt
2. **Multiple Choice (Việt-Anh)**: Chọn từ tiếng Anh
3. **Fill in the Blank**: Điền từ còn thiếu

### Hint System
- **50/50**: Loại bỏ 2 đáp án sai
- **Reveal**: Hiển thị đáp án đúng

### Scoring
- Đúng không hint: 100%
- Đúng có hint: 50%
- Sai: 0%

## 🧪 Testing

### Backend
```bash
cd backend
go test ./...
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 API Documentation

Swagger UI sẽ có tại:
- Local: http://localhost:8080/swagger/index.html

## 🚢 Deployment

### Backend
- Docker container
- Environment: Production
- Database: Managed PostgreSQL

### Frontend
- Vercel / Netlify

### Mobile
- EAS Build (Expo Application Services)

## 📖 Import Data

Từ vựng và bài tập sẽ được import qua:
```bash
cd backend
go run cmd/import/main.go
```

## 🤝 Contributing

1. Fork
2. Feature branch
3. Commit
4. Push
5. Pull Request

## 📄 License

MIT
