import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, reinitSupabase, sanitizeUrl, DEFAULT_URL, DEFAULT_KEY } from '../lib/supabase';

export interface GalleryImageItem {
  id: string;
  url: string;
  title?: string;
  uploadedAt: string;
  category?: string;
}

export interface SiteContent {
  name: string;
  director: string;
  phone: string;
  email: string;
  address: string;
  licenseNumber: string;
  licenseState: string;
  hoursEn: string;
  hoursEs: string;
  taglineEn: string;
  taglineEs: string;
  announcementEn: string;
  announcementEs: string;
  showAnnouncement: boolean;
  infantRate: number;
  preschoolRate: number;
  schoolAgeRate: number;
  extendedCareRate: number;
  spaceSubtitleEn: string;
  spaceSubtitleEs: string;
  spaceTitleEn: string;
  spaceTitleEs: string;
  spaceDescEn: string;
  spaceDescEs: string;
  galleryTitleEn: string;
  galleryTitleEs: string;
  gallerySubtitleEn: string;
  gallerySubtitleEs: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  name: 'Juegos Y Sonrisas Daycare',
  director: 'Amelia M Vargas',
  phone: '+1 (857) 361-8923',
  email: 'Vargas.amelia31@gmail.com',
  address: '48 Hazelton St, Mattapan, MA 02126',
  licenseNumber: '9142647',
  licenseState: 'Massachusetts Family Childcare License',
  hoursEn: 'Monday – Friday: 8:00 AM – 5:00 PM',
  hoursEs: 'Lunes – Viernes: 8:00 AM – 5:00 PM',
  taglineEn: 'Where Learning is Full of Games & Smiles',
  taglineEs: 'Donde Aprender es Juego y Sonrisas',
  announcementEn: '🎉 Enrolling Now for 2026-2027! Schedule your private tour today in Mattapan, MA.',
  announcementEs: '🎉 ¡Inscripciones Abiertas 2026-2027! Reserve su recorrido privado en Mattapan, MA.',
  showAnnouncement: true,
  infantRate: 503,
  preschoolRate: 464,
  schoolAgeRate: 361,
  extendedCareRate: 104,
  spaceSubtitleEn: 'Environment As The Third Teacher',
  spaceSubtitleEs: 'El Entorno como Tercer Maestro',
  spaceTitleEn: 'Our Loving Space at 48 Hazelton St',
  spaceTitleEs: 'Nuestro Espacio en 48 Hazelton St',
  spaceDescEn: 'Thoughtfully arranged with natural woods, open daylight, child-height furnishings, and off-street parking designed for peaceful learning.',
  spaceDescEs: 'Diseñado meticulosamente con maderas naturales, luz natural, mobiliario a la altura del niño y estacionamiento privado para un día sin estrés.',
  galleryTitleEn: 'A Glimpse Inside',
  galleryTitleEs: 'Un Vistazo a Nuestro Mundo',
  gallerySubtitleEn: 'Our Learning Sanctuary',
  gallerySubtitleEs: 'Nuestro Refugio de Aprendizaje',
};

interface AdminContextType {
  heroImage: string;
  aboutImage: string;
  galleryImages: GalleryImageItem[];
  siteContent: SiteContent;
  isLoading: boolean;
  isSupabaseActive: boolean;
  updateHeroImage: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  updateAboutImage: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  addGalleryImage: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  deleteGalleryImage: (idOrUrl: string) => Promise<{ success: boolean; message?: string }>;
  reorderGalleryImages: (newGallery: GalleryImageItem[]) => Promise<{ success: boolean }>;
  updateSiteContent: (newContent: Partial<SiteContent>) => Promise<{ success: boolean }>;
  saveCustomSupabaseConfig: (url: string, key: string) => Promise<void>;
  resetImagesToDefault: () => void;
}

const fixImageUrl = (url?: string): string => {
  if (!url) return '';
  return url.replace('/src/assets/images/', '/images/');
};

const DEFAULT_HERO_IMAGE = '/images/amelia-hero.jpg';
const DEFAULT_ABOUT_IMAGE = '/images/amelia-hero.jpg';

const DEFAULT_GALLERY: GalleryImageItem[] = [
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
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroImage, setHeroImage] = useState<string>(() => {
    return fixImageUrl(localStorage.getItem('site_hero_image') || DEFAULT_HERO_IMAGE);
  });

  const [aboutImage, setAboutImage] = useState<string>(() => {
    return fixImageUrl(localStorage.getItem('site_about_image') || DEFAULT_ABOUT_IMAGE);
  });

  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>(() => {
    const saved = localStorage.getItem('site_gallery_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((img: GalleryImageItem) => ({ ...img, url: fixImageUrl(img.url) }));
        }
      } catch (e) {}
    }
    return DEFAULT_GALLERY;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('site_content_data');
    if (saved) {
      try {
        return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(isSupabaseConfigured());

  // Self-heal broken/deleted images using client Base64 backup
  const healImage = async (url: string): Promise<string> => {
    if (!url || !url.startsWith('/uploads/')) return url;
    const backup = localStorage.getItem(`backup_image_${url}`);
    if (!backup) return url;
    try {
      const fileName = url.split('/').pop() || 'image.jpg';
      const folderPrefix = url.includes('gallery/') ? 'gallery/' : '';
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileData: backup,
          folderPrefix,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          localStorage.setItem(`backup_image_${data.url}`, backup);
          if (data.url !== url) {
            localStorage.removeItem(`backup_image_${url}`);
          }
          return data.url;
        }
      }
    } catch (e) {
      console.warn('Auto-healing image failed:', e);
    }
    return url;
  };

  // Load config and settings from server or Supabase on mount
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);

      // Check if URL contains query/hash params for auto-sync on other phones
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        const queryUrl = urlParams.get('supaUrl') || hashParams.get('supaUrl');
        const queryKey = urlParams.get('supaKey') || hashParams.get('supaKey');
        if (queryUrl && queryKey) {
          reinitSupabase(queryUrl, queryKey);
          localStorage.setItem('CUSTOM_SUPABASE_URL', queryUrl);
          localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', queryKey);
          setIsSupabaseActive(true);
        }
      }

      // Check if custom Supabase credentials are saved locally
      const storedUrl = localStorage.getItem('CUSTOM_SUPABASE_URL');
      const storedKey = localStorage.getItem('CUSTOM_SUPABASE_ANON_KEY');
      if (storedUrl && storedKey) {
        reinitSupabase(storedUrl, storedKey);
        setIsSupabaseActive(isSupabaseConfigured());
      }

      // Try fetching server config if running fullstack
      try {
        const confRes = await fetch('/api/config');
        if (confRes.ok) {
          const conf = await confRes.json();
          if (conf.url && conf.key && conf.isConfigured) {
            reinitSupabase(conf.url, conf.key);
            localStorage.setItem('CUSTOM_SUPABASE_URL', conf.url);
            localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', conf.key);
            setIsSupabaseActive(true);
          }
        }
      } catch (err) {
        // Static host like Netlify - safe to ignore
      }

      // Try fetching site settings from server
      try {
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settings = await settingsRes.json();

          // Check for local storage customized data
          const localHero = localStorage.getItem('site_hero_image');
          const localAbout = localStorage.getItem('site_about_image');
          const localGallery = localStorage.getItem('site_gallery_images');
          const localContent = localStorage.getItem('site_content_data');

          let hasLocalCustomizations = false;
          if (localHero && localHero !== DEFAULT_HERO_IMAGE) hasLocalCustomizations = true;
          if (localAbout && localAbout !== DEFAULT_ABOUT_IMAGE) hasLocalCustomizations = true;
          if (localGallery) {
            try {
              const parsedLocal = JSON.parse(localGallery);
              if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
                if (parsedLocal.length !== DEFAULT_GALLERY.length || parsedLocal[0].url !== DEFAULT_GALLERY[0].url) {
                  hasLocalCustomizations = true;
                }
              }
            } catch (e) {}
          }
          if (localContent) {
            try {
              const parsedLocal = JSON.parse(localContent);
              if (parsedLocal && typeof parsedLocal === 'object' && Object.keys(parsedLocal).length > 0) {
                const keys = Object.keys(parsedLocal) as Array<keyof SiteContent>;
                const isDifferent = keys.some(k => parsedLocal[k] !== DEFAULT_SITE_CONTENT[k]);
                if (isDifferent) {
                  hasLocalCustomizations = true;
                }
              }
            } catch (e) {}
          }

          // Check if server returned default settings
          let serverIsDefault = true;
          if (settings.hero_image && settings.hero_image !== DEFAULT_HERO_IMAGE) serverIsDefault = false;
          if (settings.about_image && settings.about_image !== DEFAULT_ABOUT_IMAGE) serverIsDefault = false;
          if (settings.gallery_images) {
            try {
              const parsedServer = typeof settings.gallery_images === 'string'
                ? JSON.parse(settings.gallery_images)
                : settings.gallery_images;
              if (Array.isArray(parsedServer) && parsedServer.length > 0) {
                if (parsedServer.length !== DEFAULT_GALLERY.length || parsedServer[0].url !== DEFAULT_GALLERY[0].url) {
                  serverIsDefault = false;
                }
              }
            } catch (e) {}
          }
          if (settings.site_content_data) {
            serverIsDefault = false;
          }

          if (hasLocalCustomizations && serverIsDefault) {
            console.log('Detected server reset. Self-healing uploaded images and restoring text contents...');

            let healedHero = localHero || DEFAULT_HERO_IMAGE;
            if (localHero && localHero.startsWith('/uploads/')) {
              healedHero = await healImage(localHero);
            }

            let healedAbout = localAbout || DEFAULT_ABOUT_IMAGE;
            if (localAbout && localAbout.startsWith('/uploads/')) {
              healedAbout = await healImage(localAbout);
            }

            let healedGallery = DEFAULT_GALLERY;
            if (localGallery) {
              try {
                const parsedLocal = JSON.parse(localGallery) as GalleryImageItem[];
                healedGallery = await Promise.all(
                  parsedLocal.map(async (item) => {
                    if (item.url.startsWith('/uploads/')) {
                      const newUrl = await healImage(item.url);
                      return { ...item, url: newUrl };
                    }
                    return item;
                  })
                );
              } catch (e) {}
            }

            setHeroImage(healedHero);
            localStorage.setItem('site_hero_image', healedHero);
            await saveSetting('hero_image', healedHero);

            setAboutImage(healedAbout);
            localStorage.setItem('site_about_image', healedAbout);
            await saveSetting('about_image', healedAbout);

            setGalleryImages(healedGallery);
            const galStr = JSON.stringify(healedGallery);
            localStorage.setItem('site_gallery_images', galStr);
            await saveSetting('gallery_images', galStr);

            if (localContent) {
              const parsedContent = JSON.parse(localContent);
              setSiteContent(parsedContent);
              localStorage.setItem('site_content_data', localContent);
              await saveSetting('site_content_data', localContent);
            }
          } else {
            // Normal server-to-client settings synchronization
            if (settings.hero_image) {
              setHeroImage(settings.hero_image);
              localStorage.setItem('site_hero_image', settings.hero_image);
            }
            if (settings.about_image) {
              setAboutImage(settings.about_image);
              localStorage.setItem('site_about_image', settings.about_image);
            }
            if (settings.gallery_images) {
              try {
                const parsed = typeof settings.gallery_images === 'string'
                  ? JSON.parse(settings.gallery_images)
                  : settings.gallery_images;
                if (Array.isArray(parsed)) {
                  setGalleryImages(parsed);
                  localStorage.setItem('site_gallery_images', JSON.stringify(parsed));
                }
              } catch (e) {}
            }
            if (settings.site_content_data) {
              try {
                const parsed = typeof settings.site_content_data === 'string'
                  ? JSON.parse(settings.site_content_data)
                  : settings.site_content_data;
                if (parsed && typeof parsed === 'object') {
                  const merged = { ...DEFAULT_SITE_CONTENT, ...parsed };
                  setSiteContent(merged);
                  localStorage.setItem('site_content_data', JSON.stringify(merged));
                }
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        // Static host - safe to ignore
      }

      // Also try fetching site settings directly from Supabase if active
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.from('site_settings').select('*');
          if (!error && data && data.length > 0) {
            data.forEach((row: { key: string; value: string }) => {
              if (row.key === 'hero_image' && row.value) {
                setHeroImage(row.value);
                localStorage.setItem('site_hero_image', row.value);
              }
              if (row.key === 'about_image' && row.value) {
                setAboutImage(row.value);
                localStorage.setItem('site_about_image', row.value);
              }
              if (row.key === 'gallery_images' && row.value) {
                try {
                  const parsed = JSON.parse(row.value);
                  if (Array.isArray(parsed)) {
                    setGalleryImages(parsed);
                    localStorage.setItem('site_gallery_images', row.value);
                  }
                } catch (e) {}
              }
              if (row.key === 'site_content_data' && row.value) {
                try {
                  const parsed = JSON.parse(row.value);
                  if (parsed && typeof parsed === 'object') {
                    const merged = { ...DEFAULT_SITE_CONTENT, ...parsed };
                    setSiteContent(merged);
                    localStorage.setItem('site_content_data', JSON.stringify(merged));
                  }
                } catch (e) {}
              }
            });
          }
        } catch (e) {
          console.warn('Could not query Supabase site_settings directly:', e);
        }
      }

      setIsLoading(false);
    };

    initData();
  }, []);

  // Helper to convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload file safely (tries client Supabase storage -> server API -> local base64 fallback)
  const uploadImageFile = async (file: File, folderPrefix = ''): Promise<{ url: string; isSupabase: boolean }> => {
    const fileData = await fileToBase64(file);
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestampedName = `${folderPrefix}${Date.now()}-${cleanName}`;

    // Path 1: Client-side direct upload to Supabase bucket if configured
    if (isSupabaseConfigured()) {
      try {
        const { error: uploadErr } = await supabase.storage
          .from('site-images')
          .upload(timestampedName, file, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr) {
          const { data: pubData } = supabase.storage
            .from('site-images')
            .getPublicUrl(timestampedName);

          if (pubData?.publicUrl) {
            return { url: pubData.publicUrl, isSupabase: true };
          }
        } else {
          console.warn('Client Supabase bucket upload notice:', uploadErr.message);
        }
      } catch (err) {
        console.warn('Client Supabase upload error:', err);
      }
    }

    // Path 2: Try server API upload endpoint
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileData,
          folderPrefix,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          return { url: data.url, isSupabase: Boolean(data.isSupabase) };
        }
      }
    } catch (err) {
      // Server endpoint not present (e.g. static hosting)
    }

    // Path 3: Local Base64 fallback (guarantees image display instantly)
    return { url: fileData, isSupabase: false };
  };

  // Save key-value setting to both Supabase and server
  const saveSetting = async (key: string, value: string) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('site_settings').upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      } catch (e) {
        console.warn('Direct Supabase site_settings upsert notice:', e);
      }
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
    } catch (err) {
      // Ignore if no backend endpoint
    }
  };

  // Update Hero Image
  const updateHeroImage = async (file: File) => {
    try {
      const { url, isSupabase } = await uploadImageFile(file);
      setHeroImage(url);
      localStorage.setItem('site_hero_image', url);
      
      // Store Base64 backup for self-healing if it is a local upload URL
      if (url.startsWith('/uploads/')) {
        const base64 = await fileToBase64(file);
        localStorage.setItem(`backup_image_${url}`, base64);
      }

      await saveSetting('hero_image', url);

      return {
        success: true,
        url,
        message: isSupabase
          ? 'Hero image saved to Supabase Cloud & synced!'
          : 'Hero image saved!',
      };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || 'Failed to update hero image.' };
    }
  };

  // Update About Image
  const updateAboutImage = async (file: File) => {
    try {
      const { url, isSupabase } = await uploadImageFile(file);
      setAboutImage(url);
      localStorage.setItem('site_about_image', url);

      // Store Base64 backup for self-healing if it is a local upload URL
      if (url.startsWith('/uploads/')) {
        const base64 = await fileToBase64(file);
        localStorage.setItem(`backup_image_${url}`, base64);
      }

      await saveSetting('about_image', url);

      return {
        success: true,
        url,
        message: isSupabase
          ? 'About image saved to Supabase Cloud & synced!'
          : 'About image saved!',
      };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || 'Failed to update about image.' };
    }
  };

  // Add Gallery Image
  const addGalleryImage = async (file: File) => {
    try {
      const { url } = await uploadImageFile(file, 'gallery/');
      const newItem: GalleryImageItem = {
        id: `img-${Date.now()}`,
        url,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        uploadedAt: new Date().toISOString(),
      };

      // Store Base64 backup for self-healing if it is a local upload URL
      if (url.startsWith('/uploads/')) {
        const base64 = await fileToBase64(file);
        localStorage.setItem(`backup_image_${url}`, base64);
      }

      const updatedGallery = [newItem, ...galleryImages];
      setGalleryImages(updatedGallery);
      const jsonStr = JSON.stringify(updatedGallery);
      localStorage.setItem('site_gallery_images', jsonStr);
      await saveSetting('gallery_images', jsonStr);

      return { success: true, url, message: 'Gallery image uploaded!' };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || 'Failed to add gallery image.' };
    }
  };

  // Delete Gallery Image
  const deleteGalleryImage = async (idOrUrl: string) => {
    try {
      const updatedGallery = galleryImages.filter(
        (item) => item.id !== idOrUrl && item.url !== idOrUrl
      );
      setGalleryImages(updatedGallery);
      const jsonStr = JSON.stringify(updatedGallery);
      localStorage.setItem('site_gallery_images', jsonStr);
      await saveSetting('gallery_images', jsonStr);

      return { success: true, message: 'Image deleted from gallery.' };
    } catch (err: any) {
      console.error(err);
      return { success: false, message: err.message || 'Failed to delete image.' };
    }
  };

  // Reorder Gallery Images
  const reorderGalleryImages = async (newGallery: GalleryImageItem[]) => {
    setGalleryImages(newGallery);
    const jsonStr = JSON.stringify(newGallery);
    localStorage.setItem('site_gallery_images', jsonStr);
    await saveSetting('gallery_images', jsonStr);
    return { success: true };
  };

  // Update Site Content & Text
  const updateSiteContent = async (newContent: Partial<SiteContent>) => {
    const updated = { ...siteContent, ...newContent };
    setSiteContent(updated);
    const jsonStr = JSON.stringify(updated);
    localStorage.setItem('site_content_data', jsonStr);
    await saveSetting('site_content_data', jsonStr);
    return { success: true };
  };

  // Save custom Supabase credentials cleanly
  const saveCustomSupabaseConfig = async (rawUrl: string, rawKey: string) => {
    let cleanUrl = (rawUrl || '').trim();
    const cleanKey = (rawKey || '').trim();

    if (!cleanUrl || !cleanKey) {
      throw new Error('Please enter both Project URL and Anon API Key.');
    }

    if (cleanUrl.startsWith('sb_publishable_') || cleanUrl.startsWith('eyJ') || cleanUrl.includes('publishable')) {
      throw new Error('You pasted an API Key into the Project URL field! The Project URL should look like https://your-project.supabase.co');
    }

    cleanUrl = sanitizeUrl(cleanUrl);

    if (!cleanUrl.includes('supabase.co') && !cleanUrl.startsWith('http')) {
      throw new Error('Please enter a valid Supabase Project URL ending in .supabase.co (e.g. https://your-project.supabase.co)');
    }

    // 1. Instantly save to local storage
    localStorage.setItem('CUSTOM_SUPABASE_URL', cleanUrl);
    localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', cleanKey);

    // 2. Reinit client
    reinitSupabase(cleanUrl, cleanKey);
    setIsSupabaseActive(isSupabaseConfigured());

    // 3. Try server config sync if server exists
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl, key: cleanKey }),
      });
    } catch (err) {
      // Static host - safe to ignore
    }

    // 4. Instantly push all active images and site content to Supabase site_settings
    try {
      if (heroImage) await saveSetting('hero_image', heroImage);
      if (aboutImage) await saveSetting('about_image', aboutImage);
      if (galleryImages.length > 0) await saveSetting('gallery_images', JSON.stringify(galleryImages));
      if (siteContent) await saveSetting('site_content_data', JSON.stringify(siteContent));
    } catch (err) {
      console.warn('Initial push to Supabase site_settings notice:', err);
    }
  };

  const resetImagesToDefault = () => {
    setHeroImage(DEFAULT_HERO_IMAGE);
    setAboutImage(DEFAULT_ABOUT_IMAGE);
    setGalleryImages(DEFAULT_GALLERY);
    setSiteContent(DEFAULT_SITE_CONTENT);
    localStorage.removeItem('site_hero_image');
    localStorage.removeItem('site_about_image');
    localStorage.removeItem('site_gallery_images');
    localStorage.removeItem('site_content_data');
    localStorage.removeItem('CUSTOM_SUPABASE_URL');
    localStorage.removeItem('CUSTOM_SUPABASE_ANON_KEY');
    saveSetting('hero_image', DEFAULT_HERO_IMAGE);
    saveSetting('about_image', DEFAULT_ABOUT_IMAGE);
    saveSetting('gallery_images', JSON.stringify(DEFAULT_GALLERY));
    saveSetting('site_content_data', JSON.stringify(DEFAULT_SITE_CONTENT));
  };

  return (
    <AdminContext.Provider
      value={{
        heroImage,
        aboutImage,
        galleryImages,
        siteContent,
        isLoading,
        isSupabaseActive,
        updateHeroImage,
        updateAboutImage,
        addGalleryImage,
        deleteGalleryImage,
        reorderGalleryImages,
        updateSiteContent,
        saveCustomSupabaseConfig,
        resetImagesToDefault,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
