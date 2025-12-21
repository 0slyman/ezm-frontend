"use client";

import { useState } from "react";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function IletisimPage() {
  const [formData, setFormData] = useState({ ad: "", email: "", mesaj: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("http://localhost:1337/api/iletisims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      if (!res.ok) throw new Error("Hata");

      setStatus("success");
      setFormData({ ad: "", email: "", mesaj: "" });
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-teal-50 pt-32 pb-20 px-6">
      
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
            <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-slate-900 mb-4`}>Bize Ulaşın</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Sorularınız, iş birlikleriniz veya danışmanlık talepleriniz için aşağıdaki formu doldurabilir veya iletişim bilgilerimizden bize ulaşabilirsiniz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100">
            
            {/* SOL TARAF - İLETİŞİM BİLGİLERİ */}
            <div className="bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
                
                <div className="relative z-10 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-teal-400">İletişim Bilgileri</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">📍</div>
                                <div>
                                    <p className="font-bold text-lg">Adres</p>
                                    <p className="text-slate-400 text-sm">FEVZİCAKMAK MAH.KENİTRA CAD.10662, SOK DOĞU TİCARET MERKEZİ NO22/D B BLOK<br/>42210 Karatay/Konya</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">📞</div>
                                <div>
                                    <p className="font-bold text-lg">Telefon</p>
                                    <p className="text-slate-400 text-sm">90544 721 1523</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">📧</div>
                                <div>
                                    <p className="font-bold text-lg">E-Posta</p>
                                    <p className="text-slate-400 text-sm">info@ezmdanismanlik.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-12">
                     <p className="text-slate-500 text-xs">Çalışma Saatleri: Pazartesi - Cumartesi / 09:00 - 18:00</p>
                </div>
            </div>

            {/* SAĞ TARAF - FORM */}
            <div className="p-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Mesaj Gönderin</h3>
                
                {status === "success" ? (
                    <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center">
                        <p className="font-bold text-lg">Mesajınız Alındı! 🎉</p>
                        <p className="text-sm mt-2">En kısa sürede size dönüş yapacağız.</p>
                        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-bold underline">Yeni Mesaj Gönder</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Adınız Soyadınız</label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-4 bg-teal-50 border border-teal-100 rounded-xl focus:border-teal-500 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-500 font-medium"
                                placeholder="Örn: Ahmet Yılmaz"
                                value={formData.ad}
                                onChange={(e) => setFormData({...formData, ad: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresiniz</label>
                            <input 
                                type="email" 
                                required
                                className="w-full p-4 bg-teal-50 border border-teal-100 rounded-xl focus:border-teal-500 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-500 font-medium"
                                placeholder="ahmet@ornek.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Mesajınız</label>
                            <textarea 
                                required
                                rows={4}
                                className="w-full p-4 bg-teal-50 border border-teal-100 rounded-xl focus:border-teal-500 focus:bg-white transition-all outline-none resize-none text-slate-900 placeholder:text-slate-500 font-medium"
                                placeholder="Size nasıl yardımcı olabiliriz?"
                                value={formData.mesaj}
                                onChange={(e) => setFormData({...formData, mesaj: e.target.value})}
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={status === "loading"}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-teal-600 transition-all shadow-lg disabled:opacity-50"
                        >
                            {status === "loading" ? "Gönderiliyor..." : "Mesajı Gönder"}
                        </button>
                        {status === "error" && <p className="text-red-500 text-sm font-bold text-center">Bir hata oluştu. Lütfen tekrar deneyin.</p>}
                    </form>
                )}
            </div>
        </div>
      </div>
    </main>
  );
}