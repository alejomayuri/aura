'use client';

import React, { useState } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';

export const GalleryItem = ({
  item,
  galleryId,
  isItemActive,
  isItemDeleteOpen,
  isThisItemSaving,
  handleSaveItemsOrder,
  handleToggleItemActive,
  setDeleteItemTarget,
  handleDeleteItem,
  handleUpdateItemTitle,
}) => {
  // 1. Mantenemos el estado local y un registro del título anterior
  const [localTitle, setLocalTitle] = useState(item.title || "");
  const [prevTitle, setPrevTitle] = useState(item.title || "");

  // 2. Si item.title cambió desde el padre, actualizamos localTitle en el render
  if ((item.title || "") !== prevTitle) {
    setPrevTitle(item.title || "");
    setLocalTitle(item.title || "");
  }

  /**
   * Guarda el título cuando cambia el valor al desenfocar o presionar Enter
   */
  const saveTitleChange = () => {
    const trimmedTitle = localTitle.trim();
    if (trimmedTitle !== (item.title || "") && typeof handleUpdateItemTitle === 'function') {
      handleUpdateItemTitle(galleryId, item.id, trimmedTitle);
    }
  };

  /**
   * Desencadena el desenfoque al presionar Enter
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <Reorder.Item
      key={item.id}
      value={item}
      onDragEnd={() => handleSaveItemsOrder && handleSaveItemsOrder(item)}
      className="list-none bg-white border border-slate-200 p-3 rounded-xl shadow-sm"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
            {/* Ícono de arrastre */}
            <div className="text-slate-400 hover:text-purple-700 flex flex-col gap-0.5 justify-center shrink-0 px-1 transition-colors cursor-grab active:cursor-grabbing">
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

            {/* Imagen Preview */}
            <img
              src={item.url}
              alt={item.title || "Preview"}
              className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 shadow-sm"
            />

            {/* Campo de texto para editar el Título */}
            <div className="flex-1 min-w-0 pr-1">
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={saveTitleChange}
                onKeyDown={handleKeyDown}
                placeholder="Sin título"
                className="w-full bg-transparent border border-transparent focus:bg-white rounded-lg px-2.5 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:placeholder-transparent font-medium transition-all focus:outline-none truncate"
                title="Haz clic para editar el título"
              />
            </div>

            {/* Spinner de guardado por item */}
            {isThisItemSaving && (
              <svg
                className="w-5 h-5 animate-spin text-purple-600 shrink-0 ml-1"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isItemActive}
                onChange={() =>
                  handleToggleItemActive &&
                  handleToggleItemActive(galleryId, item.id, isItemActive)
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>

            <button
              type="button"
              onClick={() =>
                setDeleteItemTarget &&
                setDeleteItemTarget(
                  isItemDeleteOpen
                    ? { galleryId: null, itemId: null }
                    : { galleryId, itemId: item.id }
                )
              }
              className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                isItemDeleteOpen
                  ? "bg-rose-600 text-white"
                  : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
              }`}
            >
              <svg
                className="w-4 h-4 stroke-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isItemDeleteOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-rose-50/50 border border-rose-100 rounded-lg p-3 space-y-2.5"
            >
              <span className="text-xs font-semibold text-rose-950 block">
                ¿Eliminar esta imagen?
              </span>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteItemTarget &&
                    setDeleteItemTarget({ galleryId: null, itemId: null })
                  }
                  className="bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteItem && handleDeleteItem(galleryId, item.id)
                  }
                  className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reorder.Item>
  );
};