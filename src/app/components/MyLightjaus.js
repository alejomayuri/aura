"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import WeeklySummary from "./AdminFormsComponents/miLightjaus/WeeklySummary";
import UpdatesAndTips from "./AdminFormsComponents/miLightjaus/UpdatesAndTips";
import TrafficEvolutionChart from "./AdminFormsComponents/miLightjaus/TrafficEvolutionChart";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  Copy,
  ExternalLink,
  Share2,
  X,
} from "lucide-react";

function getPageItemsRealClicks(page) {
  if (!page) return 0;

  if (page.type === "image") {
    const galleryItems = (page.galleries || []).flatMap((gal) => gal.items || []);
    const sourceItems =
      galleryItems.length > 0 ? galleryItems : Array.isArray(page.items) ? page.items : [];
    return sourceItems.reduce((sum, item) => sum + (Number(item.clicks) || 0), 0);
  }

  const items = Array.isArray(page.items)
    ? page.items
    : Array.isArray(page.products)
    ? page.products
    : [];

  return items.reduce((sum, item) => sum + (Number(item.clicks) || 0), 0);
}

export default function MyLightjaus({ portfolioData: initialPortfolioData, user }) {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [mounted] = useState(true);

  const [snapshotPortfolioData, setSnapshotPortfolioData] = useState(null);
  const [resolvedDocId, setResolvedDocId] = useState(
    initialPortfolioData?.id || initialPortfolioData?.uid || null
  );
  const [eventsList, setEventsList] = useState([]);

  // Estado para el selector de página en el resumen semanal
  const [selectedPageFilter, setSelectedPageFilter] = useState("home");

  const livePortfolioData = useMemo(() => {
    if (!snapshotPortfolioData) return initialPortfolioData || {};
    return { ...(initialPortfolioData || {}), ...snapshotPortfolioData };
  }, [initialPortfolioData, snapshotPortfolioData]);

  const portfolioDocId =
    resolvedDocId ||
    initialPortfolioData?.id ||
    initialPortfolioData?.uid ||
    livePortfolioData?.id ||
    livePortfolioData?.uid ||
    null;

  const slug =
    livePortfolioData?.slug ||
    livePortfolioData?.title?.toLowerCase().replace(/[^a-z0-9]/g, "-") ||
    user?.uid?.slice(0, 8) ||
    "mi-lightjaus";
  const publicUrl = `https://lightjaus.com/${slug}`;

  // Resolver docId y escuchar cambios en tiempo real del documento del portafolio
  useEffect(() => {
    let unsubscribeDoc = null;
    let isCancelled = false;

    const startSubscription = (docId) => {
      if (!docId || isCancelled) return;
      const portfolioRef = doc(db, "portfolios", docId);
      unsubscribeDoc = onSnapshot(portfolioRef, (snap) => {
        if (snap.exists() && !isCancelled) {
          setSnapshotPortfolioData({ id: snap.id, ...snap.data() });
        }
      });
    };

    const directId =
      initialPortfolioData?.id ||
      initialPortfolioData?.uid ||
      livePortfolioData?.id ||
      livePortfolioData?.uid ||
      user?.uid ||
      null;

    if (directId) {
      startSubscription(directId);
    } else if (livePortfolioData?.slug) {
      const cleanSlug = String(livePortfolioData.slug).toLowerCase().trim();
      const q = query(collection(db, "portfolios"), where("slug", "==", cleanSlug));
      getDocs(q)
        .then((snap) => {
          if (isCancelled || snap.empty) return;
          const foundId = snap.docs[0].id;
          setResolvedDocId(foundId);
          startSubscription(foundId);
        })
        .catch((err) => {
          console.error("Error al resolver portafolio en MyLightjaus:", err);
        });
    }

    return () => {
      isCancelled = true;
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, [
    initialPortfolioData?.id,
    initialPortfolioData?.uid,
    livePortfolioData?.id,
    livePortfolioData?.uid,
    livePortfolioData?.slug,
    user?.uid,
  ]);

  // Escuchar analyticsEvents para el gráfico de evolución temporal
  useEffect(() => {
    if (!portfolioDocId) return;

    const eventsRef = collection(db, "portfolios", portfolioDocId, "analyticsEvents");
    const unsubscribeEvents = onSnapshot(eventsRef, (snapshot) => {
      const parsed = snapshot.docs.map((d) => {
        const data = d.data();
        const rawDate = data?.createdAt?.toDate ? data.createdAt.toDate() : null;
        return {
          id: d.id,
          ...data,
          dateObj: rawDate,
        };
      });
      setEventsList(parsed);
    });

    return () => unsubscribeEvents();
  }, [portfolioDocId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pagesList = livePortfolioData?.pages || [];
  const isHomeSelected =
    selectedPageFilter === "home" || selectedPageFilter === "all";

  const selectedPageObj = !isHomeSelected
    ? pagesList.find(
        (page, idx) => (page.id || page.title || `page-${idx}`) === selectedPageFilter
      )
    : null;

  // Clics reales acumulados (semanales) desde los ítems de las páginas
  const totalRealClicks = isHomeSelected
    ? pagesList.reduce((acc, p) => acc + getPageItemsRealClicks(p), 0)
    : getPageItemsRealClicks(selectedPageObj);

  // Visitas reales (views) desde el documento del portafolio (Home) o de la página seleccionada
  const realViewsCount = isHomeSelected
    ? Number(livePortfolioData?.views ?? 0)
    : Number(selectedPageObj?.views ?? 0);

  const totalViews = realViewsCount;
  const totalClicks = totalRealClicks;
  const conversionRate =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-['Poppins']">
      {/* 1. SECCIÓN SUPERIOR: Bienvenida y Enlace Público */}
      <div className="bg-white py-6 sm:py-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black font-semibold tracking-tight text-slate-900">
            Hola de nuevo, {slug}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-5 py-3 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4" /> Visitar
          </a>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 bg-[#F2F1EF] cursor-pointer hover:bg-gray-100 text-slate-700 text-xs font-semibold px-5 py-3 rounded-xl transition"
          >
            <Share2 className="w-4 h-4" /> Compartir
          </button>
        </div>
      </div>

      {/* 2. GRID DE VALOR: Métricas Clave e Insights de la Semana */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda & Centro: Resumen de la Semana */}
        <WeeklySummary
          pagesList={pagesList}
          portfolioData={livePortfolioData}
          selectedPageFilter={selectedPageFilter}
          setSelectedPageFilter={setSelectedPageFilter}
          totalViews={totalViews}
          totalClicks={totalClicks}
          conversionRate={conversionRate}
        />

        {/* Columna Derecha: Actualizaciones */}
        <UpdatesAndTips />
      </div>

      {/* 3. SECCIÓN INFERIOR: Gráfico de Rendimiento Detallado */}
      <TrafficEvolutionChart
        pagesList={pagesList}
        eventsList={eventsList}
      />

      {/* Modal de Compartir renderizado mediante Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isShareModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 w-screen h-screen overflow-hidden font-['Poppins']"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative border border-purple-100"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-sm font-bold text-slate-800 tracking-tight">
                      Compartir portfolio
                    </span>
                    <button
                      onClick={() => setIsShareModalOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 bg-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 shadow-sm">
                    <span className="text-xs font-medium select-all truncate">
                      <span className="text-slate-900">lightjaus.com</span>
                      <span className="text-slate-600">/{slug}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink();
                      }}
                      className="bg-black hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-purple-900 block">
                      Compartir en redes sociales
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(() => {
                        const whatsappText = `Mira mi Lightjaus: ${publicUrl}`;
                        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          whatsappText
                        )}`;

                        return (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                          >
                            <svg
                              className="w-5 h-5 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            <span>WhatsApp</span>
                          </a>
                        );
                      })()}

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          publicUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg
                          className="w-5 h-5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.588 9 4.7V8z" />
                        </svg>
                        <span>Facebook</span>
                      </a>
                      <a
                        href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(
                          publicUrl
                        )}&app_id=291494419107518&redirect_uri=${encodeURIComponent(
                          publicUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg
                          className="w-5 h-5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.373 0 0 4.979 0 11.111c0 3.497 1.745 6.616 4.472 8.654V24l4.08-2.242c1.093.303 2.248.464 3.448.464 6.627 0 12-4.979 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.56-6.963 3.13 3.26 5.888-3.26-6.56 6.963z" />
                        </svg>
                        <span>Messenger</span>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Mira mi Lightjaus`
                        )}&url=${encodeURIComponent(publicUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg
                          className="w-5 h-5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>X</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          publicUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg
                          className="w-5 h-5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}