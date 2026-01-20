"use client";

import { useState } from "react";
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function IlanPageClient({ initialIlanlar }: { initialIlanlar: any[] }) {
  const [ilanlar, setIlanlar] = useState(initialIlanlar);
  
  // FİLTRE STATE'İ
  const [filters, setFilters] = useState({
    durum: "Hepsi",      // Strapi'deki: Kategori (Satılık/Kiralık)
    tip: "Hepsi",        // Strapi'deki: emlak_tipi (Daire/Villa)
    konum: "Hepsi",
    oda: "Hepsi",        // Strapi'deki: oda_sayisi
    minFiyat: "",
    maxFiyat: "",
  });

  // SEÇENEKLERİ ÇEKME
  const durumlar = Array.from(new Set(initialIlanlar.map(i => i.Kategori).filter(Boolean)));
  const tipler = Array.from(new Set(initialIlanlar.map(i => i.emlak_tipi).filter(Boolean)));
  const konumlar = Array.from(new Set(initialIlanlar.map(i => i.konum).filter(Boolean)));
  const odalar = Array.from(new Set(initialIlanlar.map(i => i.oda_sayisi).filter(Boolean))).sort();

  // FİLTRELEME FONKSİYONU
  const handleSearch = () => {
    let result = initialIlanlar;

    // 1. Durum (Kategori: Satılık/Kiralık)
    if (filters.durum !== "Hepsi") {
        result = result.filter((i: any) => i.Kategori === filters.durum);
    }

    // 2. Emlak Tipi (emlak_tipi: Daire/Arsa)
    if (filters.tip !== "Hepsi") {
        result = result.filter((i: any) => i.emlak_tipi === filters.tip);
    }

    // 3. Konum
    if (filters.konum !== "Hepsi") {
        result = result.filter((i: any) => i.konum?.includes(filters.konum));
    }

    // 4. Oda Sayısı
    if (filters.oda !== "Hepsi") {
        result = result.filter((i: any) => i.oda_sayisi === filters.oda);
    }

    // 5. Fiyat
    if (filters.minFiyat) {
        result = result.filter((i: any) => i.fiyat >= Number(filters.minFiyat));
    }
    if (filters.maxFiyat) {
        result = result.filter((i: any) => i.fiyat <= Number(filters.maxFiyat));
    }

    setIlanlar(result);
  };

  const resetFilters = () => {
      setFilters({durum:"Hepsi", tip:"Hepsi", konum:"Hepsi", oda:"Hepsi", minFiyat:"", maxFiyat:""});
      setIlanlar(initialIlanlar);
  }

  return (
    <div className="container mx-auto py-12 px-6 relative z-20 -mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- SOL TARAFTAKİ FİLTRE --- */}
            <div className="w-full lg:w-1/4 h-fit sticky top-28 z-30">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="bg-slate-900 p-4 flex justify-between items-center">
                        <h3 className="text-white font-bold text-lg">Detaylı Arama</h3>
                        <button onClick={resetFilters} className="text-xs text-slate-300 hover:text-white underline">Temizle</button>
                    </div>
                    
                    <div className="p-5 flex flex-col gap-4">
                        {/* İlan Durumu */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">İlan Durumu</label>
                            <select 
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-slate-700 bg-gray-50"
                                onChange={(e) => setFilters({...filters, durum: e.target.value})}
                                value={filters.durum}
                            >
                                <option value="Hepsi">Tümü</option>
                                {durumlar.map((d: any, index) => <option key={index} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Emlak Tipi */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Emlak Tipi</label>
                            <select 
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-slate-700 bg-gray-50"
                                onChange={(e) => setFilters({...filters, tip: e.target.value})}
                                value={filters.tip}
                            >
                                <option value="Hepsi">Tümü</option>
                                {tipler.map((t: any, index) => <option key={index} value={t}>{t}</option>)}
                            </select>
                        </div>

                        {/* Konum */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Konum</label>
                            <select 
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-slate-700 bg-gray-50"
                                onChange={(e) => setFilters({...filters, konum: e.target.value})}
                                value={filters.konum}
                            >
                                <option value="Hepsi">Tümü</option>
                                {konumlar.map((k: any, index) => <option key={index} value={k}>{k}</option>)}
                            </select>
                        </div>

                        {/* Fiyat Aralığı */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fiyat Aralığı (TL)</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min" className="w-1/2 p-2.5 border border-gray-300 rounded-lg bg-gray-50"
                                    value={filters.minFiyat} onChange={(e) => setFilters({...filters, minFiyat: e.target.value})} />
                                <input type="number" placeholder="Max" className="w-1/2 p-2.5 border border-gray-300 rounded-lg bg-gray-50"
                                    value={filters.maxFiyat} onChange={(e) => setFilters({...filters, maxFiyat: e.target.value})} />
                            </div>
                        </div>

                        <button onClick={handleSearch} className="mt-2 w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition shadow-lg">
                            Sonuçları Filtrele
                        </button>
                    </div>
                </div>
            </div>


            {/* --- SAĞ TARAFTAKİ LİSTE --- */}
            <div className="w-full lg:w-3/4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {ilanlar.map((ilan: any) => {
                    const kapakResmi = ilan.gorseller?.[0]?.url || ilan.gorseller?.url; 
                    const formatliFiyat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(ilan.fiyat);

                    return (
                    <div key={ilan.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
                        
                        <div className="relative h-60 w-full overflow-hidden">
                            {/* 🔥 SATILDI ETİKETİ - DAMGA MODU 🔥 */}
                            {ilan.satildi && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px]">
                                    <div className="bg-red-600 text-white text-lg font-bold px-6 py-2 -rotate-12 shadow-2xl border-2 border-white tracking-widest uppercase transform group-hover:scale-110 transition-transform duration-300">
                                        SATILDI
                                    </div>
                                </div>
                            )}
                            {/* 🔥 SATILDI BİTİŞ 🔥 */}

                            {kapakResmi ? (
                                <img src={`https://ezm-backend-production.up.railway.app${kapakResmi}`} alt={ilan.baslik} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                            ) : ( <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">Görsel Yok</div> )}
                            
                            {/* Kategori Etiketi */}
                            {ilan.Kategori && (
                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-md font-bold text-xs shadow-sm text-white ${ilan.Kategori === 'Satılık' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                    {ilan.Kategori}
                                </div>
                            )}

                            {/* Fiyat Etiketi */}
                            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg font-bold shadow-md text-sm">
                                {formatliFiyat}
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    {ilan.konum}
                                </span>
                                {ilan.emlak_tipi && (
                                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-100 uppercase">
                                        {ilan.emlak_tipi}
                                    </span>
                                )}
                            </div>

                            <h3 className={`${playfair.className} text-lg font-bold text-slate-900 mb-4 group-hover:text-teal-700 transition-colors line-clamp-2 min-h-[3.5rem]`}>
                                {ilan.baslik}
                            </h3>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-600 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2"><span className="font-semibold text-slate-800">{ilan.metrekare} m²</span></div>
                                <div className="flex items-center gap-2"><span className="font-semibold text-slate-800">{ilan.oda_sayisi}</span></div>
                                {ilan.isitma && <div className="col-span-2"><span className="text-slate-500">Isıtma:</span> <span className="font-semibold text-slate-800">{ilan.isitma}</span></div>}
                            </div>

                            <Link href={`/ilanlar/${ilan.slug}`} className="mt-auto w-full block text-center py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all duration-300 text-sm">
                                İlanı İncele
                            </Link>
                        </div>
                    </div>
                    );
                })}

                {ilanlar.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-400 text-lg">Aradığınız kriterlere uygun ilan bulunamadı.</p>
                        <button onClick={resetFilters} className="mt-4 text-slate-900 font-semibold hover:underline">Filtreleri Temizle</button>
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>
  );
}