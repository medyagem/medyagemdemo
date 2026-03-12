/**
 * SEO Expert (.md/.html) dosyalarını parse eden yardımcılar.
 */

export interface ParsedSEOData {
  title?: string;
  description?: string;
  excerpt?: string;
  tldr?: string;
  keywords?: string[];
  faq?: Array<{ q: string; a: string }>;
  content: string;
  // Yeni eklenen alanlar
  category?: string;
  related_service?: string;
  cover_image?: string;
  cover_image_alt?: string;
  author_name?: string;
  author_image?: string;
}

export function parseSEOFile(text: string): ParsedSEOData {
  const data: ParsedSEOData = {
    content: ""
  };

  // 1. Frontmatter Ayıklama (--- ... ---)
  const frontmatterMatch = text.match(/^---\s*([\s\S]*?)\s*---/);
  
  if (frontmatterMatch) {
    const yamlStr = frontmatterMatch[1];
    data.content = text.replace(frontmatterMatch[0], "").trim();

    // Basit YAML Parser
    const lines = yamlStr.split('\n');
    let isFaq = false;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      if (trimmedLine.includes(':') && !trimmedLine.startsWith('-')) {
        const [key, ...parts] = trimmedLine.split(':');
        const value = parts.join(':').trim();
        
        const currentKey = key.trim();
        const cleanValue = value.replace(/^["']|["']$/g, '');

        if (currentKey === 'title') data.title = cleanValue;
        if (currentKey === 'description') data.description = cleanValue;
        if (currentKey === 'excerpt') data.excerpt = cleanValue;
        if (currentKey === 'tldr') data.tldr = cleanValue;
        if (currentKey === 'category') data.category = cleanValue;
        if (currentKey === 'related_service') data.related_service = cleanValue;
        if (currentKey === 'cover_image') data.cover_image = cleanValue;
        if (currentKey === 'cover_image_alt') data.cover_image_alt = cleanValue;
        if (currentKey === 'author_name') data.author_name = cleanValue;
        if (currentKey === 'author_image') data.author_image = cleanValue;
        
        if (currentKey === 'keywords') {
          data.keywords = cleanValue
            .replace(/[\[\]]/g, '')
            .split(',')
            .map(k => k.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
        }
        
        if (currentKey === 'faq') {
          isFaq = true;
          data.faq = [];
        } else {
          isFaq = false;
        }
      } 
      else if (isFaq && trimmedLine.startsWith('-')) {
        const content = trimmedLine.substring(1).trim();
        if (content.startsWith('q:')) {
          const q = content.replace('q:', '').trim().replace(/^["']|["']$/g, '');
          data.faq?.push({ q, a: "" });
        } else if (content.startsWith('a:')) {
          if (data.faq && data.faq.length > 0) {
            data.faq[data.faq.length - 1].a = content.replace('a:', '').trim().replace(/^["']|["']$/g, '');
          }
        }
      }
    });
  } else {
    data.content = text;
  }

  return data;
}
