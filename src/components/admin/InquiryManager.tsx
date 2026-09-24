import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Clock, User, Check, RefreshCw, MessageSquare, AlertCircle, Save, Key, Settings2 } from 'lucide-react';

export interface Inquiry {
  id: string;
  type: 'tour' | 'enrollment';
  parentName: string;
  parentEmail: string;
  phone: string;
  childName?: string;
  childAge?: string;
  program?: string;
  selectedDate?: string;
  selectedTime?: string;
  startDate?: string;
  tourType?: string;
  needsSubsidy?: boolean;
  needsExtendedCare?: boolean;
  message?: string;
  createdAt: string;
  status?: string;
}

export const InquiryManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'tour' | 'enrollment'>('all');

  // SMTP Settings State
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [smtpSaved, setSmtpSaved] = useState(false);
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.warn('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmtpSettings = async () => {
    try {
      const res = await fetch('/api/smtp');
      if (res.ok) {
        const data = await res.json();
        setSmtpHost(data.host || 'smtp.gmail.com');
        setSmtpPort(data.port || 587);
        setSmtpUser(data.user || '');
        setSmtpConfigured(data.hasPass);
      }
    } catch (err) {
      console.warn('Error fetching SMTP settings:', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchSmtpSettings();
  }, []);

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass || undefined, // only send if not empty
        }),
      });

      if (res.ok) {
        setSmtpSaved(true);
        setSmtpConfigured(true);
        if (smtpPass) {
          setSmtpPass('');
        }
        setTimeout(() => setSmtpSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving SMTP settings:', err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === 'all') return true;
    return inq.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-[#1A237E]">Inquiries & Tour Requests</h2>
          <p className="text-xs text-[#8B4513]">
            Automatic notifications are sent to parents and <span className="font-bold text-[#1A237E]">Vargas.amelia31@gmail.com</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Email Settings Trigger Button */}
          <button
            onClick={() => setShowSmtpConfig(!showSmtpConfig)}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              smtpConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{smtpConfigured ? 'Email Active (Connected)' : 'Activate Email Alerts'}</span>
          </button>

          <div className="flex bg-[#FFF8E7] p-1 rounded-xl border border-[#8B4513]/20 text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-[#1A237E] text-white shadow-xs' : 'text-[#1A237E]/70'
              }`}
            >
              All ({inquiries.length})
            </button>
            <button
              onClick={() => setFilter('tour')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'tour' ? 'bg-[#1A237E] text-white shadow-xs' : 'text-[#1A237E]/70'
              }`}
            >
              Tours ({inquiries.filter((i) => i.type === 'tour').length})
            </button>
            <button
              onClick={() => setFilter('enrollment')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'enrollment' ? 'bg-[#1A237E] text-white shadow-xs' : 'text-[#1A237E]/70'
              }`}
            >
              Applications ({inquiries.filter((i) => i.type === 'enrollment').length})
            </button>
          </div>

          <button
            onClick={fetchInquiries}
            className="p-2 bg-white border border-[#8B4513]/20 text-[#1A237E] rounded-xl hover:bg-[#FFF8E7] transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* SMTP Email Configuration Section */}
      {showSmtpConfig && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#1A237E]/20 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3 border-b border-[#FFF8E7] pb-3">
            <div className="p-2 bg-[#1A237E] text-white rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1A237E]">Email Auto-Response Setup (SMTP)</h3>
              <p className="text-xs text-[#8B4513]">
                Connect your business email so parent confirmations and director notifications are delivered in real-time.
              </p>
            </div>
          </div>

          <div className="bg-[#FFF8E7] p-4 rounded-2xl text-xs text-[#8B4513] space-y-2">
            <p className="font-bold text-[#1A237E] flex items-center gap-1">
              <span>💡 Quick Gmail Setup:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#5D2E0C]">
              <li>Use <strong>smtp.gmail.com</strong> for SMTP Host and <strong>587</strong> for SMTP Port.</li>
              <li>Turn on <strong>2-Step Verification</strong> on your Gmail account.</li>
              <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#1A237E]">Gmail App Passwords</a>, select "Mail", and click Generate.</li>
              <li>Paste the 16-character generated code into the <strong>SMTP Password / App Password</strong> box below!</li>
            </ol>
          </div>

          <form onSubmit={handleSaveSmtp} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-[#1A237E] uppercase mb-1">SMTP Host</label>
              <input
                type="text"
                required
                placeholder="smtp.gmail.com"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono text-[#1A237E] focus:outline-none focus:border-[#1A237E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#1A237E] uppercase mb-1">SMTP Port</label>
              <input
                type="number"
                required
                placeholder="587"
                value={smtpPort}
                onChange={(e) => setSmtpPort(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono text-[#1A237E] focus:outline-none focus:border-[#1A237E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#1A237E] uppercase mb-1">SMTP Email Address</label>
              <input
                type="email"
                required
                placeholder="Vargas.amelia31@gmail.com"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono text-[#1A237E] focus:outline-none focus:border-[#1A237E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#1A237E] uppercase mb-1">
                SMTP App Password {smtpConfigured && <span className="text-emerald-600 font-bold">(Configured)</span>}
              </label>
              <input
                type="password"
                placeholder={smtpConfigured ? "••••••••••••••••" : "Paste 16-char App Password"}
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono text-[#1A237E] focus:outline-none focus:border-[#1A237E]"
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2">
              {smtpSaved && (
                <span className="text-xs text-emerald-600 font-bold self-center animate-pulse flex items-center gap-1 mr-2">
                  <Check className="w-3.5 h-3.5" /> Saved & Connected!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A237E] hover:bg-[#283593] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-[#8B4513]/15">
          <RefreshCw className="w-6 h-6 animate-spin text-[#1A237E] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#1A237E]">Loading submissions...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-[#8B4513]/15 space-y-2">
          <AlertCircle className="w-8 h-8 text-[#FFD60A] mx-auto" />
          <h3 className="text-sm font-bold text-[#1A237E]">No submissions yet</h3>
          <p className="text-xs text-[#8B4513]">
            When parents submit a tour request or enrollment application, it will appear here and email notifications will fire automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-5 bg-white rounded-3xl border border-[#8B4513]/15 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FFF8E7] pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase font-mono px-2.5 py-1 rounded-full ${
                      inq.type === 'tour' ? 'bg-[#FFD60A]/30 text-[#8B4513]' : 'bg-[#A8E6CF]/40 text-[#2D6A4F]'
                    }`}
                  >
                    {inq.type === 'tour' ? '📅 Tour Request' : '📝 Application'}
                  </span>
                  <span className="text-xs text-[#8B4513]/60">
                    {new Date(inq.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {inq.phone && inq.phone !== 'Not provided' && (
                    <a
                      href={`https://wa.me/${inq.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold bg-[#25D366] text-white px-2.5 py-1 rounded-lg hover:opacity-90"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {inq.parentEmail && inq.parentEmail !== 'Not provided' && (
                    <a
                      href={`mailto:${inq.parentEmail}`}
                      className="inline-flex items-center gap-1 text-xs font-bold bg-[#1A237E] text-white px-2.5 py-1 rounded-lg hover:bg-[#283593]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply Email</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#1A237E]">
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[#1A237E]">
                    <User className="w-3.5 h-3.5 text-[#FF6B6B]" />
                    <span>Parent: {inq.parentName}</span>
                  </div>
                  <p className="text-[#8B4513]">Email: {inq.parentEmail}</p>
                  <p className="text-[#8B4513]">Phone: {inq.phone}</p>
                </div>

                <div className="space-y-1">
                  {inq.type === 'tour' ? (
                    <>
                      <p className="font-bold">Tour Type: <span className="capitalize">{inq.tourType}</span></p>
                      <p className="text-[#8B4513]">Date: {inq.selectedDate}</p>
                      <p className="text-[#8B4513]">Time: {inq.selectedTime}</p>
                      <p className="text-[#8B4513]">Child Age: {inq.childAge}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold">Child Name: {inq.childName}</p>
                      <p className="text-[#8B4513]">DOB/Age: {inq.childAge}</p>
                      <p className="text-[#8B4513]">Program: {inq.program}</p>
                      <p className="text-[#8B4513]">Start Date: {inq.startDate}</p>
                    </>
                  )}
                </div>

                <div className="space-y-1 bg-[#FFF8E7]/50 p-2.5 rounded-xl border border-[#8B4513]/10">
                  {inq.needsSubsidy && <p className="text-[11px] font-bold text-[#E07A5F]">✓ Needs State Subsidy/Voucher</p>}
                  {inq.needsExtendedCare && <p className="text-[11px] font-bold text-[#1A237E]">✓ Needs Extended Care</p>}
                  {inq.message && <p className="text-[11px] italic text-[#8B4513]">"{inq.message}"</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
