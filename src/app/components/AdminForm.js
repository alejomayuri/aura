"use client";

import { useState, useMemo } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";

export default function AdminForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage, onTogglePreview }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [openLayoutPageUid, setOpenLayoutPageUid] = useState(null);
  const [openSharePageUid, setOpenSharePageUid] = useState(null);

  const stableLinks = useMemo(() => {
    const links = portfolioData?.socialLinks || [];
    return links.map(link => ({
      ...link,
      uid: link.id || link.uid || link.url
    }));
  }, [portfolioData?.socialLinks]);

  // Manejo estable de páginas con uid para el drag and drop con Framer Motion
  const stablePages = useMemo(() => {
    const pages = portfolioData?.pages || [];
    return pages.map(page => ({
      ...page,
      uid: page.id || page.uid || page.slug || page.path
    }));
  }, [portfolioData?.pages]);

  const handleTogglePageVisibility = (pageUid) => {
    const updatedPages = stablePages.map(page => {
      if (page.uid === pageUid) {
        return { ...page, showOnHome: page.showOnHome === false ? true : false };
      }
      return page;
    });
    setPortfolioData({ ...portfolioData, pages: updatedPages });
  };

  const handleReorderPages = (newPages) => {
    setPortfolioData({ ...portfolioData, pages: newPages });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const getSocialIcon = (url) => {
    if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
    if (lowerUrl.includes("whatsapp.com") || lowerUrl.includes("wa.me")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
    if (lowerUrl.includes("linkedin.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
    if (lowerUrl.includes("github.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
    if (lowerUrl.includes("facebook.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
    if (lowerUrl.includes("tiktok.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
    return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  };

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    const newLink = { uid: Date.now().toString(), url: newLinkUrl.trim() };
    setPortfolioData({ ...portfolioData, socialLinks: [...stableLinks, newLink] });
    setNewLinkUrl("");
  };

  const handleRemoveLink = (uidToRemove) => {
    setPortfolioData({
      ...portfolioData,
      socialLinks: stableLinks.filter((link) => link.uid !== uidToRemove),
    });
  };

  const handleReorder = (newSocialLinks) => {
    setPortfolioData({ ...portfolioData, socialLinks: newSocialLinks });
  };

  const handleUpdatePageLayout = (pageUid, layoutType) => {
    const updatedPages = stablePages.map(page => {
      if (page.uid === pageUid) {
        return { ...page, layout: layoutType };
      }
      return page;
    });
    setPortfolioData({ ...portfolioData, pages: updatedPages });
  };

  const handleSaveWithUpload = async () => {
    let finalImageUrl = portfolioData.mainImage;
    let updatedData = { ...portfolioData, socialLinks: stableLinks, pages: stablePages };

    if (selectedFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "pataki_portfolio_upload");

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dz3p460iu/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          finalImageUrl = data.secure_url;
          updatedData.mainImage = finalImageUrl;
          setPortfolioData(updatedData);
        }
      } catch (error) {
        console.error("Error al subir la imagen a Cloudinary:", error);
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    if (typeof onSave === "function") {
      await onSave(updatedData);
    } else {
      await onSave();
    }

    setSelectedFile(null);
    setLocalPreview(null);
  };

  const currentImageDisplay = localPreview || portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image;
  const portfolioSlug = portfolioData?.slug || portfolioData?.username || "tu-usuario";

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Página Principal</h2>
          <button
            type="button"
            onClick={onTogglePreview}
            className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-100/50 rounded-lg transition-colors cursor-pointer"
            title="Ocultar formulario y ver solo preview"
          >
            <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        {saveMessage && (
          <span className={`text-sm px-3.5 py-1.5 rounded-lg font-medium border ${
            saveMessage.includes("exito") || saveMessage.includes("éxito") 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
            {saveMessage}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-base font-semibold text-slate-900 block">Título Principal</label>
        <input
          type="text"
          value={portfolioData?.title || ""}
          onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
          className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 shadow-sm"
          placeholder="Ej. Mi Portfolio Profesional"
        />
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-base font-semibold text-slate-900 block">Imagen Principal</label>
        <div className="w-full bg-transparent p-0 flex justify-start">
          <div className="relative w-full max-w-[240px] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Imagen principal actual" className="w-full h-auto object-contain max-h-[300px]" />
            ) : (
              <span className="text-xs text-slate-400 italic py-10">No hay imagen principal seleccionada</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="cursor-pointer bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ? "Subiendo..." : "Cambiar Imagen"}
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={uploading || saving} />
          </label>
          {selectedFile && !uploading && <span className="text-xs text-amber-600 italic">Imagen lista para guardar...</span>}
          {uploading && <span className="text-xs text-purple-600">Subiendo a Cloudinary...</span>}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-base font-semibold text-slate-900 block">Biografía</label>
        <textarea
          rows="3"
          value={portfolioData?.description || ""}
          onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
          className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 resize-none shadow-sm"
          placeholder="Escribe una breve bio o descripción para tu portfolio..."
        />
      </div>

      <div className="space-y-3 pt-4 pb-4 px-4 bg-slate-50 border border-purple-100 rounded-2xl shadow-sm">
        <label className="text-base font-semibold text-slate-900 block">Redes Sociales</label>

        {stableLinks.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={stableLinks} 
            onReorder={handleReorder}
            className="space-y-2.5 pt-1 list-none"
          >
            {stableLinks.map((linkItem) => {
              const iconUrl = getSocialIcon(linkItem.url);

              return (
                <Reorder.Item 
                  key={linkItem.uid}
                  value={linkItem}
                  whileDrag={{
                    scale: 1.02,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    zIndex: 50,
                  }}
                  className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-3 shadow-sm border border-purple-100 hover:border-purple-200 cursor-grab active:cursor-grabbing relative select-none"
                >
                  <div className="text-slate-600 hover:text-purple-700 flex flex-col gap-0.5 justify-center shrink-0 px-1 transition-colors cursor-grab active:cursor-grabbing" title="Arrastrar para ordenar">
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

                  <div className="w-9 h-9 flex items-center justify-center bg-purple-50 border border-purple-100 rounded-lg shrink-0 pointer-events-none">
                    <img src={iconUrl} alt="Ícono red social" className="w-4.5 h-4.5 text-slate-900" />
                  </div>
                  
                  <input
                    type="text"
                    value={linkItem.url}
                    onChange={(e) => {
                      const updatedLinks = stableLinks.map(l => 
                        l.uid === linkItem.uid ? { ...l, url: e.target.value } : l
                      );
                      setPortfolioData({ ...portfolioData, socialLinks: updatedLinks });
                    }}
                    className="w-full bg-transparent border-none text-sm text-slate-900 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveLink(linkItem.uid)}
                    className="text-slate-400 hover:text-rose-600 text-sm px-3 py-1 transition cursor-pointer"
                    title="Eliminar link"
                  >
                    ✕
                  </button>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <p className="text-xs text-slate-500 italic pt-1">No hay enlaces agregados todavía.</p>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
            className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 shadow-sm"
            placeholder="Ej. https://instagram.com/tu_usuario o cualquier web"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-xl text-sm font-medium transition shadow-sm shrink-0 cursor-pointer"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* SECCIÓN: Páginas */}
      <div className="space-y-3 pt-4 pb-4 px-4 bg-slate-50 border border-purple-100 rounded-2xl shadow-sm">
        <label className="text-base font-semibold text-slate-900 block">Páginas</label>

        {stablePages.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={stablePages} 
            onReorder={handleReorderPages}
            className="space-y-2.5 pt-1 list-none"
          >
            {stablePages.map((page) => {
              const isVisibleOnHome = page.showOnHome !== false; 
              const pageType = page.type || page.template || "Página";
              const isImageType = pageType.toLowerCase() === "image" || pageType.toLowerCase() === "imagen";
              const isLayoutOpen = openLayoutPageUid === page.uid;
              const isShareOpen = openSharePageUid === page.uid;
              const currentLayout = page.layout || "grid-3";
              const pageSlug = page.slug || page.path || "";
              const absoluteShareUrl = typeof window !== "undefined" ? `${window.location.origin}/${portfolioSlug}/${pageSlug}` : `/${portfolioSlug}/${pageSlug}`;

              return (
                <Reorder.Item 
                  key={page.uid}
                  value={page}
                  whileDrag={{
                    scale: 1.02,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    zIndex: 50,
                  }}
                  className="flex flex-col bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-200 overflow-hidden relative select-none"
                >
                  <div className="flex relative w-full">
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
                          <div className="w-9 h-9 flex items-center justify-center bg-purple-50 border border-purple-100 rounded-lg shrink-0 pointer-events-none">
                            <svg className="w-4.5 h-4.5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>

                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-slate-900 truncate">{page.title || page.name || "Página sin título"}</h4>
                              <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100 shrink-0">
                                {pageType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">/{pageSlug}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTogglePageVisibility(page.uid)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 border ${
                            isVisibleOnHome 
                              ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" 
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Alternar visibilidad en la página principal"
                        >
                          {isVisibleOnHome ? "Visible en Home" : "Oculto en Home"}
                        </button>
                      </div>

                      <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isImageType) {
                              setOpenLayoutPageUid(isLayoutOpen ? null : page.uid);
                              setOpenSharePageUid(null);
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenSharePageUid(isShareOpen ? null : page.uid);
                            setOpenLayoutPageUid(null);
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
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedPages = stablePages.filter(p => p.uid !== page.uid);
                            setPortfolioData({ ...portfolioData, pages: updatedPages });
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar página"
                        >
                          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sección desplegable con animación smooth para compartir */}
                  <AnimatePresence>
                    {isShareOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-purple-50/50 border-t border-purple-100 px-4 py-3.5 space-y-3"
                      >
                        <span className="text-xs font-semibold text-slate-700 block">Comparte el contenido de la página con este link</span>

                        {/* URL y botón de copiar dentro de un borde */}
                        <div className="flex items-center justify-between gap-2 bg-white border border-purple-100 rounded-xl px-3.5 py-2.5 shadow-sm">
                          <span className="text-sm font-medium select-all truncate">
                            <span className="text-slate-900">lightjaus.com</span>
                            <span className="text-slate-600">/{portfolioSlug}/{pageSlug}</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(`https://lightjaus.com/${portfolioSlug}/${pageSlug}`);
                            }}
                            className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copiar
                          </button>
                        </div>

                        {/* Redes sociales debajo con título */}
                        <div className="space-y-2 pt-1">
                          <span className="text-xs font-semibold text-purple-900 block">Compartir en redes sociales</span>
                          <div className="grid grid-cols-5 gap-1.5">
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Mira esta página: ${page.title || ""} ${absoluteShareUrl}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                            >
                              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteShareUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                            >
                              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.588 9 4.7V8z"/></svg>
                              <span>Facebook</span>
                            </a>
                            <a
                              href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(absoluteShareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(absoluteShareUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                            >
                              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 4.979 0 11.111c0 3.497 1.745 6.616 4.472 8.654V24l4.08-2.242c1.093.303 2.248.464 3.448.464 6.627 0 12-4.979 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.56-6.963 3.13 3.26 5.888-3.26-6.56 6.963z"/></svg>
                              <span>Messenger</span>
                            </a>
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mira esta página: ${page.title || ""}`)}&url=${encodeURIComponent(absoluteShareUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                            >
                              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                              <span>X</span>
                            </a>
                            <a
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteShareUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                            >
                              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                              <span>LinkedIn</span>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sección desplegable con animación smooth para selección de layout (solo para páginas de tipo image) */}
                  <AnimatePresence>
                    {isImageType && isLayoutOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-purple-50/50 border-t border-purple-100 px-4 py-3.5"
                      >
                        <div className="space-y-2.5">
                          <span className="text-xs font-semibold text-purple-900 block">Seleccionar Layout de Imágenes</span>
                          <div className="grid grid-cols-3 gap-2.5">
                            {/* Opción 1: Fila de 3 imágenes */}
                            <button
                              type="button"
                              onClick={() => handleUpdatePageLayout(page.uid, "grid-3")}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                currentLayout === "grid-3" || !currentLayout
                                  ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                  : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                              }`}
                            >
                              <svg className={`w-7 h-7 stroke-2 ${currentLayout === "grid-3" || !currentLayout ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <rect x="3" y="5" width="5" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="9.5" y="5" width="5" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="16" y="5" width="5" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "grid-3" || !currentLayout ? "text-white" : "text-slate-600"}`}>
                                Fila de 3 imágenes
                              </span>
                            </button>

                            {/* Opción 2: Imagen grande única */}
                            <button
                              type="button"
                              onClick={() => handleUpdatePageLayout(page.uid, "single-large")}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                currentLayout === "single-large"
                                  ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                  : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                              }`}
                            >
                              <svg className={`w-7 h-7 stroke-2 ${currentLayout === "single-large" ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "single-large" ? "text-white" : "text-slate-600"}`}>
                                Imagen grande única
                              </span>
                            </button>

                            {/* Opción 3: Galería Mosaico */}
                            <button
                              type="button"
                              onClick={() => handleUpdatePageLayout(page.uid, "masonry-grid")}
                              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                currentLayout === "masonry-grid"
                                  ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                  : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                              }`}
                            >
                              <svg className={`w-7 h-7 stroke-2 ${currentLayout === "masonry-grid" ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <rect x="3" y="3" width="10" height="10" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="14" y="3" width="7" height="6" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="14" y="10.5" width="7" height="10.5" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="3" y="14" width="10" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "masonry-grid" ? "text-white" : "text-slate-600"}`}>
                                Galería Mosaico
                              </span>
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
          <p className="text-xs text-slate-500 italic pt-1">No hay páginas creadas todavía.</p>
        )}
      </div>

      <button
        onClick={handleSaveWithUpload}
        disabled={saving || uploading}
        className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition focus:outline-none shadow-md cursor-pointer"
      >
        {uploading ? "Subiendo imagen..." : saving ? "Guardando..." : "Guardar Cambios en Firestore"}
      </button>
    </div>
  );
}