import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const memoryStore = new Map<string, string>();

const memoryAdapter = {
  getItem: (key: string) => memoryStore.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memoryStore.set(key, value);
  },
  removeItem: (key: string) => {
    memoryStore.delete(key);
  },
};

const webAdapter = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

function createAuthStorage() {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      return webAdapter;
    }
    return memoryAdapter;
  }
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  const storage = createMMKV();
  return {
    getItem: (key: string) => {
      try {
        return storage.getString(key) ?? null;
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
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createAuthStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
