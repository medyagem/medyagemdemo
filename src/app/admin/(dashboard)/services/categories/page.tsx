"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Save,
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ServiceCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "", is_active: true });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/service-categories");
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.name || !newCategory.slug) {
      alert("İsim ve slug alanları zorunludur.");
      return;
    }
    try {
      const res = await fetch("/api/admin/service-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory)
      });
      if (res.ok) {
        setNewCategory({ name: "", slug: "", description: "", is_active: true });
        setShowAddForm(false);
        fetchCategories();
      }
    } catch (err) {
      alert("Ekleme hatası.");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch("/api/admin/service-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editFormData })
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      alert("Güncelleme hatası.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/service-categories?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (err) {
      alert("Silme hatası.");
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/services">
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-heading">Hizmet Kategorileri</h2>
            <p className="text-desc mt-1">Hizmetleri gruplandırmak için kategoriler oluşturun.</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4" /> Yeni Kategori Ekle
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-heading">Yeni Kategori</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-meta uppercase">Kategori Adı</label>
              <input 
                type="text" 
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full bg-background border border-border px-4 py-2 rounded-lg text-sm focus:border-brand-primary outline-none"
                placeholder="Örn: Dijital Pazarlama"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-meta uppercase">Slug (URL)</label>
              <input 
                type="text" 
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                className="w-full bg-background border border-border px-4 py-2 rounded-lg text-sm focus:border-brand-primary outline-none"
                placeholder="dijital-pazarlama"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-meta uppercase">Açıklama</label>
              <input 
                type="text" 
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full bg-background border border-border px-4 py-2 rounded-lg text-sm focus:border-brand-primary outline-none"
                placeholder="Kısa açıklama..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>İptal</Button>
            <Button onClick={handleAdd}>Kaydet</Button>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-background/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-meta" />
            <input 
              type="text" 
              placeholder="Kategori adı ile ara..." 
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
                <th className="px-6 py-4 font-medium">İsim / Slug</th>
                <th className="px-6 py-4 font-medium">Açıklama</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-desc">Yükleniyor...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-desc">Kategori bulunamadı.</td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-background/20 transition-colors group">
                    <td className="px-6 py-4">
                      {editingId === cat.id ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="bg-background border border-border px-2 py-1 rounded w-full text-sm"
                          />
                          <input 
                            type="text" 
                            value={editFormData.slug}
                            onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                            className="bg-background border border-border px-2 py-1 rounded w-full text-xs text-meta"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-main font-medium group-hover:text-brand-primary transition-colors">{cat.name}</span>
                          <span className="text-xs text-meta mt-0.5">/{cat.slug}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === cat.id ? (
                        <input 
                          type="text" 
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          className="bg-background border border-border px-2 py-1 rounded w-full text-sm"
                        />
                      ) : (
                        <span className="text-sm text-desc">{cat.description || "-"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === cat.id ? (
                        <select 
                          value={String(editFormData.is_active)}
                          onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === "true" })}
                          className="bg-background border border-border px-2 py-1 rounded text-sm"
                        >
                          <option value="true">Aktif</option>
                          <option value="false">Pasif</option>
                        </select>
                      ) : (
                        cat.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-state-success/10 text-state-success text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-state-error/10 text-state-error text-xs font-medium">
                            <XCircle className="w-3 h-3" /> Pasif
                          </span>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === cat.id ? (
                          <>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleUpdate(cat.id)}>
                              <Save className="w-4 h-4 text-state-success" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingId(null)}>
                              <X className="w-4 h-4 text-state-error" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => {
                                setEditingId(cat.id);
                                setEditFormData(cat);
                              }}
                            >
                              <Edit className="w-4 h-4 text-brand-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-state-error/10 hover:text-state-error"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
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
