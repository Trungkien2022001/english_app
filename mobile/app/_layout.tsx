import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../lib/store/authStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth stack
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        // Main app stack
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="exercises/[id]"
            options={{
              headerShown: true,
              title: 'Bài tập',
              headerBackTitle: 'Quay lại',
            }}
          />
          <Stack.Screen
            name="history/[id]"
            options={{
              headerShown: true,
              title: 'Chi tiết bài test',
              headerBackTitle: 'Quay lại',
            }}
          />
        </>
      )}
    </Stack>
  );
}
