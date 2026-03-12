"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalScroll from "@/components/layout/GlobalScroll";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsProvider>
      <GlobalScroll>
        <Header />
        <main className="w-full overflow-hidden">
          {children}
        </main>
        <Footer />
      </GlobalScroll>
    </SiteSettingsProvider>
  );
}
