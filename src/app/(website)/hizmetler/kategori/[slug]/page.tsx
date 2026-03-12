import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Monitor, BarChart2, MousePointerClick, CheckCircle, Smartphone, PenTool, Search, Globe } from "lucide-react";
import Cta from "@/sections/Cta";
import { getServiceCategoryBySlug, getServices } from "@/lib/data-fetchers";

const ICONS = [Monitor, BarChart2, MousePointerClick, CheckCircle, Smartphone, PenTool, Search, Globe];

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getServiceCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} Hizmetleri - MedyaGem`,
    description: category.description || `Profesyonel ${category.name} çözümleri ile işinizi büyütün.`,
  };
}

export default async function ServiceCategoryPage({ params }: { params: { slug: string } }) {
  const category = await getServiceCategoryBySlug(params.slug);
  if (!category) notFound();

  const allServices = await getServices();
  const services = allServices.filter((s) => s.category_id === category.id);

  return (
    <>
      <PageHero
        title={<><span className="text-primary">{category.name}</span> Çözümlerimiz</>}
        description={category.description || "Markanız için uçtan uca dijital çözümler ve profesyonel hizmetler."}
        breadcrumbItems={[
          { label: "Hizmetler", href: "/hizmetler" },
          { label: category.name }
        ]}
      />

      <section className="py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-border/50 pb-6">
             <Link href="/hizmetler" className="flex items-center gap-2 text-desc hover:text-primary transition-colors font-semibold">
                <ArrowLeft className="w-5 h-5" /> Tüm Hizmetlere Dön
             </Link>
             <div className="px-4 py-1.5 bg-surface border border-border rounded-full text-xs text-primary font-bold uppercase tracking-widest shadow-sm">
                {services.length} AKTİF HİZMET
             </div>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-24 bg-surface/50 border border-dashed border-border rounded-3xl">
               <h3 className="text-2xl font-bold text-heading">Hizmet Alanı Hazırlanıyor</h3>
               <p className="text-desc mt-3 max-w-md mx-auto">Bu uzmanlık alanı için yakında yeni hizmetlerimizi burada sergileyeceğiz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, index) => {
                const IconComponent = ICONS[index % ICONS.length];
                return (
                  <Link key={service.id} href={`/hizmetler/${service.slug}`} className="group flex flex-col bg-surface border border-border overflow-hidden hover:border-primary transition-all duration-500 rounded-2xl shadow-xl hover:shadow-primary/5">
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/50">
                      {service.cover_image ? (
                        <img src={service.cover_image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center">
                           <IconComponent className="w-16 h-16 text-primary/10" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-extrabold text-heading mb-4 group-hover:text-primary transition-colors leading-tight">{service.name}</h3>
                      <p className="text-desc leading-relaxed line-clamp-3 mb-8 flex-grow text-[15px]">{service.card_description || service.hero_description || "MedyaGem uzmanlığıyla tanışın."}</p>
                      <div className="flex items-center text-primary font-bold group-hover:gap-4 transition-all duration-300">
                        DETAYLI BİLGİ <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Cta />
    </>
  );
}
