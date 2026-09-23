import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, ShieldCheck, Sparkles, AlertCircle, Save } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { supabaseUrl, supabaseAnonKey } from '../../lib/supabase';

export const SupabaseSetupGuide: React.FC = () => {
  const { isSupabaseActive, saveCustomSupabaseConfig } = useAdmin();
  const [copiedSql, setCopiedSql] = useState(false);
  const [customUrl, setCustomUrl] = useState(
    supabaseUrl !== 'https://YOUR_PROJECT.supabase.co' ? supabaseUrl : ''
  );
  const [customKey, setCustomKey] = useState(
    supabaseAnonKey !== 'YOUR_ANON_KEY' ? supabaseAnonKey : ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sqlSnippet = `
-- 1. Create the site_settings table for permanent image storage
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insert initial default settings
INSERT INTO site_settings (key, value) VALUES 
('hero_image', '/images/amelia-hero.jpg'),
('about_image', '/images/amelia-hero.jpg'),
('gallery_images', '[]')
ON CONFLICT (key) DO NOTHING;

-- 3. Enable RLS and add public access policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read site_settings" 
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update site_settings" 
  ON site_settings FOR ALL USING (true);
`.trim();

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseConfig(customUrl, customKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Key Configuration Form */}
      <div className="bg-white rounded-3xl shadow-sm border-2 border-[#8B4513]/15 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#FFF8DC] to-[#FFF8E7] border-b border-[#8B4513]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#8B4513] text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#1A237E]">Supabase Project Credentials</h3>
              <p className="text-xs text-[#8B4513]">Connect your Supabase Cloud instance for permanent image sync</p>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isSupabaseActive
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isSupabaseActive ? 'Supabase Connected' : 'Configuration Pending'}</span>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Supabase credentials saved! App reloaded to test connection.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                Project URL (<code className="lowercase">VITE_SUPABASE_URL</code>)
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono font-medium text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                Anon API Key (<code className="lowercase">VITE_SUPABASE_ANON_KEY</code>)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono font-medium text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#8B4513]">
              Credentials can also be placed in <code className="bg-[#FFF8E7] px-1.5 py-0.5 rounded border border-[#8B4513]/20 font-mono">.env</code>
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Verify Connection</span>
            </button>
          </div>
        </form>
      </div>

      {/* Task 2: Setup Instructions Card */}
      <div className="bg-white rounded-3xl shadow-sm border-2 border-[#8B4513]/15 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#8B4513]/15 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-[#1A237E]">
              Task 2: Supabase Bucket & Database Instructions
            </h3>
            <p className="text-xs text-[#8B4513]">Follow these 3 simple steps in your Supabase Dashboard</p>
          </div>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#1A237E] hover:bg-[#283593] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-5 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#8B4513] text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-[#1A237E]">Create Storage Bucket</h4>
            <ul className="text-xs text-[#5D2E0C] space-y-1 list-disc list-inside">
              <li>Go to <strong>Storage</strong> in Supabase</li>
              <li>Click <strong>New Bucket</strong></li>
              <li>Name: <code className="font-mono bg-white px-1 rounded font-bold">site-images</code></li>
              <li>Set Public Bucket: <strong className="text-emerald-700">YES</strong></li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#8B4513] text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-[#1A237E]">Create Gallery Folder</h4>
            <ul className="text-xs text-[#5D2E0C] space-y-1 list-disc list-inside">
              <li>Open bucket <code className="font-mono bg-white px-1 rounded font-bold">site-images</code></li>
              <li>Click <strong>New Folder</strong></li>
              <li>Folder Name: <code className="font-mono bg-white px-1 rounded font-bold">gallery</code></li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#8B4513] text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-[#1A237E]">Run SQL Schema Script</h4>
            <ul className="text-xs text-[#5D2E0C] space-y-1 list-disc list-inside">
              <li>Open <strong>SQL Editor</strong></li>
              <li>Click <strong>New Query</strong></li>
              <li>Paste SQL script below & click <strong>Run</strong></li>
            </ul>
          </div>
        </div>

        {/* SQL Script Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1A237E] uppercase tracking-wider font-mono">
              Database Table SQL Script
            </span>
            <button
              onClick={handleCopySql}
              className="px-3.5 py-1.5 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied SQL to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Query</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-[#1A237E] text-[#FFF8DC] rounded-2xl text-xs font-mono overflow-x-auto border-2 border-[#8B4513]/30 leading-relaxed">
            {sqlSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
