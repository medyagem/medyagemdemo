"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const NAV_LINKS = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hakkımızda", href: "/hakkimizda" },
  { name: "Hizmetler", href: "/hizmetler" },
  { name: "Çalışmalar", href: "/calismalar" },
  { name: "Bölgeler", href: "/bolgeler" },
  { name: "Blog", href: "/blog" },
  { name: "SSS", href: "/sss" },
  { name: "İletişim", href: "/iletisim" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logo kaynağı: admin'den gelen logo varsa onu kullan, yoksa varsayılan
  const logoSrc = settings.site_logo || "/logo.png";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "bg-background/80 backdrop-blur-md border-border py-2" : "bg-transparent py-4"
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2" aria-label={`${settings.site_name} Ana Sayfa`}>
            {settings.site_logo ? (
              <img
                src={settings.site_logo}
                alt={`${settings.site_name} Logo`}
                className="h-9 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Image
                src="/logo.png"
                alt={`${settings.site_name} Logo`}
                width={180}
                height={48}
                className="h-9 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Ana Menü">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-main hover:text-white relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a href={`https://wa.me/${settings.whatsapp || "905386295834"}`} target="_blank" rel="noopener noreferrer">
              <Button className="hidden md:flex text-sm h-10 px-5 shadow-hover-glow hover:shadow-hover-glow transition-shadow">
                Teklif Al
              </Button>
            </a>

            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menüyü Aç"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-500",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil Menü"
      >
        <button
          className="absolute top-6 right-6 text-white p-2"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Menüyü Kapat"
        >
          <X className="w-8 h-8" />
        </button>

        <nav className="flex flex-col items-center gap-8" aria-label="Mobil Navigasyon">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-2xl font-bold text-main hover:text-white hover:text-transparent hover:bg-clip-text hover:bg-brand-primary transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <a href={`https://wa.me/${settings.whatsapp || "905386295834"}`} target="_blank" rel="noopener noreferrer">
            <Button className="mt-8 shadow-hover-glow h-12 px-8 text-base w-[200px]" onClick={() => setMobileMenuOpen(false)}>
              Teklif Al
            </Button>
          </a>
        </nav>
      </div>
    </>
  );
}
