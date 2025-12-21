import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6 font-sans">
      
      {/* Arka Plan Efekti */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
          {/* Büyük 404 Yazısı */}
          <h1 className="text-[10rem] font-bold text-slate-900 leading-none opacity-5 select-none">
              404
          </h1>
          
          <div className="-mt-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Aradığınız Sayfa Bulunamadı
              </h2>
              <p className="text-slate-500 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                  Gitmeye çalıştığınız sayfa taşınmış, silinmiş veya adresi yanlış yazılmış olabilir. Endişelenmeyin, sizi doğru yola sokalım.
              </p>

              {/* Yönlendirme Butonları */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/" 
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-slate-900/20"
                  >
                    Anasayfaya Dön
                  </Link>
                  <Link 
                    href="/ilanlar" 
                    className="px-8 py-3 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all"
                  >
                    İlanlara Göz At
                  </Link>
              </div>
          </div>
      </div>

      {/* Alt Bilgi */}
      <div className="absolute bottom-10 text-slate-400 text-sm">
          EZM Danışmanlık © {new Date().getFullYear()}
      </div>

    </div>
  );
}