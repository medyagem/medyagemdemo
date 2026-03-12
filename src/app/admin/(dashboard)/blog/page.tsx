"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ExternalLink, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock,
  AlertTriangle,
  Edit,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    try {
      const [blogRes, serviceRes, catRes] = await Promise.all([
        fetch("/api/admin/blog"),
        fetch("/api/admin/services"),
        fetch("/api/admin/blog-categories")
      ]);
      if (blogRes.ok) setPosts(await blogRes.json());
      if (serviceRes.ok) setServices(await serviceRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPosts();
    } catch (err) {
      alert("Silme işlemi başarısız.");
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // M07 Orphan Page Kontrolü
  const isOrphan = (post: any) => {
    // 1. Kendi hariç diğer blogların content_json alanında bu yazının slug'ı/linki geçiyor mu?
    const hasLinkInBlogs = posts.some(p => p.id !== post.id && p.content_json?.includes(`/${post.slug}`));
    // 2. Hizmetlerin content alanlarında geçiyor mu?
    const hasLinkInServices = services.some(s => s.overview_content?.includes(`/${post.slug}`) || s.faq_json?.includes(post.slug));
    
    // Yazar "tags" falan girmiş mi? (Optional SEO check)
    return !hasLinkInBlogs && !hasLinkInServices;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-heading">Blog Yazıları</h2>
          <p className="text-desc mt-1">Sitedeki tüm blog içeriklerini buradan yönetebilirsiniz.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blog/categories">
            <Button variant="outline" className="gap-2">
              <Tag className="w-4 h-4" /> Kategoriler
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Yeni Yazı Ekle
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-background/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-meta" />
            <input 
              type="text" 
              placeholder="Yazı başlığı ile ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm focus:border-brand-primary outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background/30 text-meta text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Görsel</th>
                <th className="px-6 py-4 font-medium">Başlık & Kategori</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">Tarih</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-desc">Yükleniyor...</td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-desc">Yazı bulunamadı.</td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-background/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Eye className="w-4 h-4 text-meta opacity-30" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-main font-bold group-hover:text-brand-primary transition-colors leading-tight">{post.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold border border-primary/20">
                            {categories.find(c => c.id === post.category_id)?.name || "Genel"}
                          </span>
                          <span className="text-[10px] text-meta font-mono">/{post.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          {post.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-state-success/10 text-state-success text-[10px] font-bold uppercase">
                              <CheckCircle2 className="w-3 h-3" /> Yayında
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-meta/10 text-meta text-[10px] font-bold uppercase tracking-tight">
                              <Clock className="w-3 h-3" /> Taslak
                            </span>
                          )}
                        </div>
                        {isOrphan(post) && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-state-error/10 text-state-error text-[10px] font-bold uppercase tracking-wider w-fit" title="Bu sayfaya site içinden hiç link verilmemiş (Orphan Page). SEO açısından diğer yazılardan veya hizmetlerden link verin.">
                            <AlertTriangle className="w-3 h-3" /> Orphan
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-desc">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') :
                       post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Görüntüle">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/${post.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Düzenle">
                            <Edit className="w-4 h-4 text-brand-primary" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-state-error/10 hover:text-state-error"
                          onClick={() => handleDelete(post.id)}
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
