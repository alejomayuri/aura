"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import DragIcon from "@/app/components/AdminFormsComponents/ui/DragIcon";
import DeleteButton from "@/app/components/AdminFormsComponents/ui/DeleteButton";

export default function LinkItem({
  link,
  onDragEnd,
  editingLinkId,
  setEditingLinkId,
  tempTitle,
  setTempTitle,
  handleSaveTitle,
  editingUrlId,
  setEditingUrlId,
  tempUrl,
  setTempUrl,
  handleSaveUrl,
  handleOpenImageModal,
  handleRemoveImage,
  handleToggleFeatured,
  handleToggleActive,
  layoutOpenId,
  setLayoutOpenId,
  deleteConfirmId,
  setDeleteConfirmId,
  handleUpdateLinkLayout,
  handleDeleteLinkItem,
}) {
  const isLinkActive = link.isActive !== false;
  const isEditing = editingLinkId === link.id;
  const isEditingUrl = editingUrlId === link.id;
  const isFeatured = link.isFeatured === true;
  const isDeleteOpen = deleteConfirmId === link.id;
  const isLayoutOpen = layoutOpenId === link.id;
  const currentLayout = link.layout || "classic";

  return (
    <Reorder.Item
      key={link.id}
      value={link}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col bg-white border border-slate-300 rounded-xl shadow-sm cursor-grab active:cursor-grabbing transition-colors overflow-hidden"
    >
      {/* Contenedor principal flex */}
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        
        {/* Bloque de contenido principal (ocupa todo el espacio sobrante) */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <DragIcon />

          <div className="flex flex-col gap-3 overflow-hidden w-full">
            {/* Fila superior: Título y URL */}
            <div className="flex items-center justify-between gap-3 overflow-hidden w-full">
              <div className="overflow-hidden w-full space-y-1.5">
                {/* Campo de Título */}
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(link.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTitle(link.id);
                        if (e.key === "Escape") setEditingLinkId(null);
                      }}
                      className="text-sm font-medium text-slate-950 outline-none w-full"
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingLinkId(link.id);
                        setTempTitle(link.title || "");
                      }}
                      title="Haz clic para editar el título"
                      className="text-sm font-medium text-slate-950 truncate block cursor-pointer hover:underline"
                    >
                      {link.title || "Sin título"}
                    </span>
                  )}
                </div>

                {/* Campo de URL */}
                <div className="flex items-center gap-2">
                  {isEditingUrl ? (
                    <input
                      type="text"
                      autoFocus
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      onBlur={() => handleSaveUrl(link.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveUrl(link.id);
                        if (e.key === "Escape") setEditingUrlId(null);
                      }}
                      className="text-sm text-slate-500 outline-none w-full"
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingUrlId(link.id);
                        setTempUrl(link.url || "");
                      }}
                      title="Haz clic para editar la URL"
                      className="text-sm text-slate-500 truncate block cursor-pointer hover:underline"
                    >
                      {link.url || "Sin URL"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Fila inferior: Controles */}
            <div className="pt-1 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(link.id)}
                  className={`cursor-pointer ${
                    isFeatured
                      ? "border-slate-700 text-slate-900"
                      : "bg-transparent border-slate-200 text-slate-500 hover:text-slate-900"
                  }`}
                  title={isFeatured ? "Quitar destacado" : "Destacar enlace"}
                >
                  <svg
                    className="w-4.5 h-4.5"
                    fill={isFeatured ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>

                {/* Botón de Layout */}
                <button
                  type="button"
                  onClick={() => {
                    setLayoutOpenId(isLayoutOpen ? null : link.id);
                    setDeleteConfirmId(null);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isLayoutOpen
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Configurar Layout del enlace"
                >
                  <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                </button>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLinkActive}
                    onChange={() => handleToggleActive(link.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>

                <DeleteButton
                  isOpen={isDeleteOpen}
                  onClick={() => {
                    setDeleteConfirmId(isDeleteOpen ? null : link.id);
                    setLayoutOpenId(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloque de Imagen a la derecha*/}
        <div className="shrink-0">
          {link.imageUrl ? (
            <div className="relative group w-22 h-22 rounded-lg overflow-hidden border border-slate-200">
              <img
                src={link.imageUrl}
                alt={link.title || "Imagen del link"}
                className="w-full h-full object-cover"
              />
              <div
                onClick={() => handleOpenImageModal(link.id)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                title="Cambiar imagen"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenImageModal(link.id)}
              className="w-22 h-22 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Añadir imagen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desplegable de selección de Layout */}
      <AnimatePresence>
        {isLayoutOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-purple-50/50 border-t border-purple-100 px-4 py-3.5 space-y-3"
          >
            <span className="text-xs font-semibold text-purple-900 block">
              Seleccionar estilo del enlace
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleUpdateLinkLayout(link.id, "classic")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer gap-2 ${
                  currentLayout === "classic"
                    ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                    : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                }`}
              >
                <svg className={`w-6 h-6 stroke-2 ${currentLayout === "classic" ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="8" width="18" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "classic" ? "text-white" : "text-slate-600"}`}>
                  Clásico
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateLinkLayout(link.id, "card")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer gap-2 ${
                  currentLayout === "card"
                    ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                    : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                }`}
              >
                <svg className={`w-6 h-6 stroke-2 ${currentLayout === "card" ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                </svg>
                <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "card" ? "text-white" : "text-slate-600"}`}>
                  Tarjeta
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateLinkLayout(link.id, "featured")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition cursor-pointer gap-2 ${
                  currentLayout === "featured"
                    ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                    : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                }`}
              >
                <svg className={`w-6 h-6 stroke-2 ${currentLayout === "featured" ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "featured" ? "text-white" : "text-slate-600"}`}>
                  Banner
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desplegable de confirmación de eliminación */}
      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-rose-50/50 border-t border-rose-100 px-4 py-3.5 space-y-3"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-rose-900 block">
                ¿Eliminar este enlace?
              </span>
              <p className="text-[11px] text-slate-600">
                Esta acción eliminará permanentemente el enlace de la página.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLinkItem(link.id)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                Sí, eliminar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}