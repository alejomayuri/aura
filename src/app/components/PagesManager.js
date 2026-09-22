"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Reorder, motion, AnimatePresence } from "framer-motion";

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

  // Actualiza el estado visual fluidamente mientras se arrastra
  const handleReorderPages = (newOrder) => {
    setLocalPages(newOrder);
  };

  // Guarda en la base de datos exactamente en el momento en que se suelta el elemento
  const handleDragEndPages = () => {
    savePagesToFirebase(localPages);
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

  const handleDeletePageFinal = (uid) => {
    const updated = localPages.filter((p) => (p.uid || p.id) !== uid);
    setLocalPages(updated);
    savePagesToFirebase(updated);
    setOpenDeletePageUid(null);
    setSuccessMsg("Página eliminada correctamente.");
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Crear y Gestionar Páginas</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Añade nuevas secciones a tu portfolio o reordena las existentes.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3.5 rounded-xl transition-all duration-300">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Nombre de la Página</label>
          <input 
            type="text"
            required
            placeholder="Ej. Colección 2026"
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">URL / Slug Generado</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 overflow-x-auto">
            <span className="text-purple-600 font-medium">aura.com/{portfolioSlug}/</span>
            <span className="text-slate-900 font-semibold">{slug || "nombre-de-la-pagina"}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Tipo de Contenido (Type)</label>
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="image">Imagen / Galería</option>
            <option value="audio">Audio / Podcast</option>
            <option value="text">Texto / Artículo</option>
            <option value="link">Enlace / Linktree</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-medium shadow-sm transition-all focus:outline-none flex items-center gap-2 cursor-pointer"
          >
            {loading ? "Guardando..." : "Crear y Guardar"}
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
                <Reorder.Item 
                  key={pageUid}
                  value={page}
                  onDragEnd={handleDragEndPages}
                  className="flex flex-col bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-200 overflow-hidden relative"
                >
                  <div className="flex relative w-full items-stretch">
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-slate-400 hover:text-purple-700 transition-colors cursor-grab active:cursor-grabbing bg-slate-50/50 border-r border-slate-100" 
                      title="Arrastrar para ordenar"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex gap-0.5">
                          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                        </div>
                        <div className="flex gap-0.5">
                          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                        </div>
                        <div className="flex gap-0.5">
                          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-3 pl-12 pr-3.5 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 flex items-center justify-center bg-purple-50 border border-purple-100 rounded-lg shrink-0">
                            <svg className="w-4.5 h-4.5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>

                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-slate-900 truncate">{page.title || page.name || "Página sin título"}</h4>
                              <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100 shrink-0">
                                {pType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">/{pageSlug}</p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer shrink-0" title="Alternar visibilidad en la página principal">
                          <input
                            type="checkbox"
                            checked={isVisibleOnHome}
                            onChange={() => handleTogglePageVisibility(pageUid)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            if (isImageType) {
                              setOpenLayoutPageUid(isLayoutOpen ? null : pageUid);
                              setOpenSharePageUid(null);
                              setOpenDeletePageUid(null);
                            }
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isImageType 
                              ? (isLayoutOpen ? "text-purple-700 bg-purple-100" : "text-slate-500 hover:text-purple-700 hover:bg-purple-50")
                              : "text-slate-300 cursor-not-allowed"
                          }`}
                          title={isImageType ? "Configurar Layout" : "Solo disponible para páginas de tipo image"}
                        >
                          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenSharePageUid(isShareOpen ? null : pageUid);
                            setOpenLayoutPageUid(null);
                            setOpenDeletePageUid(null);
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isShareOpen ? "text-purple-700 bg-purple-100" : "text-slate-500 hover:text-purple-700 hover:bg-purple-50"
                          }`}
                          title="Compartir página"
                        >
                          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenDeletePageUid(isDeleteOpen ? null : pageUid);
                            setOpenSharePageUid(null);
                            setOpenLayoutPageUid(null);
                          }}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isDeleteOpen ? "text-rose-600 bg-rose-100" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          }`}
                          title="Eliminar página"
                        >
                          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isDeleteOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-rose-50/50 border-t border-rose-100 px-4 py-3.5 space-y-3"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-rose-900 block">¿Estás seguro de eliminar esta página?</span>
                          <p className="text-[11px] text-slate-600">Esta acción no se puede deshacer y el contenido se perderá.</p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setOpenDeletePageUid(null)}
                            className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePageFinal(pageUid)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            Sí, eliminar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isShareOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-purple-50/50 border-t border-purple-100 px-4 py-3.5 space-y-3"
                      >
                        <span className="text-xs font-semibold text-slate-700 block">Comparte el contenido de la página con este link</span>

                        <div className="flex items-center justify-between gap-2 bg-white border border-purple-100 rounded-xl px-3.5 py-2.5 shadow-sm">
                          <span className="text-sm font-medium select-all truncate">
                            <span className="text-slate-900">aura.com</span>
                            <span className="text-slate-600">/{portfolioSlug}/{pageSlug}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(absoluteShareUrl)}
                            className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
                          >
                            Copiar
                          </button>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Mira mi página: ${absoluteShareUrl}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-1.5 rounded-lg text-xs font-medium transition shadow-sm flex items-center justify-center gap-1.5"
                          >
                            WhatsApp
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(absoluteShareUrl)}&text=${encodeURIComponent(`Echa un vistazo a mi página ${page.title}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-center py-1.5 rounded-lg text-xs font-medium transition shadow-sm flex items-center justify-center gap-1.5"
                          >
                            Twitter / X
                          </a>
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteShareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-center py-1.5 rounded-lg text-xs font-medium transition shadow-sm flex items-center justify-center gap-1.5"
                          >
                            LinkedIn
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isImageType && isLayoutOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-purple-50/50 border-t border-purple-100 px-4 py-3.5"
                      >
                        <div className="space-y-2.5">
                          <span className="text-xs font-semibold text-purple-900 block">Seleccionar Layout de Imágenes</span>
                          <div className="grid grid-cols-3 gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleUpdatePageLayout(pageUid, "grid-3")}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                currentLayout === "grid-3" || !currentLayout
                                  ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                  : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                              }`}
                            >
                              <span className="text-xs font-medium leading-tight text-center">Fila de 3 imágenes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdatePageLayout(pageUid, "single-large")}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                currentLayout === "single-large"
                                  ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                  : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                              }`}
                            >
                              <span className="text-xs font-medium leading-tight text-center">Imagen grande única</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdatePageLayout(pageUid, "masonry-grid")}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                currentLayout === "masonry-grid"
                                  ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                  : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                              }`}
                            >
                              <span className="text-xs font-medium leading-tight text-center">Galería Mosaico</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reorder.Item>
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