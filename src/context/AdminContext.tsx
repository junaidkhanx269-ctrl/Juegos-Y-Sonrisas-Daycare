import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, reinitSupabase } from '../lib/supabase';

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

  // Load config and settings from server API on mount
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);

      // 1. Fetch server-wide Supabase config
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
        console.warn('Could not fetch /api/config', err);
      }

      // 2. Fetch server-wide site settings
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
            } catch (e) {
              console.error('Error parsing gallery images from server', e);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch /api/settings', err);
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

  // Upload file via server endpoint (uploads to Supabase bucket AND server disk)
  const uploadImageFile = async (file: File, folderPrefix = ''): Promise<{ url: string; isSupabase: boolean }> => {
    const fileData = await fileToBase64(file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileData,
        folderPrefix,
      }),
    });

    if (!res.ok) {
      throw new Error('Upload failed on server endpoint');
    }

    const data = await res.json();
    return { url: data.url, isSupabase: data.isSupabase };
  };

  // Save key-value setting to server and Supabase
  const saveSetting = async (key: string, value: string) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
    } catch (err) {
      console.error('Error calling /api/settings', err);
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
          ? 'Hero image permanently saved to Supabase & synced across all devices!'
          : 'Hero image saved to permanent server storage!',
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
          ? 'About image permanently saved to Supabase & synced across all devices!'
          : 'About image saved to permanent server storage!',
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

      return { success: true, url, message: 'Gallery image permanently uploaded and synced across devices!' };
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

  // Save custom Supabase credentials to server so ALL devices get configured instantly!
  const saveCustomSupabaseConfig = async (url: string, key: string) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, key }),
      });

      if (res.ok) {
        reinitSupabase(url, key);
        localStorage.setItem('CUSTOM_SUPABASE_URL', url);
        localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', key);
        setIsSupabaseActive(true);
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to save Supabase config to server', err);
    }
  };

  const resetImagesToDefault = () => {
    setHeroImage(DEFAULT_HERO_IMAGE);
    setAboutImage(DEFAULT_ABOUT_IMAGE);
    setGalleryImages(DEFAULT_GALLERY);
    localStorage.removeItem('site_hero_image');
    localStorage.removeItem('site_about_image');
    localStorage.removeItem('site_gallery_images');
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
