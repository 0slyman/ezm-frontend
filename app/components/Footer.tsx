import Link from "next/link";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

async function getGlobalData() {
  try {
    const res = await fetch("https://ezm-backend-production.up.railway.app/api/global", { cache: 'no-store' });
    const json = await res.json();
    return json.data;
  } catch (error) { return null; }
}

export default async function Footer() {
  const global = await getGlobalData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 font-sans">
      <div className="container mx-auto px-6">
        
        {/* ÜST KISIM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Marka */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-lg">
                    <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-md" />
                </div>
                <h2 className={`${playfair.className} text-2xl font-bold text-white uppercase`}>
                    {global?.site_ismi || "EZM Danışmanlık"}
                </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
                Adli Bilişim, Hukuk ve Gayrimenkul süreçlerinizde; gerçeği aydınlatan, hakkaniyeti koruyan ve mülkünüze değer katan çözüm ortağınız.
            </p>
            
            {/* Sosyal Medya İkonları (Dinamik ve SVG'li) */}
            <div className="flex gap-4">
                {/* Facebook */}
                {global?.facebook && (
                    <Link href={global.facebook} target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </Link>
                )}
                
                {/* Twitter / X */}
                {global?.twitter && (
                    <Link href={global.twitter} target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-black hover:text-white transition-all group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </Link>
                )}
                
                {/* Instagram */}
                {global?.instagram && (
                    <Link href={global.instagram} target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </Link>
                )}
                
                {/* LinkedIn */}
                {global?.linkedin && (
                    <Link href={global.linkedin} target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 5.432-5.17 5.432 0v8.306h5v-10.5c0-5.352-5.19-7-7-2.975v-2.525z"/></svg>
                    </Link>
                )}
            </div>
          </div>

          {/* 2. Hizmetler */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-teal-500/30 pb-2 inline-block">Hizmetlerimiz</h3>
            <ul className="space-y-4 text-sm">
                <li><Link href="/hizmet/adli-bilisim-danismanligi" className="hover:text-teal-400 transition-colors">Adli Bilişim</Link></li>
                <li><Link href="/hizmet/ticaret-hukuku-danismanligi" className="hover:text-teal-400 transition-colors">Ticaret Hukuku</Link></li>
                <li><Link href="/hizmet/gayrimenkul-danismanligi" className="hover:text-teal-400 transition-colors">Gayrimenkul</Link></li>
                <li><Link href="/hizmet/vaka-analiz-danismanligi" className="hover:text-teal-400 transition-colors">Vaka Analiz</Link></li>
            </ul>
          </div>

          {/* 3. Kurumsal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b border-teal-500/30 pb-2 inline-block">Kurumsal</h3>
            <ul className="space-y-4 text-sm">
                <li><Link href="/" className="hover:text-teal-400 transition-colors">Anasayfa</Link></li>
                <li><Link href="/ilanlar" className="hover:text-teal-400 transition-colors">Güncel İlanlar</Link></li>
                <li><Link href="/blog" className="hover:text-teal-400 transition-colors">Blog & Makaleler</Link></li>
                <li><Link href="/iletisim" className="hover:text-teal-400 transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* 4. İletişim (Dinamik) */}
          <div id="iletisim">
            <h3 className="text-white font-bold text-lg mb-6 border-b border-teal-500/30 pb-2 inline-block">Bize Ulaşın</h3>
            <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{global?.adres || "Adres bilgisi yüklenemedi."}</span>
                </li>
                <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <a href={`mailto:${global?.email}`} className="hover:text-white transition-colors">{global?.email || "info@example.com"}</a>
                </li>
                <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <a href={`tel:${global?.telefon}`} className="hover:text-white transition-colors">{global?.telefon || "+90 000 000 00 00"}</a>
                </li>
            </ul>
          </div>

        </div>

        {/* ALT KISIM */}
        <div className="border-t border-slate-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© {currentYear} {global?.site_ismi}. Tüm hakları saklıdır.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}