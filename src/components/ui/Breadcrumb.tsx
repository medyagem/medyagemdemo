import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-desc mb-6 overflow-x-auto whitespace-nowrap">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span className="sr-only">Ana Sayfa</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-border" />
              {isLast || !item.href ? (
                <span className="text-white font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      {/* JSON-LD Schema for Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Ana Sayfa",
                item: "https://medyagem.com",
              },
              ...items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: item.label,
                ...(item.href && { item: `https://medyagem.com${item.href}` }),
              })),
            ],
          }),
        }}
      />
    </nav>
  );
}
