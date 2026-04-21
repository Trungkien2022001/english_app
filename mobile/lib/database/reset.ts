/**
 * Database Reset Helper
 * Script để reset database khi schema thay đổi
 */

import { sqliteDB } from './sqlite';

/**
 * Reset và recreate database với schema mới
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log('🔄 Resetting database...');
    await sqliteDB.resetDatabase();
    console.log('✅ Database reset complete!');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
}

/**
 * Kiểm tra và auto-update nếu cần
 */
export async function checkAndUpdateDatabase(): Promise<void> {
  try {
    const needsUpdate = await sqliteDB.needsUpdate();

    if (needsUpdate) {
      console.log('⚠️ Database schema outdated, resetting...');
      await resetDatabase();
    } else {
      console.log('✅ Database schema up to date');
    }
  } catch (error) {
    console.error('❌ Check database update failed:', error);
  }
}

export default { resetDatabase, checkAndUpdateDatabase };
