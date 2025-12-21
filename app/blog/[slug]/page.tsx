import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import BlogInteraction from "../../components/BlogInteraction"; 
import ShareButtons from "../../components/ShareButtons";
import ViewCounter from "../../components/ViewCounter";
import { Metadata } from "next";
import ReactMarkdown from 'react-markdown'; 

const playfair = Playfair_Display({ subsets: ['latin'] });

// --- YARDIMCI FONKSİYONLAR ---
function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

// URL DÜZELTİCİ
function getFullUrl(url: string) {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://ezm-backend-production.up.railway.app${url}`;
}

// --- VERİ ÇEKME FONKSİYONLARI ---
async function getMakale(slug: string) {
  try {
    const res = await fetch(`https://ezm-backend-production.up.railway.app/api/makales?filters[slug][$eq]=${slug}&populate=*`, { cache: 'no-store' });
    const json = await res.json();
    return json.data?.[0]; 
  } catch (error) { return null; }
}

async function getSidebarData(currentSlug: string) {
  try {
    const resBlog = await fetch(`https://ezm-backend-production.up.railway.app/api/makales?filters[slug][$ne]=${currentSlug}&pagination[limit]=3&populate=*`, { cache: 'no-store' });
    const jsonBlog = await resBlog.json();

    const resIlan = await fetch(`https://ezm-backend-production.up.railway.app/api/ilans?pagination[limit]=3&populate=*`, { cache: 'no-store' });
    const jsonIlan = await resIlan.json();

    return { otherBlogs: jsonBlog.data || [], listings: jsonIlan.data || [] };
  } catch (error) { return { otherBlogs: [], listings: [] }; }
}

// --- SEO: DİNAMİK METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const makale = await getMakale(resolvedParams.slug);

  if (!makale) return { title: "Makale Bulunamadı" };

  const kapakUrl = getFullUrl(makale.kapak?.url);

  return {
    title: makale.baslik,
    description: makale.ozet,
    openGraph: {
      title: makale.baslik,
      description: makale.ozet,
      type: "article",
      publishedTime: makale.publishedAt,
      authors: ["EZM Danışmanlık"],
      images: kapakUrl ? [{ url: kapakUrl }] : [],
    },
  };
}

// --- ZENGİN METİN GÖSTERİCİ (Markdown & Blocks Desteği) ---
function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;

  // EĞER İÇERİK BİR DİZİ DEĞİLSE (Yani Markdown String ise)
  if (!Array.isArray(content)) {
      return (
        <div className="markdown-content text-slate-700 leading-relaxed text-lg space-y-6">
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-l-4 border-teal-500 pl-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-900 mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-4 bg-slate-50 p-6 rounded-xl border border-slate-100" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="pl-2" {...props} />,
                    a: ({node, ...props}) => <a className="text-teal-600 underline font-bold hover:text-teal-800" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-teal-500 pl-6 italic text-slate-600 bg-teal-50 py-4 pr-4 rounded-r-xl my-8" {...props} />,
                    img: ({node, ...props}) => <img className="rounded-xl shadow-lg w-full my-6 border border-gray-100" {...props} />,
                }}
            >
                {String(content)}
            </ReactMarkdown>
        </div>
      );
  }

  // EĞER İÇERİK JSON BLOCKS İSE (Yedek)
  return (
    <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
      {content.map((block: any, index: number) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index}>
              {block.children?.map((child: any, i: number) => {
                 if (child.bold) return <strong key={i} className="font-bold text-slate-900">{child.text}</strong>;
                 if (child.italic) return <em key={i} className="italic">{child.text}</em>;
                 if (child.underline) return <u key={i}>{child.text}</u>;
                 if (child.type === 'link') return <a key={i} href={child.url} className="text-teal-600 underline font-medium hover:text-teal-800 transition">{child.children?.[0]?.text}</a>;
                 return <span key={i}>{child.text}</span>;
              })}
            </p>
          );
        }
        if (block.type === 'heading') {
            const Tag: any = `h${block.level}`; 
            return <Tag key={index} className={`font-bold text-slate-900 mt-10 mb-4 leading-tight ${block.level === 2 ? 'text-2xl border-l-4 border-teal-500 pl-4' : 'text-xl'}`}>{block.children?.[0]?.text}</Tag>;
        }
        if (block.type === 'list') {
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
            return (
                <ListTag key={index} className="list-inside list-disc pl-4 space-y-2 marker:text-teal-500 bg-slate-50 p-6 rounded-xl border border-slate-100 my-6">
                    {block.children?.map((item: any, i: number) => (
                        <li key={i}>{item.children?.[0]?.text}</li>
                    ))}
                </ListTag>
            );
        }
        if (block.type === 'image') {
            const imgUrl = getFullUrl(block.image.url);
            return (
                <div key={index} className="my-8">
                    <img src={imgUrl || ""} alt={block.image.alternativeText || 'Blog görseli'} className="rounded-2xl w-full object-cover shadow-lg border border-gray-100" />
                    {block.image.caption && <p className="text-center text-sm text-gray-500 mt-2 italic">{block.image.caption}</p>}
                </div>
            );
        }
        if (block.type === 'quote') {
             return <blockquote key={index} className="border-l-4 border-teal-500 pl-6 italic text-slate-600 bg-teal-50 py-4 pr-4 rounded-r-xl my-8 text-xl font-serif">"{block.children?.[0]?.text}"</blockquote>
        }
        return null;
      })}
    </div>
  );
}

// --- BREADCRUMB BİLEŞENİ ---
function Breadcrumb({ title }: { title: string }) {
    return (
      <nav className="flex text-sm font-medium text-slate-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="hover:text-slate-800 transition">Anasayfa</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-1 text-gray-400">/</span>
              <Link href="/blog" className="hover:text-slate-800 transition">Blog</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-1 text-gray-400">/</span>
              <span className="text-slate-900 font-semibold truncate max-w-[150px] md:max-w-xs">{title}</span>
            </div>
          </li>
        </ol>
      </nav>
    );
}

// --- ANA SAYFA BİLEŞENİ ---
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const makale = await getMakale(resolvedParams.slug);
  
  if (!makale) return <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50 text-slate-500">Makale bulunamadı veya yüklenemedi.</div>;

  const { otherBlogs, listings } = await getSidebarData(resolvedParams.slug);
  const kapak = getFullUrl(makale.kapak?.url);

  // SEO: SCHEMA.ORG JSON-LD (Article)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: makale.baslik,
    description: makale.ozet,
    image: kapak || undefined,
    datePublished: makale.publishedAt,
    author: { '@type': 'Organization', name: 'EZM Danışmanlık', url: 'https://www.ezm-danismanlik.com' },
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.ezm-danismanlik.com/blog/${makale.slug}`
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Schema Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* --- HERO ALANI (MEVLANA/ŞEHİR KONSEPTİ) --- */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden bg-slate-900">
        
        {/* ARKA PLAN GÖRSELİ */}
        <div className="absolute inset-0 z-0">
             <img 
                src="/bg.jpg" 
                alt="Kurumsal Arka Plan" 
                className="w-full h-full object-cover object-center grayscale-[20%]" 
             />
             <div className="absolute inset-0 bg-slate-950/75"></div>
        </div>
        
        {/* İÇERİK */}
        <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center pt-10">
            
            <span className="px-4 py-1.5 bg-white/10 border border-white/20 text-teal-300 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                Blog & Haberler
            </span>

            <h1 className={`${playfair.className} text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-wide drop-shadow-2xl leading-tight max-w-5xl`}>
                {makale.baslik}
            </h1>

            <div className="flex items-center gap-6 text-slate-300 text-sm font-medium bg-slate-900/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {formatDate(makale.tarih)}
                </span>
                <span className="w-1 h-1 bg-teal-500 rounded-full"></span>
                <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    EZM Editör
                </span>
            </div>
        </div>
      </section>

      {/* --- ANA İÇERİK ALANI --- */}
      <section className="container mx-auto px-6 py-12 -mt-24 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* SOL KOLON: MAKALE İÇERİĞİ */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-gray-100">
                    <Breadcrumb title={makale.baslik} />

                    {/* Makale Kapak Görseli */}
                    {kapak && (
                        <div className="h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg mb-10 border border-gray-100">
                            <img src={kapak} alt={makale.baslik} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"/>
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none text-slate-700">
                        {/* Özet */}
                        {makale.ozet && (
                             <p className="text-xl font-medium text-slate-600 border-l-4 border-teal-500 pl-6 mb-8 italic bg-gray-50 py-4 rounded-r-xl">
                                {makale.ozet}
                             </p>
                        )}
                        {/* İçerik (Markdown Render) */}
                        <RichTextRenderer content={makale.icerik || []} />
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <p className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                            Bu yazıyı paylaşın
                        </p>
                        <ShareButtons title={makale.baslik} />
                    </div>
                </div>

                <div className="mt-8">
                    <BlogInteraction makaleId={makale.id} />
                </div>
            </div>


            {/* SAĞ KOLON: SIDEBAR */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* Diğer Yazılar Widget */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <h3 className={`${playfair.className} text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-gray-200`}>
                        Diğer Yazılar
                    </h3>
                    <div className="space-y-6">
                        {otherBlogs.length > 0 ? otherBlogs.map((blog: any) => {
                            const bKapak = getFullUrl(blog.kapak?.url);
                            return (
                                <Link key={blog.id} href={`/blog/${blog.slug}`} className="group flex gap-4 items-start">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                        {bKapak && <img src={bKapak} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 leading-snug group-hover:text-teal-600 transition-colors line-clamp-2 text-sm">
                                            {blog.baslik}
                                        </h4>
                                        <span className="text-xs text-teal-600 mt-1 block font-medium">Oku →</span>
                                    </div>
                                </Link>
                            );
                        }) : <p className="text-sm text-gray-400">Başka yazı bulunamadı.</p>}
                    </div>
                </div>

                {/* İletişim CTA Widget */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden text-center shadow-xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <h3 className={`${playfair.className} text-2xl font-bold mb-4`}>Sorularınız mı var?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Hukuki süreçlerinizde veya danışmanlık ihtiyaçlarınızda size yardımcı olmaya hazırız.
                        </p>
                        <Link href="/iletisim" className="inline-block w-full py-3.5 bg-teal-600 rounded-xl font-bold hover:bg-teal-500 transition shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                            Bize Ulaşın
                        </Link>
                    </div>
                </div>

                {/* Fırsat İlanlar Widget */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                    <h3 className={`${playfair.className} text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-gray-200`}>
                        Fırsat İlanlar
                    </h3>
                    <div className="space-y-5">
                        {listings.map((ilan: any) => {
                             const fiyat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(ilan.fiyat);
                             const iKapak = getFullUrl(ilan.gorseller?.[0]?.url);
                             return (
                                <Link key={ilan.id} href={`/ilanlar/${ilan.slug}`} className="block group bg-gray-50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-teal-200">
                                    <div className="h-36 rounded-lg overflow-hidden relative mb-3">
                                        {iKapak ? (
                                            <img src={iKapak} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                        ) : (<div className="w-full h-full bg-gray-200"></div>)}
                                        <span className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded shadow-sm">{fiyat}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors text-sm">{ilan.baslik}</h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        {ilan.konum}
                                    </p>
                                </Link>
                             )
                        })}
                    </div>
                    <Link href="/ilanlar" className="block text-center mt-6 text-sm font-bold text-slate-400 hover:text-teal-600 transition uppercase tracking-wider">Tüm İlanları Gör →</Link>
                </div>

            </div>
        </div>
      </section>
      
      <ViewCounter 
          id={makale.id} 
          collection="makales" 
          currentViews={makale.goruntulenme} 
      />
    </main>
  );
}