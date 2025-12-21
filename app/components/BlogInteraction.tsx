"use client";
import { useState, useEffect } from "react";

export default function BlogInteraction({ makaleId }: { makaleId: number }) {
  // BEĞENİ & ALKIŞ STATE'LERİ
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [claps, setClaps] = useState(0);
  const [hasClapped, setHasClapped] = useState(false);
  
  // YORUM STATE'LERİ (Email eklendi)
  const [comment, setComment] = useState({ name: "", email: "", text: "" });
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. MEVCUT YORUMLARI ÇEK
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`http://localhost:1337/api/yorums?filters[makale][id][$eq]=${makaleId}&sort=tarih:desc`);
        const json = await res.json();
        setCommentsList(json.data || []);
      } catch (err) {
        console.error("Yorumlar çekilemedi", err);
      }
    }
    if (makaleId) fetchComments();
  }, [makaleId]);

  // 2. BEĞENİ İŞLEMİ
  const handleLike = () => {
    if (hasLiked) { setLikes(likes - 1); setHasLiked(false); } 
    else { setLikes(likes + 1); setHasLiked(true); }
  };

  // 3. ALKIŞ İŞLEMİ
  const handleClap = () => {
    if (hasClapped) { setClaps(claps - 1); setHasClapped(false); } 
    else { setClaps(claps + 1); setHasClapped(true); }
  };

  // 4. YORUM GÖNDERME (Email Dahil)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasyon
    if(!comment.name || !comment.email || !comment.text) return;
    
    setLoading(true);

    try {
      const res = await fetch("http://localhost:1337/api/yorums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ad_soyad: comment.name,
            email: comment.email, // Email'i de gönderiyoruz
            mesaj: comment.text,
            tarih: new Date().toISOString(),
            makale: makaleId
            // Not: publishedAt göndermiyoruz, Strapi ayarına göre Taslak (Draft) kalacak.
          }
        })
      });

      if (res.ok) {
        // Yorum başarılı ama "Onay" sisteminden dolayı hemen listede görünmeyebilir.
        // Kullanıcıya bunu nazikçe söyleyelim.
        setComment({ name: "", email: "", text: "" });
        alert("Yorumunuz başarıyla gönderildi! Yönetici onayından sonra yayınlanacaktır.");
      } else {
        alert("Yorum gönderilirken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
        
        {/* EMOJI TEPKİ ALANI */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
            <span className="text-slate-900 font-bold text-lg">Bu yazıyı beğendiniz mi?</span>
            <div className="flex gap-4">
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-95 border font-semibold ${hasLiked ? "bg-red-50 text-red-600 border-red-200 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 shadow-sm"}`}
                >
                    {hasLiked ? "❤️" : "🤍"} <span>{likes}</span>
                </button>
                <button 
                    onClick={handleClap}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-95 border font-semibold ${hasClapped ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 shadow-sm"}`}
                >
                    {hasClapped ? "👏" : "🙌"} <span>{claps > 0 ? claps : "Alkışla"}</span>
                </button>
            </div>
        </div>

        {/* YORUM FORMU */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg shadow-slate-200/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 font-playfair">Yorum Yap</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Adınız Soyadınız</label>
                        <input 
                            type="text" 
                            placeholder="Adınız Soyadınız" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium"
                            value={comment.name}
                            onChange={e => setComment({...comment, name: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">E-Posta (Yayınlanmayacak)</label>
                        <input 
                            type="email" 
                            placeholder="ornek@email.com" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium"
                            value={comment.email}
                            onChange={e => setComment({...comment, email: e.target.value})}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Yorumunuz</label>
                    <textarea 
                        rows={4} 
                        placeholder="Düşüncelerinizi paylaşın..." 
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-500 font-medium resize-none"
                        value={comment.text}
                        onChange={e => setComment({...comment, text: e.target.value})}
                        required
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-teal-600 transition-all shadow-md hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                >
                    {loading ? "Gönderiliyor..." : "Yorumu Gönder"}
                </button>
            </form>
        </div>

        {/* YORUMLAR LİSTESİ */}
        <div className="mt-16 space-y-8">
            <h4 className="font-bold text-2xl text-slate-900 font-playfair pb-4 border-b border-gray-200">
                Yorumlar ({commentsList.length})
            </h4>
            {commentsList.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                </div>
            )}
            
            <div className="space-y-6">
                {commentsList.map((c: any) => (
                    <div key={c.id} className="flex gap-5 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-teal-50 rounded-full flex-shrink-0 flex items-center justify-center text-teal-600 font-bold text-xl border border-teal-100">
                            {c.ad_soyad ? c.ad_soyad.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-900 flex items-center gap-3 flex-wrap">
                                {c.ad_soyad} 
                                {/* TARİH VE SAAT GÖSTERİMİ */}
                                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                                    {c.tarih ? new Date(c.tarih).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                                </span>
                            </h4>
                            <p className="text-slate-600 mt-3 text-base leading-relaxed">{c.mesaj}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}