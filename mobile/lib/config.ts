/**
 * Mobile App Configuration
 * File config để toggle giữa API và local database
 */

export const CONFIG = {
  // Nếu true: dùng local database (SQLite)
  // Nếu false: gọi API backend
  USE_LOCAL_DB: true,

  // API URL (khi USE_LOCAL_DB = false)
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',

  // Local database config
  DB_NAME: 'englishapp_local.db',

  // Feature flags
  ENABLE_OFFLINE_MODE: true,
  ENABLE_CACHE: true,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

export default CONFIG;
