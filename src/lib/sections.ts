// Section verilerinin varsayılan değerleri (fs kullanMAdan, client-safe)
// Bu dosya hem server hem client tarafında import edilebilir

export const SECTION_DEFAULTS: Record<string, any> = {
  hero: {
    badge: "Türkiye Geneli Hizmet",
    title_line1: "İşinizi Büyüten",
    title_line2: "Web Sitesi ve Dijital",
    title_line3: "Pazarlama Çözümleri",
    description: "Türkiye genelinde web sitesi kurulumu, SEO yönetimi ve Google Ads hizmetleri ile işletmenizin dijitalde büyümesini sağlıyoruz.",
    cta_primary: "WhatsApp ile Teklif Al",
    cta_primary_link: "https://wa.me/905386295834",
    cta_secondary: "Hizmetleri İncele",
    cta_secondary_link: "/hizmetler",
    stats: [
      { value: "150+", label: "Proje" },
      { value: "10+", label: "Sektör" },
      { value: "81 İl", label: "Türkiye Geneli" },
    ],
    visual_image: "/sahte-tiklama-monitor.png"
  },
  hakkimizda: {
    title: "MedyaGem Nedir?",
    description: "Biz, dijital dünyada sadece var olmanızı değil, parlamanızı sağlayan performans odaklı bir ajansız. İşletmenizin hedeflerini kendi hedeflerimiz gibi benimsiyoruz.",
    pillars: [
      { title: "Strateji", desc: "İşletmenize özel dijital büyüme planı oluştururuz." },
      { title: "Teknoloji", desc: "Hızlı ve SEO uyumlu web altyapıları kurarız." },
      { title: "Performans", desc: "Veriye dayalı reklam ve SEO yönetimi yaparız." },
    ],
    stats: [
      { value: "150+", label: "Başarılı Proje" },
      { value: "10+", label: "Farklı Sektör" },
      { value: "81", label: "İlde Hizmet" },
    ],
    main_image: "/about-image.png"
  },
  whymedyagem: {
    title: "Neden Bizi Seçmelisiniz?",
    manifesto: "Web sitenizi sadece kurmuyor, hedef kitlenizle buluşturuyoruz. Bizimle çalışmak, dijital dünyada rakiplerinizin bir adım önüne geçmek demektir.",
    features: ["SEO altyapılı web siteleri", "Performans odaklı reklam yönetimi", "Gerçek veri ile raporlama", "Türkiye geneli hizmet"]
  },
  projeler: {
    title: "Çalışmalarımız",
    description: "Değer yarattığımız bazı başarılı projelerimiz. Sadece estetik değil, tam anlamıyla sonuç odaklı işler tasarlıyoruz.",
    items: [
      { name: "Sayar Tesisat", category: "Web Sitesi + SEO + Ads", sector: "Tesisat" },
      { name: "Lüks Mimarlık", category: "Web Sitesi Kurulumu", sector: "Mimarlık" },
      { name: "Nova Lojistik", category: "SEO + Google Ads", sector: "Lojistik" },
      { name: "Mavi Marin", category: "Kurumsal Kimlik + Web", sector: "Turizm" },
    ]
  },
  surec: {
    title: "Çalışma Sürecimiz",
    description: "Sistematik ve veriye dayalı adımlarla riskleri minimize edip büyümeyi maksimuma çıkarıyoruz.",
    steps: [
      { id: "01", title: "Analiz", desc: "Sektörünüzü, rakiplerinizi ve mevcut durumunuzu detaylıca inceler, fırsatları tespit ederiz." },
      { id: "02", title: "Strateji", desc: "Hedeflerinize ulaşmanız için en uygun yol haritasını, platformları ve bütçe planlamasını yaparız." },
      { id: "03", title: "Kurulum", desc: "SEO altyapısı sağlam, hızlı ve dönüşüm odaklı web sitenizi / reklam hesaplarınızı hazırlarız." },
      { id: "04", title: "Optimizasyon", desc: "Verileri okuyarak sürekli iyileştirmeler yapar, maliyetleri düşürüp performansı artırırız." },
      { id: "05", title: "Raporlama", desc: "Şeffaf, anlaşılır ve gerçek verilerle her ay düzenli performans toplantıları düzenleriz." },
    ]
  },
  blog_preview: {
    title: "Blog & İçgörüler",
    description: "Dijital dünyadaki en güncel gelişmeleri, teknik ipuçlarını ve stratejileri keşfedin.",
    items: [
      { title: "Google Ads Bütçesi Nasıl Belirlenir?", desc: "Reklam bütçenizi ziyan etmeden en yüksek dönüşümü alabileceğiniz doğru bütçe planlama teknikleri.", date: "12 Ekim 2026", category: "Google Ads" },
      { title: "SEO Nedir, Neden İşletmeniz İçin Hayatidir?", desc: "Arama motoru optimizasyonu ile sitenizi Google'ın seveceği hale getirin.", date: "05 Ekim 2026", category: "SEO" },
      { title: "Sahte Reklam Tıklaması Nasıl Engellenir?", desc: "Rakiplerin ve botların reklam bütçenizi bitirmesini engelleyecek profesyonel savunma stratejileri.", date: "28 Eylül 2026", category: "Güvenlik" },
    ]
  },
  hizmetbolgeleri: {
    title: "Türkiye Genelinde Dijital Hizmet",
    description: "Lokasyon gözetmeksizin, ülkenin her noktasına aynı kalitede dijital pazarlama hizmeti ulaştırıyoruz.",
    cities: ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Kocaeli", "Mersin", "Kayseri", "Samsun", "Eskişehir", "Denizli", "Sakarya"],
    extra_count: "+66 Şehir"
  },
  faq: {
    items: [
      { q: "SEO ne kadar sürede sonuç verir?", a: "SEO uzun vadeli bir yatırımdır. Genellikle ilk etkileri 3. aydan itibaren gözlemleriz; kalıcı sonuçlar 6-12 ay arasında alınır." },
      { q: "Web sitesi kaç günde yapılır?", a: "Standart bir web sitesinin tasarımı genellikle 10 ila 15 iş günü arasında tamamlanmaktadır." },
      { q: "Google Ads için minimum bütçe nedir?", a: "Aylık minimum 10.000 TL – 15.000 TL arası bir reklam bütçesi ile başlamanızı tavsiye ediyoruz." },
      { q: "Türkiye geneline hizmet veriyor musunuz?", a: "Evet, Türkiye'nin 81 iline profesyonel hizmet sunuyoruz." },
    ]
  },
  testimonials: {
    title: "Müşterilerimiz Ne Diyor?",
    description: "Sadece söz vermiyor, sonuç üretiyoruz.",
    items: [
      { quote: "MedyaGem ile çalışmaya başladıktan sadece 3 ay sonra organik trafiklerimiz ikiye katlandı.", name: "Ahmet Yılmaz", company: "Sayar Tesisat", role: "Kurucu" },
      { quote: "Google Ads bütçemizi önceki ajanslara göre çok daha verimli yönetiyorlar.", name: "Ayşe Özdemir", company: "Nova Lojistik", role: "Pazarlama Müdürü" },
      { quote: "Yeni web sitemizi o kadar hızlı ve profesyonel hazırladılar ki inanamadık.", name: "Mehmet Çelik", company: "Lüks Mimarlık", role: "Mimar / Kurucu" },
    ]
  },
  cta: {
    title_line1: "Dijitalde Büyümeye",
    title_line2: "Hazır mısınız?",
    description: "Hemen bizimle iletişime geçin, işletmenize özel stratejiyi planlayalım.",
    cta_primary: "WhatsApp ile Teklif Al",
    cta_primary_link: "https://wa.me/905386295834",
    cta_secondary: "Bizi Arayın",
    cta_secondary_link: "tel:05386295834",
    phone: "0538 629 5834",
    phone_raw: "05386295834",
  }
};

// Client-safe section veri çekme fonksiyonu
export async function fetchSectionData(key: string): Promise<any> {
  try {
    const res = await fetch(`/api/admin/sections?section=${key}`);
    if (res.ok) return await res.json();
  } catch {}
  return SECTION_DEFAULTS[key] || {};
}
