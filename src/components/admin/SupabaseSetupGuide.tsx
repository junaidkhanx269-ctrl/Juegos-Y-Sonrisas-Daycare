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

  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await saveCustomSupabaseConfig(customUrl, customKey);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save credentials. Please check your URL and Key.');
    }
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

        <form onSubmit={handleSaveConfig} className="p-6 space-y-5">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Supabase credentials connected and active!</span>
            </div>
          )}

          {/* Real-time warning if user pasted Key into URL field */}
          {(customUrl.startsWith('sb_publishable_') || customUrl.startsWith('eyJ') || customUrl.includes('publishable')) && (
            <div className="p-4 bg-amber-50 border-2 border-amber-400 text-amber-900 rounded-2xl text-xs space-y-2">
              <div className="font-bold flex items-center gap-2 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: API Key pasted into Project URL field!</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                You pasted your publishable API Key (<code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">sb_publishable_...</code>) into the <strong>Project URL</strong> field.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomKey(customUrl);
                    setCustomUrl('');
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition-all"
                >
                  Move Key to Anon API Key Box
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Visual Helper Box */}
          <div className="p-3.5 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 text-xs text-[#8B4513] space-y-1">
            <p className="font-bold text-[#1A237E]">📌 Where to find these in Supabase Dashboard:</p>
            <ul className="list-disc list-inside text-[11px] space-y-1 pl-1">
              <li><strong>Project URL:</strong> Starts with <code className="bg-white px-1 rounded border border-[#8B4513]/20">https://</code> and ends in <code className="bg-white px-1 rounded border border-[#8B4513]/20">.supabase.co</code> (e.g. <code className="font-mono">https://xyzcompany.supabase.co</code>)</li>
              <li><strong>Anon API Key:</strong> Starts with <code className="bg-white px-1 rounded border border-[#8B4513]/20">sb_publishable_...</code> or <code className="bg-white px-1 rounded border border-[#8B4513]/20">eyJ...</code></li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                1. Project URL (<code className="lowercase">https://...supabase.co</code>)
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className={`w-full px-3.5 py-2.5 border-2 rounded-xl text-xs font-mono font-medium text-[#1A237E] focus:outline-none ${
                  customUrl.startsWith('sb_publishable_') || customUrl.startsWith('eyJ')
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-[#8B4513]/20 focus:border-[#8B4513]'
                }`}
              />
              <span className="text-[10px] text-[#8B4513] mt-1 block">
                Must be the web URL ending in <code className="font-mono font-bold">.supabase.co</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                2. Anon API Key (<code className="lowercase">sb_publishable_...</code> or <code className="lowercase">eyJ...</code>)
              </label>
              <input
                type="password"
                placeholder="sb_publishable_... or eyJhbG..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono font-medium text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
              />
              <span className="text-[10px] text-[#8B4513] mt-1 block">
                Paste your publishable or anon key here
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-[#8B4513]">
              Credentials entered here automatically save and sync across <strong>all mobile phones, tablets, and computers</strong>.
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save & Connect Supabase</span>
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
