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

async function resolvePortfolioDocId(portfolioData, providedDocId, portfolioSlug) {
  if (providedDocId) return providedDocId;
  if (portfolioData?.id) return portfolioData.id;
  if (portfolioData?.uid) return portfolioData.uid;

  const slug = (portfolioData?.slug || portfolioSlug || "").toLowerCase().trim();
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
  portfolioSlug,
  page,
  galleryId,
  clickedImg
) {
  if (!page?.id || !clickedImg || typeof window === "undefined") return;

  try {
    const docId = await resolvePortfolioDocId(
      portfolioData,
      portfolioDocId,
      portfolioSlug
    );
    if (!docId) return;

    const resolvedGalleryId = galleryId || clickedImg.galleryId || "default";
    const sessionKey = getImageSessionKey(
      docId,
      page.id,
      resolvedGalleryId,
      clickedImg
    );
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
        if (galleryId && String(g.id) !== String(galleryId)) return g;

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
    console.error("Error al registrar clic en imagen en ImagePageCard:", err);
  }
}

export default function ImagePageCard({
  page,
  portfolioData,
  portfolioDocId,
  portfolioSlug,
  styles,
  layout,
  currentTemplate,
  blockColor,
  textColor,
}) {
  const cardLayout = page.layout || layout || "row";

  // 1. Obtenemos y filtramos solo las imágenes que están activas (isActive !== false) adjuntando su galleryId
  const activeItems =
    page.type === "image" && page.galleries
      ? page.galleries.flatMap((g) =>
          (g.items || [])
            .filter((img) => img.isActive !== false)
            .map((img) => ({ ...img, _galleryId: g.id }))
        )
      : [];

  // Si no hay ninguna imagen activa, no renderizamos la tarjeta
  if (
    page.type === "image" &&
    (activeItems.length === 0 || !page.galleries || page.galleries.length === 0)
  ) {
    return null;
  }

  const handleImageItemClick = (e, img) => {
    e.stopPropagation();
    void trackImageClick(
      portfolioData,
      portfolioDocId,
      portfolioSlug,
      page,
      img._galleryId,
      img
    );
  };

  // Layout "row": hasta 3 imágenes activas en cuadrícula cuadrada
  const previewImages = activeItems.slice(0, 3);

  // Layout "single": la primera imagen activa disponible
  const singleImage = activeItems[0] || null;

  // Layout "carousel": hasta las primeras 5 imágenes activas
  const carouselImages = activeItems.slice(0, 5);

  // Layout "grid": hasta las primeras 4 imágenes activas para mostrar en cuadrícula de 2x2
  const gridImages = activeItems.slice(0, 4);

  return (
    <>
      {page.showTitleOnHome && (
        <span
          className={`block text-center whitespace-normal break-words mb-1.5 ${styles.pageTitle}`}
          style={{ color: textColor }}
        >
          {page.title}
        </span>
      )}
      <div
        className={`w-full p-3 transition-all duration-200 mb-8 block ${styles.pageCard}`}
        style={{ background: blockColor }}
      >
        {cardLayout === "single" && singleImage ? (
          <div
            onClick={(e) => handleImageItemClick(e, singleImage)}
            className="mt-2 overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer"
          >
            <img
              src={singleImage.url}
              alt={page.title || "Preview"}
              className="w-full h-auto object-contain transition-opacity"
            />
          </div>
        ) : cardLayout === "carousel" && carouselImages.length > 0 ? (
          /* Carrusel con scroll horizontal fino y limpio */
          <div className="relative mt-2">
            <div className="flex gap-2.5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-2 [-webkit-overflow-scrolling:touch] custom-scrollbar">
              {carouselImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={(e) => handleImageItemClick(e, img)}
                  className="h-[200px] shrink-0 snap-start flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt="Carousel Preview"
                    className="h-full w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : cardLayout === "grid" && gridImages.length > 0 ? (
          /* Layout Grid: Cuadrícula simétrica de 2x2 con imágenes cuadradas */
          <div className="grid grid-cols-2 gap-2 mt-2">
            {gridImages.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={(e) => handleImageItemClick(e, img)}
                className="aspect-square overflow-hidden bg-slate-900 cursor-pointer"
              >
                <img
                  src={img.url}
                  alt="Grid Preview"
                  className="w-full h-full object-cover transition-opacity"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {previewImages.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={(e) => handleImageItemClick(e, img)}
                className="overflow-hidden cursor-pointer"
              >
                <img
                  src={img.url}
                  alt="Preview"
                  className="aspect-square w-full h-full object-cover transition-opacity"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}