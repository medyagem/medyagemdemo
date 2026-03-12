"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, Edit, Eye, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RegionsListPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRegions = async () => {
    try {
      const res = await fetch("/api/admin/regions");
      if (res.ok) {
        const data = await res.json();
        setRegions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const filtered = regions.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-heading">Hizmet Bölgeleri</h2>
          <p className="text-desc mt-1">Hizmet verdiğiniz lokasyonları buradan yönetin.</p>
        </div>
        <Link href="/admin/regions/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Yeni Bölge Ekle
          </Button>
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-background/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-meta" />
            <input 
              type="text" 
              placeholder="Bölge adı ile ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm focus:border-brand-primary outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background/30 text-meta text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Bölge Adı</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-desc">Yükleniyor...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-desc">Bölge bulunamadı.</td></tr>
              ) : (
                filtered.map((region) => (
                  <tr key={region.id} className="hover:bg-background/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-main font-medium">{region.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-meta">/{region.slug}</td>
                    <td className="px-6 py-4">
                      {region.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-state-success/10 text-state-success text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-meta/10 text-meta text-xs font-medium">
                          <Clock className="w-3 h-3" /> Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/regions/${region.id}`}>
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                             <Edit className="w-4 h-4 text-brand-primary" />
                           </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
