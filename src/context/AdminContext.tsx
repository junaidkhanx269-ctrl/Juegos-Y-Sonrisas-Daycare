import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, reinitSupabase, sanitizeUrl, DEFAULT_URL, DEFAULT_KEY } from '../lib/supabase';

export interface GalleryImageItem {
  id: string;
  url: string;
  title?: string;
  uploadedAt: string;
  category?: string;
}

interface AdminContextType {
  heroImage: string;
  aboutImage: string;
  galleryImages: GalleryImageItem[];
  isLoading: boolean;
  isSupabaseActive: boolean;
  updateHeroImage: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  updateAboutImage: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  addGalleryImage: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  deleteGalleryImage: (idOrUrl: string) => Promise<{ success: boolean; message?: string }>;
  reorderGalleryImages: (newGallery: GalleryImageItem[]) => Promise<{ success: boolean }>;
  saveCustomSupabaseConfig: (url: string, key: string) => Promise<void>;
  resetImagesToDefault: () => void;
}

const DEFAULT_HERO_IMAGE = '/images/amelia-hero.jpg';
const DEFAULT_ABOUT_IMAGE = '/images/amelia-hero.jpg';

const DEFAULT_GALLERY: GalleryImageItem[] = [
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
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('site_hero_image') || DEFAULT_HERO_IMAGE;
  });

  const [aboutImage, setAboutImage] = useState<string>(() => {
    return localStorage.getItem('site_about_image') || DEFAULT_ABOUT_IMAGE;
  });

  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>(() => {
    const saved = localStorage.getItem('site_gallery_images');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_GALLERY;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(isSupabaseConfigured());

  // Load config and settings from server or Supabase on mount
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);

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

  // Save custom Supabase credentials cleanly
  const saveCustomSupabaseConfig = async (rawUrl: string, rawKey: string) => {
    let cleanUrl = (rawUrl || '').trim();
    const cleanKey = (rawKey || '').trim();

    if (!cleanUrl || !cleanKey) {
      throw new Error('Please enter both Project URL and Anon API Key.');
    }

    // Check if the user pasted an API key into the URL field!
    if (cleanUrl.startsWith('sb_publishable_') || cleanUrl.startsWith('eyJ') || cleanUrl.includes('publishable')) {
      throw new Error('You pasted an API Key into the Project URL field! The Project URL should look like https://your-project.supabase.co');
    }

    cleanUrl = sanitizeUrl(cleanUrl);

    if (cleanUrl === DEFAULT_URL || !cleanUrl.includes('supabase.co')) {
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
  };

  const resetImagesToDefault = () => {
    setHeroImage(DEFAULT_HERO_IMAGE);
    setAboutImage(DEFAULT_ABOUT_IMAGE);
    setGalleryImages(DEFAULT_GALLERY);
    localStorage.removeItem('site_hero_image');
    localStorage.removeItem('site_about_image');
    localStorage.removeItem('site_gallery_images');
    localStorage.removeItem('CUSTOM_SUPABASE_URL');
    localStorage.removeItem('CUSTOM_SUPABASE_ANON_KEY');
    saveSetting('hero_image', DEFAULT_HERO_IMAGE);
    saveSetting('about_image', DEFAULT_ABOUT_IMAGE);
    saveSetting('gallery_images', JSON.stringify(DEFAULT_GALLERY));
  };

  return (
    <AdminContext.Provider
      value={{
        heroImage,
        aboutImage,
        galleryImages,
        isLoading,
        isSupabaseActive,
        updateHeroImage,
        updateAboutImage,
        addGalleryImage,
        deleteGalleryImage,
        reorderGalleryImages,
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
