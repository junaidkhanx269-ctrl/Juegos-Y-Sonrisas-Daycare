import { createClient, SupabaseClient } from '@supabase/supabase-js';
import defaultConfig from '../data/supabaseConfig.json';

export const DEFAULT_URL = 'https://zicyrtlnulgnsqycgzpl.supabase.co';
export const DEFAULT_KEY = 'placeholder-key';

export const sanitizeUrl = (rawUrl?: string): string => {
  if (!rawUrl) return DEFAULT_URL;
  let url = rawUrl.trim().replace(/\/+$/, '');
  if (!url) return DEFAULT_URL;
  if (url === 'https://YOUR_PROJECT.supabase.co' || url === 'YOUR_PROJECT') {
    return DEFAULT_URL;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch (e) {
    return DEFAULT_URL;
  }
  return DEFAULT_URL;
};

const getInitialUrl = () => {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('CUSTOM_SUPABASE_URL');
    if (customUrl) return sanitizeUrl(customUrl);
  }
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (envUrl && envUrl !== 'https://YOUR_PROJECT.supabase.co') return sanitizeUrl(envUrl);
  if (defaultConfig?.url) return sanitizeUrl(defaultConfig.url);
  return DEFAULT_URL;
};

const getInitialKey = () => {
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('CUSTOM_SUPABASE_ANON_KEY');
    if (customKey && customKey !== 'YOUR_ANON_KEY') return customKey;
  }
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envKey && envKey !== 'YOUR_ANON_KEY') return envKey;
  if (defaultConfig?.key && defaultConfig.key !== 'YOUR_ANON_KEY' && defaultConfig.key !== 'placeholder-key') {
    return defaultConfig.key;
  }
  return DEFAULT_KEY;
};

export const createSafeClient = (rawUrl: string, rawKey: string): SupabaseClient => {
  const validUrl = sanitizeUrl(rawUrl);
  const validKey = rawKey || DEFAULT_KEY;
  try {
    return createClient(validUrl, validKey);
  } catch (err) {
    console.warn('Error creating Supabase client, using fallback:', err);
    return createClient(DEFAULT_URL, DEFAULT_KEY);
  }
};

export let supabaseUrl = getInitialUrl();
export let supabaseAnonKey = getInitialKey();

export let supabase: SupabaseClient = createSafeClient(supabaseUrl, supabaseAnonKey);

export const reinitSupabase = (url: string, key: string) => {
  const safeUrl = sanitizeUrl(url);
  const safeKey = key || DEFAULT_KEY;
  supabaseUrl = safeUrl;
  supabaseAnonKey = safeKey;
  supabase = createSafeClient(safeUrl, safeKey);
};

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'placeholder-key' &&
    supabaseAnonKey !== 'YOUR_ANON_KEY' &&
    (supabaseUrl.includes('supabase.co') || supabaseUrl.startsWith('http'))
  );
};
