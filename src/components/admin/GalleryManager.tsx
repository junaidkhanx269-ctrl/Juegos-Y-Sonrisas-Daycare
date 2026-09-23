import React, { useState, useRef } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Image as ImageIcon, CheckCircle2, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { useAdmin, GalleryImageItem } from '../../context/AdminContext';

export const GalleryManager: React.FC = () => {
  const { galleryImages, addGalleryImage, deleteGalleryImage, reorderGalleryImages, isSupabaseActive } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    setIsUploading(true);
    setToastMessage(null);

    const res = await addGalleryImage(file);
    setIsUploading(false);

    if (res.success) {
      setToastMessage('New gallery photo permanently uploaded to site-images/gallery/');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      alert(res.message || 'Error uploading file.');
    }
  };

  const handleDelete = async (item: GalleryImageItem) => {
    if (confirm(`Are you sure you want to remove "${item.title || 'this image'}" from the gallery?`)) {
      await deleteGalleryImage(item.id);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= galleryImages.length) return;

    const newArr = [...galleryImages];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;

    await reorderGalleryImages(newArr);
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border-2 border-[#8B4513]/15 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-[#FFF8DC] to-[#FFF8E7] border-b border-[#8B4513]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#8B4513] text-white">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1A237E]">Daycare Gallery Manager</h3>
          </div>
          <p className="text-xs text-[#8B4513] mt-1 font-medium">
            Manage, upload, delete, and reorder photo gallery items permanently in Supabase
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto px-5 py-3 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading to site-images/gallery/...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#FFD60A]" />
                <span>Add Gallery Photo</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between animate-fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md">
              PERMANENT
            </span>
          </div>
        )}

        {galleryImages.length === 0 ? (
          <div className="text-center py-12 bg-[#FFF8E7] rounded-2xl border-2 border-dashed border-[#8B4513]/20 space-y-3">
            <ImageIcon className="w-12 h-12 text-[#8B4513]/40 mx-auto" />
            <div className="text-sm font-bold text-[#1A237E]">Gallery is currently empty</div>
            <p className="text-xs text-[#8B4513]">Click "Add Gallery Photo" above to upload images.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#FFF8E7]/60 rounded-2xl border-2 border-[#8B4513]/15 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Image Box */}
                <div className="relative h-48 bg-[#FFF8DC] overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title || `Gallery photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#1A237E]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    #{index + 1}
                  </div>
                  {item.category && (
                    <div className="absolute top-2 right-2 bg-[#8B4513]/90 text-[#FFF8DC] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {item.category}
                    </div>
                  )}
                </div>

                {/* Info & Details */}
                <div className="p-4 space-y-3 grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1A237E] truncate">
                      {item.title || `Photo #${index + 1}`}
                    </h4>
                    <p className="text-[10px] text-[#8B4513] font-mono mt-0.5 truncate">
                      {item.url}
                    </p>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-2 border-t border-[#8B4513]/10 flex items-center justify-between gap-1">
                    {/* Copy Link Button */}
                    <button
                      onClick={() => copyUrl(item.id, item.url)}
                      className="p-2 bg-white hover:bg-amber-100 text-[#8B4513] rounded-lg border border-[#8B4513]/20 text-[11px] font-bold flex items-center gap-1"
                      title="Copy Public Image URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>URL</span>
                        </>
                      )}
                    </button>

                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 bg-white hover:bg-amber-100 disabled:opacity-30 text-[#1A237E] rounded-lg border border-[#8B4513]/20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === galleryImages.length - 1}
                        className="p-1.5 bg-white hover:bg-amber-100 disabled:opacity-30 text-[#1A237E] rounded-lg border border-[#8B4513]/20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 text-[11px] font-bold flex items-center gap-1"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
