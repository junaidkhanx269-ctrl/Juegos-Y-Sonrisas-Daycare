import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads');
const SETTINGS_FILE = path.join(DATA_DIR, 'site_settings.json');
const CONFIG_FILE = path.join(DATA_DIR, 'supabase_config.json');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Default settings
const DEFAULT_SETTINGS = {
  hero_image: '/images/amelia-hero.jpg',
  about_image: '/images/amelia-hero.jpg',
  gallery_images: JSON.stringify([
    {
      id: 'default-1',
      url: '/src/assets/images/hero_montessori_classroom_1790135121726.jpg',
      title: 'Montessori Sunlit Classroom',
      uploadedAt: new Date().toISOString(),
      category: 'classroom',
    },
    {
      id: 'default-2',
      url: '/src/assets/images/daycare_backyard_play_1790135141749.jpg',
      title: 'Enclosed Safe Backyard',
      uploadedAt: new Date().toISOString(),
      category: 'backyard',
    },
    {
      id: 'default-3',
      url: '/src/assets/images/kids_art_sensory_station_1790135171821.jpg',
      title: 'Sensory Atelier',
      uploadedAt: new Date().toISOString(),
      category: 'art',
    },
    {
      id: 'default-4',
      url: '/src/assets/images/reading_nook_cozy_1790135186078.jpg',
      title: 'Cozy Story Nook',
      uploadedAt: new Date().toISOString(),
      category: 'reading',
    },
  ]),
};

// Initialize settings file if missing
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
}

function cleanSupabaseUrl(inputUrl: string): string {
  let url = (inputUrl || '').trim();
  if (!url) return '';
  if (url === 'https://YOUR_PROJECT.supabase.co' || url === 'YOUR_PROJECT') return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  if (!url.includes('.') && !url.includes('localhost')) {
    url = `${url}.supabase.co`;
  }
  return url;
}

function safeServerSupabaseClient(rawUrl: string, rawKey: string) {
  const url = cleanSupabaseUrl(rawUrl);
  if (!url || !rawKey || url === 'https://YOUR_PROJECT.supabase.co' || rawKey === 'YOUR_ANON_KEY') {
    return null;
  }
  try {
    return createClient(url, rawKey);
  } catch (err) {
    console.warn('Supabase client creation skipped (invalid URL/key):', err);
    return null;
  }
}

// Read current Supabase config
function getSupabaseConfig() {
  let url = process.env.VITE_SUPABASE_URL || '';
  let key = process.env.VITE_SUPABASE_ANON_KEY || '';

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const fileConf = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (fileConf.url) url = fileConf.url;
      if (fileConf.key) key = fileConf.key;
    } catch (e) {
      console.error('Error reading config file', e);
    }
  }

  url = cleanSupabaseUrl(url);

  const isConfigured = Boolean(
    url &&
      url !== 'https://YOUR_PROJECT.supabase.co' &&
      key &&
      key !== 'YOUR_ANON_KEY' &&
      (url.includes('supabase.co') || url.includes('http'))
  );

  return { url, key, isConfigured };
}

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(ROOT_DIR, 'public')));

// API 1: Get Supabase Config
app.get('/api/config', (_req, res) => {
  const conf = getSupabaseConfig();
  res.json(conf);
});

// API 2: Save Supabase Config
app.post('/api/config', (req, res) => {
  const { url, key } = req.body;
  if (!url || !key) {
    return res.status(400).json({ error: 'Missing url or key' });
  }

  const cleanUrl = url.trim();
  const cleanKey = key.trim();

  // Save to config file
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify({ url: cleanUrl, key: cleanKey }, null, 2)
  );

  // Update .env file
  const envPath = path.join(ROOT_DIR, '.env');
  const envContent = `VITE_SUPABASE_URL=${cleanUrl}\nVITE_SUPABASE_ANON_KEY=${cleanKey}\n`;
  fs.writeFileSync(envPath, envContent);

  process.env.VITE_SUPABASE_URL = cleanUrl;
  process.env.VITE_SUPABASE_ANON_KEY = cleanKey;

  res.json({ success: true, message: 'Supabase credentials saved across all devices!' });
});

// API 3: Get Site Settings
app.get('/api/settings', async (_req, res) => {
  let settings = { ...DEFAULT_SETTINGS };

  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      settings = { ...settings, ...data };
    } catch (e) {
      console.error('Error reading settings file', e);
    }
  }

  // Also query Supabase if configured
  const conf = getSupabaseConfig();
  if (conf.isConfigured) {
    try {
      const client = safeServerSupabaseClient(conf.url, conf.key);
      if (client) {
        const { data, error } = await client.from('site_settings').select('*');
        if (!error && data && data.length > 0) {
          data.forEach((row: { key: string; value: string }) => {
            if (row.key && row.value) {
              (settings as any)[row.key] = row.value;
            }
          });
        }
      }
    } catch (err) {
      console.warn('Could not query Supabase site_settings from server', err);
    }
  }

  res.json(settings);
});

// API 4: Update Site Settings
app.post('/api/settings', async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Missing key or value' });
  }

  // Save locally to server disk
  let currentSettings = { ...DEFAULT_SETTINGS };
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      currentSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    } catch (e) {}
  }
  currentSettings[key] = value;
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(currentSettings, null, 2));

  // Sync to Supabase if configured
  const conf = getSupabaseConfig();
  if (conf.isConfigured) {
    try {
      const client = safeServerSupabaseClient(conf.url, conf.key);
      if (client) {
        await client.from('site_settings').upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      }
    } catch (err) {
      console.error('Error syncing setting to Supabase', err);
    }
  }

  res.json({ success: true });
});

// API 5: Server Upload endpoint (stores file permanently on server disk & uploads to Supabase)
app.post('/api/upload', async (req, res) => {
  try {
    const { fileName, fileData, folderPrefix = '' } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const cleanName = (fileName || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestampedName = `${folderPrefix}${Date.now()}-${cleanName}`;

    // Decode base64 data
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save to local disk uploads directory
    const diskPath = path.join(UPLOADS_DIR, timestampedName);
    fs.writeFileSync(diskPath, buffer);
    const localPublicUrl = `/uploads/${timestampedName}`;

    let finalUrl = localPublicUrl;
    let isSupabase = false;

    // Upload to Supabase if configured
    const conf = getSupabaseConfig();
    if (conf.isConfigured) {
      try {
        const client = safeServerSupabaseClient(conf.url, conf.key);
        if (client) {
          const { error: uploadErr } = await client.storage
            .from('site-images')
            .upload(timestampedName, buffer, {
              contentType: 'image/jpeg',
              upsert: true,
            });

          if (!uploadErr) {
            const { data: pubData } = client.storage
              .from('site-images')
              .getPublicUrl(timestampedName);

            if (pubData?.publicUrl) {
              finalUrl = pubData.publicUrl;
              isSupabase = true;
            }
          } else {
            console.warn('Supabase bucket upload notice:', uploadErr.message);
          }
        }
      } catch (e) {
        console.error('Supabase upload exception', e);
      }
    }

    res.json({ success: true, url: finalUrl, isSupabase });
  } catch (err: any) {
    console.error('Upload error', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// Start server
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(ROOT_DIR, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(ROOT_DIR, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
