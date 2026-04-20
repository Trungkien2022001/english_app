# 🚀 EnglishApp - Quick Start Guide

Hướng dẫn khởi động và chạy project EnglishApp trên local machine.

## 📋 Prerequisites

Đảm bảo bạn đã cài đặt:

- **Go** 1.23+: [Download here](https://go.dev/dl/)
- **Node.js** 20+: [Download here](https://nodejs.org/)
- **Docker** & Docker Compose: [Download here](https://www.docker.com/products/docker-desktop)
- **Git**: [Download here](https://git-scm.com/downloads)
- **PostgreSQL Client** (optional): pgAdmin, DBeaver, hoặc TablePlus

## 🏗️ Architecture Overview

```
EnglishApp/
├── backend/          # Go (Clean Architecture)
│   ├── domain/       # Entities & Repository interfaces
│   ├── usecase/      # Business logic
│   ├── delivery/     # HTTP handlers & middleware
│   ├── repository/   # Repository implementations
│   └── infrastructure/ # Config & Database
├── frontend/         # Next.js 15 (Web App)
├── mobile/           # React Native Expo (Mobile App)
└── database/         # PostgreSQL migrations
```

## 🎯 Quick Start (5 phút)

### 1. Clone và Setup Database

```bash
# Start PostgreSQL và Redis
docker-compose up -d

# Verify containers đang chạy
docker-compose ps

#你应该看到:
# englishapp_postgres  running
# englishapp_redis     running
# englishapp_pgadmin   running
```

### 2. Setup Backend

```bash
cd backend

# Tạo .env file
cp .env.example .env

# Install dependencies
go mod download

# Run migrations (hoặc dùng PostgreSQL client để chạy file SQL)
# Connection string: postgresql://englishapp:englishapp_secret@localhost:5432/englishapp_db

# Run backend
go run main.go
```

Backend sẽ chạy tại `http://localhost:8080`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Tạo .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# Run development server
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

### 4. Setup Mobile

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

Quét QR code với Expo Go app trên điện thoại.

## 🗄️ Database Setup

### Option 1: Dùng Docker Compose (Recommended)

```bash
# Start containers
docker-compose up -d

# Access pgAdmin: http://localhost:5050
# Email: admin@englishapp.local
# Password: admin
```

### Option 2: Manual Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE englishapp_db;
CREATE USER englishapp WITH PASSWORD 'englishapp_secret';
GRANT ALL PRIVILEGES ON DATABASE englishapp_db TO englishapp;

# Run migrations
psql -U englishapp -d englishapp_db -f database/migrations/001_initial_schema.up.sql
psql -U englishapp -d englishapp_db -f database/migrations/002_sample_data.sql
```

### Option 3: Dùng GUI Tool

Connection details:
- **Host**: localhost
- **Port**: 5432
- **Database**: englishapp_db
- **User**: englishapp
- **Password**: englishapp_secret

Import files từ `database/migrations/`

## 🔧 Development Workflow

### Backend Development

```bash
cd backend

# Hot reload (tính năng trong development)
go run main.go

# Run tests
go test ./...

# Build cho production
go build -o englishapp-api main.go
```

**API Endpoint Examples:**
- Health: `http://localhost:8080/health`
- API Docs: http://localhost:8080/swagger/index.html (coming soon)

### Frontend Development

```bash
cd frontend

# Development with hot reload
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build production
npm run build

# Start production server
npm start
```

**Available Pages:**
- Home: `http://localhost:3000`
- Login: `http://localhost:3000/auth/login`
- Register: `http://localhost:3000/auth/register`
- Dashboard: `http://localhost:3000/dashboard`
- Exercises: `http://localhost:3000/exercises`
- History: `http://localhost:3000/history`

### Mobile Development

```bash
cd mobile

# Start Expo development server
npx expo start

# Options:
# - Press 'a' để mở Android emulator
# - Press 'i' để mở iOS simulator (macOS only)
# - Quét QR code để mở trên physical device

# Build cho production (eas build)
eas build --platform android
eas build --platform ios
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
go test ./...

# Run với coverage
go test -cover ./...

# Run verbose
go test -v ./...
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Test với UI
npm run test:ui
```

## 📝 Import Sample Data

Backend đã bao gồm sample data trong `database/migrations/002_sample_data.sql`:

- **5 Users** (test user: `test@example.com` / `password123`)
- **25 Vocabulary words** (5 per category)
- **5 Categories**: TOEIC, IELTS, Phrasal Verbs, Business English, Daily Conversation
- **3 Exercises** với questions và answers
- **Exercise Types**: Multiple Choice, Fill in the Blank

Để import thêm data:

```bash
cd backend

# Tạo custom import script
go run cmd/import/main.go --file=data/vocabularies.json
```

## 🔍 Troubleshooting

### Backend không start

**Problem:** `failed to connect to database`

**Solution:**
1. Check Docker containers: `docker-compose ps`
2. Check PostgreSQL logs: `docker logs englishapp_postgres`
3. Verify connection string in `.env`

**Problem:** `port 8080 already in use`

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>

# Hoặc đổi port trong .env
SERVER_PORT=8081
```

### Frontend không start

**Problem:** `Cannot connect to backend API`

**Solution:**
1. Verify backend đang chạy: `curl http://localhost:8080/health`
2. Check `.env.local` file: `NEXT_PUBLIC_API_URL=http://localhost:8080`
3. Check browser console cho CORS errors

### Mobile không connect

**Problem:** `Network request failed`

**Solution:**
1. Ensure backend và frontend đang chạy
2. Update API URL trong `mobile/lib/api/client.ts`
3. Use machine's IP thay vì localhost (cho physical device)
4. Check simulator/emulator network settings

## 🚀 Deployment

### Backend (Docker)

```bash
cd backend

# Build image
docker build -t englishapp-backend .

# Run container
docker run -p 8080:8080 \
  -e DB_HOST=your-db-host \
  -e JWT_SECRET=your-secret \
  englishapp-backend
```

### Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Mobile (EAS Build)

```bash
cd mobile

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 📚 Learn More

- [Backend Architecture](docs/BACKEND_ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🆘 Need Help?

1. Check [Troubleshooting](#-troubleshooting)
2. Review [API Documentation](docs/API.md)
3. Open issue trên GitHub
4. Contact development team

## ✅ Verify Setup

Kiểm tra mọi thứ hoạt động:

```bash
# 1. Check database
docker-compose ps

# 2. Check backend
curl http://localhost:8080/health

# 3. Check frontend
curl http://localhost:3000

# 4. Test API
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Nếu tất cả trả về success, bạn đã sẵn sàng! 🎉
