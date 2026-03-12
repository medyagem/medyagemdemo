import Hero from "@/sections/Hero";
import Hizmetler from "@/sections/Hizmetler";
import Hakkimizda from "@/sections/Hakkimizda";
import WhyMedyagem from "@/sections/WhyMedyagem";
import Projeler from "@/sections/Projeler";
import Surec from "@/sections/Surec";
import Blog from "@/sections/Blog";
import Faq from "@/sections/Faq";
import HizmetBolgeleri from "@/sections/HizmetBolgeleri";
import Testimonials from "@/sections/Testimonials";
import Cta from "@/sections/Cta";

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "MedyaGem Dijital Ajans",
    "image": "https://medyagem.com/logo.png",
    "@id": "https://medyagem.com",
    "url": "https://medyagem.com",
    "telephone": "+905386295834",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "İstanbul",
      "addressLocality": "İstanbul",
      "postalCode": "34000",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.0082,
      "longitude": 28.9784
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.instagram.com/medyagem",
      "https://wa.me/905386295834"
    ],
    "areaServed": "TR"
  };

  // Tüm section'lar her zaman gösterilir
  // Section açma/kapama özelliği admin'den yönetilecek (ileride)
  return (
    <div className="flex flex-col w-full relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <Hizmetler />
      <Hakkimizda />
      <WhyMedyagem />
      <Projeler />
      <Surec />
      <Blog />
      <Faq />
      <HizmetBolgeleri />
      <Testimonials />
      <Cta />
    </div>
  );
}
