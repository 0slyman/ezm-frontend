"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function IlanlarPage() {
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // FİLTRE STATE'LERİ
  const [filters, setFilters] = useState({
    durum: "Tümü",      
    emlakTipi: "Tümü",  
    konum: "Tümü",      
    minFiyat: "",
    maxFiyat: ""
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://ezm-backend-production.up.railway.app/api/ilans?populate=*&sort=publishedAt:desc");
        const json = await res.json();
        setIlanlar(json.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // FİLTRELEME MANTIĞI
  const filteredIlanlar = ilanlar.filter((ilan) => {
    if (filters.durum !== "Tümü" && ilan.Kategori !== filters.durum) return false;
    if (filters.emlakTipi !== "Tümü" && ilan.emlak_tipi !== filters.emlakTipi) return false;
    if (filters.konum !== "Tümü" && !ilan.konum?.includes(filters.konum)) return false;
    const fiyat = ilan.fiyat;
    const min = filters.minFiyat ? parseInt(filters.minFiyat) : 0;
    const max = filters.maxFiyat ? parseInt(filters.maxFiyat) : Infinity;
    if (fiyat < min || fiyat > max) return false;
    return true;
  });

  const konumListesi = Array.from(new Set(ilanlar.map(i => i.konum?.split("/")[0]?.trim() || i.konum).filter(Boolean)));

  return (
    <main className="min-h-screen bg-teal-50 font-sans pt-28 pb-12">
      
      {/* BAŞLIK */}
      <div className="container mx-auto px-6 mb-8 text-center">
        <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-slate-900 mb-4`}>Tüm İlanlar</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Hayalinizdeki gayrimenkulü bulmak için aşağıdaki filtreleri kullanabilirsiniz.</p>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR */}
            <div className="lg:col-span-1 h-fit lg:sticky lg:top-28 z-30">
                <button 
                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                    className="lg:hidden w-full py-3 bg-slate-900 text-white rounded-xl font-bold mb-4 flex items-center justify-center gap-2 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    {showMobileFilter ? "Filtreleri Gizle" : "Detaylı Arama / Filtrele"}
                </button>

                {/* Filtre Kutusu */}
                <div className={`bg-white p-6 rounded-2xl shadow-lg border border-teal-100 ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 text-lg">Detaylı Arama</h3>
                        <button 
                            onClick={() => setFilters({ durum: "Tümü", emlakTipi: "Tümü", konum: "Tümü", minFiyat: "", maxFiyat: "" })}
                            className="text-xs text-red-500 font-bold hover:underline"
                        >
                            Temizle
                        </button>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">İlan Durumu</label>
                            <select 
                                className="w-full p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm focus:border-teal-500 outline-none text-slate-900 font-medium"
                                value={filters.durum}
                                onChange={e => setFilters({...filters, durum: e.target.value})}
                            >
                                <option value="Tümü">Tümü</option>
                                <option value="Satılık">Satılık</option>
                                <option value="Kiralık">Kiralık</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Emlak Tipi</label>
                            <select 
                                className="w-full p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm focus:border-teal-500 outline-none text-slate-900 font-medium"
                                value={filters.emlakTipi}
                                onChange={e => setFilters({...filters, emlakTipi: e.target.value})}
                            >
                                <option value="Tümü">Tümü</option>
                                <option value="Daire">Daire</option>
                                <option value="Villa">Villa</option>
                                <option value="Arsa">Arsa</option>
                                <option value="İşyeri">İşyeri</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Konum</label>
                            <select 
                                className="w-full p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm focus:border-teal-500 outline-none text-slate-900 font-medium"
                                value={filters.konum}
                                onChange={e => setFilters({...filters, konum: e.target.value})}
                            >
                                <option value="Tümü">Tümü</option>
                                {konumListesi.map((k: any, i) => (
                                    <option key={i} value={k}>{k}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fiyat Aralığı (TL)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    className="w-full p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                                    value={filters.minFiyat}
                                    onChange={e => setFilters({...filters, minFiyat: e.target.value})}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    className="w-full p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                                    value={filters.maxFiyat}
                                    onChange={e => setFilters({...filters, maxFiyat: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-teal-600 transition shadow-lg text-sm mt-2"
                            onClick={() => setShowMobileFilter(false)} 
                        >
                            Sonuçları Göster ({filteredIlanlar.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* İLAN LİSTESİ */}
            <div className="lg:col-span-3">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
                ) : filteredIlanlar.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredIlanlar.map((ilan: any) => {
                            const kapak = ilan.gorseller?.[0]?.url;
                            const fiyat = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(ilan.fiyat);
                            return (
                                <Link key={ilan.id} href={`/ilanlar/${ilan.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                    <div className="h-60 relative overflow-hidden">
                                        {kapak ? (
                                            <img src={`https://ezm-backend-production.up.railway.app${kapak}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                        ) : (<div className="w-full h-full bg-teal-100"></div>)}
                                        <span className={`absolute top-3 left-3 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${ilan.Kategori === 'Satılık' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                            {ilan.Kategori}
                                        </span>
                                        <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-sm backdrop-blur-sm">
                                            {fiyat}
                                        </span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h4 className="font-bold text-slate-900 text-lg mb-2 truncate group-hover:text-teal-600 transition-colors">
                                            {ilan.baslik}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {ilan.konum}
                                        </div>
                                        <div className="flex gap-3 mt-auto pt-4 border-t border-teal-50">
                                            <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-teal-50 px-2 py-1 rounded">
                                                🏠 {ilan.emlak_tipi}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-teal-50 px-2 py-1 rounded">
                                                📐 {ilan.metrekare} m²
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-teal-50 px-2 py-1 rounded">
                                                🚪 {ilan.oda_sayisi}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-teal-200">
                        <p className="text-slate-500 font-bold text-lg">Bu kriterlere uygun ilan bulunamadı.</p>
                        <button 
                            onClick={() => setFilters({ durum: "Tümü", emlakTipi: "Tümü", konum: "Tümü", minFiyat: "", maxFiyat: "" })}
                            className="mt-4 px-6 py-2 bg-teal-50 text-teal-700 rounded-full font-bold text-sm hover:bg-teal-100 transition"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </div>

        </div>
      </div>
    </main>
  );
}