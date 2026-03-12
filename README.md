# MedyaGem CMS Integration

## Proje Sözleşmesi
**Amacı:** Mevcut Next.js web sitesindeki tüm ana sayfa section'larını, liste sayfalarını ve detay sayfalarını tam yönetilebilir CMS yapısına bağlamak.
**Proje Türü:** Web Uygulaması / Fullstack CMS
**Kullanılan Teknoloji Yığını:** Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, SQLite.
**Tek Komutla Çalıştırma:** `npm run dev`

## Özellikler
1. Tüm ana sayfa section'ları aç/kapat işlemleriyle CMS üzerinden yönetilebilir.
2. Web üzerindeki statik sayfalar (Hakkımızda, İletişim, vb.) veritabanına bağlanmıştır.
3. Hizmetler, Blog, Bölgeler ve Projeler için dinamik detay ve liste sayfaları bulunmaktadır.
4. Merkezi JSON-LD şemaları ve SEO meta etiketleri veritabanından dinamik alınır.
5. Detay sayfalarında yorum ve puan sistemi yerel bir moderasyon algoritması ile çalışmaktadır.
6. Kolay kullanımlı Admin Panel (CRUD işlemleri için).

## Gereksinimler
- Node.js v18+
- npm v9+

## Kurulum
```bash
# Bağımlılıkları yükleyin
npm install

# Prisma veritabanını başlatın
npx prisma generate
npx prisma db push
```

## Ortam Değişkenleri
Örnek `.env.example` içeriği:
```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="securepassword123"
```

## Çalıştırma
Projeyi yerel ortamda çalıştırmak için:
```bash
npm run dev
```

## Build Alma
```bash
npm run build
```

## Testler
Projeyi test etmek için duman (smoke) testi çalıştırılır:
```bash
npm run test
```

## Dosya Yapısı Açıklaması
PROJE MODE: Single App (MODE A)
Tüm CMS ve Frontend mimarisi `src/` dizininde toplanmıştır. `src/app/admin` klasörü yönetim panelini, diğer klasörler ise frontend render katmanını içerir. Veritabanı yönetimini Prisma yapar.

## Sorun Giderme
1. **Veritabanı bağlantı hatası:** `.env` dosyasındaki `DATABASE_URL` yolunun doğruluğunu kontrol edin.
2. **Prisma Client bulunamadı hatası:** `npx prisma generate` komutunu çalıştırarak Prisma istemcisini manuel oluşturun.
3. **Admin paneline girilemiyor:** `.env` dosyasında `ADMIN_PASSWORD` değerinin tanımlı olduğundan emin olun.
4. **Tailwind stilleri yüklenmiyor:** `globals.css` dosyasının sayfalara import edildiğini doğrulayın.
5. **Sayfalar 404 dönüyor:** Veritabanında (CMS) ilgili içeriğin durumunun `is_active` (aktif) olarak ayarlanıp ayarlanmadığını kontrol edin.
