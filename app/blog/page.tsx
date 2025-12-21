import Link from "next/link";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

async function getMakaleler() {
  try {
    const res = await fetch("https://ezm-backend-production.up.railway.app/api/makales?populate=*&sort=publishedAt:desc", { cache: 'no-store' });
    if (!res.ok) throw new Error("Hata");
    return res.json();
  } catch (error) { return { data: [] }; }
}

function formatDate(dateString: string) {
    if (!dateString) return "";
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
}

export default async function BlogPage() {
  const data = await getMakaleler();
  const makaleler = data.data;

  return (
    // DÜZELTME: Arka plan bg-teal-50
    <main className="min-h-screen bg-teal-50 font-sans pt-32 pb-20">
      
      <div className="container mx-auto px-6 text-center mb-16">
        <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2 block">Güncel Bilgiler</span>
        <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold text-slate-900 mb-6`}>Blog & Haberler</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Sektörel gelişmeler, hukuki bilgilendirmeler ve gayrimenkul dünyasından en son haberler.</p>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {makaleler.map((blog: any) => {
                const kapak = blog.kapak?.url;
                return (
                    // Kart Border teal-100
                    <Link key={blog.id} href={`/blog/${blog.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-teal-100 flex flex-col h-full">
                        <div className="h-56 relative overflow-hidden">
                            {kapak ? (
                                <img src={`https://ezm-backend-production.up.railway.app${kapak}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            ) : (<div className="w-full h-full bg-teal-100"></div>)}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                                {formatDate(blog.publishedAt)}
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className={`${playfair.className} text-xl md:text-2xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors leading-tight`}>
                                {blog.baslik}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                {blog.ozet}
                            </p>
                            <span className="mt-auto flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                                Devamını Oku 
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </div>
                    </Link>
                )
            })}
        </div>
      </div>
    </main>
  );
}