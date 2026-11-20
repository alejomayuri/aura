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

function getLinkSessionKey(docId, pageId, clickedLink) {
  const itemKey = clickedLink?.id || clickedLink?.url || clickedLink?.title || "unknown";
  return `lj_item_clicked_${docId}_${pageId}_${encodeURIComponent(String(itemKey))}`;
}

async function trackLinkClick(portfolioData, portfolioDocId, page, clickedLink) {
  if (!page?.id || !clickedLink || typeof window === "undefined") return;

  try {
    const docId = await resolvePortfolioDocId(portfolioData, portfolioDocId);
    if (!docId) {
      console.warn("trackLinkClick: no se pudo resolver portfolioDocId", {
        portfolioDocId,
        slug: portfolioData?.slug,
      });
      return;
    }

    const sessionKey = getLinkSessionKey(docId, page.id, clickedLink);
    // Si ya se registró este link en esta sesión (en Home o en la página), no sumar de nuevo
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }

    // Marcamos en sesión de inmediato para evitar dobles clics rápidos
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

      const updatedItems = (p.items || []).map((item) => {
        const matchesId =
          clickedLink.id && item.id && String(item.id) === String(clickedLink.id);
        const matchesUrl =
          !clickedLink.id && clickedLink.url && item.url === clickedLink.url;

        if (!matchesId && !matchesUrl) return item;

        matchedItem = true;
        return {
          ...item,
          clicks: (Number(item.clicks) || 0) + 1,
        };
      });

      return {
        ...p,
        items: updatedItems,
      };
    });

    if (!matchedItem) {
      sessionStorage.removeItem(sessionKey);
      console.warn("trackLinkClick: no se encontró el ítem dentro de page.items", {
        pageId: page.id,
        clickedLink,
      });
      return;
    }

    await updateDoc(portfolioRef, {
      pages: updatedPages,
    });
  } catch (err) {
    console.error("Error al registrar clic en enlace en Firestore:", err);
  }
}

export default function LinkPageCard({
  page,
  portfolioData,
  portfolioDocId,
  styles,
  internal,
  blockColor,
  textColor,
  home = false,
}) {
  if (!page?.items || page.items.length === 0) return null;

  const handleLinkClick = (link) => {
    void trackLinkClick(portfolioData, portfolioDocId, page, link);
  };

  return (
    <div key={page.id} className="space-y-3 mb-8">
      {home && page.showTitleOnHome && (
        <span
          className={`block text-center whitespace-normal break-words mb-1.5 ${styles.pageTitle}`}
          style={{ color: textColor }}
        >
          {page.title}
        </span>
      )}
      {page.items.map((link) => {
        if (link.isFeatured !== true && !internal) return null;
        if (!link.isActive) return null;

        const formattedUrl = link.url.startsWith("http")
          ? link.url
          : `https://${link.url}`;
        const layout = link.layout || "classic";

        if (layout === "featured") {
          return (
            <a
              key={link.id || link.url}
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className={`w-full aspect-[350/240] p-4 relative overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-center mb-3 ${styles.pageCard}`}
              style={{ backgroundColor: blockColor }}
            >
              {link.imageUrl && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={link.imageUrl}
                    alt={link.title || "Featured Background"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              )}

              <span
                className={`relative z-10 text-center whitespace-normal break-words px-4 ${styles.pageTitle}`}
                style={{ color: textColor }}
              >
                {link.title}
              </span>
            </a>
          );
        }

        return (
          <a
            key={link.id || link.url}
            href={formattedUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick(link)}
            className={`w-full p-2 min-h-[68px] transition-all duration-200 cursor-pointer grid items-center mb-3 ${styles.pageCard}`}
            style={{
              gridTemplateColumns: link.imageUrl ? "52px 1fr 52px" : "1fr",
              backgroundColor: blockColor,
            }}
          >
            {link.imageUrl ? (
              <div
                className={`w-[48px] h-[48px] shrink-0 overflow-hidden ${
                  styles.radiusImageLink || ""
                }`}
              >
                <img
                  src={link.imageUrl}
                  alt={link.title || "Thumbnail"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <span
              className={`text-center whitespace-normal break-words px-2 ${styles.pageTitle}`}
              style={{ color: textColor }}
            >
              {link.title}
            </span>

            {link.imageUrl ? <div aria-hidden="true" /> : null}
          </a>
        );
      })}
    </div>
  );
}