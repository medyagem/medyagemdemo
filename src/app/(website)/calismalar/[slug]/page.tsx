import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShareButtons from "@/components/ui/ShareButtons";
import { ArrowLeft, ExternalLink, Building2, Briefcase } from "lucide-react";
import Link from "next/link";
import Cta from "@/sections/Cta";
import { getProjectBySlug } from "@/lib/data-fetchers";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Proje Bulunamadı | MedyaGem" };

  return {
    title: `${project.project_name} | MedyaGem Çalışmalar`,
    description: project.summary ?? undefined,
    openGraph: {
      title: project.project_name,
      description: project.summary ?? undefined,
      url: `https://medyagem.com/calismalar/${params.slug}`,
      images: project.cover_image ? [{ url: project.cover_image }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const currentUrl = `https://medyagem.com/calismalar/${params.slug}`;
  const projectName = project.project_name || params.slug.replace(/-/g, " ").toUpperCase();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": projectName,
            "creator": { "@type": "Organization", "name": "MedyaGem" },
            "url": currentUrl
          })
        }}
      />
      <PageHero
        title={<><span className="text-transparent bg-clip-text bg-brand-glow">{projectName}</span></>}
        description={project.summary || ""}
        breadcrumbItems={[{ label: "Çalışmalar", href: "/calismalar" }, { label: projectName }]}
      />

      <section className="py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Sol - İçerik */}
            <div className="lg:col-span-2 space-y-10">
              {/* Kapak Görseli */}
              {project.cover_image ? (
                <div className="w-full h-[450px] overflow-hidden border border-border">
                  <img src={project.cover_image} alt={projectName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-[450px] bg-surface border border-border flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#1C1F36]" />
                  <span className="relative z-10 text-border font-black text-4xl tracking-widest mix-blend-overlay">{projectName}</span>
                </div>
              )}

              {/* Özet */}
              {project.summary && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-heading">Proje Hakkında</h2>
                  <p className="text-main leading-relaxed text-lg">{project.summary}</p>
                </div>
              )}

              {/* Paylaş */}
              <div className="border-y border-border py-8 flex items-center justify-between flex-wrap gap-6">
                <span className="text-xl font-bold text-heading">Bu projeyi paylaşın</span>
                <ShareButtons url={currentUrl} title={`${projectName} - MedyaGem`} />
              </div>
            </div>

            {/* Sağ - Bilgi Kartı */}
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
                <h3 className="text-lg font-bold text-heading border-b border-border pb-4">Proje Bilgileri</h3>

                {project.client_name && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-meta uppercase font-semibold block">Müşteri</span>
                      <span className="text-main font-medium">{project.client_name}</span>
                    </div>
                  </div>
                )}

                {project.sector && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-meta uppercase font-semibold block">Sektör</span>
                      <span className="text-main font-medium">{project.sector}</span>
                    </div>
                  </div>
                )}

                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium mt-4"
                  >
                    <ExternalLink className="w-4 h-4" /> Web Sitesini Ziyaret Et
                  </a>
                )}
              </div>

              <Link
                href="/calismalar"
                className="flex items-center gap-2 text-desc hover:text-primary transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Tüm Çalışmalar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
