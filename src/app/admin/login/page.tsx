"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh(); // Important: refresh to update cookies layout state
        router.push("/admin");
      } else {
        setError(data.message || "Giriş başarısız.");
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary font-sans px-4">
      <div className="max-w-md w-full bg-surface border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1C1F36_1px,transparent_1px),linear-gradient(to_bottom,#1C1F36_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-brand-primary opacity-5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock className="w-8 h-8 text-brand-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-heading mb-2">CMS Yetkili Girişi</h1>
          <p className="text-desc text-center mb-8">
            MedyaGem yönetim paneline erişmek için lütfen admin şifrenizi girin.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-main">Güvenlik Anahtarı</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border p-3 text-white focus:outline-none focus:border-brand-primary transition-colors rounded-lg shadow-inner"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-state-error bg-state-error/10 border border-state-error/20 p-3 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? "Doğrulanıyor..." : "Sisteme Giriş Yap"}
            </Button>
          </form>

          <footer className="mt-8 text-sm text-meta flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} MedyaGem Digital</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
