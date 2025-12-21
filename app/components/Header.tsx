"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  // STATE'LER
  const [isOpen, setIsOpen] = useState(false); // Ana menü açık mı?
  const [isServicesOpen, setIsServicesOpen] = useState(false); // Mobilde hizmetler açık mı?
  
  const [globalData, setGlobalData] = useState<any>(null);
  const [menuLinks, setMenuLinks] = useState<any[]>([]);
  const [hizmetler, setHizmetler] = useState<any[]>([]);
  
  const pathname = usePathname();

  // VERİ ÇEKME
  useEffect(() => {
    async function fetchData() {
        try {
            const [resGlobal, resMenu, resHizmet] = await Promise.all([
                fetch("http://localhost:1337/api/global"),
                fetch("http://localhost:1337/api/menus?sort=sira:asc"),
                fetch("http://localhost:1337/api/hizmets")
            ]);

            const jsonGlobal = await resGlobal.json();
            const jsonMenu = await resMenu.json();
            const jsonHizmet = await resHizmet.json();

            setGlobalData(jsonGlobal.data);
            setMenuLinks(jsonMenu.data || []);
            setHizmetler(jsonHizmet.data || []);
        } catch (error) {
            console.error("Header veri hatası:", error);
        }
    }
    fetchData();
  }, []);

  // Sayfa değişince menüyü kapat
  useEffect(() => {
    setIsOpen(false);
    setIsServicesOpen(false);
  }, [pathname]);

  const siteIsmi = globalData?.site_ismi || "EZM Danışmanlık";

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-slate-900 shadow-xl border-b border-white/10 h-20">
      <div className="container mx-auto px-6 h-full flex justify-between items-center relative">
        
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-3 z-[1001]" onClick={() => setIsOpen(false)}>
          <div className="bg-white p-1 rounded-lg">
             <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-md" />
          </div>
          <div className="flex flex-col">
             <span className="text-white font-bold text-lg leading-none tracking-wide uppercase">
                {siteIsmi.split(" ")[0]} 
             </span>
             <span className="text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">
                {siteIsmi.split(" ").slice(1).join(" ")}
             </span>
          </div>
        </Link>

        {/* --- MASAÜSTÜ MENÜ (MD ve Üstü) - DEĞİŞMEDİ --- */}
        <nav className="hidden md:flex items-center gap-8">
            {menuLinks.map((link: any) => {
                if (link.baslik === "Hizmetler") {
                    return (
                        <div key={link.id} className="group relative py-6">
                            <button className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors flex items-center gap-1">
                                {link.baslik}
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                            <div className="absolute top-full -left-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                <div className="p-2 flex flex-col gap-1">
                                    {hizmetler.length > 0 ? hizmetler.map((h: any) => (
                                        <Link key={h.id} href={`/hizmet/${h.slug}`} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors">
                                            {h.baslik}
                                        </Link>
                                    )) : <span className="p-4 text-xs text-gray-400">Hizmet bulunamadı</span>}
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <Link key={link.id} href={link.url} className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                        {link.baslik}
                    </Link>
                )
            })}
            <Link href="/iletisim" className="px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-500 transition-all ml-4">
                İletişime Geç
            </Link>
        </nav>

        {/* --- MOBİL MENÜ BUTONU --- */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 z-[1001] focus:outline-none"
        >
            {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
        </button>

        {/* --- MOBİL MENÜ (SLIDE DOWN - Ünye Emlak Tarzı) --- */}
        <div className={`absolute top-full left-0 w-full bg-slate-900 border-t border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isOpen ? "max-h-[80vh] opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
            <div className="flex flex-col p-4 space-y-1 overflow-y-auto max-h-[75vh]">
                
                {menuLinks.map((link: any) => {
                    // HİZMETLER (Açılır/Kapanır)
                    if (link.baslik === "Hizmetler") {
                        return (
                            <div key={link.id} className="border-b border-white/5 last:border-0">
                                <button 
                                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                                    className="flex items-center justify-between w-full py-4 text-white font-bold text-sm uppercase tracking-wide hover:text-teal-400 transition-colors"
                                >
                                    <span>{link.baslik}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                                
                                {/* Alt Menü */}
                                <div className={`bg-slate-950/50 rounded-lg overflow-hidden transition-all duration-300 ${isServicesOpen ? 'max-h-96 py-2' : 'max-h-0 py-0'}`}>
                                    {hizmetler.map((h: any) => (
                                        <Link key={h.id} href={`/hizmet/${h.slug}`} className="block px-6 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-teal-500">
                                            {h.baslik}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    
                    // NORMAL LİNKLER
                    return (
                        <Link key={link.id} href={link.url} className="block py-4 text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 hover:text-teal-400 transition-colors">
                            {link.baslik}
                        </Link>
                    )
                })}

                {/* Buton */}
                <div className="pt-6 pb-2">
                    <Link href="/iletisim" className="flex items-center justify-center w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-all">
                        İletişime Geç
                    </Link>
                </div>

            </div>
        </div>

      </div>
    </header>
  );
}