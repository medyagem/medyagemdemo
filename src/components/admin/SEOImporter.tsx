"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { parseSEOFile, ParsedSEOData } from "@/lib/utils/seo-parser";

interface SEOImporterProps {
  onImport: (data: ParsedSEOData) => void;
  type: "blog" | "service";
}

export default function SEOImporter({ onImport, type }: SEOImporterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.md') && !file.name.endsWith('.html') && !file.name.endsWith('.txt')) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseSEOFile(text);
      onImport(parsed);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Parse error:", err);
      setStatus("error");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="bg-[#0F1122] border border-border rounded-xl p-6 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-heading flex items-center gap-2">
            <Upload className="w-5 h-5 text-brand-primary" /> SEO Expert&apos;ten İçe Aktar
          </h3>
          <p className="text-desc text-sm mt-1 leading-relaxed">
            Claude veya SEO Expert tarafından hazırlanan <code>.md</code> dosyanızı buraya bırakın, başlık, meta ve SSS alanlarını biz dolduralım.
          </p>
        </div>

        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full md:w-64 h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
            ${isDragging ? 'border-brand-primary bg-brand-primary/5 scale-[1.02]' : 'border-border hover:border-brand-primary/50 hover:bg-white/5'}
            ${status === 'success' ? 'border-state-success bg-state-success/5' : ''}
            ${status === 'error' ? 'border-state-error bg-state-error/5' : ''}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden" 
            accept=".md,.html,.txt"
          />

          {status === 'idle' && (
            <>
              <FileText className={`w-8 h-8 ${isDragging ? 'text-brand-primary animate-bounce' : 'text-meta'}`} />
              <span className="text-xs font-bold text-main uppercase">Dosya Seç veya Bırak</span>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-10 h-10 rounded-full bg-state-success/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-state-success" />
              </div>
              <span className="text-xs font-bold text-state-success uppercase text-center px-4">Başarıyla Aktarıldı!</span>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-8 h-8 text-state-error" />
              <span className="text-xs font-bold text-state-error uppercase text-center px-4">Dosya Okunamadı</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
