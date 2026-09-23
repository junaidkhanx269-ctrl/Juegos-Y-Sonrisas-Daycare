import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  saveCustomSupabaseConfig: (url: string, key: string) => void;
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
      } catch (e) {
        console.error('Failed to parse saved gallery', e);
      }
    }
    return DEFAULT_GALLERY;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(isSupabaseConfigured());

  // Fetch from Supabase site_settings table on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const configured = isSupabaseConfigured();
      setIsSupabaseActive(configured);

      if (configured) {
        try {
          const { data, error } = await supabase.from('site_settings').select('*');
          if (!error && data && data.length > 0) {
            data.forEach((item: { key: string; value: string }) => {
              if (item.key === 'hero_image' && item.value) {
                setHeroImage(item.value);
                localStorage.setItem('site_hero_image', item.value);
              }
              if (item.key === 'about_image' && item.value) {
                setAboutImage(item.value);
                localStorage.setItem('site_about_image', item.value);
              }
              if (item.key === 'gallery_images' && item.value) {
                try {
                  const parsed = JSON.parse(item.value);
                  if (Array.isArray(parsed)) {
                    setGalleryImages(parsed);
                    localStorage.setItem('site_gallery_images', item.value);
                  }
                } catch (err) {
                  console.error('Error parsing gallery JSON from DB', err);
                }
              }
            });
          }
        } catch (err) {
          console.warn('Could not query Supabase site_settings table', err);
        }
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  // Upload file helper to Supabase or fallback base64 DataURL
  const uploadImageFile = async (file: File, folderPrefix = ''): Promise<string> => {
    const configured = isSupabaseConfigured();

    if (configured) {
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${folderPrefix}${Date.now()}-${cleanName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('site-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.warn('Supabase upload error, falling back to local storage', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('site-images')
            .getPublicUrl(fileName);

          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.error('Exception during Supabase upload', err);
      }
    }

    // Fallback: Convert file to Base64 data URL for local storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Helper to upsert site_settings in Supabase
  const updateSettingInDb = async (key: string, value: string) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('site_settings').upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      } catch (err) {
        console.error(`Failed to update site_settings key ${key} in Supabase`, err);
      }
    }
  };

  // Task 3: Update Hero Image
  const updateHeroImage = async (file: File) => {
    try {
      const publicUrl = await uploadImageFile(file);
      setHeroImage(publicUrl);
      localStorage.setItem('site_hero_image', publicUrl);
      await updateSettingInDb('hero_image', publicUrl);
      return { success: true, url: publicUrl, message: 'Hero image permanently updated!' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Failed to process image upload.' };
    }
  };

  // Task 3: Update About Image
  const updateAboutImage = async (file: File) => {
    try {
      const publicUrl = await uploadImageFile(file);
      setAboutImage(publicUrl);
      localStorage.setItem('site_about_image', publicUrl);
      await updateSettingInDb('about_image', publicUrl);
      return { success: true, url: publicUrl, message: 'About image permanently updated!' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Failed to process image upload.' };
    }
  };

  // Task 3: Add Gallery Image
  const addGalleryImage = async (file: File) => {
    try {
      const publicUrl = await uploadImageFile(file, 'gallery/');
      const newItem: GalleryImageItem = {
        id: `img-${Date.now()}`,
        url: publicUrl,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        uploadedAt: new Date().toISOString(),
      };

      const updatedGallery = [newItem, ...galleryImages];
      setGalleryImages(updatedGallery);
      const jsonStr = JSON.stringify(updatedGallery);
      localStorage.setItem('site_gallery_images', jsonStr);
      await updateSettingInDb('gallery_images', jsonStr);

      return { success: true, url: publicUrl, message: 'Gallery image added permanently!' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Failed to add image to gallery.' };
    }
  };

  // Task 3: Delete Gallery Image
  const deleteGalleryImage = async (idOrUrl: string) => {
    try {
      const updatedGallery = galleryImages.filter(
        (item) => item.id !== idOrUrl && item.url !== idOrUrl
      );
      setGalleryImages(updatedGallery);
      const jsonStr = JSON.stringify(updatedGallery);
      localStorage.setItem('site_gallery_images', jsonStr);
      await updateSettingInDb('gallery_images', jsonStr);

      // Attempt to delete from Supabase storage if URL belongs to site-images
      if (isSupabaseConfigured() && idOrUrl.includes('site-images')) {
        try {
          const parts = idOrUrl.split('site-images/');
          if (parts.length > 1) {
            const filePath = parts[1];
            await supabase.storage.from('site-images').remove([filePath]);
          }
        } catch (e) {
          console.warn('Storage delete warning', e);
        }
      }

      return { success: true, message: 'Image removed from gallery.' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Failed to delete gallery image.' };
    }
  };

  // Task 3: Reorder Gallery Images
  const reorderGalleryImages = async (newGallery: GalleryImageItem[]) => {
    setGalleryImages(newGallery);
    const jsonStr = JSON.stringify(newGallery);
    localStorage.setItem('site_gallery_images', jsonStr);
    await updateSettingInDb('gallery_images', jsonStr);
    return { success: true };
  };

  // Save custom dynamic keys
  const saveCustomSupabaseConfig = (url: string, key: string) => {
    if (url) localStorage.setItem('CUSTOM_SUPABASE_URL', url.trim());
    else localStorage.removeItem('CUSTOM_SUPABASE_URL');

    if (key) localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', key.trim());
    else localStorage.removeItem('CUSTOM_SUPABASE_ANON_KEY');

    window.location.reload();
  };

  const resetImagesToDefault = () => {
    setHeroImage(DEFAULT_HERO_IMAGE);
    setAboutImage(DEFAULT_ABOUT_IMAGE);
    setGalleryImages(DEFAULT_GALLERY);
    localStorage.removeItem('site_hero_image');
    localStorage.removeItem('site_about_image');
    localStorage.removeItem('site_gallery_images');
    updateSettingInDb('hero_image', DEFAULT_HERO_IMAGE);
    updateSettingInDb('about_image', DEFAULT_ABOUT_IMAGE);
    updateSettingInDb('gallery_images', JSON.stringify(DEFAULT_GALLERY));
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
