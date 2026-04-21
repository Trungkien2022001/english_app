/**
 * Helper function to reset database
 * Chạy function này để reset database khi cần
 */

import { sqliteDB } from './sqlite';

export async function resetLocalDatabase() {
  try {
    console.log('🔄 Resetting local database...');
    await sqliteDB.resetDatabase();
    console.log('✅ Database reset successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    return false;
  }
}

/**
 * Gán function này vào global object để có thể gọi từ React Native Debugger
 * Usage: Trong app, gọi: window.resetLocalDatabase()
 */
if (typeof global !== 'undefined') {
  (global as any).resetLocalDatabase = resetLocalDatabase;
}

export default resetLocalDatabase;
