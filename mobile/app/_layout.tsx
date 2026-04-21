import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../lib/store/authStore';
import { sqliteDB } from '../lib/database/sqlite';
import CONFIG from '../lib/config';

export default function RootLayout() {
  // Initialize local database if using local mode
  useEffect(() => {
    if (CONFIG.USE_LOCAL_DB) {
      const initDB = async () => {
        try {
          await sqliteDB.init();

          // Check if database needs update
          const needsUpdate = await sqliteDB.needsUpdate();
          if (needsUpdate) {
            console.log('🔄 Database schema outdated, resetting...');
            await sqliteDB.resetDatabase();
          }
        } catch (error) {
          console.error('Failed to initialize database:', error);
        }
      };

      initDB();
    }
  }, []);

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
