"use client";

import { useState, useEffect } from "react";

export default function ImageGallery({ gorseller }: { gorseller: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Veri yoksa boş dön
  if (!gorseller || gorseller.length === 0) return null;

  // Ana görsel ve diğerleri
  const mainImage = gorseller[0]?.url;
  const otherImages = gorseller.slice(1);

  // Galeri açma fonksiyonu
  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Sayfa kaydırmayı kilitle
  };

  // Galeri kapatma fonksiyonu
  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset"; // Sayfa kaydırmayı aç
  };

  // Sonraki Fotoğraf
  const nextSrc = () => {
    setPhotoIndex((photoIndex + 1) % gorseller.length);
  };

  // Önceki Fotoğraf
  const prevSrc = () => {
    setPhotoIndex((photoIndex + gorseller.length - 1) % gorseller.length);
  };

  // Klavye Kontrolü (ESC ve Ok Tuşları)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextSrc();
      if (e.key === "ArrowLeft") prevSrc();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, photoIndex]);

  return (
    <>
      {/* --- MASAÜSTÜ/MOBİL GÖRÜNÜM (Izgara) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px]">
        
        {/* Sol Büyük Resim */}
        <div 
            className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden"
            onClick={() => openLightbox(0)}
        >
            {mainImage ? (
                <img 
                    src={`http://localhost:1337${mainImage}`} 
                    className="w-full h-full object-cover w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    alt="Ana Görsel"
                />
            ) : (
                <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-300">Görsel Yok</div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all transform translate-y-4 group-hover:translate-y-0">Büyüt</span>
            </div>
        </div>

        {/* Sağ Küçük Resimler */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2 h-full">
            {otherImages.slice(0, 4).map((img: any, index: number) => (
                <div 
                    key={index} 
                    className="relative h-full cursor-pointer group overflow-hidden"
                    onClick={() => openLightbox(index + 1)}
                >
                    <img 
                        src={`http://localhost:1337${img.url}`} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        alt={`Görsel ${index + 2}`}
                    />
                    {/* Son resimse ve daha fazla varsa üzerine sayı yaz */}
                    {index === 3 && gorseller.length > 5 && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-bold text-xl group-hover:bg-slate-900/80 transition-colors">
                            +{gorseller.length - 5}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* --- TAM EKRAN LIGHTBOX (MODAL) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center">
            
            {/* 1. KAPATMA BUTONU (X) - SAĞ ÜST KÖŞE */}
            <button 
                onClick={closeLightbox}
                className="absolute top-6 right-6 z-[10000] p-3 bg-white/10 text-white rounded-full hover:bg-red-600 hover:rotate-90 transition-all duration-300 border border-white/20 backdrop-blur-md group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Kapat (ESC)</span>
            </button>

            {/* 2. SOL OK (ÖNCEKİ) */}
            <button 
                onClick={(e) => { e.stopPropagation(); prevSrc(); }}
                className="absolute left-4 md:left-10 z-50 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* 3. ANA GÖRSEL */}
            <div className="relative max-w-7xl max-h-[85vh] w-full h-full p-4 flex items-center justify-center">
                <img 
                    src={`http://localhost:1337${gorseller[photoIndex].url}`} 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                    alt="Büyük Görsel"
                />
                
                {/* Alt Bilgi: 1 / 5 */}
                <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/80 font-mono text-sm tracking-widest bg-black/50 px-4 py-1 rounded-full">
                    {photoIndex + 1} / {gorseller.length}
                </div>
            </div>

            {/* 4. SAĞ OK (SONRAKİ) */}
            <button 
                onClick={(e) => { e.stopPropagation(); nextSrc(); }}
                className="absolute right-4 md:right-10 z-50 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>

        </div>
      )}
    </>
  );
}