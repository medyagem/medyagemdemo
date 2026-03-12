"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Site ayarları tipi
interface SiteSettings {
  site_name: string;
  site_description: string;
  site_keywords: string;
  site_logo: string;
  site_favicon: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  google_tag_manager: string;
  google_analytics: string;
  google_ads_conversion: string;
  facebook_pixel: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  twitter_x: string;
}

// Varsayılan değerler
const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "MedyaGem",
  site_description: "Türkiye genelinde dijital pazarlama, SEO, Google Ads ve web tasarım hizmetleri.",
  site_keywords: "dijital pazarlama, seo, web tasarım, google ads",
  site_logo: "",
  site_favicon: "",
  email: "info@medyagem.com",
  phone: "0538 629 5834",
  address: "İstanbul, Türkiye",
  whatsapp: "905386295834",
  google_tag_manager: "",
  google_analytics: "",
  google_ads_conversion: "",
  facebook_pixel: "",
  instagram: "https://instagram.com/medyagem",
  facebook: "https://facebook.com/medyagem",
  linkedin: "https://linkedin.com/company/medyagem",
  twitter_x: "https://twitter.com/medyagem",
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(data => {
        if (data?.data_json) {
          try {
            const parsed = JSON.parse(data.data_json);
            setSettings(prev => ({ ...prev, ...parsed }));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Dinamik favicon güncelleme
  useEffect(() => {
    if (settings.site_favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.site_favicon;
    }
  }, [settings.site_favicon]);

  // Dinamik site adı güncelleme
  useEffect(() => {
    if (settings.site_name && settings.site_name !== "MedyaGem") {
      document.title = `${settings.site_name} | Dijital Ajans ve Web Çözümleri`;
    }
  }, [settings.site_name]);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
