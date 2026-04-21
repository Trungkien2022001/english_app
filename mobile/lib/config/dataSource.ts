import Constants from 'expo-constants';

const envFlag = process.env.EXPO_PUBLIC_USE_LOCAL_DB;
const configFlag = Constants.expoConfig?.extra?.useLocalDatabase;

function parseBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
    return true;
  }
  if (normalized === 'false' || normalized === '0' || normalized === 'no') {
    return false;
  }
  return null;
}

const envValue = parseBoolean(envFlag);
const configValue = parseBoolean(configFlag);

// Priority: EXPO_PUBLIC_USE_LOCAL_DB > app.config extra > default false.
export const useLocalDatabase = envValue ?? configValue ?? false;
