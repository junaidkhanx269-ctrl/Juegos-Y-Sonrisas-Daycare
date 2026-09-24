import React, { useState, useEffect } from 'react';
import { ShieldCheck, Save, Check, AlertCircle, Key } from 'lucide-react';

export const AdminCredentialsManager: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Fetch current admin email
    const fetchCreds = async () => {
      try {
        const res = await fetch('/api/admin/credentials');
        if (res.ok) {
          const data = await res.json();
          if (data.email) {
            setEmail(data.email);
          }
        }
      } catch (e) {
        console.error('Failed to fetch admin credentials:', e);
      }
    };
    fetchCreds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Admin credentials updated successfully! Use these new credentials for your next login.' });
        setPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update credentials.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network connection error. Failed to save credentials.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border-2 border-[#8B4513]/15 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-[#FFF8DC] to-[#FFF8E7] border-b border-[#8B4513]/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#8B4513] text-white">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-[#1A237E]">Admin Security Settings</h3>
            <p className="text-xs text-[#8B4513]">Update the secure email and password used to access this dashboard</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 border ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-2">
              Admin Login Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Vargas.amelia31@gmail.com"
              className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-medium text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-medium text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-medium text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#8B4513]/10">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8B4513]">
            <ShieldCheck className="w-4 h-4 text-[#8B4513]/70" />
            <span>Keep your credentials safe. We recommend a password of at least 8 characters.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-55"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Update Admin Credentials'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
