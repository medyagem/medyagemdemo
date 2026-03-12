import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  PenTool, 
  MapPin, 
  FolderKanban,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  Home,
  Search,
  Code2
} from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const isAdminLog = cookieStore.get("admin_session");

  if (!isAdminLog || isAdminLog.value !== "active") {
    redirect("/admin/login");
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Ana Sayfa Yönetimi", href: "/admin/homepage", icon: Home },
    { name: "Sayfalar", href: "/admin/pages", icon: FileText },
    { name: "Hizmetler", href: "/admin/services", icon: Briefcase },
    { name: "Blog", href: "/admin/blog", icon: PenTool },
    { name: "Bölgeler", href: "/admin/regions", icon: MapPin },
    { name: "Projeler", href: "/admin/projects", icon: FolderKanban },
    { name: "SSS Yönetimi", href: "/admin/faq", icon: MessageSquare },
    { name: "Yorum & Değerlendirme", href: "/admin/reviews", icon: Star },
    { sep: true },
    { name: "SEO Merkezi", href: "/admin/seo", icon: Search },
    { name: "Schema Merkezi", href: "/admin/schema", icon: Code2 },
    { name: "Ayarlar", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary flex font-sans">
      <aside className="w-64 bg-surface border-r border-border flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-bold text-transparent bg-clip-text bg-brand-glow">MedyaGem CMS</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item: any, idx) => (
              item.sep ? (
                <li key={`sep-${idx}`} className="pt-3 pb-1 px-3">
                  <div className="border-t border-border" />
                </li>
              ) : (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-main hover:text-white hover:bg-background transition-colors group"
                  >
                    <item.icon className="w-5 h-5 text-desc group-hover:text-brand-primary transition-colors" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
           <form action="/api/admin/logout" method="POST">
             <button type="submit" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-state-error hover:bg-state-error/10 transition-colors">
               <LogOut className="w-5 h-5" />
               <span className="font-medium text-sm">Çıkış Yap</span>
             </button>
           </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-heading">Yönetim Paneli</h1>
          <div className="flex items-center gap-4 text-sm text-desc">
            <span>Hoş geldiniz, Admin</span>
            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">A</div>
          </div>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
