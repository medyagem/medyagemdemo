import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-[#0A0A0F] pt-20">
        {/* Background Visuals */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <div className="mb-8 relative transition-transform hover:scale-110 duration-500">
            <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase">KAYIP</span>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-heading mb-4">Upps! Bu Gemi Rotasından Çıkmış Görünüyor.</h2>
          <p className="text-lg text-desc mb-12 max-w-xl leading-relaxed">
            Aradığınız içerik okyanusun derinliklerine gömülmüş olabilir. Sizi güvenli limana ulaştıracak rotaları aşağıda bulabilirsiniz.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-12">
            <Link href="/" className="group p-6 bg-surface border border-border rounded-2xl hover:border-primary transition-all duration-300 text-left">
              <h4 className="font-bold text-white group-hover:text-primary mb-1">Ana Sayfa</h4>
              <p className="text-xs text-meta">Dijital ajansımızın ana limanına dönün.</p>
            </Link>
            <Link href="/hizmetler" className="group p-6 bg-surface border border-border rounded-2xl hover:border-primary transition-all duration-300 text-left">
              <h4 className="font-bold text-white group-hover:text-primary mb-1">Hizmetlerimiz</h4>
              <p className="text-xs text-meta">Size nasıl değer katabileceğimizi görün.</p>
            </Link>
            <Link href="/blog" className="group p-6 bg-surface border border-border rounded-2xl hover:border-primary transition-all duration-300 text-left">
              <h4 className="font-bold text-white group-hover:text-primary mb-1">Bilgi Bankası</h4>
              <p className="text-xs text-meta">En güncel SEO ve pazarlama rehberleri.</p>
            </Link>
            <Link href="/iletisim" className="group p-6 bg-surface border border-border rounded-2xl hover:border-primary transition-all duration-300 text-left">
              <h4 className="font-bold text-white group-hover:text-primary mb-1">İletişime Geçin</h4>
              <p className="text-xs text-meta">Yolunuzu bulmanıza yardımcı olalım.</p>
            </Link>
          </div>

          <Link href="/">
            <Button size="lg" className="px-10 py-6 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(45,107,255,0.3)] hover:shadow-primary/50 transition-all">
              Hemen Rotayı Düzelt
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
