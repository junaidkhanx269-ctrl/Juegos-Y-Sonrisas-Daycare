import React, { useState } from 'react';
import { useAdmin, SiteContent } from '../../context/AdminContext';
import {
  Save,
  Check,
  Building,
  Phone,
  Clock,
  DollarSign,
  Megaphone,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export const SiteContentManager: React.FC = () => {
  const { siteContent, updateSiteContent } = useAdmin();
  const [formData, setFormData] = useState<SiteContent>(siteContent);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'rates' | 'banner'>('info');

  const handleChange = (key: keyof SiteContent, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteContent(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#8B4513]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFD60A] text-[#1A237E] uppercase font-mono">
              Full Site Control
            </span>
            <span className="text-xs text-[#8B4513] font-semibold">Live Content Editor</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-[#1A237E] mt-1">
            Daycare Info, Rates & Text Content
          </h2>
          <p className="text-xs text-[#8B4513] mt-0.5">
            Changes saved here automatically update your entire website and sync across all mobile phones and tablets.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Site content saved & synced successfully!</span>
          </div>
        )}
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#8B4513]/15 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'info'
              ? 'bg-[#8B4513] text-white shadow-xs'
              : 'bg-white text-[#1A237E] hover:bg-[#FFF8E7]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Daycare Info & Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'rates'
              ? 'bg-[#8B4513] text-white shadow-xs'
              : 'bg-white text-[#1A237E] hover:bg-[#FFF8E7]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Tuition Rates & Fees</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'banner'
              ? 'bg-[#8B4513] text-white shadow-xs'
              : 'bg-white text-[#1A237E] hover:bg-[#FFF8E7]'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcement Banner</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: DAYCARE INFO & CONTACT */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#8B4513]/15 space-y-6">
            <h3 className="text-lg font-display font-bold text-[#1A237E] border-b border-[#8B4513]/15 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#8B4513]" />
              <span>General Daycare & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Daycare Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Director Name
                </label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => handleChange('director', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-mono font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  License Issuer / State
                </label>
                <input
                  type="text"
                  value={formData.licenseState}
                  onChange={(e) => handleChange('licenseState', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Operating Hours (English)
                </label>
                <input
                  type="text"
                  value={formData.hoursEn}
                  onChange={(e) => handleChange('hoursEn', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Operating Hours (Spanish)
                </label>
                <input
                  type="text"
                  value={formData.hoursEs}
                  onChange={(e) => handleChange('hoursEs', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Website Subtitle / Tagline (English)
                </label>
                <input
                  type="text"
                  value={formData.taglineEn}
                  onChange={(e) => handleChange('taglineEn', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Website Subtitle / Tagline (Spanish)
                </label>
                <input
                  type="text"
                  value={formData.taglineEs}
                  onChange={(e) => handleChange('taglineEs', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TUITION RATES & FEES */}
        {activeTab === 'rates' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#8B4513]/15 space-y-6">
            <h3 className="text-lg font-display font-bold text-[#1A237E] border-b border-[#8B4513]/15 pb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#8B4513]" />
              <span>Program Tuition Rates & Weekly Prices</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 space-y-2">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider">
                  Infants & Toddlers Weekly Rate ($/week)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-[#8B4513] text-sm">$</span>
                  <input
                    type="number"
                    value={formData.infantRate}
                    onChange={(e) => handleChange('infantRate', Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-sm font-bold font-mono text-[#1A237E] focus:outline-none focus:border-[#8B4513] bg-white"
                  />
                </div>
                <p className="text-[10px] text-[#8B4513]">Age range: 3 months – 2 years</p>
              </div>

              <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 space-y-2">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider">
                  Preschool Ready Weekly Rate ($/week)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-[#8B4513] text-sm">$</span>
                  <input
                    type="number"
                    value={formData.preschoolRate}
                    onChange={(e) => handleChange('preschoolRate', Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-sm font-bold font-mono text-[#1A237E] focus:outline-none focus:border-[#8B4513] bg-white"
                  />
                </div>
                <p className="text-[10px] text-[#8B4513]">Age range: 2 years – 5 years</p>
              </div>

              <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 space-y-2">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider">
                  School Age & Care Weekly Rate ($/week)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-[#8B4513] text-sm">$</span>
                  <input
                    type="number"
                    value={formData.schoolAgeRate}
                    onChange={(e) => handleChange('schoolAgeRate', Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-sm font-bold font-mono text-[#1A237E] focus:outline-none focus:border-[#8B4513] bg-white"
                  />
                </div>
                <p className="text-[10px] text-[#8B4513]">After school & summer camp program</p>
              </div>

              <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#8B4513]/20 space-y-2">
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider">
                  Extended Care Add-On Rate ($/week)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-[#8B4513] text-sm">$</span>
                  <input
                    type="number"
                    value={formData.extendedCareRate}
                    onChange={(e) => handleChange('extendedCareRate', Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-sm font-bold font-mono text-[#1A237E] focus:outline-none focus:border-[#8B4513] bg-white"
                  />
                </div>
                <p className="text-[10px] text-[#8B4513]">Optional extended hours calculator fee</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENT BANNER */}
        {activeTab === 'banner' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#8B4513]/15 space-y-6">
            <h3 className="text-lg font-display font-bold text-[#1A237E] border-b border-[#8B4513]/15 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#8B4513]" />
                <span>Top Announcement Banner Bar</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-[#1A237E]">
                  {formData.showAnnouncement ? 'Banner Enabled' : 'Banner Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={formData.showAnnouncement}
                  onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                  className="w-4 h-4 accent-[#8B4513] rounded cursor-pointer"
                />
              </label>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Announcement Message (English)
                </label>
                <input
                  type="text"
                  value={formData.announcementEn}
                  onChange={(e) => handleChange('announcementEn', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                  placeholder="🎉 Enrolling Now for 2026-2027! Limited Spots Available in Mattapan, MA."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                  Announcement Message (Spanish)
                </label>
                <input
                  type="text"
                  value={formData.announcementEs}
                  onChange={(e) => handleChange('announcementEs', e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-[#8B4513]/20 rounded-xl text-xs font-bold text-[#1A237E] focus:outline-none focus:border-[#8B4513]"
                  placeholder="🎉 ¡Inscripciones Abiertas 2026-2027! Cupos Limitados en Mattapan, MA."
                />
              </div>

              {/* Preview Box */}
              <div className="p-4 bg-gradient-to-r from-[#FFD60A] to-[#FF9F1C] rounded-2xl text-[#1A237E] font-bold text-xs flex items-center justify-between shadow-xs">
                <span>Preview: {formData.announcementEn}</span>
                <span className="text-[10px] bg-white/40 px-2 py-0.5 rounded-md">Live Bar</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#8B4513]">
            Click Save below to update all website copy & rates immediately.
          </span>

          <button
            type="submit"
            className="px-6 py-3 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Save All Site Content</span>
          </button>
        </div>
      </form>
    </div>
  );
};
