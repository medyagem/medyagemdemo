"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        alert("Yükleme başarısız.");
      }
    } catch (err) {
      alert("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-meta uppercase">{label}</label>}
      
      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2
          ${value ? 'border-brand-primary/50' : 'border-border hover:border-brand-primary bg-background/50'}
          ${loading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          accept="image/*"
        />

        {value ? (
          <>
            <img src={value} alt="Yüklenen Görsel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-xs font-medium bg-brand-primary px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                 <Upload className="w-3.5 h-3.5" /> Değiştir
               </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-2 right-2 p-1.5 bg-state-error text-white rounded-full hover:scale-110 transition-transform shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            {loading ? (
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            ) : (
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-1">
                <ImageIcon className="w-6 h-6 text-brand-primary" />
              </div>
            )}
            <p className="text-sm font-medium text-main">
              {loading ? "Yükleniyor..." : "Görsel Seçmek İçin Tıklayın"}
            </p>
            <p className="text-xs text-meta px-4">PNG, JPG veya WebP (Önerilen: 1920x1080)</p>
          </div>
        )}
      </div>
    </div>
  );
}
