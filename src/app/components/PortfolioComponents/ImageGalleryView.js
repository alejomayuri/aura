"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

async function resolvePortfolioDocId(portfolioData, providedDocId) {
  if (providedDocId) return providedDocId;
  if (portfolioData?.id) return portfolioData.id;
  if (portfolioData?.uid) return portfolioData.uid;

  const slug = portfolioData?.slug?.toLowerCase().trim();
  if (!slug) return null;

  const q = query(collection(db, "portfolios"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].id;
  }
  return null;
}

function getImageSessionKey(docId, pageId, galleryId, img) {
  const imgKey = img?.id || img?.url || img?.title || "unknown";
  return `lj_img_clicked_${docId}_${pageId}_${galleryId}_${encodeURIComponent(
    String(imgKey)
  )}`;
}

async function trackImageClick(
  portfolioData,
  portfolioDocId,
  page,
  gallery,
  clickedImg
) {
  if (!page?.id || !gallery?.id || !clickedImg || typeof window === "undefined") {
    return;
  }

  try {
    const docId = await resolvePortfolioDocId(portfolioData, portfolioDocId);
    if (!docId) return;

    const sessionKey = getImageSessionKey(docId, page.id, gallery.id, clickedImg);
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");

    const portfolioRef = doc(db, "portfolios", docId);
    const currentSnap = await getDoc(portfolioRef);
    if (!currentSnap.exists()) return;

    const latestData = currentSnap.data();
    const currentPages = Array.isArray(latestData?.pages)
      ? latestData.pages
      : Array.isArray(portfolioData?.pages)
      ? portfolioData.pages
      : [];

    if (!currentPages.length) return;

    let matchedItem = false;

    const updatedPages = currentPages.map((p) => {
      if (String(p.id) !== String(page.id)) return p;

      const updatedGalleries = (p.galleries || []).map((g) => {
        if (String(g.id) !== String(gallery.id)) return g;

        const updatedItems = (g.items || []).map((item) => {
          const matchesId =
            clickedImg.id && item.id && String(item.id) === String(clickedImg.id);
          const matchesUrl =
            !clickedImg.id && clickedImg.url && item.url === clickedImg.url;

          if (!matchesId && !matchesUrl) return item;

          matchedItem = true;
          return {
            ...item,
            clicks: (Number(item.clicks) || 0) + 1,
          };
        });

        return {
          ...g,
          items: updatedItems,
        };
      });

      return {
        ...p,
        galleries: updatedGalleries,
      };
    });

    if (!matchedItem) {
      sessionStorage.removeItem(sessionKey);
      return;
    }

    await updateDoc(portfolioRef, {
      pages: updatedPages,
    });
  } catch (err) {
    console.error("Error al registrar clic en imagen:", err);
  }
}

export default function ImageGalleryView({
  page,
  portfolioData,
  portfolioDocId,
  styles,
  galleryColor,
}) {
  if (!page?.galleries || page.galleries.length === 0) {
    return (
      <p className="text-xs text-center italic opacity-50">
        No hay galerías creadas para esta página.
      </p>
    );
  }

  const handleImageClick = (gal, img) => {
    void trackImageClick(portfolioData, portfolioDocId, page, gal, img);
  };

  return (
    <div className="space-y-6 px-4">
      {page.galleries.map((gal) => {
        // Filtramos solo las imágenes activas (isActive !== false)
        const activeItems =
          gal.items?.filter((img) => img.isActive !== false) || [];

        if (activeItems.length === 0) return null;

        // Determinamos el layout de la galería (por defecto "grid" si no está definido)
        const galleryLayout = gal.layout || "grid";

        return (
          <div key={gal.id} className="space-y-2">
            <h3
              className={`text-[12px] uppercase font-bold tracking-wider ${styles.pageTitle}`}
              style={{ color: galleryColor }}
            >
              {gal.title}
            </h3>

            {galleryLayout === "column" ? (
              /* Layout Column: Imágenes una encima de otra, ancho máximo y altura proporcional */
              <div className={`space-y-3 ${styles.imageCard}`}>
                {activeItems.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => handleImageClick(gal, img)}
                    className={`overflow-hidden bg-white/5 w-full cursor-pointer ${
                      styles.shadow || ""
                    }`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-auto object-contain transition-opacity block"
                      alt="img"
                    />
                  </div>
                ))}
              </div>
            ) : galleryLayout === "row" ? (
              /* Layout Row: Filas de 3 imágenes con proporción cuadrada estilo Instagram */
              <div className={`grid grid-cols-2 gap-2 ${styles.imageCard}`}>
                {activeItems.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => handleImageClick(gal, img)}
                    className={`aspect-square overflow-hidden bg-white/5 cursor-pointer ${
                      styles.shadow || ""
                    }`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover transition-opacity block"
                      alt="img"
                    />
                  </div>
                ))}
              </div>
            ) : galleryLayout === "carousel" ? (
              /* Layout Carousel: Scroll horizontal fluido con barra fina y limpia */
              <div className="relative mt-2">
                <div className={`flex gap-2.5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-2 [-webkit-overflow-scrolling:touch] custom-scrollbar ${styles.imageCard}`}>
                  {activeItems.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => handleImageClick(gal, img)}
                      className={`h-[220px] shrink-0 snap-start flex items-center justify-center overflow-hidden bg-white/5 cursor-pointer ${
                        styles.shadow || ""
                      }`}
                    >
                      <img
                        src={img.url}
                        className="h-full w-auto object-contain transition-opacity block"
                        alt="img"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Layout Grid (por defecto): Cuadrícula en columnas estilo masonry */
              <div className={`columns-2 gap-2 space-y-2 ${styles.imageCard}`}>
                {activeItems.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => handleImageClick(gal, img)}
                    className={`overflow-hidden bg-white/5 break-inside-avoid cursor-pointer ${
                      styles.shadow || ""
                    }`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-auto object-contain transition-opacity block"
                      alt="img"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}