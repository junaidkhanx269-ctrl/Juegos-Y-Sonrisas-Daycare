import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, ArrowLeft, Sparkles, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('admin@juegosysonrisas.com');
  const [password, setPassword] = useState('Admin@2024');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === 'admin@juegosysonrisas.com' && password === 'Admin@2024') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminSessionTime', new Date().toISOString());
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Please check email & password.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@juegosysonrisas.com');
    setPassword('Admin@2024');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#FFD60A]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Button */}
        <button
          onClick={onNavigateHome}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#8B4513] hover:text-[#5D2E0C] bg-white px-3 py-2 rounded-full shadow-xs border border-[#8B4513]/20 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Daycare Website</span>
        </button>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B4513] to-[#5D2E0C] text-[#FFF8DC] flex items-center justify-center shadow-lg border-2 border-white mb-4 rotate-2">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1A237E] tracking-tight">
            Admin Panel Login
          </h2>
          <p className="mt-1 text-xs text-[#8B4513] font-medium">
            Juegos Y Sonrisas Daycare · Permanent Image Storage
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border-2 border-[#8B4513]/20 sm:px-10 relative overflow-hidden">
          {/* Decorative Top Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B4513] via-[#FFD60A] to-[#8B4513]" />

          {/* Preset Credentials Hint Box */}
          <div className="mb-6 p-3.5 bg-[#FFF8DC] rounded-2xl border border-[#8B4513]/30 text-xs text-[#5D2E0C] flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#8B4513]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Default Admin Credentials:</span>
              </div>
              <div className="font-mono text-[11px]">
                Email: <span className="font-bold">admin@juegosysonrisas.com</span>
              </div>
              <div className="font-mono text-[11px]">
                Pass: <span className="font-bold">Admin@2024</span>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[10px] font-bold uppercase bg-[#8B4513] text-white px-2.5 py-1 rounded-lg hover:bg-[#5D2E0C] transition-colors shrink-0"
            >
              Autofill
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl animate-fade-in text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B4513]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border-2 border-[#8B4513]/20 rounded-xl text-sm font-medium text-[#1A237E] placeholder-[#8B4513]/40 focus:outline-none focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513]"
                  placeholder="admin@juegosysonrisas.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8B4513]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border-2 border-[#8B4513]/20 rounded-xl text-sm font-medium text-[#1A237E] placeholder-[#8B4513]/40 focus:outline-none focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513]"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-[#FFF8DC] bg-[#8B4513] hover:bg-[#5D2E0C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FFD60A]" />
                    <span>Sign In to Admin Panel</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-[#8B4513]/70 font-medium">
          Protected Dashboard · Supabase Storage Active
        </div>
      </div>
    </div>
  );
};
