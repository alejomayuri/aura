"use client";

import Title from "./AdminFormsComponents/Title";
import { ImageStyleOption } from "./AdminFormsComponents/home/ImageStyleOption";
import { templates } from "../config/templates"; 
import { ColorPickerItem, GradientColorPickerItem } from "./AdminFormsComponents/design/ColorPickers";
import MainImageModal from "./AdminFormsComponents/modals/MainImageModal";
import { useMainImageModal } from "@/app/hooks/useMainImageModal";
import { useState } from "react";

export default function DesignForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage }) {
  const [colorTimeout, setColorTimeout] = useState(null);

  // Reutilizamos nuestro hook personalizado para la imagen principal
  const {
    isImageModalOpen,
    setIsImageModalOpen,
    modalTempPreview,
    modalRemoveImage,
    setModalRemoveImage,
    uploading,
    currentImageDisplay,
    handleModalFileSelect,
    handleConfirmImageSelection,
    handleCancelImageSelection,
  } = useMainImageModal(portfolioData, setPortfolioData, onSave);

  const currentTemplateId = portfolioData?.template || "minimal";
  const activeTemplate = templates.find((t) => t.id === currentTemplateId) || templates[0];
  const isSocialTransparent = activeTemplate?.socialShape?.includes("bg-transparent");
  const isGradientTemplate = Boolean(activeTemplate?.hasGradient);

  const handleSelectTemplate = async (templateId) => {
    const selectedTemplate = templates.find((t) => t.id === templateId);
    let templateColors = selectedTemplate?.colors ? { ...selectedTemplate.colors } : {};

    if (selectedTemplate?.socialShape?.includes("bg-transparent")) {
      templateColors.socialColor = null;
    }

    const updatedData = {
      ...portfolioData,
      template: templateId,
      colors: {
        ...(portfolioData?.colors || {}),
        ...templateColors,
      },
    };
    setPortfolioData(updatedData);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la plantilla y sus colores:", error);
      }
    }
  };

  const handleColorChange = (colorKey, value) => {
    const updatedColors = {
      primaryColor: "#ffffff",
      primaryColorEnd: "#f8fafc",
      secondaryColor: "#f8fafc",
      socialColor: isSocialTransparent ? null : "#0f172a",
      textColor: "#0f172a",
      iconsColor: "#0f172a",
      titleColor: "#0f172a",
      ...(portfolioData?.colors || {}),
      [colorKey]: value,
    };

    const latestData = {
      ...portfolioData,
      colors: updatedColors,
    };

    setPortfolioData(latestData);

    if (colorTimeout) {
      clearTimeout(colorTimeout);
    }

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

  const primaryColor = portfolioData?.colors?.primaryColor || activeTemplate.colors.primaryColor || "#ffffff";
  const primaryColorEnd = portfolioData?.colors?.primaryColorEnd || activeTemplate.colors.primaryColorEnd || "#6366f1ff";
  const secondaryColor = portfolioData?.colors?.secondaryColor || "#f8fafc";
  const socialColor = portfolioData?.colors?.socialColor ?? null;
  const textColor = portfolioData?.colors?.textColor || "#0f172a";
  const iconsColor = portfolioData?.colors?.iconsColor || "#0f172a";
  const titleColor = portfolioData?.colors?.titleColor || "#0f172a";

  const imageStyleOptions = [
    { styleValue: "rounded", label: "Redonda" },
    { styleValue: "full-width", label: "Todo el ancho" },
    { styleValue: "fade-bottom", label: "Difuminado" },
    { styleValue: "horizontal", label: "Horizontal" },
    { styleValue: "square-rounded", label: "Cuadrada redondeada" },
    { styleValue: "creative-blob", label: "Marco Asimétrico" },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']">
      <Title title="Diseño" />

      {/* SECCIÓN: Imagen Principal */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-semibold text-slate-900">Imagen Principal</h3>
        
        <div className="w-full bg-transparent p-0 flex justify-start">
          <div 
            onClick={() => setIsImageModalOpen(true)}
            className="relative w-full max-w-[240px] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer group border border-slate-200 transition shadow-sm"
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

        {/* SECCIÓN: Layout de la imagen */}
        <div className="pt-2 space-y-3">
          <h4 className="text-base font-semibold text-slate-800">Layout de la imagen</h4>

          <div className="w-full overflow-x-auto pb-3 pt-1 snap-x snap-mandatory">
            <div className="flex gap-3 w-max">
              {imageStyleOptions.map(({ styleValue, label }) => (
                <div 
                  key={styleValue} 
                  className="w-[180px] min-w-[180px] max-w-[180px] px-0.5 shrink-0 snap-start flex flex-col [&>div]:w-full [&>button]:w-full"
                >
                  <ImageStyleOption 
                    styleValue={styleValue}
                    label={label}
                    currentImageDisplay={currentImageDisplay}
                    portfolioData={portfolioData}
                    onSave={onSave}
                    setPortfolioData={setPortfolioData}
                    primaryColor={primaryColor}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL REUTILIZADO DE IMAGEN PRINCIPAL */}
      <MainImageModal
        isOpen={isImageModalOpen}
        onClose={handleCancelImageSelection}
        currentImageDisplay={currentImageDisplay}
        modalTempPreview={modalTempPreview}
        modalRemoveImage={modalRemoveImage}
        setModalRemoveImage={setModalRemoveImage}
        uploading={uploading}
        handleModalFileSelect={handleModalFileSelect}
        handleConfirmImageSelection={handleConfirmImageSelection}
      />

      {/* SECCIÓN: Plantillas */}
      <div className="pt-2">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Plantilla</h3>
      
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
                <div className="flex items-center justify-between w-full z-10">
                  <span className={`text-base font-semibold ${t.fontFamily}`}>
                    {t.name}
                  </span>
                </div>

                <div className="mt-auto w-full space-y-2.5 z-10">
                  <div className="flex items-center justify-left gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-center text-[10px] transition-all ${t.socialShape}`}
                      />
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
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-semibold text-slate-900">Colores</h3>
        <div className="flex flex-col gap-3 w-full">
          {isGradientTemplate ? (
            <GradientColorPickerItem
              label="Color Principal (Gradiente)"
              colorStart={primaryColor}
              colorEnd={primaryColorEnd}
              onChangeStart={(val) => handleColorChange("primaryColor", val)}
              onChangeEnd={(val) => handleColorChange("primaryColorEnd", val)}
            />
          ) : (
            <ColorPickerItem
              label="Color Principal"
              colorValue={primaryColor}
              onChange={(val) => handleColorChange("primaryColor", val)}
            />
          )}

          <ColorPickerItem
            label="Color Secundario"
            colorValue={secondaryColor}
            onChange={(val) => handleColorChange("secondaryColor", val)}
          />

          {!isSocialTransparent && (
            <ColorPickerItem
              label="Tercer Color (Redes Sociales)"
              colorValue={socialColor ?? "#0f172a"}
              onChange={(val) => handleColorChange("socialColor", val)}
            />
          )}

          <ColorPickerItem
            label="Color de Iconos"
            colorValue={iconsColor}
            onChange={(val) => handleColorChange("iconsColor", val)}
          />

          <ColorPickerItem
            label="Color del título"
            colorValue={titleColor}
            onChange={(val) => handleColorChange("titleColor", val)}
          />

          <ColorPickerItem
            label="Color de los textos"
            colorValue={textColor}
            onChange={(val) => handleColorChange("textColor", val)}
          />
        </div>
      </div>
    </div>
  );
}