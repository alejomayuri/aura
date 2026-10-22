"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageModal({
  isOpen,
  onClose,
  title = "Actualizar Imagen",
  currentImageDisplay,
  modalTempPreview,
  modalRemoveImage,
  setModalRemoveImage,
  uploading,
  handleModalFileSelect,
  handleConfirmImageSelection,
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
            className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-md overflow-hidden p-6 space-y-5 my-auto cursor-default"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
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

              {currentImageDisplay && !modalRemoveImage && !modalTempPreview && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setModalRemoveImage(true)}
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
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmImageSelection}
                disabled={(!modalTempPreview && !modalRemoveImage) || uploading}
                className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
              >
                {uploading ? "Procesando..." : "Aceptar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}