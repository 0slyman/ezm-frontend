import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import ImageGallery from "../../components/ImageGallery"; 
import ShareButtons from "../../components/ShareButtons";
import ViewCounter from "../../components/ViewCounter";
import { Metadata } from "next";

const playfair = Playfair_Display({ subsets: ['latin'] });

// URL DÜZELTİCİ
function getFullUrl(url: string) {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://ezm-backend-production.up.railway.app${url}`;
}

// --- VERİ ÇEKME ---
async function getIlan(slug: string) {
  try {
    const res = await fetch(`https://ezm-backend-production.up.railway.app/api/ilans?filters[slug][$eq]=${slug}&populate[0]=gorseller&populate[1]=ic_donanimlar&populate[2]=dis_donanimlar`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Veri getirilemedi");
    const json = await res.json();
    return json.data[0]; 
  } catch (error) { return null; }
}

async function getBenzerIlanlar(kategori: string, emlak_tipi: string, currentSlug: string) {
  try {
    let filterQuery = `filters[Kategori][$eq]=${kategori}&filters[emlak_tipi][$eq]=${emlak_tipi}&filters[slug][$ne]=${currentSlug}`;
    const res = await fetch(`https://ezm-backend-production.up.railway.app/api/ilans?${filterQuery}&pagination[limit]=4&sort=publishedAt:desc&populate=gorseller`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch (error) { return []; }
}

async function getGlobalData() {
    try {
      const res = await fetch("https://ezm-backend-production.up.railway.app/api/global", { cache: 'no-store' });
      const json = await res.json();
      return json.data;
    } catch (error) { return null; }
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
}

// --- SEO: DYNAMIC METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const ilan = await getIlan(resolvedParams.slug);

  if (!ilan) return { title: "İlan Bulunamadı" };

  const kapak = getFullUrl(ilan.gorseller?.[0]?.url || ilan.gorseller?.url);
  const fiyat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(ilan.fiyat);

  return {
    title: `${ilan.baslik} - ${fiyat}`,
    description: `${ilan.konum} konumunda, ${ilan.metrekare} m² ${ilan.emlak_tipi}.`,
    openGraph: {
      title: `${ilan.baslik} | EZM Gayrimenkul`,
      description: `Fiyat: ${fiyat} - ${ilan.konum}`,
      images: kapak ? [{ url: kapak }] : [],
    },
  };
}

// --- ZENGİN METİN GÖSTERİCİ ---
function RichTextRenderer({ content }: { content: any[] }) {
  if (!content) return null;
  return (
    <div className="space-y-4 text-slate-700 leading-relaxed text-lg">
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return <p key={index}>{block.children.map((child: any, i: number) => (child.bold ? <strong key={i} className="font-bold">{child.text}</strong> : <span key={i}>{child.text}</span>))}</p>;
        }
        return null;
      })}
    </div>
  );
}

const FeaturesList = ({ title, items }: { title: string, items: any[] }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mt-8">
            <h4 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2"><span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>{title}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 hover:border-teal-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-sm font-medium">{item.isim}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default async function IlanDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const ilanData = getIlan(resolvedParams.slug);
  const globalData = getGlobalData();
  const [ilan, global] = await Promise.all([ilanData, globalData]);

  if (!ilan) return <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-gray-50"><h1 className="text-2xl font-bold text-gray-400">İlan bulunamadı.</h1><Link href="/ilanlar" className="text-slate-900 hover:underline">İlanlara Dön</Link></div>;

  const benzerIlanlar = await getBenzerIlanlar(ilan.Kategori, ilan.emlak_tipi, ilan.slug);
  const formatliFiyat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(ilan.fiyat);
  const gorseller = ilan.gorseller || [];
  const rawPhone = global?.telefon || "905555555555"; 
  const cleanPhone = rawPhone.replace(/[^0-9]/g, ''); 
  const wpLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Merhaba, "${ilan.baslik}" ilanı hakkında bilgi almak istiyorum.`)}`;
  const icDonanimlar = ilan.ic_donanimlar || [];
  const disDonanimlar = ilan.dis_donanimlar || [];

  // --- HATA DÜZELTMESİ (Rich Text Kontrolü) ---
  let metaDescription = ilan.baslik;
  if (typeof ilan.aciklama === 'string') {
      metaDescription = ilan.aciklama.substring(0, 150);
  } else if (Array.isArray(ilan.aciklama) && ilan.aciklama.length > 0) {
      try {
          const firstBlock = ilan.aciklama[0];
          if (firstBlock.type === 'paragraph' && firstBlock.children && firstBlock.children[0]) {
              metaDescription = firstBlock.children[0].text.substring(0, 150);
          }
      } catch (e) {}
  }

  // SEO: SCHEMA (Güncel Link ile)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: ilan.baslik,
    description: metaDescription,
    image: getFullUrl(gorseller?.[0]?.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: ilan.fiyat,
      availability: 'https://schema.org/InStock',
      url: `https://www.ezm-danismanlik.com/ilanlar/${ilan.slug}`
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans pt-28 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="container mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8">
            <div>
                <div className="flex flex-wrap gap-3 mb-4 items-center">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${ilan.Kategori === 'Satılık' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{ilan.Kategori}</span>
                    {ilan.emlak_tipi && (<span className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border border-teal-100">{ilan.emlak_tipi}</span>)}
                    <span className="text-slate-400 text-sm font-medium flex items-center gap-1 ml-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{formatDate(ilan.publishedAt)}</span>
                </div>
                <h1 className={`${playfair.className} text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-3`}>{ilan.baslik}</h1>
                <p className="text-slate-500 text-lg flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{ilan.konum}</p>
            </div>
            <div className="text-left md:text-right bg-slate-50 p-6 rounded-2xl min-w-[250px]">
                <p className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">Satış Fiyatı</p>
                <p className={`${playfair.className} text-3xl md:text-4xl font-bold text-slate-900`}>{formatliFiyat}</p>
            </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mb-12">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <ImageGallery gorseller={gorseller} />
          </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                    <h3 className={`${playfair.className} text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-gray-100 flex items-center gap-3`}>İlan Özellikleri</h3>
                    
                    {/* ÖZELLİKLER GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 pb-8 border-b border-gray-100">
                        
                        {/* Metrekare */}
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Metrekare</span>
                            <span className="text-slate-900 font-bold text-xl flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">📏</span> 
                                {ilan.metrekare} m²
                            </span>
                        </div>
                        
                        {/* Oda Sayısı */}
                        <div>
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Oda Sayısı</span>
                            <span className="text-slate-900 font-bold text-xl flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">🚪</span> 
                                {ilan.oda_sayisi}
                            </span>
                        </div>
                        
                        {/* Bina Yaşı (DÜZELTİLDİ: 0 olsa bile göster) */}
                        {(ilan.bina_yasi !== null && ilan.bina_yasi !== undefined) && (
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bina Yaşı</span>
                                <span className="text-slate-900 font-bold text-xl flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">🏢</span> 
                                    {ilan.bina_yasi} Yaşında
                                </span>
                            </div>
                        )}
                        
                        {/* Kat (DÜZELTİLDİ: 0 olsa bile göster) */}
                        {(ilan.bulundugu_kat !== null && ilan.bulundugu_kat !== undefined) && (
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kat</span>
                                <span className="text-slate-900 font-bold text-xl flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">🔼</span> 
                                    {ilan.bulundugu_kat}. Kat
                                </span>
                            </div>
                        )}
                        
                        {/* Isıtma */}
                        {ilan.isitma && (
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Isıtma</span>
                                <span className="text-slate-900 font-bold text-xl flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">🔥</span> 
                                    {ilan.isitma}
                                </span>
                            </div>
                        )}
                        
                        {/* Durum */}
                        <div className="col-span-2 md:col-span-1 pt-1">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Durum</span>
                            <div className="flex flex-wrap gap-2">
                                {ilan.esyali && <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200">Eşyalı</span>}
                                {ilan.krediye_uygun && <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">Krediye Uygun</span>}
                            </div>
                        </div>

                    </div>
                    
                    <FeaturesList title="İç Özellikler" items={icDonanimlar} />
                    <FeaturesList title="Dış Özellikler" items={disDonanimlar} />
                </div>
                <div className="prose prose-lg prose-slate max-w-none"><h3 className={`${playfair.className} text-2xl font-bold text-slate-900 border-b border-gray-200 pb-4 mb-6`}>Açıklama</h3><RichTextRenderer content={ilan.aciklama} /></div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between flex-wrap gap-4"><span className="font-bold text-slate-700">Bu ilanı arkadaşlarınızla paylaşın:</span><ShareButtons title={ilan.baslik} /></div>
            </div>
            
            <div className="lg:col-span-1 mt-10 lg:mt-0">
                <div className="sticky top-28 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                             <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-gray-200 p-1 flex items-center justify-center"><img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl" /></div>
                             <div><h4 className="font-bold text-slate-900 text-lg">EZM Danışmanlık</h4><p className="text-teal-600 text-xs font-bold uppercase tracking-wider">Kurumsal Üye</p></div>
                        </div>
                        <div className="space-y-3">
                            <a href={`tel:${cleanPhone}`} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg flex items-center justify-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>Hemen Ara</a>
                            <a href={wpLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-green-50 text-green-700 border-2 border-green-200 rounded-xl font-bold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>WhatsApp'tan Yaz</a>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                        <h3 className={`${playfair.className} text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-gray-100`}>Benzer İlanlar</h3>
                        <div className="space-y-5">
                            {benzerIlanlar.length > 0 ? benzerIlanlar.map((b: any) => {
                                const b_kapak = getFullUrl(b.gorseller?.[0]?.url || b.gorseller?.url);
                                const b_fiyat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(b.fiyat);
                                return (
                                    <Link key={b.id} href={`/ilanlar/${b.slug}`} className="group flex gap-3 items-start p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 relative">{b_kapak && <img src={b_kapak} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>}</div>
                                        <div className="flex-grow"><h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors">{b.baslik}</h4><p className="text-teal-700 font-bold text-xs mt-1">{b_fiyat}</p><div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2"><span>{b.emlak_tipi}</span><span>•</span><span>{b.konum?.split(" ")[0]}</span></div></div>
                                    </Link>
                                )
                            }) : <p className="text-sm text-gray-400 italic">Bu kriterlere uygun başka ilan bulunamadı.</p>}
                        </div>
                        <Link href="/ilanlar" className="block text-center mt-6 text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-wider">Tüm İlanları Gör →</Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
      <ViewCounter id={ilan.id} collection="ilans" currentViews={ilan.goruntulenme} />
    </main>
  );
}