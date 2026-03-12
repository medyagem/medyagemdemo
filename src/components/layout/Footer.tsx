"use client";

import Link from "next/link";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Footer() {
  const settings = useSiteSettings();

  const socialLinks = [
    { icon: Instagram, href: settings.instagram, label: "Instagram" },
    { icon: Facebook, href: settings.facebook, label: "Facebook" },
    { icon: Linkedin, href: settings.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: settings.twitter_x, label: "Twitter" },
  ];

  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site Bilgi Menüsü</h2>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Marka & Adres */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-6 hover:opacity-80 transition-opacity w-fit" aria-label={`${settings.site_name} Ana Sayfa`}>
              {settings.site_logo ? (
                <img src={settings.site_logo} alt={`${settings.site_name} Logo`} className="h-20 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-bold text-heading">{settings.site_name}</span>
              )}
            </Link>
            <p className="text-desc text-sm leading-relaxed mb-6">
              {settings.site_description || "İşletmenizi dijitale en iyi şekilde taşıyoruz. SEO, Web Tasarım ve Google Ads çözümleriyle yanınızdayız."}
            </p>
            <address className="text-desc text-sm not-italic mb-6">
              <p className="mb-2">{settings.address || "İstanbul / Sultanbeyli"}</p>
              <p className="mb-2">Pazartesi – Cumartesi</p>
              <p>09:00 – 18:00</p>
            </address>
            {/* Sosyal Medya */}
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                social.href && (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border text-meta hover:border-primary hover:text-primary transition-all shadow-sm"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Hızlı Menü */}
          <nav aria-labelledby="footer-quick-links">
            <h4 id="footer-quick-links" className="text-heading font-semibold mb-6">Hızlı Menü</h4>
            <ul className="flex flex-col gap-4 text-sm text-desc">
              <li><Link href="/hakkimizda" className="hover:text-accent transition-colors">Hakkımızda</Link></li>
              <li><Link href="/hizmetler" className="hover:text-accent transition-colors">Tüm Hizmetler</Link></li>
              <li><Link href="/calismalar" className="hover:text-accent transition-colors">Çalışmalarımız</Link></li>
              <li><Link href="/bolgeler" className="hover:text-accent transition-colors">Hizmet Bölgeleri</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Dijital Rehber (Blog)</Link></li>
              <li><Link href="/sss" className="hover:text-accent transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </nav>

          {/* İletişim */}
          <div aria-labelledby="footer-contact">
            <h4 id="footer-contact" className="text-heading font-semibold mb-6">İletişim</h4>
            <ul className="flex flex-col gap-4 text-sm text-desc">
              <li><a href={`tel:${settings.phone?.replace(/\s/g, "") || "05386295834"}`} className="hover:text-accent transition-colors" aria-label={`Bizi arayın: ${settings.phone || "0538 629 5834"}`}>Telefon: {settings.phone || "0538 629 5834"}</a></li>
              <li><a href={`https://wa.me/${settings.whatsapp || "905386295834"}`} className="hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp üzerinden iletişime geçin">WhatsApp İletişim</a></li>
              <li><a href={`mailto:${settings.email || "info@medyagem.com"}`} className="hover:text-accent transition-colors" aria-label={`Bize e-posta gönderin: ${settings.email || "info@medyagem.com"}`}>E-Posta: {settings.email || "info@medyagem.com"}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-meta">
          <p>© {new Date().getFullYear()} {settings.site_name}. Tüm Hakları Saklıdır.</p>
          <nav className="flex gap-4 mt-4 md:mt-0" aria-label="Yasal Bilgilendirme">
            <Link href="/kvkk" className="hover:text-white transition-colors">KVKK Aydınlatma</Link>
            <Link href="/cerez-politikasi" className="hover:text-white transition-colors">Çerez Politikası</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
