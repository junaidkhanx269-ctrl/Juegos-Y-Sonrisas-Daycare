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
const ADMIN_CREDENTIALS_FILE = path.join(DATA_DIR, 'admin_credentials.json');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Ensure default admin credentials exist
if (!fs.existsSync(ADMIN_CREDENTIALS_FILE)) {
  fs.writeFileSync(ADMIN_CREDENTIALS_FILE, JSON.stringify({
    email: 'vargas.amelia31@gmail.com',
    password: 'Admin@2024'
  }, null, 2));
}

// Default settings
const DEFAULT_SETTINGS = {
  hero_image: '/images/amelia-hero.jpg',
  about_image: '/images/amelia-hero.jpg',
  gallery_images: JSON.stringify([
    {
      id: 'default-1',
      url: '/images/hero_montessori_classroom_1790135121726.jpg',
      title: 'Montessori Sunlit Classroom',
      uploadedAt: new Date().toISOString(),
      category: 'classroom',
    },
    {
      id: 'default-2',
      url: '/images/daycare_backyard_play_1790135141749.jpg',
      title: 'Enclosed Safe Backyard',
      uploadedAt: new Date().toISOString(),
      category: 'backyard',
    },
    {
      id: 'default-3',
      url: '/images/kids_art_sensory_station_1790135171821.jpg',
      title: 'Sensory Atelier',
      uploadedAt: new Date().toISOString(),
      category: 'art',
    },
    {
      id: 'default-4',
      url: '/images/reading_nook_cozy_1790135186078.jpg',
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

import nodemailer from 'nodemailer';

const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const ADMIN_EMAIL = 'Vargas.amelia31@gmail.com';

// API 6: Send Email Notification to Parent & Admin
app.post('/api/send-email', async (req, res) => {
  try {
    const {
      type = 'tour',
      parentName,
      parentEmail,
      phone,
      childName,
      childAge,
      program,
      selectedDate,
      selectedTime,
      startDate,
      tourType = 'in-person',
      needsSubsidy,
      needsExtendedCare,
      message,
    } = req.body;

    if (!parentName || (!parentEmail && !phone)) {
      return res.status(400).json({ error: 'Missing parent name, email or phone' });
    }

    const inquiryRecord = {
      id: `inq-${Date.now()}`,
      type,
      parentName,
      parentEmail: parentEmail || 'Not provided',
      phone: phone || 'Not provided',
      childName: childName || 'N/A',
      childAge: childAge || 'N/A',
      program: program || 'N/A',
      selectedDate: selectedDate || 'N/A',
      selectedTime: selectedTime || 'N/A',
      startDate: startDate || 'N/A',
      tourType,
      needsSubsidy: Boolean(needsSubsidy),
      needsExtendedCare: Boolean(needsExtendedCare),
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Save to local inquiries.json
    let inquiries: any[] = [];
    if (fs.existsSync(INQUIRIES_FILE)) {
      try {
        inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
      } catch (e) {}
    }
    inquiries.unshift(inquiryRecord);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));

    // Save to Supabase if configured
    const conf = getSupabaseConfig();
    if (conf.isConfigured) {
      try {
        const client = safeServerSupabaseClient(conf.url, conf.key);
        if (client) {
          await client.from('inquiries').insert([
            {
              id: inquiryRecord.id,
              type: inquiryRecord.type,
              parent_name: inquiryRecord.parentName,
              parent_email: inquiryRecord.parentEmail,
              phone: inquiryRecord.phone,
              child_name: inquiryRecord.childName,
              child_age: inquiryRecord.childAge,
              program: inquiryRecord.program,
              selected_date: inquiryRecord.selectedDate,
              selected_time: inquiryRecord.selectedTime,
              details: JSON.stringify(inquiryRecord),
              created_at: inquiryRecord.createdAt,
            },
          ]);
        }
      } catch (err) {
        console.warn('Could not insert inquiry into Supabase inquiries table:', err);
      }
    }

    // Attempt sending real emails via nodemailer if SMTP settings or fallback available
    let smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    let smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    let smtpUser = process.env.SMTP_USER || '';
    let smtpPass = process.env.SMTP_PASS || '';

    const SMTP_CONFIG_FILE = path.join(DATA_DIR, 'smtp_config.json');
    if (fs.existsSync(SMTP_CONFIG_FILE)) {
      try {
        const fileSmtp = JSON.parse(fs.readFileSync(SMTP_CONFIG_FILE, 'utf-8'));
        if (fileSmtp.host) smtpHost = fileSmtp.host;
        if (fileSmtp.port) smtpPort = parseInt(fileSmtp.port, 10);
        if (fileSmtp.user) smtpUser = fileSmtp.user;
        if (fileSmtp.pass) smtpPass = fileSmtp.pass;
      } catch (e) {
        console.error('Error reading SMTP config file', e);
      }
    }

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const isTour = type === 'tour';
      const subjectAdmin = isTour
        ? `📅 New Tour Request: ${parentName} (${selectedDate} @ ${selectedTime})`
        : `📝 New Enrollment Application: ${childName || parentName}`;

      const subjectParent = isTour
        ? `✨ Tour Request Received - Juegos Y Sonrisas Daycare`
        : `✨ Application Received - Juegos Y Sonrisas Daycare`;

      const htmlAdmin = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1A237E; max-width: 600px; border: 1px solid #FFD60A; border-radius: 12px;">
          <h2 style="color: #1A237E;">${isTour ? '📅 New Tour Request' : '📝 New Enrollment Application'}</h2>
          <p>You received a new inquiry from <strong>${parentName}</strong>!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
          <ul style="line-height: 1.8;">
            <li><strong>Parent Name:</strong> ${parentName}</li>
            <li><strong>Parent Email:</strong> ${parentEmail || 'N/A'}</li>
            <li><strong>Phone Number:</strong> ${phone || 'N/A'}</li>
            ${
              isTour
                ? `
              <li><strong>Tour Type:</strong> ${tourType}</li>
              <li><strong>Preferred Date:</strong> ${selectedDate}</li>
              <li><strong>Preferred Time:</strong> ${selectedTime}</li>
              <li><strong>Child's Age:</strong> ${childAge || 'N/A'}</li>
            `
                : `
              <li><strong>Child's Name:</strong> ${childName || 'N/A'}</li>
              <li><strong>Child's DOB:</strong> ${childAge || 'N/A'}</li>
              <li><strong>Program Selected:</strong> ${program || 'N/A'}</li>
              <li><strong>Estimated Start Date:</strong> ${startDate || 'N/A'}</li>
              <li><strong>Needs State Voucher/Subsidy:</strong> ${needsSubsidy ? 'Yes' : 'No'}</li>
              <li><strong>Needs Extended Hours:</strong> ${needsExtendedCare ? 'Yes' : 'No'}</li>
              ${message ? `<li><strong>Notes:</strong> ${message}</li>` : ''}
            `
            }
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
          <p style="font-size: 12px; color: #666;">Juegos Y Sonrisas Daycare Admin Notification</p>
        </div>
      `;

      const htmlParent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1A237E; max-width: 600px; border: 1px solid #A8E6CF; border-radius: 12px;">
          <h2 style="color: #1A237E;">Hola ${parentName}! 🎉</h2>
          <p>Thank you for reaching out to <strong>Juegos Y Sonrisas Daycare</strong> in Mattapan, MA!</p>
          <p>${isTour ? `Amelia M Vargas has received your tour request for <strong>${selectedDate} at ${selectedTime}</strong>.` : 'Amelia M Vargas has received your child enrollment application.'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
          <p><strong>Director Contact:</strong> Amelia M Vargas</p>
          <p><strong>Phone / WhatsApp:</strong> +1 (857) 361-8923</p>
          <p><strong>Email:</strong> Vargas.amelia31@gmail.com</p>
          <p><strong>Address:</strong> 48 Hazelton St, Mattapan, MA 02126</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
          <p style="font-size: 13px; color: #444;">We look forward to meeting you and your little one soon!</p>
        </div>
      `;

      // 1. Send email to Admin
      await transporter.sendMail({
        from: `"Juegos Y Sonrisas Web" <${smtpUser}>`,
        to: ADMIN_EMAIL,
        subject: subjectAdmin,
        html: htmlAdmin,
      });

      // 2. Send email to Parent if email was provided
      if (parentEmail && parentEmail.includes('@')) {
        await transporter.sendMail({
          from: `"Juegos Y Sonrisas Daycare" <${smtpUser}>`,
          to: parentEmail,
          subject: subjectParent,
          html: htmlParent,
        });
      }
    } else {
      console.log('📧 Inquiry recorded. (Set SMTP_USER & SMTP_PASS in .env to enable live email delivery)');
    }

    res.json({ success: true, inquiry: inquiryRecord });
  } catch (err: any) {
    console.error('Email sending exception:', err);
    res.status(500).json({ error: err.message || 'Error processing email notification' });
  }
});

// API 7: Get all inquiries for Admin Panel
app.get('/api/inquiries', (_req, res) => {
  let inquiries: any[] = [];
  if (fs.existsSync(INQUIRIES_FILE)) {
    try {
      inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
    } catch (e) {}
  }
  res.json(inquiries);
});

// API 8: Get SMTP Configuration
app.get('/api/smtp', (_req, res) => {
  let host = 'smtp.gmail.com';
  let port = 587;
  let user = '';
  let hasPass = false;

  if (fs.existsSync(SMTP_CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SMTP_CONFIG_FILE, 'utf-8'));
      if (data.host) host = data.host;
      if (data.port) port = parseInt(data.port, 10);
      if (data.user) user = data.user;
      if (data.pass) hasPass = true;
    } catch (e) {}
  }

  res.json({ host, port, user, hasPass });
});

// API 9: Update SMTP Configuration
app.post('/api/smtp', (req, res) => {
  const { host, port, user, pass } = req.body;
  if (!host || !user) {
    return res.status(400).json({ error: 'Missing SMTP Host or Email User' });
  }

  let currentSmtp = { host: 'smtp.gmail.com', port: 587, user: '', pass: '' };
  if (fs.existsSync(SMTP_CONFIG_FILE)) {
    try {
      currentSmtp = JSON.parse(fs.readFileSync(SMTP_CONFIG_FILE, 'utf-8'));
    } catch (e) {}
  }

  currentSmtp.host = host.trim();
  currentSmtp.port = parseInt(port || '587', 10);
  currentSmtp.user = user.trim();
  if (pass !== undefined) {
    currentSmtp.pass = pass;
  }

  fs.writeFileSync(SMTP_CONFIG_FILE, JSON.stringify(currentSmtp, null, 2));
  res.json({ success: true, message: 'SMTP settings updated successfully!' });
});

// API 10: Admin Login Check
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  let creds = { email: 'vargas.amelia31@gmail.com', password: 'Admin@2024' };
  if (fs.existsSync(ADMIN_CREDENTIALS_FILE)) {
    try {
      creds = JSON.parse(fs.readFileSync(ADMIN_CREDENTIALS_FILE, 'utf-8'));
    } catch (e) {}
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCredsEmail = creds.email.trim().toLowerCase();

  if ((cleanEmail === cleanCredsEmail || cleanEmail === 'admin@juegosysonrisas.com') && password === creds.password) {
    res.json({ success: true, message: 'Authenticated successfully!' });
  } else {
    res.status(401).json({ error: 'Invalid credentials. Please check email & password.' });
  }
});

// API 11: Get Admin Credentials (Only Email for security)
app.get('/api/admin/credentials', (_req, res) => {
  let email = 'vargas.amelia31@gmail.com';
  if (fs.existsSync(ADMIN_CREDENTIALS_FILE)) {
    try {
      const creds = JSON.parse(fs.readFileSync(ADMIN_CREDENTIALS_FILE, 'utf-8'));
      if (creds.email) email = creds.email;
    } catch (e) {}
  }
  res.json({ email });
});

// API 12: Update Admin Credentials
app.post('/api/admin/update-credentials', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const newCreds = {
    email: email.trim().toLowerCase(),
    password: password.trim()
  };

  fs.writeFileSync(ADMIN_CREDENTIALS_FILE, JSON.stringify(newCreds, null, 2));
  res.json({ success: true, message: 'Admin credentials updated successfully!' });
});

// Start server
async function start() {
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const distIndexPath = path.join(ROOT_DIR, 'dist', 'index.html');
  const hasDist = fs.existsSync(distIndexPath);
  const isExplicitDev = process.env.NODE_ENV === 'development';

  if (hasDist && !isExplicitDev) {
    // Production mode: Serve pre-built static files from dist
    console.log('Serving production build from dist/');
    app.use(express.static(path.join(ROOT_DIR, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(distIndexPath);
    });
  } else {
    // Development mode with Vite middleware
    try {
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
    } catch (err) {
      console.warn('Vite dev server unavailable, using static fallback:', err);
      if (hasDist) {
        app.use(express.static(path.join(ROOT_DIR, 'dist')));
        app.get('*', (_req, res) => {
          res.sendFile(distIndexPath);
        });
      } else {
        app.get('*', (_req, res) => {
          res.status(200).send('<!doctype html><html><body><h1>Juegos Y Sonrisas Daycare</h1><p>Starting server... Please run npm run build to compile assets.</p></body></html>');
        });
      }
    }
  }

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  const rawPort = process.env.PORT || 3000;
  const isPipeOrSocket = typeof rawPort === 'string' && isNaN(Number(rawPort));

  const server = isPipeOrSocket
    ? app.listen(rawPort, () => {
        console.log(`Server listening on socket: ${rawPort}`);
      })
    : app.listen(Number(rawPort), () => {
        console.log(`Server listening on port: ${rawPort}`);
      });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated');
    });
  });
}

start();
