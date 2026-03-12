"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, FileText, Edit, CheckCircle2, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PagesListPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      if (res.ok) setPages(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPages(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-heading flex items-center gap-2"><FileText className="w-6 h-6 text-brand-primary" /> Sayfalar</h2>
          <p className="text-desc mt-1">Statik sayfaları (Hakkımızda, İletişim vb.) yönetin.</p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="gap-2"><Plus className="w-4 h-4" /> Yeni Sayfa</Button>
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/30 text-meta text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Sayfa</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Durum</th>
              <th className="px-6 py-4 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-desc">Yükleniyor...</td></tr>
            ) : pages.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-desc">Henüz sayfa bulunamadı.</td></tr>
            ) : pages.map(page => (
              <tr key={page.id} className="hover:bg-background/20 transition-colors">
                <td className="px-6 py-4 text-main font-medium">{page.title}</td>
                <td className="px-6 py-4 text-sm font-mono text-meta">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${page.status === 'published' ? 'bg-state-success/10 text-state-success' : 'bg-meta/10 text-meta'}`}>
                    {page.status === 'published' ? <><CheckCircle2 className="w-3 h-3" /> Yayında</> : <><Clock className="w-3 h-3" /> Taslak</>}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/pages/${page.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit className="w-4 h-4 text-brand-primary" /></Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
