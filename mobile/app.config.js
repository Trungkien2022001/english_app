export default {
  expo: {
    name: 'EnglishApp',
    slug: 'englishapp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.englishapp.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.englishapp.app'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-router'
    ],
    scheme: 'englishapp',
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiUrl: process.env.API_URL || 'http://localhost:8080'
    }
  }
};
