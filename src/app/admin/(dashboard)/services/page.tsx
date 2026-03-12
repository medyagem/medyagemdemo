"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/service-categories")
      ]);
      if (sRes.ok) setServices(await sRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz? Geri alınamaz.")) return;
    try {
      await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      fetchServices();
    } catch (e) {
      alert("Hata oluştu");
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end">
         <div>
           <h2 className="text-3xl font-bold text-heading">Hizmetler Yönetimi</h2>
           <p className="text-desc mt-1">Web sitenizdeki tüm hizmetlerin listesi, detayları ve bağlantıları.</p>
         </div>
        <div className="flex gap-3">
          <Link href="/admin/services/categories">
            <Button variant="outline" className="gap-2">
              <Tag className="w-4 h-4" /> Kategoriler
            </Button>
          </Link>
          <Link href="/admin/services/new">
            <Button className="gap-2"><Plus className="w-4 h-4" /> Yeni Hizmet Ekle</Button>
          </Link>
        </div>
       </div>

       <div className="bg-surface border border-border rounded-xl mt-8 overflow-hidden">
         {loading ? (
           <div className="p-8 text-center text-desc">Yükleniyor...</div>
         ) : services.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background/50 font-bold text-meta text-[10px] uppercase tracking-widest">
                <div className="col-span-1">Görsel</div>
                <div className="col-span-3">Hizmet & Kategori</div>
                <div className="col-span-2">URL (Slug)</div>
                <div className="col-span-2 text-center">Durum</div>
                <div className="col-span-2 text-center">Tarih</div>
                <div className="col-span-2 text-right">İşlemler</div>
              </div>
              {services.map((sec) => (
                <div key={sec.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-background/20 transition-colors group">
                  <div className="col-span-1">
                    <div className="w-10 h-10 rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center">
                      {sec.cover_image ? (
                        <img src={sec.cover_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-[10px] text-primary/30 font-bold uppercase">HG</div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="font-bold text-heading leading-tight group-hover:text-brand-primary transition-colors">
                      {sec.name}
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold border border-primary/20">
                        {categories.find(c => c.id === sec.category_id)?.name || "Genel"}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-meta text-[11px] font-mono">
                    /{sec.slug}
                  </div>
                  <div className="col-span-2 flex justify-center">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${sec.is_active ? 'bg-state-success/10 text-state-success border-state-success/20' : 'bg-state-error/10 text-state-error border-state-error/20'}`}>
                       {sec.is_active ? "Yayında" : "Gizli"}
                     </span>
                  </div>
                  <div className="col-span-2 flex justify-center text-[11px] font-medium text-desc">
                    {sec.created_at ? new Date(sec.created_at).toLocaleDateString('tr-TR') : '-'}
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Link href={`/hizmetler/${sec.slug}`} target="_blank">
                      <button className="p-2 bg-background border border-border rounded hover:text-brand-primary transition-colors text-desc" title="Görüntüle">
                        <Plus className="w-4 h-4 rotate-45" />
                      </button>
                    </Link>
                    <Link href={`/admin/services/${sec.id}`}>
                      <button className="p-2 bg-background border border-border rounded hover:text-brand-primary transition-colors text-desc" title="Düzenle">
                        <Edit className="w-4 h-4 text-brand-primary" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(sec.id)}
                      className="p-2 bg-background border border-border rounded hover:bg-state-error/10 hover:text-state-error transition-colors text-desc" 
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
         ) : (
           <div className="p-12 text-center text-desc flex flex-col items-center gap-4">
             <p>Henüz hiçbir hizmet eklenmemiş.</p>
             <Link href="/admin/services/new"><Button variant="secondary">İlk Hizmetini Ekle</Button></Link>
           </div>
         )}
       </div>
    </div>
  );
}
