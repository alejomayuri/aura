"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import { PageItem } from "./AdminFormsComponents/PageItem";

export default function PagesManager({ portfolioData, onUpdatePages }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pageType, setPageType] = useState("image");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [localPages, setLocalPages] = useState(() => portfolioData?.pages || []);
  const [openLayoutPageUid, setOpenLayoutPageUid] = useState(null);
  const [openSharePageUid, setOpenSharePageUid] = useState(null);
  const [openDeletePageUid, setOpenDeletePageUid] = useState(null);

  const portfolioSlug = portfolioData?.slug || portfolioData?.username || "mi-portfolio";

  // Definición de los tipos de contenido actualizados (Texto/Artículo cambiado por Tienda)
  const contentTypes = [
    {
      id: "image",
      title: "Imagen",
      description: "Muestra colecciones de imágenes o fotografías.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "audio",
      title: "Audio",
      description: "Comparte canciones o podcast.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      id: "store",
      title: "Tienda",
      description: "Muestra productos para vender.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "link",
      title: "Link",
      description: "Comparte varios enlaces de interés.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");  

    setSlug(generatedSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !slug.trim()) {
      setError("Por favor completa el título y el slug.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      setError("No hay una sesión activa en Firebase.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const newPage = {
        uid: Date.now().toString(),
        id: Date.now().toString(),
        title: title.trim(),
        slug: slug.trim(),
        type: pageType,
        showOnHome: true,
        layout: "grid-3",
        items: [],
        createdAt: new Date().toISOString()
      };

      const updatedPages = [...localPages, newPage];
      const portfolioRef = doc(db, "portfolios", currentUser.uid);

      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      setLocalPages(updatedPages);
      if (onUpdatePages) onUpdatePages(updatedPages);

      setSuccessMsg("¡Página creada y guardada con éxito!");
      setTitle("");
      setSlug("");
      setPageType("image");
    } catch (err) {
      console.error("Error al guardar en Firestore:", err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const savePagesToFirebase = async (newPages) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: newPages }, { merge: true });
      if (onUpdatePages) onUpdatePages(newPages);
    } catch (err) {
      console.error("Error al actualizar páginas en Firestore:", err);
      setError(`Error al actualizar: ${err.message}`);
    }
  };

  const handleReorderPages = (newOrder) => {
    setLocalPages(newOrder);
    savePagesToFirebase(newOrder);
  };

  const handleTogglePageVisibility = (uid) => {
    const updated = localPages.map((p) => {
      if (p.uid === uid || p.id === uid) {
        const currentShow = p.showOnHome !== false;
        return { ...p, showOnHome: !currentShow };
      }
      return p;
    });
    setLocalPages(updated);
    savePagesToFirebase(updated);
  };

  const handleUpdatePageLayout = (uid, newLayout) => {
    const updated = localPages.map((p) => {
      if (p.uid === uid || p.id === uid) {
        return { ...p, layout: newLayout };
      }
      return p;
    });
    setLocalPages(updated);
    savePagesToFirebase(updated);
    setOpenLayoutPageUid(null);
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']">
      <Title title="Crear Página" />

      {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}
      {successMsg && <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-5 rounded-xl space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input 
            type="text"
            required
            placeholder="Nombre de la página"
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Contenido</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {contentTypes.map((type) => {
              const isSelected = pageType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setPageType(type.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-50/80 border-purple-500 shadow-sm ring-1 ring-purple-500"
                      : "bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
                    {type.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-xs font-semibold ${isSelected ? "text-purple-900" : "text-slate-900"}`}>
                      {type.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {type.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:bg-black disabled:text-white rounded-xl text-sm font-medium shadow-sm transition-all shrink-0 cursor-pointer"
          >
            {loading ? "Guardando..." : "Crear página"}
          </button>
        </div>
      </form>

      <div className="space-y-3 pt-2 pb-4">
        <label className="text-base font-semibold text-slate-900 block">
          Páginas Registradas ({localPages.length})
        </label>

        {localPages.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={localPages} 
            onReorder={handleReorderPages}
            className="space-y-2.5 pt-1 list-none"
          >
            {localPages.map((page) => {
              const pageUid = page.uid || page.id;
              const isVisibleOnHome = page.showOnHome !== false; 
              const pType = page.type || page.template || "Página";
              const isImageType = pType.toLowerCase() === "image" || pType.toLowerCase() === "imagen";
              const isLayoutOpen = openLayoutPageUid === pageUid;
              const isShareOpen = openSharePageUid === pageUid;
              const isDeleteOpen = openDeletePageUid === pageUid;
              const currentLayout = page.layout || "grid-3";
              const pageSlug = page.slug || page.path || "";
              const absoluteShareUrl = typeof window !== "undefined" ? `${window.location.origin}/${portfolioSlug}/${pageSlug}` : `/${portfolioSlug}/${pageSlug}`;

              return (
                <PageItem
                  key={pageUid}
                  page={page}
                  pageType={pType}
                  pageSlug={pageSlug}
                  portfolioSlug={portfolioSlug}
                  absoluteShareUrl={absoluteShareUrl}
                  isVisibleOnHome={isVisibleOnHome}
                  isImageType={isImageType}
                  isLayoutOpen={isLayoutOpen}
                  isShareOpen={isShareOpen}
                  isDeleteOpen={isDeleteOpen}
                  currentLayout={currentLayout}
                  
                  handleTogglePageVisibility={handleTogglePageVisibility}
                  setOpenLayoutPageUid={setOpenLayoutPageUid}
                  setOpenSharePageUid={setOpenSharePageUid}
                  setOpenDeletePageUid={setOpenDeletePageUid}
                  handleUpdatePageLayout={handleUpdatePageLayout}
                  
                  stablePages={localPages}
                  portfolioData={{ ...portfolioData, pages: localPages }}
                  setPortfolioData={(newData) => {
                    if (newData && newData.pages) {
                      setLocalPages(newData.pages);
                      savePagesToFirebase(newData.pages);
                    }
                  }}
                />
              );
            })}
          </Reorder.Group>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay páginas guardadas en la base de datos todavía.</p>
        )}
      </div>
    </div>
  );
}