import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'] });

async function getHizmet(slug: string) {
  try {
    const res = await fetch(`http://localhost:1337/api/hizmets?filters[slug][$eq]=${slug}&populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Veri getirilemedi");
    const json = await res.json();
    return json.data[0]; 
  } catch (error) { return null; }
}

// --- SEO: DYNAMIC METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const hizmet = await getHizmet(resolvedParams.slug);
  if (!hizmet) return { title: "Hizmet Bulunamadı" };
  const ikonUrl = hizmet.ikon?.url || hizmet.ikon?.[0]?.url;
  return {
    title: hizmet.baslik,
    description: hizmet.kisa_aciklama,
    openGraph: {
      title: `${hizmet.baslik} - Profesyonel Destek`,
      description: hizmet.kisa_aciklama,
      images: ikonUrl ? [{ url: `http://localhost:1337${ikonUrl}` }] : [],
    },
  };
}

function RichTextRenderer({ content }: { content: any[] }) {
  if (!content) return null;
  return (
    <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index}>{block.children.map((child: any, childIndex: number) => {
                if (child.bold) return <strong key={childIndex} className="font-bold text-slate-900">{child.text}</strong>;
                if (child.italic) return <em key={childIndex} className="italic">{child.text}</em>;
                return <span key={childIndex}>{child.text}</span>;
              })}</p>
          );
        }
        return null;
      })}
    </div>
  );
}

function Breadcrumb({ title }: { title: string }) {
    return (
      <nav className="flex text-sm font-medium text-slate-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center"><Link href="/" className="hover:text-slate-800 transition">Anasayfa</Link></li>
          <li><div className="flex items-center"><span className="mx-1 text-gray-400">/</span><span className="text-slate-400">Hizmetler</span></div></li>
          <li aria-current="page"><div className="flex items-center"><span className="mx-1 text-gray-400">/</span><span className="text-slate-900 font-semibold">{title}</span></div></li>
        </ol>
      </nav>
    );
}

export default async function HizmetDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const hizmet = await getHizmet(resolvedParams.slug);

  if (!hizmet) return <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50"><h1 className="text-2xl font-bold text-gray-400">Hizmet bulunamadı.</h1><Link href="/" className="text-slate-800 hover:underline">Anasayfaya Dön</Link></div>;

  const ikonUrl = hizmet.ikon?.url || hizmet.ikon?.[0]?.url;

  // SEO: SCHEMA
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: hizmet.baslik,
    description: hizmet.kisa_aciklama,
    provider: { '@type': 'Organization', name: 'EZM Danışmanlık' },
    areaServed: "Konya",
    image: ikonUrl ? `http://localhost:1337${ikonUrl}` : undefined,
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0"><img src="/bg.jpg" alt="Kurumsal Arka Plan" className="w-full h-full object-cover object-center grayscale-[20%]"/></div>
        <div className="absolute inset-0 z-10 bg-slate-950/70"></div>
        <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center pt-20">
            {ikonUrl && (
            <div className="mb-10 w-48 h-48 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden relative group">
               <img src={`http://localhost:1337${ikonUrl}`} alt={hizmet.baslik} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            )}
            <h1 className={`${playfair.className} text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-wide drop-shadow-2xl leading-tight`}>{hizmet.baslik}</h1>
             <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 max-w-3xl shadow-lg"><p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed">{hizmet.kisa_aciklama}</p></div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24 -mt-20 relative z-30">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <Breadcrumb title={hizmet.baslik} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
                <div className="lg:col-span-2">
                    <div className="prose prose-lg max-w-none">
                        <h2 className={`${playfair.className} text-3xl font-bold text-slate-900 mb-6 pb-4 border-b border-gray-200`}>Hizmet Detayları</h2>
                        <p className="text-xl text-slate-600 leading-relaxed mb-10 font-medium pl-4 border-l-4 border-slate-900 bg-gray-50 py-4 rounded-r-lg">{hizmet.kisa_aciklama}</p>
                        <RichTextRenderer content={hizmet.detay} />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className={`${playfair.className} text-xl font-bold text-slate-900 mb-4`}>Profesyonel Destek Alın</h3>
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">{hizmet.baslik} konusunda uzman ekibimizle görüşmek için bize ulaşın.</p>
                            <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 group shadow-lg"><span>Bizi Arayın</span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></button>
                            <div className="mt-4 pt-4 border-t border-gray-200 text-center"><Link href="/" className="text-sm text-slate-500 hover:text-slate-900 font-medium">Diğer Hizmetlere Göz At</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}