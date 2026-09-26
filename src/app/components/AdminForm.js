"use client";

import { useState, useMemo } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import Social from "./AdminFormsComponents/home/Social";
import { PageItem } from "./AdminFormsComponents/PageItem";
import { Bio } from "./AdminFormsComponents/home/Bio";

export default function AdminForm({ portfolioData, setPortfolioData, onSave, saving, onTogglePreview }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [openLayoutPageUid, setOpenLayoutPageUid] = useState(null);
  const [openSharePageUid, setOpenSharePageUid] = useState(null);
  
  // Estado para controlar la edición inline del título principal y la biografía
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Estado para controlar el modal de la imagen principal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  // Estado temporal dentro del modal para previsualizar antes de confirmar
  const [modalTempFile, setModalTempFile] = useState(null);
  const [modalTempPreview, setModalTempPreview] = useState(null);
  const [modalRemoveImage, setModalRemoveImage] = useState(false);

  // Estado para confirmar la eliminación de un enlace social
  const [deleteConfirmUid, setDeleteConfirmUid] = useState(null);

  const [openDeletePageUid, setOpenDeletePageUid] = useState(null);

  // Estado para mostrar u ocultar estilos de imagen en la sección de páginas
  const [showImageStyles, setShowImageStyles] = useState(false);

  // Estado para controlar la adición de un nuevo enlace social
  const [isAddingLink, setIsAddingLink] = useState(false);

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

  const handleModalFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModalTempFile(file);
    setModalTempPreview(URL.createObjectURL(file));
    setModalRemoveImage(false);
  };

  const handleConfirmImageSelection = () => {
    if (modalRemoveImage) {
      setSelectedFile(null);
      setLocalPreview("");
      setPortfolioData({ ...portfolioData, mainImage: "", imagen: "", image: "" });
    } else if (modalTempFile) {
      setSelectedFile(modalTempFile);
      setLocalPreview(modalTempPreview);
    }
    setIsImageModalOpen(false);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
  };

  const handleCancelImageSelection = () => {
    setIsImageModalOpen(false);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
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

    if (localPreview === "") {
      finalImageUrl = "";
      updatedData.mainImage = "";
      updatedData.imagen = "";
      updatedData.image = "";
    } else if (selectedFile) {
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

  const currentImageDisplay = localPreview !== null ? localPreview : (portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image);
  const portfolioSlug = portfolioData?.slug || portfolioData?.username || "tu-usuario";

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Title 
        title="Página Principal" 
        externalRoute={`/${portfolioSlug}`} 
        openInNewTab={true}
      />

      <div className="space-y-3">
        {isEditingTitle ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={portfolioData?.title || ""}
                onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                onBlur={(e) => {
                  if (!e.currentTarget.parentElement?.parentElement?.contains(e.relatedTarget)) {
                    setIsEditingTitle(false);
                  }
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingTitle(false); }}
                className="w-full bg-white border border-slate-900 rounded-xl px-4 py-3 text-lg font-semibold text-slate-900 focus:outline-none shadow-sm"
                placeholder="Ej. Mi Portfolio Profesional"
              />
            </div>

            {/* 📐 OPCIONES DE ALINEACIÓN CON ÍCONOS */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs font-medium text-slate-500 mr-1">Alineación:</span>
              
              {/* Izquierda */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setPortfolioData({ ...portfolioData, titleAlign: "left" })}
                title="Alinear a la izquierda"
                className={`p-2 rounded-lg border transition-all ${
                  (portfolioData?.titleAlign || "left") === "left"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
                </svg>
              </button>

              {/* Centro */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setPortfolioData({ ...portfolioData, titleAlign: "center" })}
                title="Alinear al centro"
                className={`p-2 rounded-lg border transition-all ${
                  portfolioData?.titleAlign === "center"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
                </svg>
              </button>

              {/* Derecha */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setPortfolioData({ ...portfolioData, titleAlign: "right" })}
                title="Alinear a la derecha"
                className={`p-2 rounded-lg border transition-all ${
                  portfolioData?.titleAlign === "right"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingTitle(true)}
            className="w-full bg-transparent border-none px-0 py-2 text-lg font-semibold text-slate-900 flex items-center justify-start gap-2.5 transition group cursor-pointer w-fit"
          >
            <span className={portfolioData?.title ? "text-slate-900 font-semibold group-hover:underline decoration-slate-900 underline-offset-4 transition-all" : "text-slate-400 italic font-normal text-base group-hover:underline decoration-slate-400 underline-offset-4 transition-all"}>
              {portfolioData?.title || "Sin título principal (Haz clic para editar)"}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="text-slate-400 group-hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-0.5 text-xs font-medium shrink-0"
              title="Editar título"
            >
              <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editar
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <div className="w-full bg-transparent p-0 flex justify-start">
          <div 
            onClick={() => setIsImageModalOpen(true)}
            className="relative w-full max-w-[240px] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer group border border-slate-200 hover:border-purple-500 transition shadow-sm"
          >
            {currentImageDisplay ? (
              <>
                <img src={currentImageDisplay} alt="Imagen principal actual" className="w-full h-auto object-contain max-h-[300px] group-hover:opacity-75 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white gap-1">
                  <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="text-xs font-medium">Cambiar imagen</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-slate-400 group-hover:text-purple-600 transition-colors gap-2">
                <svg className="w-8 h-8 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs italic">Haz clic para subir una imagen principal</span>
              </div>
            )}
          </div>
        </div>

        {selectedFile && !uploading && <span className="text-xs text-amber-600 italic block">Imagen lista para guardar...</span>}
        {uploading && <span className="text-xs text-purple-600 block">Subiendo a Cloudinary...</span>}

        {/* 🎨 BOTÓN DE DISEÑO DE IMAGEN */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowImageStyles(!showImageStyles)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors border border-slate-200"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Diseño de imagen</span>
            <svg 
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${showImageStyles ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 🌀 MENÚ DESPLEGABLE CON PREVIEWS ESTILO MÓVIL */}
          <div className={`grid transition-all duration-300 ease-in-out ${showImageStyles ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
            <div className="overflow-hidden">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 max-w-2xl">
                <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Estilo visual de la imagen</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  
                  {/* 1. REDONDA */}
                  <button
                    type="button"
                    onClick={() => setPortfolioData({ ...portfolioData, imageStyle: 'rounded' })}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                      (portfolioData?.imageStyle || 'rounded') === 'rounded'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-full h-56 bg-emerald-200/80 rounded-2xl p-0 pt-2 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-emerald-300">
                      {currentImageDisplay ? (
                        <img src={currentImageDisplay} alt="Preview" className="w-14 h-14 rounded-full object-cover shrink-0 mt-1 ring-2 ring-white shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-emerald-300/80 shrink-0 mt-1 flex items-center justify-center text-xs text-emerald-800">📷</div>
                      )}
                      <span className="text-[10px] font-semibold text-emerald-950 px-2 line-clamp-2 leading-snug">
                        {portfolioData?.title || "Sin título"}
                      </span>
                      <div className="w-full space-y-2 px-2.5 opacity-90">
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-2">Redonda</span>
                  </button>

                  {/* 2. TODO EL ANCHO */}
                  <button
                    type="button"
                    onClick={() => setPortfolioData({ ...portfolioData, imageStyle: 'full-width' })}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                      portfolioData?.imageStyle === 'full-width'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-full h-56 bg-emerald-200/80 rounded-2xl p-0 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-emerald-300">
                      {currentImageDisplay ? (
                        <img src={currentImageDisplay} alt="Preview" className="w-full h-20 object-cover shrink-0" />
                      ) : (
                        <div className="w-full h-20 bg-emerald-300/80 shrink-0 flex items-center justify-center text-xs text-emerald-800">📷</div>
                      )}
                      <span className="text-[10px] font-semibold text-emerald-950 px-2 line-clamp-2 leading-snug text-center">
                        {portfolioData?.title || "Sin título"}
                      </span>
                      <div className="w-full space-y-2 px-2.5 opacity-90">
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-2">Todo el ancho</span>
                  </button>

                  {/* 3. DIFUMINADO ABAJO */}
                  <button
                    type="button"
                    onClick={() => setPortfolioData({ ...portfolioData, imageStyle: 'fade-bottom' })}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                      portfolioData?.imageStyle === 'fade-bottom'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-full h-56 bg-emerald-200/80 rounded-2xl p-0 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-emerald-300 relative">
                      <div className="relative w-full h-24 shrink-0">
                        {currentImageDisplay ? (
                          <img src={currentImageDisplay} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-emerald-300/80 flex items-center justify-center text-xs text-emerald-800">📷</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-200 via-emerald-200/40 to-transparent"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-950 px-2 line-clamp-2 leading-snug text-center z-10 -mt-5">
                        {portfolioData?.title || "Sin título"}
                      </span>
                      <div className="w-full space-y-2 px-2.5 opacity-90 z-10">
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-2">Difuminado</span>
                  </button>

                  {/* 4. RECTANGULAR HORIZONTAL */}
                  <button
                    type="button"
                    onClick={() => setPortfolioData({ ...portfolioData, imageStyle: 'horizontal' })}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                      portfolioData?.imageStyle === 'horizontal'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-full h-56 bg-emerald-200/80 rounded-2xl p-0 pt-2 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-emerald-300">
                      <div className="px-2.5 w-full">
                        {currentImageDisplay ? (
                          <img src={currentImageDisplay} alt="Preview" className="w-full h-20 rounded-lg object-cover shrink-0 shadow-xs" />
                        ) : (
                          <div className="w-full h-20 rounded-lg bg-emerald-300/80 shrink-0 flex items-center justify-center text-xs text-emerald-800">📷</div>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-950 px-2 line-clamp-2 leading-snug">
                        {portfolioData?.title || "Sin título"}
                      </span>
                      <div className="w-full space-y-2 px-2.5 opacity-90">
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-2">Horizontal</span>
                  </button>

                  {/* 5. CUADRADA REDONDEADA */}
                  <button
                    type="button"
                    onClick={() => setPortfolioData({ ...portfolioData, imageStyle: 'square-rounded' })}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                      portfolioData?.imageStyle === 'square-rounded'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-full h-56 bg-emerald-200/80 rounded-2xl p-0 pt-2 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-emerald-300">
                      {currentImageDisplay ? (
                        <img src={currentImageDisplay} alt="Preview" className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-emerald-300/80 shrink-0 flex items-center justify-center text-xs text-emerald-800">📷</div>
                      )}
                      <span className="text-[10px] font-semibold text-emerald-950 px-2 line-clamp-2 leading-snug">
                        {portfolioData?.title || "Sin título"}
                      </span>
                      <div className="w-full space-y-2 px-2.5 opacity-90">
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-2">Cuadrada redondeada</span>
                  </button>

                  {/* 6. MARCO ASIMÉTRICO */}
                  <button
                    type="button"
                    onClick={() => setPortfolioData({ ...portfolioData, imageStyle: 'creative-blob' })}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                      portfolioData?.imageStyle === 'creative-blob'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="w-full h-56 bg-emerald-200/80 rounded-2xl p-0 pt-2 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-emerald-300">
                      <div className="p-[2px] bg-gradient-to-tr from-teal-500 via-emerald-500 to-amber-400 rounded-2xl rounded-tr-xs shrink-0 shadow-xs">
                        {currentImageDisplay ? (
                          <img src={currentImageDisplay} alt="Preview" className="w-20 h-20 rounded-2xl rounded-tr-xs object-cover" />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl rounded-tr-xs bg-emerald-300/80 flex items-center justify-center text-xs text-emerald-800">📷</div>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-950 px-2 line-clamp-2 leading-snug">
                        {portfolioData?.title || "Sin título"}
                      </span>
                      <div className="w-full space-y-2 px-2.5 opacity-90">
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                        <div className="w-full h-5 bg-white rounded-sm shadow-2xs"></div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 mt-2">Marco Asimétrico</span>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PARA SUBIR O REMOVER IMAGEN PRINCIPAL */}
      <AnimatePresence>
        {isImageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl border border-purple-100 w-full max-w-md overflow-hidden p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Actualizar Imagen Principal</h3>
                <button
                  type="button"
                  onClick={handleCancelImageSelection}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-6 bg-purple-50/30 transition text-center relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleModalFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  {modalRemoveImage ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <span className="text-sm font-medium text-black">Se eliminará la imagen actual al guardar</span>
                      <span className="text-xs text-black">Haz clic o arrastra otra si deseas reemplazarla</span>
                    </div>
                  ) : modalTempPreview ? (
                    <div className="space-y-3 flex flex-col items-center">
                      <img src={modalTempPreview} alt="Preview nueva" className="max-h-48 rounded-xl object-contain shadow-sm" />
                      <span className="text-xs text-purple-700 font-medium bg-purple-100 px-3 py-1 rounded-full">
                        Haz clic o arrastra otra para cambiar
                      </span>
                    </div>
                  ) : currentImageDisplay ? (
                    <div className="space-y-3 flex flex-col items-center">
                      <img src={currentImageDisplay} alt="Actual" className="max-h-40 rounded-xl object-contain opacity-80" />
                      <span className="text-xs text-black font-medium">
                        Haz clic aquí para seleccionar una nueva imagen
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col items-center">
                      <svg className="w-10 h-10 text-purple-500 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-black">Arrastra tu imagen aquí o haz clic</span>
                      <span className="text-xs text-black">PNG, JPG, WEBP hasta 10MB</span>
                    </div>
                  )}
                </div>

                {currentImageDisplay && !modalRemoveImage && !modalTempFile && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setModalRemoveImage(true);
                        setModalTempFile(null);
                        setModalTempPreview(null);
                      }}
                      className="text-black hover:bg-black/5 text-xs font-medium px-4 py-2 rounded-xl border border-black transition flex items-center justify-center gap-1.5 cursor-pointer w-fit"
                    >
                      <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remover imagen
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelImageSelection}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImageSelection}
                  disabled={!modalTempFile && !modalRemoveImage}
                  className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
                >
                  Aceptar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-3 pt-2">
        <label className="text-base font-semibold text-slate-900 block">Biografía</label>
        {isEditingBio ? (
          <Bio
            portfolioData={portfolioData} 
            setPortfolioData={setPortfolioData} 
            setIsEditingBio={setIsEditingBio} 
          />
        ) : (
          <div
            onClick={() => setIsEditingBio(true)}
            className="w-full px-1 py-1 text-sm text-slate-900 cursor-pointer transition hover:underline decoration-slate-900 underline-offset-4"
          >
            {portfolioData?.description || (
              <span className="text-slate-400 italic">Escribe una breve bio o descripción para tu portfolio...</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-4 pb-4">
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
              const isConfirmingDelete = deleteConfirmUid === linkItem.uid;

              return (
                <Social
                  key={linkItem.uid}
                  linkItem={linkItem}
                  iconUrl={iconUrl}
                  stableLinks={stableLinks}
                  portfolioData={portfolioData}
                  setPortfolioData={setPortfolioData}
                  isConfirmingDelete={isConfirmingDelete}
                  setDeleteConfirmUid={setDeleteConfirmUid}
                  handleRemoveLink={handleRemoveLink}
                />
              );
            })}
          </Reorder.Group>
        ) : (
          <p className="text-xs text-slate-500 italic pt-1">No hay enlaces agregados todavía.</p>
        )}

        {isAddingLink ? (
          <div 
            className="flex items-center gap-2 pt-2"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsAddingLink(false);
              }
            }}
          >
            <input
              type="text"
              autoFocus
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') { 
                  e.preventDefault(); 
                  handleAddLink(); 
                  setIsAddingLink(false);
                } 
              }}
              className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 shadow-sm"
              placeholder="Ej. https://instagram.com/tu_usuario o cualquier web"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                handleAddLink();
                setIsAddingLink(false);
              }}
              className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-xl text-sm font-medium transition shadow-sm shrink-0 cursor-pointer"
            >
              Añadir
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingLink(true)}
            className="w-full bg-white border border-purple-100 hover:border-purple-200 rounded-xl py-3.5 flex items-center justify-center text-slate-600 hover:text-purple-700 transition shadow-sm cursor-pointer mt-2"
            title="Añadir red social"
          >
            <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {/* SECCIÓN: Páginas */}
      <div className="space-y-3 pt-4 pb-4">
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
              const isDeleteOpen = openDeletePageUid === page.uid;
              const currentLayout = page.layout || "grid-3";
              const pageSlug = page.slug || page.path || "";
              const absoluteShareUrl = typeof window !== "undefined" ? `${window.location.origin}/${portfolioSlug}/${pageSlug}` : `/${portfolioSlug}/${pageSlug}`;

              return (
                <PageItem
                  key={page.uid}
                  page={page}
                  pageType={pageType}
                  pageSlug={pageSlug}
                  portfolioSlug={portfolioSlug}
                  absoluteShareUrl={absoluteShareUrl}
                  isVisibleOnHome={isVisibleOnHome}
                  isImageType={isImageType}
                  isLayoutOpen={isLayoutOpen}
                  isShareOpen={isShareOpen}
                  isDeleteOpen={isDeleteOpen}
                  currentLayout={currentLayout}
                  
                  // Handlers y funciones de estado (asegúrate de que existan en este componente padre)
                  handleTogglePageVisibility={handleTogglePageVisibility}
                  setOpenLayoutPageUid={setOpenLayoutPageUid}
                  setOpenSharePageUid={setOpenSharePageUid}
                  setOpenDeletePageUid={setOpenDeletePageUid}
                  handleUpdatePageLayout={handleUpdatePageLayout}
                  
                  stablePages={stablePages}
                  portfolioData={portfolioData}
                  setPortfolioData={setPortfolioData}
                />
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