"use client";

import { useEffect } from "react";

interface ViewCounterProps {
  id: number;
  collection: "ilans" | "makales"; // Hangi tabloda çalışacak?
  currentViews: number; // Şu anki sayı kaç?
}

export default function ViewCounter({ id, collection, currentViews }: ViewCounterProps) {
  
  useEffect(() => {
    // Sayfa yüklendiğinde bir kere çalışır
    const incrementView = async () => {
      try {
        // Strapi'ye PUT isteği atarak sayıyı 1 artırıyoruz
        await fetch(`http://localhost:1337/api/${collection}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              goruntulenme: (currentViews || 0) + 1,
            },
          }),
        });
      } catch (error) {
        console.error("Görüntülenme artırılamadı:", error);
      }
    };

    incrementView();
  }, [id, collection, currentViews]); // id veya views değişirse tekrar çalışmasın, sadece ilk girişte.

  return null; // Bu bileşen ekranda hiçbir şey göstermez (Gizli Ajan)
}