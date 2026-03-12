"use client";

import { useState, useEffect } from "react";
import { Star, Send, MessageCircle, ThumbsUp, User } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  email?: string;
}

interface ReviewSystemProps {
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  itemName: string;
  entityType?: string; // "blog" | "service" | "project" | "region"
  entitySlug?: string; // slug tanımlayıcı
}

export default function ReviewSystem({ reviews: initialReviews = [], averageRating: initAvg = 0, totalReviews: initTotal = 0, itemName, entityType, entitySlug }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [avgRating, setAvgRating] = useState(initAvg);
  const [totalCount, setTotalCount] = useState(initTotal);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // API'den yorumları yükle
  useEffect(() => {
    if (entityType && entitySlug) {
      const fetchReviews = async () => {
        try {
          const res = await fetch(`/api/reviews?type=${entityType}&slug=${entitySlug}`);
          if (res.ok) {
            const data = await res.json();
            // Prisma'dan gelen veriyi Review interface'ine uyarla
            const formatted = data.map((r: any) => ({
              id: r.id,
              author: r.author_name,
              rating: r.rating,
              content: r.comment,
              date: new Date(r.submitted_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
            }));
            setReviews(formatted);
            
            if (formatted.length > 0) {
              const avg = formatted.reduce((acc: number, r: any) => acc + r.rating, 0) / formatted.length;
              setAvgRating(parseFloat(avg.toFixed(1)));
              setTotalCount(formatted.length);
            }
          }
        } catch (error) {
          console.error("Yorumlar yüklenirken hata:", error);
        }
      };
      
      fetchReviews();
    }
  }, [entityType, entitySlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setError("Lütfen adınızı girin.");
      return;
    }
    if (!comment.trim()) {
      setError("Lütfen yorumunuzu yazın.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: authorName.trim(),
          rating,
          comment: comment.trim(),
          entity_type: entityType,
          entity_id: entitySlug,
        }),
      });

      if (!response.ok) throw new Error("Gönderme hatası");

      // Formu temizle
      setAuthorName("");
      setEmail("");
      setComment("");
      setRating(5);
      setSubmitted(true);

      // 4 saniye sonra mesajı kaldır
      setTimeout(() => setSubmitted(false), 4000);
      
      // Not: Admin onaylayana kadar burada görünmeyecek, 
      // istersen geçici olarak ekleyebilirsin ama state karmaşıklığı yaratır.
    } catch {
      setError("Yorum gönderilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Schema */}
      {totalCount > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": itemName,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": avgRating.toString(),
                "reviewCount": totalCount.toString()
              },
              "review": reviews.slice(0, 10).map(r => ({
                "@type": "Review",
                "author": { "@type": "Person", "name": r.author },
                "datePublished": r.date,
                "reviewBody": r.content,
                "reviewRating": { "@type": "Rating", "ratingValue": r.rating.toString() }
              }))
            })
          }}
        />
      )}

      {/* Başlık */}
      <div className="flex items-center gap-3">
        <MessageCircle className="w-7 h-7 text-primary" />
        <h3 className="text-2xl md:text-3xl font-bold text-heading">
          Yorumlar{totalCount > 0 && <span className="text-primary ml-2">({totalCount})</span>}
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Rating Summary */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-xl h-fit lg:sticky lg:top-24">
          <span className="text-6xl font-black text-heading mb-2">{avgRating.toFixed(1)}</span>
          <div className="flex items-center gap-1 mb-3 text-brand-primary">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={cn("w-6 h-6", star <= avgRating ? "fill-current" : "text-border fill-transparent")} />
            ))}
          </div>
          <span className="text-desc text-sm">{totalCount} Değerlendirme</span>
          
          {/* Yıldız Dağılımı */}
          <div className="w-full mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map(starLevel => {
              const count = reviews.filter(r => r.rating === starLevel).length;
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={starLevel} className="flex items-center gap-2 text-sm">
                  <span className="text-meta w-3 text-right">{starLevel}</span>
                  <Star className="w-3.5 h-3.5 text-brand-primary fill-current" />
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-meta w-6 text-right text-xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yorum Listesi */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col gap-4 hover:border-border/80 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary font-bold uppercase">
                      {review.author.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-heading">{review.author}</span>
                      <span className="text-xs text-meta">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-brand-primary">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn("w-4 h-4", star <= review.rating ? "fill-current" : "text-border fill-transparent")} />
                    ))}
                  </div>
                </div>
                <p className="text-main leading-relaxed">{review.content}</p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border border-border border-dashed rounded-xl">
              <MessageCircle className="w-12 h-12 text-meta mx-auto mb-4 opacity-30" />
              <p className="text-desc italic">Henüz yorum yapılmamış. İlk değerlendiren siz olun!</p>
            </div>
          )}
        </div>
      </div>

      {/* ========= YORUM FORMU ========= */}
      <div className="w-full bg-surface border border-border rounded-xl p-8 md:p-10">
        <h4 className="text-xl md:text-2xl font-bold text-heading mb-2">Yorum Bırakın</h4>
        <p className="text-desc text-sm mb-8">Deneyiminizi paylaşın ve bu içeriği değerlendirin.</p>

        {submitted && (
          <div className="flex items-center gap-3 bg-state-success/10 border border-state-success/30 text-state-success rounded-lg px-5 py-4 mb-6">
            <ThumbsUp className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">Yorumunuz başarıyla eklendi. Teşekkür ederiz!</span>
          </div>
        )}

        {error && (
          <div className="bg-state-error/10 border border-state-error/30 text-state-error rounded-lg px-5 py-4 mb-6">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Yıldız Seçimi */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-semibold text-heading">Puanınız:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors duration-150",
                      star <= (hoveredRating || rating) ? "text-brand-primary fill-current" : "text-border fill-transparent"
                    )}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-meta font-medium">
                {(hoveredRating || rating) === 1 && "Kötü"}
                {(hoveredRating || rating) === 2 && "Orta"}
                {(hoveredRating || rating) === 3 && "İyi"}
                {(hoveredRating || rating) === 4 && "Çok İyi"}
                {(hoveredRating || rating) === 5 && "Mükemmel"}
              </span>
            </div>
          </div>

          {/* İsim ve Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-meta" />
              <input
                type="text"
                placeholder="Adınız Soyadınız *"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-background border border-border pl-11 pr-4 py-3.5 text-white rounded-lg focus:outline-none focus:border-primary transition-colors placeholder:text-meta"
                required
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-meta text-sm">@</span>
              <input
                type="email"
                placeholder="E-posta Adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border pl-11 pr-4 py-3.5 text-white rounded-lg focus:outline-none focus:border-primary transition-colors placeholder:text-meta"
              />
            </div>
          </div>

          {/* Yorum */}
          <textarea
            placeholder="Yorumunuzu buraya yazın... *"
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-background border border-border px-4 py-3.5 text-white rounded-lg focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-meta"
            required
          />

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={submitting} className="gap-2 px-8">
              <Send className="w-4 h-4" />
              {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
