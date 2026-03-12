import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Faq from "@/sections/Faq";
import Cta from "@/sections/Cta";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular (SSS) | MedyaGem",
  description: "MedyaGem dijital ajans hizmetleri hakkında kurumsal süreçlerimiz, web tasarım ve Google Ads ile ilgili teknik olarak en çok merak edilen sorular ve detaylı yanıtları.",
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "SEO ne kadar sürede sonuç verir?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO (Arama Motoru Optimizasyonu) uzun vadeli bir yatırımdır. Genellikle ilk etkileri 3. aydan itibaren gözlemleriz; kalıcı ve güçlü sonuçlar ise 6-12 ay arasında alınır."
                }
              },
              {
                "@type": "Question",
                "name": "Web sitesi kaç günde yapılır?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sitenizin kapsamına ve tasarımın detaylarına bağlı olarak süre değişebilir. Kurumsal kimlik içeren standart bir web sitesinin tasarımı, kodlanması ve onayı genellikle 10 ila 15 iş günü arasında tamamlanmaktadır."
                }
              }
            ]
          })
        }}
      />
      <PageHero
        title={
          <>Sıkça Sorulan <span className="text-transparent bg-clip-text bg-brand-glow">Sorular</span></>
        }
        description="Aklınıza takılan tüm soruların detaylı ve şeffaf cevaplarını burada bulabilir, çalışma prensiplerimizi yakından inceleyebilirsiniz."
        breadcrumbItems={[{ label: "SSS" }]}
      />
      
      {/* SSS Section reuse */}
      <div className="pt-12">
        <Faq />
      </div>

      <Cta />
    </>
  );
}
