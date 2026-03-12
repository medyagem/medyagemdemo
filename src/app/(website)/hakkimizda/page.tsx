import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import WhyMedyagem from "@/sections/WhyMedyagem";
import Cta from "@/sections/Cta";

export const metadata: Metadata = {
  title: "Hakkımızda | MedyaGem",
  description: "MedyaGem'in kuruluş hikayesi, vizyonu ve misyonu. İşletmenizi dijitale en iyi şekilde taşıyan premium dijital ajans.",
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MedyaGem",
            "url": "https://medyagem.com",
            "logo": "https://medyagem.com/logo.png",
            "sameAs": [
              "https://www.instagram.com/medyagem",
              "https://wa.me/905386295834"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+905386295834",
              "contactType": "customer service",
              "areaServed": "TR",
              "availableLanguage": "Turkish"
            }
          })
        }}
      />

      <PageHero
        title={
          <>
            Dijital Dünyada <br/>
            <span className="text-transparent bg-clip-text bg-brand-primary">Güçlü İzler</span> Bırakıyoruz
          </>
        }
        description="Amacımız sadece bir web sitesi yapmak veya reklam açmak değil; markanızın kendi sektöründeki en iyi dijital versiyonunu yaratmaktır."
        breadcrumbItems={[{ label: "Hakkımızda" }]}
      >
        <Link href="#hikayemiz">
          <Button size="lg" className="w-full sm:w-auto font-semibold">
            Hikayemizi Keşfet
          </Button>
        </Link>
        <Link href="/iletisim">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Bizimle İletişime Geç
          </Button>
        </Link>
      </PageHero>

      {/* Hikayemiz ve Vizyon/Misyon */}
      <section id="hikayemiz" className="py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-5xl font-bold text-heading tracking-tight">Performans Odaklı Dijital Kurum</h2>
            <p className="text-main leading-relaxed text-lg">
              MedyaGem, kurulduğu ilk günden itibaren işletmelerin dijitaldeki somut yatırım getirilerine (ROI) odaklanmıştır. Birçok geleneksel ajansın aksine, sadece estetik tasarımlar yapıp sizi yalnız bırakmıyoruz. Biz; dönüşüm oranınızı artırmak, doğru hedef kitleyi sitenize çekmek ve müşteri sadakati yaratmak için çalışıyoruz.
            </p>
            <p className="text-main leading-relaxed text-lg">
              Türkiye’nin dört bir yanından gelen iş ortaklarımızla, coğrafi sınırları aşan projeler geliştiriyor, şeffaf raporlamamız sayesinde sürecin her anında size eşlik ediyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-surface p-8 border border-border border-t-2 border-t-primary shadow-lg flex flex-col justify-center">
               <h3 className="text-2xl font-bold text-heading mb-4">Misyonumuz</h3>
               <p className="text-desc leading-relaxed">
                 KOBİ'lerden büyük işletmelere kadar her yapıya veri odaklı, yüksek kaliteli ve geri dönüş sağlayan dijital stratejiler sunmak.
               </p>
            </div>
            <div className="bg-surface p-8 border border-border border-t-2 border-t-secondary shadow-lg flex flex-col justify-center">
               <h3 className="text-2xl font-bold text-heading mb-4">Vizyonumuz</h3>
               <p className="text-desc leading-relaxed">
                 2030 yılına kadar Türkiye’nin en çok tercih edilen ilk 5 premium dijital & performans ajansından biri olmak.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-20 border-y border-border bg-bg-secondary">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-brand-glow">150+</span>
            <span className="text-heading font-semibold text-lg">Tamamlanan Proje</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-brand-glow">10+</span>
            <span className="text-heading font-semibold text-lg">Farklı Sektör</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-brand-glow">81</span>
            <span className="text-heading font-semibold text-lg">İlde Hizmet</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-brand-glow">%98</span>
            <span className="text-heading font-semibold text-lg">Müşteri Memnuniyeti</span>
          </div>
        </div>
      </section>

      {/* Neden Biz */}
      <WhyMedyagem />

      {/* CTA */}
      <Cta />
    </>
  );
}
