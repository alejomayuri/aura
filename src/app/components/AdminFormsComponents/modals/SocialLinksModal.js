"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import Social from "../home/Social";
import { getSocialIcon } from "@/app/utils/socialIcons";

export default function SocialLinksModal({
  isOpen,
  onClose,
  showAddSocialForm,
  setShowAddSocialForm,
  newLinkUrl,
  setNewLinkUrl,
  handleAddLink,
  stableLinks,
  handleReorder,
  deleteConfirmUid,
  setDeleteConfirmUid,
  portfolioData,
  setPortfolioData,
  onSave,
  socialPosition,
  handleChangeSocialPosition,
}) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
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
                onClick={onClose}
                className="text-slate-400 hover:text-black transition-colors cursor-pointer p-1"
              >
                ✕
              </button>
            </div>
            <span className="text-sm text-slate-600">
              Añade tus perfiles, emails o redes sociales a tu página.
            </span>

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

            <div className="shrink-0 pt-3 space-y-2.5">
              <h3 className="text-lg font-semibold mb-1 text-slate-900">Ubicación</h3>
              <span className="text-sm text-slate-600">Selecciona la ubicación de las redes sociales en tu página.</span>
              
              <div className="flex flex-col space-y-2">
                <label 
                  onClick={() => handleChangeSocialPosition("top")}
                  className="flex items-center text-slate-900 gap-3 py-6 rounded-xl mb-0 cursor-pointer transition-all"
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    socialPosition === "top" ? "border-black" : "border-slate-300"
                  }`}>
                    {socialPosition === "top" && <div className="w-3 h-3 rounded-full bg-black" />}
                  </div>
                  <span className="text-md font-medium">Arriba</span>
                </label>

                <label 
                  onClick={() => handleChangeSocialPosition("bottom")}
                  className="flex items-center text-slate-900 gap-3 rounded-xl cursor-pointer transition-all"
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    socialPosition === "bottom" ? "border-black" : "border-slate-300"
                  }`}>
                    {socialPosition === "bottom" && <div className="w-3 h-3 rounded-full bg-black" />}
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
  );
}