import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface ImageManagerProps {
  title: string;
  description: string;
  currentImage: string;
  onUpload: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  aspectRatio?: 'hero' | 'portrait' | 'square';
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  title,
  description,
  currentImage,
  onUpload,
  aspectRatio = 'hero',
}) => {
  const { isSupabaseActive } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setSelectedPreview(objectUrl);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const triggerUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setToastMessage(null);

    const res = await onUpload(selectedFile);
    setIsUploading(false);

    if (res.success) {
      setToastMessage('Image permanently saved to Supabase');
      setSelectedFile(null);
      setSelectedPreview(null);
      setTimeout(() => setToastMessage(null), 5000);
    } else {
      alert(res.message || 'Error saving image.');
    }
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
            <h3 className="font-display text-xl font-bold text-[#1A237E]">{title}</h3>
          </div>
          <p className="text-xs text-[#8B4513] mt-1 font-medium">{description}</p>
        </div>

        {/* Permanent Storage Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20 self-start sm:self-auto">
          <Database className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>
            {isSupabaseActive
              ? 'Stored in Supabase - will not revert on refresh'
              : 'Stored Locally - Connect Supabase for Cloud Storage'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Success Toast Banner */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Current Live Preview Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-[#1A237E] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B4513]" />
              <span>Current Live Preview</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-[#8B4513]/20 bg-[#FFF8E7] shadow-md group">
              <img
                src={selectedPreview || currentImage}
                alt={title}
                className={`w-full object-cover ${
                  aspectRatio === 'hero'
                    ? 'h-64 sm:h-80 object-top'
                    : aspectRatio === 'portrait'
                    ? 'h-80 object-top'
                    : 'h-64 object-center'
                }`}
              />
              <div className="absolute top-3 left-3 bg-[#1A237E]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                {selectedPreview ? 'New Preview (Pending Save)' : 'Currently Live on Site'}
              </div>
            </div>

            <div className="p-3 bg-[#FFF8DC] rounded-xl border border-[#8B4513]/20 text-[11px] text-[#5D2E0C] space-y-1">
              <div className="font-mono text-[10px] truncate">
                <span className="font-bold">Source URL:</span> {currentImage}
              </div>
            </div>
          </div>

          {/* Upload Area Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold text-[#1A237E] uppercase tracking-wider">
              Upload Replacement Image
            </div>

            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-3 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-[#8B4513] bg-[#8B4513]/10 scale-[1.01]'
                  : 'border-[#8B4513]/30 bg-[#FFF8E7]/50 hover:bg-[#FFF8E7] hover:border-[#8B4513]/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
              />

              <div className="w-14 h-14 rounded-2xl bg-[#8B4513]/10 text-[#8B4513] mx-auto flex items-center justify-center mb-3">
                <Upload className="w-7 h-7" />
              </div>

              <div className="text-sm font-bold text-[#1A237E]">
                Click or drag image here to select
              </div>
              <div className="text-xs text-[#8B4513] mt-1 font-medium">
                Supports JPG, PNG, WEBP files
              </div>
            </div>

            {/* Selected File Action Panel */}
            {selectedFile && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#1A237E] font-semibold">
                  <span>Selected: <strong className="font-mono">{selectedFile.name}</strong></span>
                  <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={triggerUpload}
                    disabled={isUploading}
                    className="grow py-3 px-5 bg-[#8B4513] hover:bg-[#5D2E0C] text-[#FFF8DC] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Save Permanently to Supabase</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setSelectedPreview(null);
                    }}
                    className="py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!isSupabaseActive && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Supabase Notice:</strong> Configure your Supabase credentials in the setup tab to sync files directly to your cloud storage bucket. Local updates will be retained in browser storage until cleared.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
