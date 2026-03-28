import { createClient } from '@supabase/supabase-js';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    try {
      const value = storage.getString(key);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
