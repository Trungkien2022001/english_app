# EnglishApp Mobile

Mobile app cho EnglishApp được xây dựng với React Native và Expo.

## 🏗️ Architecture

```
mobile/
├── app/                      # Expo Router (file-based routing)
│   ├── (auth)/              # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── index.tsx        # Home screen
│   │   ├── exercises.tsx    # Exercises list
│   │   ├── history.tsx      # Test history
│   │   └── profile.tsx      # User profile
│   ├── exercises/[id].tsx   # Exercise detail
│   └── history/[id].tsx     # Test detail
├── lib/
│   ├── api/                 # API client
│   │   ├── client.ts        # Axios with interceptors
│   │   ├── auth.ts          # Auth API
│   │   └── exercise.ts      # Exercise API
│   ├── store/               # State management
│   │   └── authStore.ts     # Zustand auth store
│   └── utils/               # Utilities
└── components/              # Reusable components
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (cho production build): `npm install -g eas-cli`

### Installation

```bash
cd mobile
npm install
```

### Development

```bash
# Start Expo development server
npx expo start

# Options:
# - Press 'a' để mở Android emulator
# - Press 'i' để mở iOS simulator (macOS only)
# - Quét QR code để mở trên physical device với Expo Go app
```

### Environment Variables

Tạo file `.env` hoặc update trong `app.config.js`:

```env
API_URL=http://localhost:8080
```

## 📱 Screens

### 1. Authentication Screens

#### Login (`/(auth)/login`)
- Email/password login
- Link to registration
- Form validation

#### Register (`/(auth)/register`)
- User registration
- Password confirmation
- Auto-login after registration

### 2. Main App Screens (Tabs)

#### Home (`/(tabs)/index`)
- User greeting và stats
- XP, streak, level display
- Category cards
- Quick actions

#### Exercises (`/(tabs)/exercises`)
- List of exercises
- Filter by category
- Difficulty badges
- Exercise stats

#### History (`/(tabs)/history`)
- Test history list
- Score badges
- Date & time display
- Detail navigation

#### Profile (`/(tabs)/profile`)
- User info & stats
- Level progress
- Account settings
- Logout

### 3. Detail Screens

#### Exercise Detail (`/exercises/[id]`)
- Start test
- Question display
- Multiple choice answers
- Progress tracking
- Real-time feedback

#### History Detail (`/history/[id]`)
- Test overview
- Score breakdown
- Detailed answer history
- Vocabulary info
- Time tracking

## 🔧 Configuration

### API Configuration

API URL được config trong `app.config.js`:

```javascript
extra: {
  apiUrl: process.env.API_URL || 'http://localhost:8080'
}
```

Và được sử dụng trong `lib/api/client.ts`:

```typescript
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8080';
```

### Authentication

Authentication sử dụng:
- JWT access tokens (15 minutes)
- Refresh tokens (7 days)
- SecureStore cho token storage
- Automatic token refresh

### State Management

Sử dụng Zustand cho global state:
- `authStore`: User info, auth state, auth actions

## 🧪 Testing

```bash
# Run tests
npm test

# Run với coverage
npm test -- --coverage
```

## 📦 Building

### Development Build

```bash
# Create development build
eas build --profile development --platform all

# Hoặc dùng local builds
npx expo run:android
npx expo run:ios
```

### Production Build

```bash
# Configure build
eas build:configure

# Build cho Android
eas build --platform android

# Build cho iOS
eas build --platform ios
```

## 🎨 Styling

App sử dụng React Native styling với:
- Custom styles (không dùng Tailwind Native)
- Consistent color scheme
- Platform-specific adjustments
- Safe area handling

### Color Palette

- Primary: `#0ea5e9` (blue)
- Success: `#22c55e` (green)
- Warning: `#f59e0b` (amber)
- Error: `#ef4444` (red)
- Background: `#f5f5f5` (gray)

## 📱 Platform Differences

### iOS
- Native navigation components
- Safe area handling
- Haptic feedback
- Swipe gestures

### Android
- Material Design patterns
- Back button handling
- Permission requests

## 🔐 Security

- Tokens stored in SecureStore
- HTTPS in production
- Certificate pinning (future)
- Biometric authentication (future)

## 🚀 Performance

- Lazy loading cho screens
- Optimized re-renders
- Image optimization
- Bundle size optimization

## 📚 Documentation

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/docs/getting-started/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

## 🐛 Troubleshooting

### Metro bundler cache

```bash
npx expo start -c
```

### Clear node_modules

```bash
rm -rf node_modules
npm install
```

### iOS Simulator not working

```bash
cd ios
pod install
cd ..
npx expo run:ios
```

### Network issues with physical device

- Use machine's IP instead of localhost
- Ensure device và computer on same network
- Check firewall settings

## 📄 License

MIT
