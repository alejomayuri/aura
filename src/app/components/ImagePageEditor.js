"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export default function ImagePageEditor({ portfolioData, selectedPageId, onUpdatePortfolio }) {
  const page = portfolioData.pages.find((p) => (p.id || p.slug) === selectedPageId);

  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [activeGalleryId, setActiveGalleryId] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  
  // Estados para la edición de títulos de galerías
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingGalleryTitle, setEditingGalleryTitle] = useState("");

  const [deleteGalleryUid, setDeleteGalleryUid] = useState(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState({ galleryId: null, itemId: null });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!page) {
    return <div className="text-sm text-slate-500">Selecciona una página válida desde el menú lateral.</div>;
  }

  const galleries = page.galleries || [];

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!newGalleryTitle.trim()) {
      setError("Por favor escribe un nombre para la galería.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const newGallery = {
        id: crypto.randomUUID(),
        title: newGalleryTitle.trim(),
        isActive: true,
        items: []
      };

      const updatedGalleries = [...galleries, newGallery];
      
      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
      setSuccessMsg(`¡Galería "${newGallery.title}" creada con éxito!`);
      setNewGalleryTitle("");
    } catch (err) {
      console.error("Error al crear galería:", err);
      setError("No se pudo crear la galería.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorderGalleries = async (newOrderGalleries) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: newOrderGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
    } catch (err) {
      console.error("Error al reordenar galerías:", err);
      setError("No se pudo guardar el nuevo orden de las galerías.");
    }
  };

  const handleUpdateGalleryTitle = async (galleryId) => {
    if (!editingGalleryTitle.trim()) {
      setEditingGalleryId(null);
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          return { ...gal, title: editingGalleryTitle.trim() };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
      setEditingGalleryId(null);
    } catch (err) {
      console.error("Error al actualizar título:", err);
      setError("No se pudo actualizar el título de la galería.");
    }
  };

  const handleToggleGalleryActive = async (galleryId, currentActiveState) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          return { ...gal, isActive: currentActiveState === undefined ? false : !currentActiveState };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
    } catch (err) {
      console.error("Error al cambiar estado de galería:", err);
      setError("No se pudo actualizar el estado de la galería.");
    }
  };

  const handleAddImageToGallery = async (e, galleryId) => {
    e.preventDefault();
    if (!mediaFile) {
      setError("Selecciona una imagen para subir.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", mediaFile);
      formData.append("upload_preset", "pataki_portfolio_upload"); 

      const res = await fetch("https://api.cloudinary.com/v1_1/dz3p460iu/image/upload", {
        method: "POST",
        body: formData,
      });

      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("Error de respuesta del servidor:", responseText);
        throw new Error("El servidor devolvió una respuesta no válida.");
      }

      if (!res.ok) throw new Error(data.error || "Error al subir la imagen");

      const imageUrl = data.secure_url || data.url;

      const newItem = {
        id: crypto.randomUUID(),
        url: imageUrl,
        title: itemTitle.trim(),
        description: itemDescription.trim(),
        createdAt: new Date().toISOString()
      };

      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          return { ...gal, items: [...gal.items, newItem] };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
      setSuccessMsg("¡Imagen añadida a la galería con éxito!");
      setMediaFile(null);
      setItemTitle("");
      setItemDescription("");
      setActiveGalleryId(null);
    } catch (err) {
      console.error("Error al añadir imagen:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (galleryId, itemId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          return { ...gal, items: gal.items.filter((item) => item.id !== itemId) };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
      setSuccessMsg("Imagen eliminada correctamente.");
      setDeleteItemTarget({ galleryId: null, itemId: null });
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
      setError("No se pudo eliminar la imagen.");
    }
  };

  const handleDeleteGallery = async (galleryId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const updatedGalleries = galleries.filter((gal) => gal.id !== galleryId);
      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
      setSuccessMsg("Galería eliminada correctamente.");
      setDeleteGalleryUid(null);
    } catch (err) {
      console.error("Error al eliminar galería:", err);
      setError("No se pudo eliminar la galería.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{page.title}</h2>
          <button
            type="button"
            className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-100/50 rounded-lg transition-colors cursor-pointer"
            title="Ocultar formulario y ver solo preview"
          >
            <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-slate-500">
          Página tipo imagen
        </p>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">{error}</div>}
      {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3.5 rounded-xl">{successMsg}</div>}

      {/* Formulario para Crear una Nueva Galería */}
      <form onSubmit={handleCreateGallery} className="flex items-center gap-2.5 bg-transparent border-none p-0 shadow-none">
        <input
          type="text"
          placeholder="Nombre de la galería (ej. Vestidos, Zapatos...)"
          value={newGalleryTitle}
          onChange={(e) => setNewGalleryTitle(e.target.value)}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-600 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:opacity-50 rounded-xl text-sm font-medium shadow-sm transition-all shrink-0 cursor-pointer"
        >
          Crear Galería
        </button>
      </form>

      {/* Listado de Galerías */}
      <Reorder.Group axis="y" values={galleries} onReorder={handleReorderGalleries} className="space-y-4 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {galleries.length > 0 ? (
          galleries.map((gal) => {
            const isGalleryDeleteOpen = deleteGalleryUid === gal.id;
            const isGalleryActive = gal.isActive !== false;
            const isEditing = editingGalleryId === gal.id;

            return (
              <Reorder.Item key={gal.id} value={gal} className="list-none relative">
                <div className="bg-white border border-purple-100 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-3">
                      
                      {/* Ícono de Arrastre personalizado en puntos y Título editable */}
                      <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
                        <div 
                          className="text-slate-400 hover:text-purple-700 flex flex-col gap-0.5 justify-center shrink-0 px-1 transition-colors cursor-grab active:cursor-grabbing"
                          title="Arrastrar para ordenar"
                        >
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

                        <div className="flex-1 overflow-hidden">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingGalleryTitle}
                              onChange={(e) => setEditingGalleryTitle(e.target.value)}
                              onBlur={() => handleUpdateGalleryTitle(gal.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.target.blur(); // Dispara el onBlur y guarda
                                }
                                if (e.key === "Escape") {
                                  setEditingGalleryId(null);
                                }
                              }}
                              autoFocus
                              className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 px-0 py-0 text-base font-medium text-slate-900 shadow-none rounded-none"
                            />
                          ) : (
                            <div 
                              onClick={() => {
                                setEditingGalleryId(gal.id);
                                setEditingGalleryTitle(gal.title);
                              }}
                              className="group cursor-pointer flex items-center gap-1.5"
                              title="Haz clic para editar el título"
                            >
                              <h3 className="text-base font-medium text-slate-950 tracking-wide group-hover:text-purple-700 transition-colors truncate">
                                {gal.title}
                              </h3>
                              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Botón Añadir Imagen */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveGalleryId(activeGalleryId === gal.id ? null : gal.id);
                            setDeleteGalleryUid(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm ${
                            activeGalleryId === gal.id
                              ? "bg-slate-800 text-white"
                              : "bg-black text-white hover:bg-slate-800"
                          }`}
                        >
                          {activeGalleryId === gal.id ? "Cancelar" : "+ Añadir Imagen"}
                        </button>

                        {/* Switch para activar/desactivar galería */}
                        <label className="relative inline-flex items-center cursor-pointer" title={isGalleryActive ? "Galería activa" : "Galería desactivada"}>
                          <input
                            type="checkbox"
                            checked={isGalleryActive}
                            onChange={() => handleToggleGalleryActive(gal.id, isGalleryActive)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>

                        {/* Botón de Borrar Galería con Ícono de Tacho */}
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteGalleryUid(isGalleryDeleteOpen ? null : gal.id);
                            setActiveGalleryId(null);
                          }}
                          className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                            isGalleryDeleteOpen 
                              ? "bg-rose-600 text-white border border-rose-600" 
                              : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                          }`}
                          title="Borrar Galería"
                        >
                          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Panel de confirmación para borrar galería */}
                    <AnimatePresence>
                      {isGalleryDeleteOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-3"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-rose-900 block">¿Estás seguro de eliminar esta galería completa?</span>
                            <p className="text-xs text-slate-600">Se eliminarán todas las imágenes asociadas a &quot;{gal.title}&quot;.</p>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setDeleteGalleryUid(null)}
                              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGallery(gal.id)}
                              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer"
                            >
                              Sí, eliminar galería
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {activeGalleryId === gal.id && (
                      <form onSubmit={(e) => handleAddImageToGallery(e, gal.id)} className="space-y-3.5 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <h4 className="text-xs font-semibold text-slate-900">Subir imagen a &quot;{gal.title}&quot;</h4>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-700 block">Archivo de Imagen</label>
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setMediaFile(e.target.files[0])}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-black file:text-white cursor-pointer shadow-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-700 block">Título Opcional</label>
                          <input
                            type="text"
                            placeholder="Ej. Vestido de Gala Azul"
                            value={itemTitle}
                            onChange={(e) => setItemTitle(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black shadow-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-700 block">Descripción Corta</label>
                          <input
                            type="text"
                            placeholder="Ej. Tela satinada con detalles bordados..."
                            value={itemDescription}
                            onChange={(e) => setItemDescription(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-black shadow-sm"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-black hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-all cursor-pointer shadow-sm"
                          >
                            {loading ? "Subiendo..." : "Guardar Imagen"}
                          </button>
                        </div>
                      </form>
                    )}

                    {gal.items.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {gal.items.map((item) => {
                          const isItemDeleteOpen = deleteItemTarget.galleryId === gal.id && deleteItemTarget.itemId === item.id;

                          return (
                            <div key={item.id} className="flex flex-col bg-white border border-slate-200 p-3 rounded-xl gap-3 shadow-sm">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <img src={item.url} alt={item.title || "Preview"} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
                                  <div className="overflow-hidden">
                                    <span className="text-xs font-semibold text-slate-900 truncate block">{item.title || "Sin título"}</span>
                                    <p className="text-xs text-slate-500 truncate">{item.description || "Sin descripción"}</p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setDeleteItemTarget(isItemDeleteOpen ? { galleryId: null, itemId: null } : { galleryId: gal.id, itemId: item.id })}
                                  className={`p-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                    isItemDeleteOpen 
                                      ? "bg-rose-600 text-white" 
                                      : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                                  }`}
                                  title="Eliminar imagen"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Panel de confirmación anidado para la imagen individual */}
                              <AnimatePresence>
                                {isItemDeleteOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden bg-rose-50/50 border border-rose-100 rounded-lg p-3 space-y-2.5"
                                  >
                                    <span className="text-xs font-semibold text-rose-950 block">¿Eliminar esta imagen?</span>
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setDeleteItemTarget({ galleryId: null, itemId: null })}
                                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteItem(gal.id, item.id)}
                                        className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-3">No hay imágenes en esta galería todavía.</p>
                    )}
                  </div>
                </div>
              </Reorder.Item>
            );
          })
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay galerías creadas para esta página todavía.</p>
        )}
      </Reorder.Group>
    </div>
  );
}