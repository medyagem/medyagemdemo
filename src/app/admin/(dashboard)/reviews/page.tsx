"use client";
import { useState, useEffect } from "react";
import { Star, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) setReviews(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      fetchReviews();
    } catch { alert("Güncelleme hatası."); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-heading flex items-center gap-2"><Star className="w-6 h-6 text-brand-primary" /> Yorum & Değerlendirme</h2>
        <p className="text-desc mt-1">Kullanıcı yorumlarını inceleyin, onaylayın veya reddedin.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm divide-y divide-border">
        {loading ? <div className="p-8 text-center text-desc">Yükleniyor...</div> : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="w-12 h-12 text-border mx-auto mb-3" />
            <p className="text-desc">Henüz yorum bulunmamaktadır.</p>
          </div>
        ) : reviews.map(review => (
          <div key={review.id} className="p-5 hover:bg-background/20 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-main">{review.author_name}</span>
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-state-warning fill-state-warning' : 'text-border'}`} />)}</div>
                </div>
                <p className="text-desc text-sm">{review.comment}</p>
                <span className="text-xs text-meta mt-2 inline-block">{review.entity_type} • {new Date(review.submitted_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex gap-2 items-center">
                {review.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(review.id, 'approved')} className="gap-1 bg-state-success/20 text-state-success hover:bg-state-success/30 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Onayla</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(review.id, 'rejected')} className="gap-1 text-state-error hover:bg-state-error/10 text-xs"><XCircle className="w-3.5 h-3.5" /> Reddet</Button>
                  </>
                )}
                {review.status === 'approved' && <span className="text-xs text-state-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Onaylandı</span>}
                {review.status === 'rejected' && <span className="text-xs text-state-error flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Reddedildi</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
