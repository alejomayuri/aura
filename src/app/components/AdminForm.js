"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import Social from "./AdminFormsComponents/home/Social";
import { PageItem } from "./AdminFormsComponents/PageItem";
import EditableTitleInput from "./AdminFormsComponents/home/EditableTitleInput";
import { Bio } from "./AdminFormsComponents/home/Bio";
import { ImageStyleOption } from "./AdminFormsComponents/home/ImageStyleOption";

/**
 * Componente principal de administración de formulario (AdminForm)
 */
export default function AdminForm({ portfolioData, setPortfolioData, onSave, saving, onTogglePreview }) {
  // ==========================================
  // ESTADOS LOCALES Y CONTROLES DE INTERFAZ
  // ==========================================
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  
  // Control para mostrar/ocultar el formulario de nueva red dentro del modal
  const [showAddSocialForm, setShowAddSocialForm] = useState(false);

  // Control de menús desplegables en páginas
  const [openLayoutPageUid, setOpenLayoutPageUid] = useState(null);
  const [openSharePageUid, setOpenSharePageUid] = useState(null);
  const [openDeletePageUid, setOpenDeletePageUid] = useState(null);

  // Control de edición en línea (Inline Edit)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Estado del Modal de Imagen Principal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalTempFile, setModalTempFile] = useState(null);
  const [modalTempPreview, setModalTempPreview] = useState(null);
  const [modalRemoveImage, setModalRemoveImage] = useState(false);

  // Estado del Modal de Redes Sociales
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  // Estados de confirmación y visibilidad
  const [deleteConfirmUid, setDeleteConfirmUid] = useState(null);
  const [showImageStyles, setShowImageStyles] = useState(false);

  // Posición de redes sociales (por defecto 'bottom' o 'top')
  const socialPosition = portfolioData?.socialPosition || "bottom";

  // ==========================================
  // MEMORIZACIÓN Y REFERENCIAS ESTABLES
  // ==========================================

  const stableLinks = useMemo(() => {
    const links = portfolioData?.socialLinks || [];
    return links.map(link => ({
      ...link,
      uid: link.id || link.uid || link.url
    }));
  }, [portfolioData?.socialLinks]);

  const stablePages = useMemo(() => {
    const pages = portfolioData?.pages || [];
    return pages.map(page => ({
      ...page,
      uid: page.id || page.uid || page.slug || page.path
    }));
  }, [portfolioData?.pages]);

  const latestPagesRef = useRef(stablePages);

  useEffect(() => {
    latestPagesRef.current = stablePages;
  }, [stablePages]);

  // ==========================================
  // 1. MANEJADORES DE PÁGINAS (AUTO-SAVE)
  // ==========================================

  const handleTogglePageVisibility = async (pageUid) => {
    const updatedPages = stablePages.map((page) => {
      if (page.uid === pageUid) {
        return { 
          ...page, 
          showOnHome: page.showOnHome === false ? true : false 
        };
      }
      return page;
    });

    const updatedData = {
      ...portfolioData,
      socialLinks: stableLinks,
      pages: updatedPages,
    };

    setPortfolioData(updatedData);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la visibilidad de la página:", error);
      }
    }
  };

  const handleDeletePage = async (pageUid) => {
    const updatedPages = stablePages.filter((page) => page.uid !== pageUid);

    const updatedData = {
      ...portfolioData,
      pages: updatedPages,
    };

    setPortfolioData(updatedData);
    setOpenDeletePageUid(null);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al eliminar la página:", error);
      }
    }
  };

  const handleUpdatePageLayout = async (pageUid, layoutType) => {
    const updatedPages = stablePages.map((page) => {
      if ((page.uid || page.id) === pageUid) {
        return { ...page, layout: layoutType };
      }
      return page;
    });

    const updatedData = {
      ...portfolioData,
      socialLinks: stableLinks,
      pages: updatedPages,
    };

    setPortfolioData(updatedData);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al actualizar el layout de la página:", error);
      }
    }
  };

  const handleReorderPages = (newPages) => {
    setPortfolioData({ ...portfolioData, pages: newPages });
  };

  const handlePageDragEnd = async () => {
    const updatedData = {
      ...portfolioData,
      socialLinks: stableLinks,
      pages: latestPagesRef.current,
    };

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar el reordenamiento de páginas:", error);
      }
    }
  };

  // ==========================================
  // 2. MANEJADORES DE REDES SOCIALES
  // ==========================================

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

  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;
    
    const newLink = { uid: Date.now().toString(), url: newLinkUrl.trim(), enabled: true };
    const updatedLinks = [...stableLinks, newLink];
    const updatedData = { ...portfolioData, socialLinks: updatedLinks };

    setPortfolioData(updatedData);
    setNewLinkUrl("");
    setShowAddSocialForm(false);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la nueva red social:", error);
      }
    }
  };

  const handleReorder = (newSocialLinks) => {
    setPortfolioData({ ...portfolioData, socialLinks: newSocialLinks });
  };

  const handleChangeSocialPosition = async (position) => {
    const updatedData = {
      ...portfolioData,
      socialLinks: stableLinks,
      socialPosition: position,
    };

    setPortfolioData(updatedData);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la posición de las redes sociales:", error);
      }
    }
  };

  const handleCloseSocialModal = () => {
    setIsSocialModalOpen(false);
    setShowAddSocialForm(false);
    setNewLinkUrl("");
  };

  // ==========================================
  // 3. MANEJADORES DE IMAGEN PRINCIPAL
  // ==========================================

  const handleModalFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModalTempFile(file);
    setModalTempPreview(URL.createObjectURL(file));
    setModalRemoveImage(false);
  };

  const handleConfirmImageSelection = async () => {
    let updatedData = { 
      ...portfolioData, 
      socialLinks: stableLinks, 
      pages: stablePages 
    };

    if (modalRemoveImage) {
      setSelectedFile(null);
      setLocalPreview("");
      updatedData.mainImage = "";
      updatedData.imagen = "";
      updatedData.image = "";
      setPortfolioData(updatedData);

      setIsImageModalOpen(false);
      setModalTempFile(null);
      setModalTempPreview(null);
      setModalRemoveImage(false);

      if (typeof onSave === "function") {
        await onSave(updatedData);
      }
      return;
    } 
    
    if (modalTempFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", modalTempFile);
      formData.append("upload_preset", "pataki_portfolio_upload");

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dz3p460iu/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        
        if (data.secure_url) {
          const finalImageUrl = data.secure_url;
          setSelectedFile(null);
          setLocalPreview(finalImageUrl);
          
          updatedData.mainImage = finalImageUrl;
          updatedData.imagen = finalImageUrl;
          updatedData.image = finalImageUrl;
          setPortfolioData(updatedData);

          if (typeof onSave === "function") {
            await onSave(updatedData);
          }
        }
      } catch (error) {
        console.error("Error al subir la imagen a Cloudinary:", error);
      } finally {
        setUploading(false);
      }
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

  const currentImageDisplay = localPreview !== null ? localPreview : (portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image);
  const portfolioSlug = portfolioData?.slug || portfolioData?.username || "tu-usuario";

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Title 
        title="Página Principal" 
        externalRoute={`/${portfolioSlug}`} 
        openInNewTab={true}
      />

      {/* SECCIÓN: Imagen Principal */}
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

        {uploading && <span className="text-xs text-purple-600 block">Subiendo imagen y guardando cambios...</span>}
      </div>

      {/* MODAL DE IMAGEN PRINCIPAL */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isImageModalOpen && (
            <div 
              onClick={handleCancelImageSelection}
              className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 overflow-y-auto cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-md overflow-hidden p-6 space-y-5 my-auto cursor-default"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Actualizar Imagen Principal</h3>
                  <button
                    type="button"
                    onClick={handleCancelImageSelection}
                    className="text-slate-400 hover:text-black transition-colors cursor-pointer p-1"
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
                        <span className="text-sm font-medium text-black">Se eliminará la imagen actual al aceptar</span>
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
                    disabled={(!modalTempFile && !modalRemoveImage) || uploading}
                    className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
                  >
                    {uploading ? "Subiendo..." : "Aceptar"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <EditableTitleInput
        portfolioData={portfolioData}
        setPortfolioData={setPortfolioData}
        isEditingTitle={isEditingTitle}
        setIsEditingTitle={setIsEditingTitle}
        onSave={onSave}
        saving={saving}
        stableLinks={stableLinks}
        stablePages={stablePages}
      />

      {/* SECCIÓN: Redes Sociales */}
      <div className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          {stableLinks.map((linkItem) => {
            const iconUrl = getSocialIcon(linkItem.url);
            const isEnabled = linkItem.enabled !== false;

            return (
              <button
                key={linkItem.uid}
                type="button"
                onClick={() => setIsSocialModalOpen(true)}
                className={`w-6 h-6 flex items-center mr-2 justify-center transition-all cursor-pointer`}
                title={linkItem.url}
              >
                <img src={iconUrl} alt="Red social" className="w-full h-full object-contain" />
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsSocialModalOpen(true)}
            className="w-7 h-7 rounded-full border border-slate-700 bg-slate-100/50 hover:bg-slate-100/70 text-slate-700 flex items-center justify-center transition shadow-sm cursor-pointer"
            title="Añadir red social"
          >
            <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* MODAL DE REDES SOCIALES */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isSocialModalOpen && (
            <div 
              onClick={handleCloseSocialModal}
              className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 overflow-y-auto cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-lg overflow-hidden p-6 space-y-5 my-auto cursor-default max-h-[90vh] flex flex-col"
              >
                <div className="flex items-center justify-between shrink-0 mb-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-0">Configurar Redes Sociales</h3>
                  <button
                    type="button"
                    onClick={handleCloseSocialModal}
                    className="text-slate-400 hover:text-black transition-colors cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>
                <span className="text-sm text-slate-600">
                  Añade tus perfiles, emails o redes sociales a tu página.
                </span>

                {/* Botón o Formulario de creación */}
                <div className="shrink-0 pt-1">
                  {!showAddSocialForm ? (
                    <button
                      type="button"
                      onClick={() => setShowAddSocialForm(true)}
                      className="w-full bg-black text-white border border-black py-2.5 rounded-xl text-sm font-medium transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Añadir red social
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        onKeyDown={(e) => { 
                          if (e.key === 'Enter') { 
                            e.preventDefault(); 
                            handleAddLink(); 
                          } 
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-black shadow-sm"
                        placeholder="Ej. https://instagram.com/tu_usuario"
                      />
                      <button
                        type="button"
                        onClick={handleAddLink}
                        className="bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm shrink-0 cursor-pointer"
                      >
                        Añadir
                      </button>
                    </div>
                  )}
                </div>

                {/* Lista reordenable */}
                <div className="overflow-y-auto pr-1 space-y-2 flex-1 min-h-0">
                  {stableLinks.length > 0 ? (
                    <Reorder.Group 
                      axis="y" 
                      values={stableLinks} 
                      onReorder={handleReorder}
                      className="space-y-2.5 list-none"
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
                            onSave={onSave}
                          />
                        );
                      })}
                    </Reorder.Group>
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-6">
                      No hay enlaces agregados todavía. Pulsa el botón superior para agregar uno.
                    </p>
                  )}
                </div>

                {/* SECCIÓN: Selección de Ubicación con Radio Buttons Apilados */}
                <div className="shrink-0 pt-3 space-y-2.5">
                  <h3 className="text-lg font-semibold mb-1 text-slate-900">
                    Ubicación
                  </h3>
                  <span className="text-sm text-slate-600">
                    Selecciona la ubicación de las redes sociales en tu página.
                  </span>
                  
                  <div className="flex flex-col space-y-2">
                    {/* Opción ARRIBA */}
                    <label 
                      onClick={() => handleChangeSocialPosition("top")}
                      className={`flex items-center text-slate-900 gap-3 py-6 rounded-xl mb-0 cursor-pointer transition-all`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        socialPosition === "top" ? "border-black" : "border-slate-300"
                      }`}>
                        {socialPosition === "top" && (
                          <div className="w-3 h-3 rounded-full bg-black" />
                        )}
                      </div>
                      <span className="text-md font-medium">Arriba</span>
                    </label>

                    {/* Opción ABAJO */}
                    <label 
                      onClick={() => handleChangeSocialPosition("bottom")}
                      className={`flex items-center text-slate-900 gap-3 rounded-xl cursor-pointer transition-all`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        socialPosition === "bottom" ? "border-black" : "border-slate-300"
                      }`}>
                        {socialPosition === "bottom" && (
                          <div className="w-3 h-3 rounded-full bg-black" />
                        )}
                      </div>
                      <span className="text-md font-medium">Abajo</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* SECCIÓN: Biografía */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-slate-900 block">Biografía</label>
        <Bio
          portfolioData={portfolioData} 
          setPortfolioData={setPortfolioData} 
          setIsEditingBio={setIsEditingBio} 
          isEditingBio={isEditingBio}
          onSave={onSave}
          saving={saving}
          stableLinks={stableLinks}
          stablePages={stablePages}
        />
      </div>

      

      {/* SECCIÓN: Páginas */}
      <div className="space-y-3 pt-4 pb-4">
        <label className="text-base font-semibold text-slate-900 block">Páginas</label>

        {stablePages.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={stablePages} 
            onReorder={handleReorderPages}
            onPanEnd={handlePageDragEnd}
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
                  
                  handleTogglePageVisibility={handleTogglePageVisibility}
                  setOpenLayoutPageUid={setOpenLayoutPageUid}
                  setOpenSharePageUid={setOpenSharePageUid}
                  setOpenDeletePageUid={setOpenDeletePageUid}
                  handleUpdatePageLayout={handleUpdatePageLayout}
                  
                  stablePages={stablePages}
                  portfolioData={portfolioData}
                  setPortfolioData={() => handleDeletePage(page.uid)}
                  onDragEnd={handlePageDragEnd}
                />
              );
            })}
          </Reorder.Group>
        ) : (
          <p className="text-xs text-slate-500 italic pt-1">No hay páginas creadas todavía.</p>
        )}
      </div>
    </div>
  );
}