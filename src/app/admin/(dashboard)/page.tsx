"use client";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Briefcase, 
  Globe, 
  MessageCircle, 
  Plus, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  PlusCircle,
  Layout
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface DashboardData {
  stats: {
    blog: number;
    services: number;
    regions: number;
    reviews: number;
  };
  activities: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard data fetch error:", err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: "Aktif Hizmetler", value: data?.stats?.services || 0, color: "text-brand-primary", icon: Briefcase },
    { label: "Blog Yazıları", value: data?.stats?.blog || 0, color: "text-state-warning", icon: FileText },
    { label: "Onay Bekleyen Yorumlar", value: data?.stats?.reviews || 0, color: "text-state-error", icon: MessageCircle },
    { label: "Toplam Bölge", value: data?.stats?.regions || 0, color: "text-state-success", icon: Globe }
  ];

  if (loading) {
     return <div className="flex items-center justify-center min-h-[400px] text-desc">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-heading">Sistem Özeti</h2>
          <p className="text-desc mt-1">Web sitenizin genel durumunu buradan takip edebilirsiniz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-brand-primary transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-desc">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
            </div>
            <span className={`text-4xl font-black ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Son Aktiviteler */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-heading mb-4 border-b border-border pb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-primary" /> Son Aktiviteler
          </h3>
          <div className="space-y-4">
            {data?.activities && data.activities.length > 0 ? (
              data.activities.map((act, i) => (
                <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors border border-transparent hover:border-border">
                  <div className={`p-2 rounded-full bg-background border border-border`}>
                    {act.type === 'blog' && <FileText className="w-4 h-4 text-state-warning" />}
                    {act.type === 'service' && <Briefcase className="w-4 h-4 text-brand-primary" />}
                    {act.type === 'region' && <Globe className="w-4 h-4 text-state-success" />}
                    {act.type === 'settings' && <Layout className="w-4 h-4 text-meta" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-main font-medium truncate">
                      <span className="capitalize">{act.action === 'create' ? 'Yeni' : act.action === 'update' ? 'Güncellendi:' : 'Silindi:'}</span> {act.title}
                    </p>
                    <p className="text-xs text-meta mt-0.5">
                      {new Date(act.timestamp).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-desc text-sm italic">
                Henüz kayıtlı aktivite bulunmamaktadır.
              </div>
            )}
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="bg-surface border border-border rounded-xl p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-heading mb-4 border-b border-border pb-2 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-primary" /> Hızlı İşlemler
          </h3>
          <div className="flex flex-col gap-3">
            <Link href="/admin/blog/new">
              <Button variant="ghost" className="w-full justify-between hover:bg-background border border-transparent hover:border-border group">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Yeni Blog Yazısı</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/admin/services/new">
              <Button variant="ghost" className="w-full justify-between hover:bg-background border border-transparent hover:border-border group">
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Yeni Hizmet Ekle</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/admin/regions/new">
              <Button variant="ghost" className="w-full justify-between hover:bg-background border border-transparent hover:border-border group">
                <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Yeni Bölge Ekle</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/admin/pages">
              <Button variant="ghost" className="w-full justify-between hover:bg-background border border-transparent hover:border-border group">
                <span className="flex items-center gap-2"><Layout className="w-4 h-4" /> Sayfa Yönetimi</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            
            <div className="mt-6 pt-6 border-t border-border">
              <Link href="/admin/reviews">
                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="w-4 h-4" /> Yorumları İncele
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
