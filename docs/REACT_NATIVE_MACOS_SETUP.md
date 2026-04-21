# 📱 React Native trên macOS - Hướng dẫn cài đặt chi tiết

Hướng dẫn cài đặt môi trường phát triển React Native trên macOS để chạy app demo trên iPhone.

## 🛠️ Cài đặt cần thiết

### 1. Phần mềm BẮT BUỘC

#### Node.js & npm
```bash
# Download từ: https://nodejs.org/
# Hoặc dùng Homebrew:
brew install node

# Verify:
node --version
npm --version
```

#### Git
```bash
# Xem có git chưa:
git --version

# Nếu chưa:
brew install git
```

### 2. iOS Development Tools

#### Xcode (Quan trọng nhất!)
```bash
# Download từ Mac App Store (miễn phí)
# Link: https://apps.apple.com/us/app/xcode/id497799835

# Sau khi cài xong, cài Command Line Tools:
xcode-select --install

# Verify:
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer
```

#### CocoaPods (Dependency manager cho iOS)
```bash
sudo gem install cocoapods

# Setup CocoaPods:
pod setup
```

### 3. Expo CLI

```bash
# Cài đặt Expo CLI global:
npm install -g expo-cli

# Hoặc dùng npx (không cần cài global):
npx expo start
```

### 4. iOS Simulator

Đã có sẵn trong Xcode, không cần cài thêm.

```bash
# Mở simulator manually:
open -a Simulator

# List tất cả simulators:
xcrun simctl list devices

# Tạo simulator mới (nếu cần):
xcrun simctl create "iPhone 15" com.apple.CoreSimulator.SimDeviceType.iPhone-15 com.apple.CoreSimulator.SimRuntime.iOS-17-0
```

### 5. Công cụ khuyến nghị (Recommended)

#### Watchman (Facebook's file watcher)
```bash
brew install watchman

# Giúp Expo reload nhanh hơn khi code thay đổi
```

#### VS Code + Extensions
Extensions cần thiết:
- ESLint
- Prettier
- React Native Tools
- TypeScript & JavaScript Language Features
- Expo

## 📱 Chạy trên iPhone THẬT

### Cách 1: Expo Go App (Đơn giản nhất - Khuyên dùng)

**Ưu điểm:**
- Không cần cable
- Cài đặt nhanh
- Không cần Apple Developer account

**Steps:**

1. **Tải Expo Go** trên iPhone từ App Store
   - Link: https://apps.apple.com/app/expo-go/id982107779

2. **Kết nối iPhone và Mac** cùng WiFi network

3. **Chạy project:**
   ```bash
   cd /path/to/EnglishApp/mobile
   npm install
   npx expo start
   ```

4. **Mở Expo Go** trên iPhone và quét QR code

5. **App sẽ load** trên iPhone ngay!

### Cách 2: Development Build (Nâng cao)

**Ưu điểm:**
- Performance tốt hơn
- Có thể debug native modules
- Test production-like environment

**Nhược điểm:**
- Cần Apple Developer account ($99/năm)
- Phải cài certificate & provisioning profile
- Build mất thời gian

**Steps:**

1. **Cài EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login Expo:**
   ```bash
   eas login
   ```

3. **Configure project:**
   ```bash
   eas build:configure
   ```

4. **Tạo development build:**
   ```bash
   # Build trên EAS cloud:
   eas build --profile development --platform ios
   
   # Hoặc build local (cần Mac):
   eas build --profile development --platform ios --local
   ```

5. **Install build** trên iPhone và chạy

### Cách 3: Local Development Build

```bash
cd mobile
npm install

# Run development build local (cần Mac):
npx expo run:ios

# App sẽ tự động mở trên iOS Simulator
# Hoặc connect iPhone và chọn device
```

## 🚀 Cách chạy project EnglishApp

### Trên iOS Simulator (Nhanh nhất cho dev)

```bash
cd /Users/kiennguyen/Documents/Workspace/Code/Project/EnglishApp/mobile

# Install dependencies:
npm install

# Start development server:
npx expo start

# Nhấn 'i' trong terminal để mở iOS Simulator
```

### Trên iPhone thật với Expo Go

```bash
cd /Users/kiennguyen/Documents/Workspace/Code/Project/EnglishApp/mobile

# Install dependencies:
npm install

# Start development server:
npx expo start

# Quét QR code bằng Expo Go app trên iPhone
```

### Trên Development Build

```bash
cd /Users/kiennguyen/Documents/Workspace/Code/Project/EnglishApp/mobile

# iOS development build:
npx expo run:ios

# Hoặc dùng EAS:
eas build --profile development --platform ios
```

## 📋 Full Setup Checklist

### Minimal Setup (Simulator + Expo Go) ✅
- [ ] Xcode (từ Mac App Store)
- [ ] Command Line Tools: `xcode-select --install`
- [ ] Node.js: `brew install node`
- [ ] Expo CLI: `npm install -g expo-cli`

**Time:** ~30-45 phút
**Cost:** $0

### Full Setup (Development Build + Production) 🔥
- [ ] Xcode + Command Line Tools
- [ ] Homebrew
- [ ] Node.js
- [ ] Watchman: `brew install watchman`
- [ ] CocoaPods: `sudo gem install cocoapods`
- [ ] Expo CLI: `npm install -g expo-cli`
- [ ] EAS CLI: `npm install -g eas-cli`
- [ ] Apple Developer Account ($99/năm) - optional

**Time:** ~1-2 giờ
**Cost:** $99/năm (optional)

## 🔧 Troubleshooting

### Xcode Command Line Tools

Nếu gặp lỗi "xcrun: error: invalid active developer path":

```bash
sudo xcode-select -s /Applications/Xcode.app
sudo xcode-select --install
```

### CocoaPods Issues

```bash
# Update CocoaPods:
sudo gem install cocoapods

# Clear cache:
pod cache clean --all

# Re-install pods:
cd ios && pod install && cd ..
```

### Metro Bundler Issues

```bash
# Clear cache:
npx expo start -c

# Hoặc:
rm -rf node_modules
npm install
```

### iOS Simulator Issues

```bash
# Reset simulator:
xcrun simctl erase all

# Restart simulator:
sudo killall -9 Simulator
open -a Simulator
```

### Network Issues với Physical Device

1. **Đảm bảo iPhone và Mac cùng WiFi**
2. **Tắt VPN** trên cả 2 devices
3. **Check firewall** trên Mac
4. **Dùng IP thay vì localhost:**
   ```bash
   # Tìm IP của Mac:
   ifconfig | grep "inet "
   
   # Trong Expo dev tools, chọn "Connection" → "Tunnel"
   ```

### iPhone Trust Settings

Khi chạy development build trên iPhone thật:
1. Mở **Settings** → **General** → **VPN & Device Management**
2. Tìm developer app certificate
3. **Trust** certificate

## 📖 Tài liệu tham khảo

### Official Docs
- [Expo iOS Setup Guide](https://docs.expo.dev/workflow/ios-setup/)
- [React Native macOS Setup](https://reactnative.dev/docs/environment-setup)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo Go App](https://expo.dev/client)

### Video Tutorials
- [Expo Quick Start](https://www.youtube.com/watch?v=8GkJvU10alI)
- [React Native on macOS](https://www.youtube.com/watch?v=2FOq8n7yHd8)

### Community Resources
- [Expo Forums](https://forums.expo.dev/)
- [React Native Reddit](https://www.reddit.com/r/reactnative/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

## 💡 Tips cho Development

### 1. Hot Reload
Expo có hot reload tự động. Khi code thay đổi:
- Fast Refresh cho JavaScript
- Live Reload cho full reload

### 2. Debugging
```bash
# Mở Expo DevTools trong browser:
npx expo start

# Mở tại: http://localhost:8081
```

### 3. Logging
```javascript
// Log trong React Native:
console.log('Debug info');

// Log với Expo:
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
```

### 4. Performance
```bash
# Use production build khi test performance:
eas build --profile production --platform ios

# Hoặc trong development mode:
npx expo start --minify
```

## 🎯 Quick Start cho EnglishApp

```bash
# 1. Install dependencies
cd /Users/kiennguyen/Documents/Workspace/Code/Project/EnglishApp/mobile
npm install

# 2. Start development server
npx expo start

# 3. Options:
#    - Nhấn 'i' → iOS Simulator
#    - Nhấn 'a' → Android Emulator  
#    - Quét QR code → iPhone thật với Expo Go
#    - Nhấn 'w' → Mở web version
```

## ⚡ Performance Tips

### For Development
- Use iOS Simulator để test nhanh
- Dùng Expo Go để test trên device thật
- Bật Fast Refresh

### For Production
- Use EAS Build
- Test trên multiple devices
- Use TestFlight để beta testing

## 🔐 Security Notes

### API Configuration

```typescript
// Trong mobile/lib/api/client.ts
// Dùng máy's IP thay vì localhost khi test physical device

const API_URL = 'http://YOUR_MAC_IP:8080';
// Ví dụ: http://192.168.1.100:8080

# Tìm IP của Mac:
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Environment Variables

```bash
# Tạo file .env trong mobile/
API_URL=http://192.168.1.100:8080

# Update app.config.js:
extra: {
  apiUrl: process.env.API_URL || 'http://localhost:8080'
}
```

## 🎉 Summary

### Để BẮT ĐẦU (Minimal setup):
1. ✅ Xocode (App Store) - 30 phút
2. ✅ Node.js - 5 phút
3. ✅ Expo CLI - 2 phút
4. ✅ Expo Go app trên iPhone - 2 phút

**Total: ~40 phút, $0**

### Để PRODUCTION (Full setup):
1. ✅ Tất cả minimal setup
2. ✅ Apple Developer Account - $99/năm
3. ✅ Development build setup - 1 giờ

**Total: ~2 giờ, $99/năm**

**Khuyên nghị:** Bắt đầu với minimal setup và Expo Go app! 🚀
