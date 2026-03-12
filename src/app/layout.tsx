import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for modern geometric sans feel
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "MedyaGem | Dijital Ajans ve Web Çözümleri",
  description: "Türkiye genelinde web sitesi kurulumu, SEO yönetimi ve Google Ads hizmetleri ile işletmenizin dijitalde büyümesini sağlıyoruz.",
  openGraph: {
    title: "MedyaGem | Dijital Ajans",
    description: "İşletmenizi dijitale en iyi şekilde taşıyoruz. SEO, Web Tasarım ve Google Ads çözümleri.",
    url: "https://medyagem.com",
    siteName: "MedyaGem",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://medyagem.com/og-image.png", width: 1200, height: 630, alt: "MedyaGem Dijital Ajans" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "MedyaGem | Dijital Ajans",
    description: "İşletmenizi dijitale en iyi şekilde taşıyoruz. SEO, Web Tasarım ve Google Ads çözümleri.",
    images: ["https://medyagem.com/og-image.png"],
  },
  manifest: "/manifest.json"
};

export const viewport = {
  themeColor: "#0A0A0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark scroll-smooth">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
        
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "MedyaGem",
              "image": "https://medyagem.com/logo.png",
              "url": "https://medyagem.com",
              "telephone": "+905386295834",
              "email": "info@medyagem.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Mecidiye, Sultanbeyli",
                "addressLocality": "İstanbul",
                "postalCode": "34930",
                "addressCountry": "TR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.9667,
                "longitude": 29.2667
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "09:00",
                  "closes": "18:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/medyagem",
                "https://www.instagram.com/medyagem",
                "https://www.linkedin.com/company/medyagem",
                "https://twitter.com/medyagem"
              ],
              "priceRange": "$$"
            })
          }}
        />
      </body>
    </html>
  );
}
