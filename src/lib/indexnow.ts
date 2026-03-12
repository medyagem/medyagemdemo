const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "medyagem-indexnow-key-2026";
const HOST = process.env.NEXT_PUBLIC_SITE_URL?.replace("https://", "")?.replace("http://", "") || "medyagem.com";

export async function pingIndexNow(urlParams: string | string[]) {
  const urls = Array.isArray(urlParams) ? urlParams : [urlParams];
  const fullUrls = urls.map(u => `https://${HOST}${u.startsWith('/') ? u : '/' + u}`);

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      console.warn("IndexNow ping başarısız:", res.status);
    } else {
      console.log(`IndexNow başarıyla pinglendi: ${fullUrls.length} URL bildirilildi.`);
    }
  } catch (err) {
    console.error("IndexNow ping hatası:", err);
  }
}
