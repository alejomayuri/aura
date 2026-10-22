"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Title from "./AdminFormsComponents/Title";
import EditableTitleInput from "./AdminFormsComponents/home/EditableTitleInput";
import PagesList from "./AdminFormsComponents/PagesList";
import { Bio } from "./AdminFormsComponents/home/Bio";

// Modales extraídos
import MainImageModal from "./AdminFormsComponents/modals/MainImageModal";
import SocialLinksModal from "./AdminFormsComponents/modals/SocialLinksModal";

// Hooks y servicios
import { useMainImageModal } from "@/app/hooks/useMainImageModal";
import { useSocialLinks } from "@/app/hooks/useSocialLinks";
import { getSocialIcon } from "@/app/utils/socialIcons";

export default function AdminForm({ portfolioData, setPortfolioData, onSave, saving, onSelectPage }) {
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

  const {
    isSocialModalOpen,
    setIsSocialModalOpen,
    showAddSocialForm,
    setShowAddSocialForm,
    newLinkUrl,
    setNewLinkUrl,
    deleteConfirmUid,
    setDeleteConfirmUid,
    stableLinks,
    socialPosition,
    handleAddLink,
    handleReorder,
    handleChangeSocialPosition,
    handleCloseSocialModal,
  } = useSocialLinks(portfolioData, setPortfolioData, onSave);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

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

  const portfolioSlug = portfolioData?.slug || portfolioData?.username || "tu-usuario";

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']">
      <Title title="Página Principal" externalRoute={`/${portfolioSlug}`} openInNewTab={true} />

      {/* SECCIÓN: Imagen Principal */}
      <div className="space-y-3 pt-2">
        <div className="w-full bg-transparent p-0 flex justify-start">
          <div 
            onClick={() => setIsImageModalOpen(true)}
            className="relative w-full max-w-[240px] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer group border border-slate-200 transition shadow-sm"
          >
            {currentImageDisplay ? (
              <>
                <img src={currentImageDisplay} alt="Imagen principal" className="w-full h-auto object-contain max-h-[300px] group-hover:opacity-75 transition-opacity" />
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

      {/* MODAL DE IMAGEN PRINCIPAL EXTRAÍDO */}
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
          {stableLinks.map((linkItem) => (
            <button
              key={linkItem.uid}
              type="button"
              onClick={() => setIsSocialModalOpen(true)}
              className="w-6 h-6 flex items-center mr-2 justify-center transition-all cursor-pointer"
              title={linkItem.url}
            >
              <img src={getSocialIcon(linkItem.url)} alt="Red social" className="w-full h-full object-contain" />
            </button>
          ))}

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

      {/* MODAL DE REDES SOCIALES EXTRAÍDO */}
      <SocialLinksModal
        isOpen={isSocialModalOpen}
        onClose={handleCloseSocialModal}
        showAddSocialForm={showAddSocialForm}
        setShowAddSocialForm={setShowAddSocialForm}
        newLinkUrl={newLinkUrl}
        setNewLinkUrl={setNewLinkUrl}
        handleAddLink={handleAddLink}
        stableLinks={stableLinks}
        handleReorder={handleReorder}
        deleteConfirmUid={deleteConfirmUid}
        setDeleteConfirmUid={setDeleteConfirmUid}
        portfolioData={portfolioData}
        setPortfolioData={setPortfolioData}
        onSave={onSave}
        socialPosition={socialPosition}
        handleChangeSocialPosition={handleChangeSocialPosition}
      />

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
        <PagesList 
          pages={stablePages}
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          onSave={onSave}
          onSelectPage={onSelectPage}
          onReorderPages={(newPages) => {
            setPortfolioData({ ...portfolioData, pages: newPages });
          }}
        />
      </div>
    </div>
  );
}