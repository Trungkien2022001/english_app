# EnglishApp - AI Assistant Context

Complete English learning platform with web (Next.js), mobile (React Native Expo), and backend (Go Clean Architecture).

## 🚀 Quick Start

```bash
# 1. Start services
docker-compose up -d

# 2. Backend (Go)
cd backend && go run main.go

# 3. Frontend (Next.js)
cd frontend && npm install && npm run dev

# 4. Mobile (Expo)
cd mobile && npm install && npx expo start
```

## 📦 Tech Stack

### Backend
- **Language:** Go 1.23
- **Framework:** Gin (HTTP router)
- **ORM:** GORM (PostgreSQL)
- **Auth:** JWT (access + refresh tokens)
- **Architecture:** Clean Architecture (domain/usecase/delivery layers)
- **Database:** PostgreSQL 16, Redis 7

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **State:** Zustand
- **Styling:** TailwindCSS
- **HTTP:** Axios với interceptors

### Mobile
- **Framework:** Expo 52
- **Navigation:** Expo Router (file-based)
- **Language:** TypeScript
- **State:** Zustand
- **Storage:** Expo SecureStore

### Database
- **PostgreSQL 16:** Main database
- **Redis 7:** Cache (future)

## 📁 Project Structure

```
EnglishApp/
├── backend/                 # Go backend (Clean Architecture)
│   ├── domain/             # Business entities & interfaces
│   │   ├── entity/         # Data models
│   │   └── repository/     # Repository interfaces
│   ├── usecase/            # Business logic
│   ├── delivery/           # HTTP handlers
│   │   └── http/
│   │       ├── handler/    # API handlers
│   │       └── middleware/ # Auth, CORS
│   ├── repository/         # Repository implementations
│   │   └── postgres/       # PostgreSQL repositories
│   └── infrastructure/     # Config, DB
│       ├── config/         # Config loader
│       └── database/       # DB connection
│
├── frontend/               # Next.js web app
│   └── app/               # App Router pages
│       ├── (auth)/        # Auth pages
│       ├── dashboard/     # User dashboard
│       ├── exercises/     # Exercise pages
│       └── history/       # Test history
│   ├── components/        # React components
│   ├── lib/              # Utilities
│   │   ├── api/          # API clients
│   │   └── store/        # Zustand stores
│   └── styles/           # Global styles
│
├── mobile/                # React Native Expo app
│   └── app/              # Expo Router screens
│       ├── (auth)/       # Login, Register
│       ├── (tabs)/       # Main tabs (Home, Exercises, History, Profile)
│       ├── exercises/    # Exercise detail
│       └── history/      # History detail
│   ├── lib/             # Utilities
│   │   ├── api/         # API clients
│   │   └── store/       # Zustand stores
│   └── components/      # React Native components
│
├── database/             # Database migrations
│   └── migrations/      # SQL schema & sample data
│       ├── 001_initial_schema.up.sql
│       ├── 001_initial_schema.down.sql
│       └── 002_sample_data.sql
│
├── docs/                # Documentation
│   ├── API.md           # API endpoints
│   └── REACT_NATIVE_MACOS_SETUP.md
│
└── docker-compose.yml   # PostgreSQL, Redis, pgAdmin
```

## 🔧 Development Commands

### Backend (Go)
```bash
cd backend

# Run development server
go run main.go

# Run tests
go test ./...
go test -v ./...
go test -cover ./...

# Build
go build -o englishapp-api main.go

# Install dependencies
go mod download
go mod tidy
```

### Frontend (Next.js)
```bash
cd frontend

# Development
npm run dev

# Build production
npm run build
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

### Mobile (Expo)
```bash
cd mobile

# Start dev server
npx expo start

# Options:
# - Press 'i' → iOS Simulator
# - Press 'a' → Android Emulator
# - Scan QR code → Expo Go on physical device

# Build development build
eas build --profile development --platform ios

# Build production
eas build --profile production --platform ios
```

### Database
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres

# Access pgAdmin
# http://localhost:5050
# Email: admin@englishapp.local
# Password: admin
```

## 🎨 Coding Conventions

### Go Backend
- **Clean Architecture:** Strict separation (domain/usecase/delivery/repository)
- **Interfaces First:** Define repository interfaces in `domain/repository/`
- **Error Handling:** Return errors, don't panic in business logic
- **Naming:** camelCase for exported, PascalCase for public API
- **Package structure:** One responsibility per package

### TypeScript (Frontend/Mobile)
- **Type Safety:** Always use types, avoid `any`
- **Components:** Functional components with hooks
- **State:** Zustand for global state, useState for local
- **API:** Centralized API clients in `lib/api/`
- **Styling:** TailwindCSS utility classes
- **Naming:** camelCase for variables, PascalCase for components

### File Naming
```
Go:           user_repository.go        (snake_case)
TypeScript:   authStore.ts              (camelCase)
React:        UserCard.tsx              (PascalCase)
SQL:          001_initial_schema.up.sql (snake_case)
```

## 📋 Workflow Rules

### 1. Authentication
- **Backend:** JWT in `Authorization` header
- **Frontend:** httpOnly cookies (future)
- **Mobile:** SecureStore
- **Token refresh:** Automatic in axios interceptors

### 2. API Development
1. Define interfaces in `domain/repository/`
2. Implement in `repository/postgres/`
3. Create usecase in `usecase/`
4. Add handler in `delivery/http/handler/`
5. Register routes in `main.go`
6. Update API docs in `docs/API.md`

### 3. Database Changes
1. Create migration in `database/migrations/`
2. Create rollback migration (down)
3. Update GORM models if needed
4. Test with `docker-compose up -d`
5. Document in schema comments

### 4. Frontend/Mobile Features
1. Create/update API client in `lib/api/`
2. Create/update Zustand store in `lib/store/`
3. Build components
4. Add routes (App Router / Expo Router)
5. Test with backend running

### 5. Code Style
- **No console.log** in production (use logger)
- **Error messages** user-friendly, details in logs
- **Comments** for complex logic only
- **Functions** small, single responsibility
- **Files** max 300 lines (split if needed)

## 🔐 Security

- **Passwords:** bcrypt hash (never store plaintext)
- **JWT:** 15 min access token, 7 day refresh token
- **SQL:** Use GORM parameterized queries (no SQL injection)
- **CORS:** Configured in production
- **Secrets:** Environment variables (never commit .env)

## 📝 Key Files

### Configuration
- `backend/.env` - Backend env vars
- `frontend/.env.local` - Frontend env vars
- `mobile/app.config.js` - Mobile config
- `docker-compose.yml` - Services

### Entry Points
- `backend/main.go` - Backend server
- `frontend/app/layout.tsx` - Frontend root
- `mobile/app/_layout.tsx` - Mobile root

### Documentation
- `README.md` - Project overview
- `QUICKSTART.md` - Setup guide
- `PROJECT_SUMMARY.md` - Detailed summary
- `docs/API.md` - API endpoints
- `docs/REACT_NATIVE_MACOS_SETUP.md` - macOS setup

## 🧪 Testing

### Backend Tests
```bash
cd backend
go test ./...                    # All tests
go test -v ./...                 # Verbose
go test -cover ./...             # Coverage
go test -race ./...              # Race detection
```

### Frontend Tests
```bash
cd frontend
npm test                         # Run tests
npm run test:watch              # Watch mode
```

## 🚨 Common Issues

### Backend
- **DB connection:** Check `docker-compose ps`, verify `.env` DB settings
- **Port 8080 in use:** Change `SERVER_PORT` in `.env`
- **Import errors:** Run `go mod tidy`

### Frontend
- **Module not found:** `npm install`
- **API errors:** Check backend running at `localhost:8080`
- **Build fails:** Check TypeScript errors

### Mobile
- **Metro bundler:** `npx expo start -c`
- **Network issues:** Use machine IP instead of localhost
- **iOS Simulator:** Reset: `xcrun simctl erase all`

## 📚 Additional Resources

- [Backend Architecture Guide](docs/BACKEND_ARCHITECTURE.md) (TODO)
- [Database Schema](docs/DATABASE_SCHEMA.md) (TODO)
- [API Documentation](docs/API.md)
- [Contributing Guide](CONTRIBUTING.md) (TODO)

## 🎯 Current Status

**Version:** 1.0.0
**Status:** Production-ready
**Last Updated:** 2025-04-21

### Implemented Features
- ✅ User authentication (JWT)
- ✅ 3 exercise types (Multiple Choice, Fill Blank)
- ✅ 5 vocabulary categories
- ✅ Test sessions with detailed tracking
- ✅ Progress tracking (XP, streak, level)
- ✅ Hint system (50/50, Reveal)
- ✅ Test history with timestamps

### Tech Debt & Future Work
- [ ] WebSocket support (real-time updates)
- [ ] Offline mode for mobile
- [ ] Push notifications
- [ ] Unit tests coverage >80%
- [ ] E2E tests with Playwright
- [ ] Performance monitoring
