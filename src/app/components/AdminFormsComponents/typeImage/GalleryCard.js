import React, { useState } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { GalleryItem } from "@/app/components/AdminFormsComponents/typeImage/GalleryItem"; 
import DeleteButton from "../ui/DeleteButton";
import DragIcon from "../ui/DragIcon";

export default function GalleryCard({
  gal,
  handleSaveGalleriesOrder,
  handleUpdateGalleryTitle,
  handleToggleGalleryActive,
  handleDeleteGallery,
  handleReorderItems,
  handleSaveItemsOrder,
  handleToggleItemActive,
  handleDeleteItem,
  handleUpdateItemTitle,
  handleSelectLayout,
  setModalGalleryId,
  setModalTempFile,
  setModalTempPreview,
  deleteGalleryUid,
  setDeleteGalleryUid,
  deleteItemTarget,
  setDeleteItemTarget,
  savingItemId,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(gal.title);
  const [activeTab, setActiveTab] = useState("images");

  const isGalleryActive = gal.isActive !== false;
  const isGalleryDeleteOpen = deleteGalleryUid === gal.id;
  const currentLayout = gal.layout || "grid";

  const onTitleSubmit = () => {
    setIsEditing(false);
    if (editingTitle.trim() && editingTitle !== gal.title) {
      handleUpdateGalleryTitle(gal.id, editingTitle.trim());
    } else {
      setEditingTitle(gal.title);
    }
  };

  const tabButtonClasses = (tabName) => `
    px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors cursor-pointer
    ${activeTab === tabName 
      ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600" 
      : "text-slate-600 hover:text-purple-600 hover:bg-slate-50"}
  `;

  const layoutOptions = [
    { id: "column", name: "Columna" },
    { id: "carousel", name: "Carrusel" },
    { id: "grid", name: "Grid" },
  ];

  return (
    <Reorder.Item
      key={gal.id}
      value={gal}
      onDragEnd={handleSaveGalleriesOrder}
      className="list-none relative"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white border border-slate-300 rounded-xl cursor-grab active:cursor-grabbing shadow-sm overflow-hidden"
      >
        <div className="p-4 space-y-4">
          {/* Cabecera de la galería */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
              {/* Icono Draggable */}
              <DragIcon />

              {/* Título o Input de Edición */}
              <div className="flex-1 overflow-hidden">
                {isEditing ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={onTitleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onTitleSubmit();
                      if (e.key === "Escape") {
                        setEditingTitle(gal.title);
                        setIsEditing(false);
                      }
                    }}
                    autoFocus
                    className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 px-0 py-0 text-base font-medium text-slate-900 shadow-none rounded-none"
                  />
                ) : (
                  <div
                    onClick={() => {
                      setIsEditing(true);
                      setEditingTitle(gal.title);
                    }}
                    className="group cursor-pointer flex items-center gap-1.5"
                  >
                    <h3 className="text-base font-medium text-slate-950 tracking-wide group-hover:text-purple-700 transition-colors truncate">
                      {gal.title}
                    </h3>
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 transition-colors shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div
              className={`flex items-center gap-3 shrink-0 transition-opacity duration-200 ${
                isHovered || isGalleryDeleteOpen
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setModalGalleryId(gal.id);
                  setModalTempFile(null);
                  setModalTempPreview(null);
                  setDeleteGalleryUid(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm bg-black text-white hover:bg-slate-800"
              >
                + Añadir Imagen
              </button>

              {/* Toggle Activo */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGalleryActive}
                  onChange={() =>
                    handleToggleGalleryActive(gal.id, isGalleryActive)
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
              </label>

              {/* Componente DeleteButton utilizado para borrar la galería */}
              <DeleteButton
                isOpen={isGalleryDeleteOpen}
                onClick={() =>
                  setDeleteGalleryUid(isGalleryDeleteOpen ? null : gal.id)
                }
              />
            </div>
          </div>

          {/* Confirmación de eliminación */}
          <AnimatePresence>
            {isGalleryDeleteOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-3"
              >
                <span className="text-xs font-semibold text-rose-900 block">
                  ¿Eliminar esta galería completa?
                </span>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteGalleryUid(null)}
                    className="bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGallery(gal.id)}
                    className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Sí, eliminar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pestañas */}
          <div className="border-b border-slate-100">
            <div className="flex items-center gap-1">
              <button 
                type="button"
                className={tabButtonClasses("images")}
                onClick={() => setActiveTab("images")}
              >
                Imágenes
              </button>
              <button 
                type="button"
                className={tabButtonClasses("layouts")}
                onClick={() => setActiveTab("layouts")}
              >
                Layouts
              </button>
            </div>
          </div>

          {/* Contenido según pestaña activa */}
          <AnimatePresence mode="wait">
            {activeTab === "images" && (
              <motion.div
                key="images_view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {gal.items && gal.items.length > 0 ? (
                  <Reorder.Group
                    axis="y"
                    values={gal.items}
                    onReorder={(newOrder) => handleReorderItems(gal.id, newOrder)}
                    className="space-y-2 pt-1"
                  >
                    {gal.items.map((item) => {
                      const isItemDeleteOpen =
                        deleteItemTarget?.galleryId === gal.id &&
                        deleteItemTarget?.itemId === item.id;
                      const isItemActive = item.isActive !== false;
                      const isThisItemSaving = savingItemId === item.id;

                      return (
                        <GalleryItem
                          key={item.id}
                          item={item}
                          galleryId={gal.id}
                          isItemActive={isItemActive}
                          isItemDeleteOpen={isItemDeleteOpen}
                          isThisItemSaving={isThisItemSaving}
                          handleSaveItemsOrder={handleSaveItemsOrder}
                          handleToggleItemActive={handleToggleItemActive}
                          setDeleteItemTarget={setDeleteItemTarget}
                          handleDeleteItem={handleDeleteItem}
                          handleUpdateItemTitle={handleUpdateItemTitle}
                        />
                      );
                    })}
                  </Reorder.Group>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-3">
                    No hay imágenes en esta galería todavía.
                  </p>
                )}
              </motion.div>
            )}

            {activeTab === "layouts" && (
              <motion.div
                key="layouts_view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pt-2"
              >
                <div className="grid grid-cols-3 gap-4">
                  {layoutOptions.map((option) => {
                    const isSelected = currentLayout === option.id;

                    return (
                      <div 
                        key={option.id}
                        onClick={() => handleSelectLayout && handleSelectLayout(gal.id, option.id)}
                        className={`border-2 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all text-center group ${
                          isSelected 
                            ? "border-purple-600 bg-purple-50/60 shadow-sm" 
                            : "border-slate-200 hover:border-purple-300 hover:bg-purple-50/30"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected 
                            ? "bg-purple-600 text-white" 
                            : "bg-slate-100 group-hover:bg-purple-100 text-slate-400 group-hover:text-purple-600"
                        }`}>
                          <span className="text-xs font-mono">{option.id.substring(0,3).toUpperCase()}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          isSelected ? "text-purple-900 font-semibold" : "text-slate-800 group-hover:text-purple-900"
                        }`}>
                          {option.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </Reorder.Item>
  );
}