const fs = require('fs');
const path = require('path');

console.log("Smoke Test Başlatılıyor...\n");

try {
  // Check if critical files exist
  const filesToCheck = [
    'package.json',
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'src/sections/Hero.tsx',
    'src/components/layout/Header.tsx'
  ];

  let passed = true;
  filesToCheck.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(fullPath)) {
      console.error(`[FAIL] Kritik dosya bulunamadı: ${file}`);
      passed = false;
    } else {
      console.log(`[PASS] Dosya mevcut: ${file}`);
    }
  });

  if (passed) {
    console.log("\n[PASS] Tüm kritik dosyalar yerinde. Smoke test başarılı.");
    process.exit(0);
  } else {
    console.error("\n[FAIL] Smoke test başarısız. Gerekli dosyalar eksik.");
    process.exit(1);
  }
} catch (err) {
  console.error("[FAIL] Beklenmeyen hata:", err);
  process.exit(1);
}
