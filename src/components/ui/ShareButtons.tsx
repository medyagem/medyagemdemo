"use client";

import { Link as LinkIcon, Twitter, Facebook, Linkedin } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Bağlantı kopyalandı!");
    } catch (err) {
      console.error("Panoya kopyalanamadı:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-desc mr-2">Paylaş:</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-desc hover:text-primary hover:border-primary hover:bg-[#1C1F36] transition-all"
        aria-label="X'te Paylaş"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-desc hover:text-primary hover:border-primary hover:bg-[#1C1F36] transition-all"
        aria-label="Facebook'ta Paylaş"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-desc hover:text-primary hover:border-primary hover:bg-[#1C1F36] transition-all"
        aria-label="LinkedIn'de Paylaş"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <button
        onClick={copyToClipboard}
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-desc hover:text-primary hover:border-primary hover:bg-[#1C1F36] transition-all"
        aria-label="Bağlantıyı Kopyala"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
