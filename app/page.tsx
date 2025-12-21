import Link from "next/link";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap' });

// --- VERİ ÇEKME FONKSİYONLARI ---

async function getHizmetler() {
  try {
    const res = await fetch("https://ezm-backend-production.up.railway.app/api/hizmets?populate=*", { cache: 'no-store' });
    if (!res.ok) throw new Error("Hata");
    return res.json();
  } catch (error) { return { data: [] }; }
}

async function getPopulerIlanlar() {
  try {
    const res = await fetch("https://ezm-backend-production.up.railway.app/api/ilans?filters[goruntulenme][$gt]=0&sort=goruntulenme:desc&pagination[limit]=6&populate=*", { cache: 'no-store' });
    if (!res.ok) throw new Error("Hata");
    return res.json();
  } catch (error) { return { data: [] }; }
}

async function getPopulerMakaleler() {
  try {
    const res = await fetch("https://ezm-backend-production.up.railway.app/api/makales?filters[goruntulenme][$gt]=0&sort=goruntulenme:desc&pagination[limit]=3&populate=*", { cache: 'no-store' });
    if (!res.ok) throw new Error("Hata");
    return res.json();
  } catch (error) { return { data: [] }; }
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
}


export default async function Home() {
  const [hizmetData, ilanData, makaleData] = await Promise.all([
    getHizmetler(),
    getPopulerIlanlar(),
    getPopulerMakaleler()
  ]);

  const hizmetler = hizmetData.data;
  const ilanlar = ilanData.data;
  const makaleler = makaleData.data;

  return (
    <main className="min-h-screen bg-teal-50 text-slate-800 font-sans">
      
      {/* 1. HERO ALANI */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 overflow-hidden bg-slate-900 pt-24 pb-12 md:pt-0 md:pb-0">
        <div className="absolute inset-0 z-0">
            <img src="/bg.jpg" alt="Arka Plan" className="w-full h-full object-cover object-center grayscale-[20%]" />
            <div className="absolute inset-0 bg-slate-950/70"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 md:h-48 bg-gradient-to-t from-teal-50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center w-full h-full">
            <h1 className={`${playfair.className} text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-10 tracking-wide leading-tight drop-shadow-2xl`}>
              EZM <span className="text-gray-300 block md:inline">Danışmanlık</span>
            </h1>
            
            <div className="bg-slate-900/60 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/10 shadow-2xl max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto mb-8 md:mb-12">
                <p className="text-sm sm:text-base md:text-2xl text-slate-200 leading-relaxed font-light">
                    <span className="font-semibold text-white">Hukuk, Bilişim</span> ve <span className="font-semibold text-white">Gayrimenkul</span> süreçlerinizde; 
                    gerçeği aydınlatan çözüm ortağınız.
                </p>
                <div className="hidden md:block w-16 h-[1px] bg-white/30 mx-auto mt-8 mb-4"></div>
                <p className="hidden md:block text-sm text-gray-400 tracking-[0.2em] uppercase font-medium">Geleceğe Güvenle Bakın</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                <button className="w-full sm:w-auto px-8 py-3 md:px-10 md:py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1 text-base md:text-lg">
                  Hizmetleri Keşfet
                </button>
                <Link href="/ilanlar" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-3 md:px-10 md:py-4 bg-transparent border border-white/20 text-white rounded-xl font-bold hover:bg-white/5 transition backdrop-blur-sm text-base md:text-lg">
                    İlanlara Göz At
                  </button>
                </Link>
            </div>
        </div>
      </section>

      {/* 2. HİZMETLER */}
      <section className="container mx-auto py-16 md:py-24 px-6 relative z-20 -mt-12 md:-mt-24 bg-teal-50 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12">
          <div className="text-center md:text-left w-full md:w-auto">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-slate-900 mb-2`}>Uzmanlık Alanlarımız</h2>
            <p className="text-gray-500 text-sm md:text-base">Profesyonel çözümlerimizle yanınızdayız.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {hizmetler.map((hizmet: any) => {
            const ikonUrl = hizmet.ikon?.url || hizmet.ikon?.[0]?.url;
            const ikonSrc = ikonUrl?.startsWith('http') ? ikonUrl : `https://ezm-backend-production.up.railway.app${ikonUrl}`;

            return (
              <div key={hizmet.id} className="group bg-white p-6 md:p-8 rounded-3xl border border-teal-100 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden shadow-inner p-4 group-hover:bg-slate-100">
                  {ikonUrl ? (
                    <img src={ikonSrc} alt={hizmet.baslik} className="w-full h-full object-contain" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 md:w-16 md:h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">{hizmet.baslik}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3 text-sm">{hizmet.kisa_aciklama}</p>
                <Link href={`/hizmet/${hizmet.slug}`} className="mt-auto inline-flex items-center text-sm font-bold text-slate-900 group-hover:text-slate-600 transition-colors bg-gray-50 px-4 py-2 rounded-lg group-hover:bg-gray-200">
                  Detayları İncele →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. POPÜLER İLANLAR */}
      {ilanlar.length > 0 && (
      <section className="bg-teal-50 py-16 md:py-24 border-t border-teal-100">
        <div className="container mx-auto px-6">
            <div className="text-center mb-10 md:mb-16">
                <span className="text-teal-600 font-bold uppercase tracking-widest text-xs">Fırsatlar</span>
                <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-slate-900 mt-2`}>En Çok İlgilenilen İlanlar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ilanlar.map((ilan: any) => {
                    const kapak = ilan.gorseller?.[0]?.url;
                    const fiyat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(ilan.fiyat);
                    const imageSrc = kapak?.startsWith('http') ? kapak : `https://ezm-backend-production.up.railway.app${kapak}`;
                    
                    return (
                        <Link key={ilan.id} href={`/ilanlar/${ilan.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-teal-100 hover:shadow-xl transition-all">
                            <div className="h-56 md:h-64 relative overflow-hidden">
                                {kapak ? (
                                  <img 
                                      src={imageSrc} 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                ) : (<div className="w-full h-full bg-slate-200"></div>)}
                                <span className={`absolute top-3 left-3 text-white px-2 py-1 rounded text-xs font-bold ${ilan.Kategori === 'Satılık' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                    {ilan.Kategori}
                                </span>
                                <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-3 py-1 rounded-lg text-sm font-bold">{fiyat}</span>
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-slate-900 text-lg mb-2 truncate group-hover:text-teal-600 transition-colors">{ilan.baslik}</h4>
                                <div className="flex gap-4 text-sm text-slate-500">
                                    <span>{ilan.oda_sayisi}</span>
                                    <span>{ilan.metrekare} m²</span>
                                    <span>{ilan.konum}</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
            <div className="text-center mt-10 md:mt-12">
                <Link href="/ilanlar" className="inline-block px-8 py-3 border border-slate-300 rounded-full text-slate-700 font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-sm md:text-base">
                    Tüm İlanları Gör
                </Link>
            </div>
        </div>
      </section>
      )}

      {/* 4. POPÜLER MAKALELER */}
      {makaleler.length > 0 && (
      <section className="py-16 md:py-24 bg-teal-50 border-t border-teal-100">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12">
                <div className="text-center md:text-left w-full md:w-auto">
                    <span className="text-teal-600 font-bold uppercase tracking-widest text-xs">Bilgi Bankası</span>
                    <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold text-slate-900 mt-2`}>Popüler Yazılar</h2>
                </div>
                <Link href="/blog" className="hidden md:block text-slate-600 font-bold hover:text-teal-600">Tümünü Oku →</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {makaleler.map((blog: any) => {
                    const kapak = blog.kapak?.url;
                    const imageSrc = kapak?.startsWith('http') ? kapak : `https://ezm-backend-production.up.railway.app${kapak}`;
                    
                    return (
                        <Link key={blog.id} href={`/blog/${blog.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-teal-100">
                            <div className="h-48 relative overflow-hidden">
                                {kapak ? (
                                    <img src={imageSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                ) : (<div className="w-full h-full bg-slate-200"></div>)}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-slate-900">
                                    {formatDate(blog.tarih) || "Blog"}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className={`${playfair.className} text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors leading-tight line-clamp-2`}>
                                    {blog.baslik}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                                    {blog.ozet}
                                </p>
                                <span className="text-teal-600 text-xs font-bold uppercase tracking-wider">Devamını Oku</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
            <div className="md:hidden text-center mt-8">
                 <Link href="/blog" className="text-slate-600 font-bold hover:text-teal-600 border-b border-slate-300 pb-1">Tüm Yazıları Gör →</Link>
            </div>
        </div>
      </section>
      )}

      {/* 5. CTA (İLETİŞİM) */}
      <section className="bg-slate-900 py-16 md:py-24 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
         </div>
         <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className={`${playfair.className} text-3xl md:text-5xl font-bold text-white mb-6`}>
                Profesyonel Destek İçin Yanınızdayız
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 font-light">
                Adli bilişimden gayrimenkul yatırımına kadar tüm süreçlerde uzman ekibimizle tanışın.
            </p>
            <Link href="/iletisim">
                <button className="px-10 py-3 md:px-12 md:py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-500 transition shadow-lg hover:shadow-teal-500/30 text-base md:text-lg">
                    Bize Ulaşın
                </button>
            </Link>
         </div>
      </section>

    </main>
  );
}