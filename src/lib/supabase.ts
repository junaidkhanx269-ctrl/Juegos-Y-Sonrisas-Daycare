import { createClient } from '@supabase/supabase-js';

// Read from Vite env variables or localStorage overrides (for live dynamic testing in Admin UI)
const getEnvUrl = () => {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('CUSTOM_SUPABASE_URL');
    if (customUrl) return customUrl;
  }
  return import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
};

const getEnvKey = () => {
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('CUSTOM_SUPABASE_ANON_KEY');
    if (customKey) return customKey;
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';
};

export const supabaseUrl = getEnvUrl();
export const supabaseAnonKey = getEnvKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  const url = getEnvUrl();
  const key = getEnvKey();
  return (
    url &&
    url !== 'https://YOUR_PROJECT.supabase.co' &&
    key &&
    key !== 'YOUR_ANON_KEY' &&
    url.includes('supabase.co')
  );
};
