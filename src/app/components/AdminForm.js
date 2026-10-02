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
 * Permite gestionar en tiempo real la información principal del portafolio:
 * título, biografía, imagen principal, redes sociales y páginas creadas.
 */
export default function AdminForm({ portfolioData, setPortfolioData, onSave, saving, onTogglePreview }) {
  // ==========================================
  // ESTADOS LOCALES Y CONTROLES DE INTERFAZ
  // ==========================================
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  
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

  // Estados de confirmación y visibilidad
  const [deleteConfirmUid, setDeleteConfirmUid] = useState(null);
  const [showImageStyles, setShowImageStyles] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);

  // ==========================================
  // MEMORIZACIÓN Y REFERENCIAS ESTABLES
  // ==========================================

  /** Garantiza un identificador único (uid) estable para cada red social */
  const stableLinks = useMemo(() => {
    const links = portfolioData?.socialLinks || [];
    return links.map(link => ({
      ...link,
      uid: link.id || link.uid || link.url
    }));
  }, [portfolioData?.socialLinks]);

  /** Garantiza un identificador único (uid) estable para cada página */
  const stablePages = useMemo(() => {
    const pages = portfolioData?.pages || [];
    return pages.map(page => ({
      ...page,
      uid: page.id || page.uid || page.slug || page.path
    }));
  }, [portfolioData?.pages]);

  /** Referencia para capturar la última versión de las páginas durante gestos de arrastre */
  const latestPagesRef = useRef(stablePages);

  useEffect(() => {
    latestPagesRef.current = stablePages;
  }, [stablePages]);

  // ==========================================
  // 1. MANEJADORES DE PÁGINAS (AUTO-SAVE)
  // ==========================================

  /**
   * Alterna la visibilidad de una página en la vista de inicio.
   * @param {string} pageUid - Identificador único de la página.
   */
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

  /**
   * Elimina una página del portafolio y persiste los cambios en la BD.
   * @param {string} pageUid - Identificador único de la página a eliminar.
   */
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

  /**
   * Actualiza la disposición visual (layout) de una página específica sin cerrar el selector.
   * @param {string} pageUid - Identificador único de la página.
   * @param {string} layoutType - Tipo de layout elegido ('grid-3', 'single-large', 'masonry-grid').
   */
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

  /**
   * Actualiza la secuencia de páginas localmente durante el arrastre con Framer Motion.
   * @param {Array} newPages - Arreglo con la nueva secuencia de páginas.
   */
  const handleReorderPages = (newPages) => {
    setPortfolioData({ ...portfolioData, pages: newPages });
  };

  /**
   * Persiste el nuevo orden de las páginas al finalizar el gesto de arrastre.
   */
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

  /**
   * Devuelve la URL del icono SVG correspondiente al dominio introducido.
   * @param {string} url - Dirección web de la red social.
   * @returns {string} URL del recurso SVG.
   */
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

  /**
   * Registra una nueva red social y guarda de forma automática los datos.
   */
  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;
    
    const newLink = { uid: Date.now().toString(), url: newLinkUrl.trim(), enabled: true };
    const updatedLinks = [...stableLinks, newLink];
    const updatedData = { ...portfolioData, socialLinks: updatedLinks };

    setPortfolioData(updatedData);
    setNewLinkUrl("");

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la nueva red social:", error);
      }
    }
  };

  /**
   * Reordena los enlaces de redes sociales.
   * @param {Array} newSocialLinks - Nueva lista ordenada de enlaces.
   */
  const handleReorder = (newSocialLinks) => {
    setPortfolioData({ ...portfolioData, socialLinks: newSocialLinks });
  };

  // ==========================================
  // 3. MANEJADORES DE IMAGEN PRINCIPAL
  // ==========================================

  /**
   * Captura el archivo seleccionado en el selector de archivos del modal.
   */
  const handleModalFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModalTempFile(file);
    setModalTempPreview(URL.createObjectURL(file));
    setModalRemoveImage(false);
  };

  /**
   * Procesa la subida a Cloudinary o la remoción de la imagen principal.
   */
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

  /**
   * Cancela la selección de imagen y limpia los datos temporales del modal.
   */
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

        {/* Desplegable: Opciones de estilo visual de la imagen */}
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

          <div className={`grid transition-all duration-300 ease-in-out ${showImageStyles ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
            <div className="overflow-hidden">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 max-w-2xl">
                <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Estilo visual de la imagen</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { styleValue: "rounded", label: "Redonda" },
                    { styleValue: "full-width", label: "Todo el ancho" },
                    { styleValue: "fade-bottom", label: "Difuminado" },
                    { styleValue: "horizontal", label: "Horizontal" },
                    { styleValue: "square-rounded", label: "Cuadrada redondeada" },
                    { styleValue: "creative-blob", label: "Marco Asimétrico" },
                  ].map(({ styleValue, label }) => (
                    <ImageStyleOption 
                      key={styleValue}
                      styleValue={styleValue}
                      label={label}
                      currentImageDisplay={currentImageDisplay}
                      portfolioData={portfolioData}
                      onSave={onSave}
                      setPortfolioData={setPortfolioData}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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

      {/* SECCIÓN: Redes Sociales */}
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
                  onSave={onSave}
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