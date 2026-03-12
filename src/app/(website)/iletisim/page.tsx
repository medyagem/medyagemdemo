import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Faq from "@/sections/Faq";

export const metadata: Metadata = {
  title: "İletişim | MedyaGem",
  description: "İşletmenizin dijital büyüme planını oluşturmak için MedyaGem reklam ve web ajansı ile hemen iletişime geçin.",
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "İletişim | MedyaGem",
            "description": metadata.description,
            "url": "https://medyagem.com/iletisim",
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "MedyaGem",
              "image": "https://medyagem.com/logo.png",
              "telephone": "05386295834",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sultanbeyli",
                "addressLocality": "İstanbul",
                "addressCountry": "TR"
              }
            }
          })
        }}
      />
      <PageHero
        title={
          <>Birlikte Büyümeye <span className="text-transparent bg-clip-text bg-brand-glow">Hazır mıyız?</span></>
        }
        description="Bizimle iletişime geçerek işletmenize en uygun dijital pazarlama ve web tasarım modelini anında öğrenebilirsiniz. Uzmanlarımız size hızlıca geri dönüş yapacaktır."
        breadcrumbItems={[{ label: "İletişim" }]}
      />

      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Cards */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-heading mb-4">Bizimle İletişime Geçin</h2>
            <p className="text-main leading-relaxed text-lg mb-6">
              Aşağıdaki kanallardan herhangi birini kullanarak bize ulaşabilirsiniz. E-posta ile gönderilen talepler ortalama 2 saat içerisinde yanıtlanmaktadır.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href="tel:05386295834" className="flex items-center gap-4 bg-surface p-6 border border-border hover:border-primary transition-colors hover:shadow-hover-glow group">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-desc font-medium">Telefon</span>
                  <span className="text-heading font-bold text-lg">0538 629 5834</span>
                </div>
              </a>
              
              <a href="https://wa.me/905386295834" target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-surface p-6 border border-border hover:border-state-success transition-colors hover:shadow-hover-glow group">
                <div className="w-12 h-12 bg-state-success/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-state-success" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-desc font-medium">WhatsApp</span>
                  <span className="text-heading font-bold text-lg">Mesaj Gönder</span>
                </div>
              </a>
              
              <a href="mailto:info@medyagem.com" className="flex items-center gap-4 bg-surface p-6 border border-border hover:border-secondary transition-colors hover:shadow-hover-glow group">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-desc font-medium">E-Posta</span>
                  <span className="text-heading font-bold text-lg">info@medyagem</span>
                </div>
              </a>
              
              <div className="flex items-center gap-4 bg-surface p-6 border border-border">
                <div className="w-12 h-12 bg-border rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-main" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-desc font-medium">Çalışma Saatleri</span>
                  <span className="text-heading font-bold">Pzt-Cmt / 09:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Map Placeholder */}
          <div className="flex flex-col h-full relative border border-border bg-surface p-8 overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(93,169,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[gradient_3s_linear_infinite]" />
            <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
              <div className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center mb-8 shadow-hover-glow">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-heading mb-4">Operasyon Merkezi</h3>
              <p className="text-main text-lg max-w-sm mb-2">
                Sultanbeyli, İstanbul
              </p>
              <p className="text-desc mb-8 border-b border-border pb-8 w-full max-w-sm">Hizmet Bölgesi: Tüm Türkiye</p>
              
              <Link href="https://maps.google.com" target="_blank" rel="noreferrer">
                <Button variant="outline" className="font-semibold">Haritada Görüntüle</Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SSS Kısa Versiyon */ }
      <Faq />

      {/* Final CTA */}
      <section className="py-20 bg-brand-primary flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Projenizi Ertelemeyin</h2>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10">Kapsamlı analiz ve ücretsiz strateji görüşmesi için uzmanlarımızla bağlantı kurun.</p>
        <div className="flex gap-4">
          <a href="tel:05386295834">
            <Button className="bg-white text-brand-primary hover:bg-gray-100 font-bold border-none" size="lg">Hemen Arayın</Button>
          </a>
          <a href="https://wa.me/905386295834" target="_blank" rel="noreferrer">
             <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold" size="lg">WhatsApp Destek</Button>
          </a>
        </div>
      </section>
    </>
  );
}
