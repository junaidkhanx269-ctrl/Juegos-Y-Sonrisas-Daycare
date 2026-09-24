import React, { useState } from 'react';
import {
  Image as ImageIcon,
  UserCheck,
  Grid,
  Database,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Menu,
  X,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ImageManager } from '../components/admin/ImageManager';
import { GalleryManager } from '../components/admin/GalleryManager';
import { SupabaseSetupGuide } from '../components/admin/SupabaseSetupGuide';
import { SiteContentManager } from '../components/admin/SiteContentManager';
import { InquiryManager } from '../components/admin/InquiryManager';
import { AdminCredentialsManager } from '../components/admin/AdminCredentialsManager';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigateHome }) => {
  const {
    heroImage,
    aboutImage,
    updateHeroImage,
    updateAboutImage,
    isSupabaseActive,
    resetImagesToDefault,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'inquiries' | 'content' | 'hero' | 'about' | 'gallery' | 'supabase' | 'security'>('inquiries');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'inquiries', label: 'Inquiries & Leads', icon: FileText, badge: 'New Submissions' },
    { id: 'content', label: 'Site Content & Rates', icon: Sparkles, badge: 'Editable Text' },
    { id: 'hero', label: 'Hero Image Manager', icon: ImageIcon, badge: 'Main Banner' },
    { id: 'about', label: 'About Amelia Image', icon: UserCheck, badge: 'Director Bio' },
    { id: 'gallery', label: 'Gallery Manager', icon: Grid, badge: 'Photos' },
    { id: 'security', label: 'Admin Credentials', icon: ShieldCheck, badge: 'Security' },
    { id: 'supabase', label: 'Supabase & SQL Setup', icon: Database, badge: 'Cloud Sync' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col font-sans antialiased text-[#1A237E] selection:bg-[#FFD60A]">
      {/* Top Navbar */}
      <header className="bg-gradient-to-r from-[#8B4513] via-[#5D2E0C] to-[#1A237E] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFD60A] text-[#1A237E] flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-base sm:text-lg leading-tight tracking-tight text-[#FFF8DC]">
                  Admin Panel
                </h1>
                <p className="text-[10px] text-[#FFD60A] font-semibold tracking-wide">
                  Juegos Y Sonrisas Daycare
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isSupabaseActive ? 'Supabase Sync Active' : 'Local Storage Mode'}</span>
            </div>

            {/* View Live Site */}
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside
            className={`lg:col-span-3 space-y-2 ${
              mobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-[#8B4513]/15 space-y-1.5 sticky top-24">
              <div className="px-3 py-2 text-[10px] font-bold text-[#8B4513] uppercase tracking-wider font-mono">
                Management Modules
              </div>

              {navigation.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#8B4513] text-[#FFF8DC] shadow-md scale-[1.01]'
                        : 'text-[#1A237E] hover:bg-[#FFF8E7] hover:text-[#8B4513]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-[#FFD60A]' : 'text-[#8B4513]'}`} />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#FFF8DC] text-[#8B4513]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-[#8B4513]/15 space-y-2">
                <button
                  onClick={() => {
                    if (confirm('Restore default daycare template images?')) {
                      resetImagesToDefault();
                    }
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-[#8B4513] hover:bg-amber-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Workspace */}
          <main className="lg:col-span-9 space-y-6">
            {activeTab === 'inquiries' && <InquiryManager />}

            {activeTab === 'content' && <SiteContentManager />}

            {activeTab === 'hero' && (
              <ImageManager
                title="1. Hero Image Manager"
                description="Upload the main hero photo displayed on the top of the homepage."
                currentImage={heroImage}
                onUpload={updateHeroImage}
                aspectRatio="hero"
              />
            )}

            {activeTab === 'about' && (
              <ImageManager
                title="2. About Amelia Image Manager"
                description="Upload Director Amelia Vargas's portrait shown in the About section."
                currentImage={aboutImage}
                onUpload={updateAboutImage}
                aspectRatio="portrait"
              />
            )}

            {activeTab === 'gallery' && <GalleryManager />}

            {activeTab === 'security' && <AdminCredentialsManager />}

            {activeTab === 'supabase' && <SupabaseSetupGuide />}
          </main>
        </div>
      </div>
    </div>
  );
};
