"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Title from "./AdminFormsComponents/Title";
import { ImageStyleOption } from "./AdminFormsComponents/home/ImageStyleOption";

export default function DesignForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage }) {
  // Estados para manejo del modal y la subida de imagen principal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showImageStyles, setShowImageStyles] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [modalTempFile, setModalTempFile] = useState(null);
  const [modalTempPreview, setModalTempPreview] = useState(null);
  const [modalRemoveImage, setModalRemoveImage] = useState(false);

  // Referencia temporal para manejar el temporizador de guardado automático de colores (debounce)
  const [colorTimeout, setColorTimeout] = useState(null);

  const currentImageDisplay = portfolioData?.mainImage || portfolioData?.profileImage || portfolioData?.imagen || portfolioData?.image || null;

  const templates = [
    {
      id: "minimal",
      name: "Minimal",
      cardBg: "bg-slate-900 border-slate-800 text-white",
      fontFamily: "Roboto",
      socialShape: "w-7 h-7 rounded-full bg-slate-800 border border-slate-700",
      previewCard: "bg-slate-800/30 border border-slate-700 rounded-2xl text-slate-200 shadow-sm py-3.5 font-medium",
      previewBtnText: "Minimal UI",
    },
    {
      id: "neon",
      name: "Neón",
      cardBg: "uppercase bg-slate-950 border-3 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      fontFamily: "Roboto",
      socialShape: "w-7 h-7 bg-purple-950/40 border border-purple-500/40 shadow-sm",
      previewCard: "bg-purple-950/40 border border-purple-500/40 text-purple-300 py-3.5 font-semibold uppercase",
      previewBtnText: "Glow",
    },
    {
      id: "classic",
      name: "Clásico",
      cardBg: "bg-zinc-900 border-zinc-700 text-zinc-100 text-lg",
      fontFamily: "font-serif",
      socialShape: "w-7 h-7 rounded-sm bg-zinc-800 border border-zinc-700 text-zinc-300 shadow-sm",
      previewCard: "bg-zinc-800/80 border border-zinc-700 rounded-sm text-zinc-200 py-3.5 font-semibold",
      previewBtnText: "Editorial",
    },
    {
      id: "brutal",
      name: "Brutalism",
      cardBg: "bg-yellow-400 border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
      fontFamily: "font-mono font-black uppercase tracking-tight",
      socialShape: "w-7 h-7 rounded-none bg-white border-2 border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]",
      previewCard: "font-semibold bg-white border-2 border-black rounded-none text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] py-3.5",
      previewBtnText: "NEO-BRUTAL",
    },
    {
      id: "glass",
      name: "Glass",
      cardBg: "bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-200 border border-white/40 text-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
      fontFamily: "font-sans tracking-tight",
      socialShape: "w-7 h-7 rounded-[.75rem] bg-white/30 backdrop-blur-sm border border-white/50 text-slate-700 shadow-sm",
      previewCard: "font-semibold bg-white/20 backdrop-blur-md border border-white/40 rounded-[1.1rem] text-slate-700 shadow-sm py-3.5",
      previewBtnText: "Blur Effect",
    },
    {
      id: "terminal",
      name: "Terminal",
      cardBg: "bg-black border border-green-500/50 text-green-400",
      fontFamily: "font-mono tracking-tighter",
      socialShape: "w-7 h-7 rounded-none bg-black border border-green-500 text-green-400 shadow-[0_0_5px_rgba(34,197,94,0.3)]",
      previewCard: "font-semibold bg-black border border-green-500 rounded-none text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)] py-3.5",
      previewBtnText: ">_ bash",
    },
    {
      id: "y2k",
      name: "Y2K",
      cardBg: "bg-fuchsia-600 border-4 border-lime-300 text-lime-300 shadow-[6px_6px_0px_0px_#bef264]",
      fontFamily: "font-mono font-black uppercase tracking-widest",
      socialShape: "w-7 h-7 rounded-none bg-lime-300 border-2 border-fuchsia-950 text-fuchsia-950 shadow-[2px_2px_0px_0px_#000]",
      previewCard: "font-mono font-black bg-cyan-300 border-2 border-fuchsia-950 text-fuchsia-950 shadow-[3px_3px_0px_0px_#581c87] rounded-none py-3.5 uppercase",
      previewBtnText: "Cyber",
    },
    {
      id: "holographic",
      name: "Holographic",
      cardBg: "bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 border-2 border-white/80 text-white shadow-[0_0_25px_rgba(236,72,153,0.4)] backdrop-blur-2xl",
      fontFamily: "font-sans font-extrabold tracking-wide",
      socialShape: "w-7 h-7 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-white shadow-md",
      previewCard: "font-bold bg-white/15 backdrop-blur-md border border-white/40 rounded-2xl text-white shadow-lg py-3.5 tracking-wider",
      previewBtnText: "Holo Glow",
    },
    {
      id: "comic",
      name: "Comic",
      cardBg: "bg-yellow-200 border-4 border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
      fontFamily: "text-black font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_#fff]",
      socialShape: "w-7 h-7 rounded-[0.5rem] bg-cyan-400 border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      previewCard: "font-black bg-white border-3 border-black rounded-xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-3.5 uppercase",
      previewBtnText: "POW!",
    }
  ];

  const handleSelectTemplate = async (templateId) => {
    const updatedData = {
      ...portfolioData,
      template: templateId,
    };
    setPortfolioData(updatedData);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la plantilla:", error);
      }
    }
  };

  // Manejador de cambios de color con debounce (espera a que el usuario termine de seleccionar)
  const handleColorChange = (colorKey, value) => {
    const updatedColors = {
      primaryColor: "#ffffff",
      secondaryColor: "#f8fafc",
      socialColor: "#0f172a",
      titleColor: "#0f172a",
      ...(portfolioData?.colors || {}),
      [colorKey]: value,
    };

    const latestData = {
      ...portfolioData,
      colors: updatedColors,
    };

    // 1. Actualiza la UI inmediatamente
    setPortfolioData(latestData);

    // 2. Limpia temporizador previo
    if (colorTimeout) {
      clearTimeout(colorTimeout);
    }

    // 3. Dispara la llamada a onSave() 400ms después de que se detenga la selección
    const newTimeout = setTimeout(async () => {
      if (typeof onSave === "function") {
        try {
          await onSave(latestData);
        } catch (error) {
          console.error("Error al guardar colores automáticamente:", error);
        }
      }
    }, 400);

    setColorTimeout(newTimeout);
  };

  // Funciones de control del Modal de Imagen
  const handleModalFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setModalTempFile(file);
      setModalTempPreview(URL.createObjectURL(file));
      setModalRemoveImage(false);
    }
  };

  const handleCancelImageSelection = () => {
    setIsImageModalOpen(false);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
  };

  const handleConfirmImageSelection = async () => {
    let updatedData = { ...portfolioData };

    if (modalRemoveImage) {
      updatedData.mainImage = "";
      updatedData.imagen = "";
      updatedData.image = "";
      updatedData.profileImage = "";

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

          updatedData.mainImage = finalImageUrl;
          updatedData.imagen = finalImageUrl;
          updatedData.image = finalImageUrl;
          updatedData.profileImage = finalImageUrl;

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

  const primaryColor = portfolioData?.colors?.primaryColor || "#ffffff";
  const secondaryColor = portfolioData?.colors?.secondaryColor || "#f8fafc";
  const socialColor = portfolioData?.colors?.socialColor || portfolioData?.colors?.textColor || "#0f172a";
  const titleColor = portfolioData?.colors?.titleColor || "#0f172a";

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']">
      <Title title="Diseño" />

      {/* SECCIÓN: Imagen Principal */}
      <div className="space-y-3 pt-2 font-['Poppins']">
        <h3 className="text-base font-semibold text-slate-900">Imagen Principal</h3>
        
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
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors border border-slate-200 cursor-pointer"
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
                className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-md overflow-hidden p-6 space-y-5 my-auto cursor-default font-['Poppins']"
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

      {/* SECCIÓN: Plantillas */}
      <div className="font-['Poppins'] pt-2">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Plantilla</h3>
      
        {/* Lista de Plantillas */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-h-[540px] overflow-y-auto p-2">
          {templates.map((t) => {
            const isSelected = portfolioData.template === t.id || (!portfolioData.template && t.id === "minimal");

            return (
              <div
                key={t.id}
                onClick={() => handleSelectTemplate(t.id)}
                className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between h-45 overflow-hidden ${t.cardBg} ${
                  isSelected
                    ? "ring-2 ring-slate-900 ring-offset-2 ring-offset-slate-50 scale-[1.01]"
                    : "hover:opacity-95 hover:scale-[0.99]"
                }`}
              >
                {/* Encabezado del Template */}
                <div className="flex items-center justify-between w-full z-10">
                  <span className={`text-base font-semibold ${t.fontFamily}`}>
                    {t.name}
                  </span>
                </div>

                {/* Vista previa de componentes del Template */}
                <div className="mt-auto w-full space-y-2.5 z-10">
                  <div className="flex items-center justify-left gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-center text-[10px] transition-all ${t.socialShape}`}
                      ></div>
                    ))}
                  </div>

                  <div className={`w-full px-4 flex items-center justify-between transition-all ${t.previewCard}`}>
                    <span className={`text-xs ${t.fontFamily}`}>{t.previewBtnText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN: Colores */}
      <div className="space-y-3 pt-4 font-['Poppins']">
        <h3 className="text-base font-semibold text-slate-900">Colores</h3>
        <div className="flex flex-col gap-3 w-full">
          {/* Color Principal */}
          <div className="bg-white border border-slate-300 rounded-2xl p-4 flex items-center justify-between w-full">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">Principal</span>
            </div>
            <div className="rounded-full p-0.5 border border-slate-300 shadow-sm hover:border-slate-400 transition-colors bg-white flex items-center justify-center">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                className="w-12 h-12 rounded-full cursor-pointer appearance-none bg-transparent border-0 p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-focus-inner]:p-0 [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full"
              />
            </div>
          </div>

          {/* Color Secundario */}
          <div className="bg-white border border-slate-300 rounded-2xl p-4 flex items-center justify-between w-full">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">Bloques</span>
            </div>
            <div className="rounded-full p-0.5 border border-slate-300 shadow-sm hover:border-slate-400 transition-colors bg-white flex items-center justify-center">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                className="w-12 h-12 rounded-full cursor-pointer appearance-none bg-transparent border-0 p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-focus-inner]:p-0 [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full"
              />
            </div>
          </div>

          {/* Tercer Color - Redes Sociales */}
          <div className="bg-white border border-slate-300 rounded-2xl p-4 flex items-center justify-between w-full">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">Redes sociales</span>
            </div>
            <div className="rounded-full p-0.5 border border-slate-300 shadow-sm hover:border-slate-400 transition-colors bg-white flex items-center justify-center">
              <input
                type="color"
                value={socialColor}
                onChange={(e) => handleColorChange("socialColor", e.target.value)}
                className="w-12 h-12 rounded-full cursor-pointer appearance-none bg-transparent border-0 p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-focus-inner]:p-0 [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full"
              />
            </div>
          </div>

          {/* Cuarto Color - Título */}
          <div className="bg-white border border-slate-300 rounded-2xl p-4 flex items-center justify-between w-full">
            <div>
              <span className="text-sm font-semibold text-slate-900 block">Títulos</span>
            </div>
            <div className="rounded-full p-0.5 border border-slate-300 shadow-sm hover:border-slate-400 transition-colors bg-white flex items-center justify-center">
              <input
                type="color"
                value={titleColor}
                onChange={(e) => handleColorChange("titleColor", e.target.value)}
                className="w-12 h-12 rounded-full cursor-pointer appearance-none bg-transparent border-0 p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-focus-inner]:p-0 [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}