"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export default function ImagePageEditor({ portfolioData, selectedPageId, onUpdatePortfolio }) {
  const page = portfolioData.pages.find((p) => (p.id || p.slug) === selectedPageId);

  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  
  const [modalGalleryId, setModalGalleryId] = useState(null);
  const [modalTempFile, setModalTempFile] = useState(null);
  const [modalTempPreview, setModalTempPreview] = useState(null);
  
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingGalleryTitle, setEditingGalleryTitle] = useState("");

  const [deleteGalleryUid, setDeleteGalleryUid] = useState(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState({ galleryId: null, itemId: null });

  const [loading, setLoading] = useState(false);
  const [savingGalleryId, setSavingGalleryId] = useState(null);
  const [savingItemId, setSavingItemId] = useState(null);
  const [hoveredGalleryId, setHoveredGalleryId] = useState(null);
  
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!page) {
    return <div className="text-sm text-slate-500">Selecciona una página válida desde el menú lateral.</div>;
  }

  const galleries = page.galleries || [];

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!newGalleryTitle.trim()) return;

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

      const updatedGalleries = [newGallery, ...galleries];
      
      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
      setNewGalleryTitle("");
    } catch (err) {
      console.error("Error al crear galería:", err);
      setError("No se pudo crear la galería.");
    } finally {
      setLoading(false);
    }
  };

  // Actualiza el estado visual fluidamente mientras se arrastra
  const handleReorderGalleries = (newOrderGalleries) => {
    const updatedPages = portfolioData.pages.map((p) => {
      if ((p.id || p.slug) === selectedPageId) {
        return { ...p, galleries: newOrderGalleries };
      }
      return p;
    });
    onUpdatePortfolio(updatedPages);
  };

  // Guarda definitivamente en Firestore al soltar la galería
  const handleSaveGalleriesOrder = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setError(null);
    try {
      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: portfolioData.pages }, { merge: true });
    } catch (err) {
      console.error("Error al guardar orden de galerías:", err);
      setError("No se pudo guardar el nuevo orden de las galerías.");
    }
  };

  const handleReorderItems = (galleryId, newOrderItems) => {
    const updatedGalleries = galleries.map((gal) => {
      if (gal.id === galleryId) {
        return { ...gal, items: newOrderItems };
      }
      return gal;
    });

    const updatedPages = portfolioData.pages.map((p) => {
      if ((p.id || p.slug) === selectedPageId) {
        return { ...p, galleries: updatedGalleries };
      }
      return p;
    });

    onUpdatePortfolio(updatedPages);
  };

  const handleSaveItemsOrder = async (droppedItem) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSavingItemId(droppedItem.id);
    setError(null);

    try {
      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: portfolioData.pages }, { merge: true });
    } catch (err) {
      console.error("Error al guardar orden de imágenes:", err);
      setError("No se pudo guardar el nuevo orden de las imágenes.");
    } finally {
      setSavingItemId(null);
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

  const handleToggleItemActive = async (galleryId, itemId, currentActiveState) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          const updatedItems = gal.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, isActive: currentActiveState === undefined ? false : !currentActiveState };
            }
            return item;
          });
          return { ...gal, items: updatedItems };
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
      console.error("Error al cambiar estado de imagen:", err);
      setError("No se pudo actualizar el estado de la imagen.");
    }
  };

  const handleModalFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModalTempFile(file);
      setModalTempPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelImageSelection = () => {
    setModalGalleryId(null);
    setModalTempFile(null);
    setModalTempPreview(null);
  };

  const handleConfirmImageSelection = async () => {
    if (!modalTempFile || !modalGalleryId) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", modalTempFile);
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
        title: "",
        description: "",
        isActive: true,
        createdAt: new Date().toISOString()
      };

      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === modalGalleryId) {
          return { ...gal, items: [newItem, ...gal.items] };
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
      handleCancelImageSelection();
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
      setDeleteGalleryUid(null);
    } catch (err) {
      console.error("Error al eliminar galería:", err);
      setError("No se pudo eliminar la galería.");
    }
  };

  const targetGalleryForModal = galleries.find(g => g.id === modalGalleryId);

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{page.title}</h2>
        </div>
        <p className="text-sm text-slate-500">Página tipo imagen</p>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">{error}</div>}
      {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3.5 rounded-xl">{successMsg}</div>}

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
          disabled={loading || !newGalleryTitle.trim()}
          className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:bg-black disabled:text-white rounded-xl text-sm font-medium shadow-sm transition-all shrink-0 cursor-pointer"
        >
          Crear Galería
        </button>
      </form>

      <Reorder.Group 
        axis="y" 
        values={galleries} 
        onReorder={handleReorderGalleries}
        className="space-y-4 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {galleries.length > 0 ? (
          galleries.map((gal) => {
            const isGalleryDeleteOpen = deleteGalleryUid === gal.id;
            const isGalleryActive = gal.isActive !== false;
            const isEditing = editingGalleryId === gal.id;
            const isHovered = hoveredGalleryId === gal.id;

            return (
              <Reorder.Item 
                key={gal.id} 
                value={gal} 
                onDragEnd={handleSaveGalleriesOrder}
                className="list-none relative"
              >
                <div 
                  onMouseEnter={() => setHoveredGalleryId(gal.id)}
                  onMouseLeave={() => setHoveredGalleryId(null)}
                  className="bg-white border border-purple-100 rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-3">
                      
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
                                if (e.key === "Enter") e.target.blur();
                                if (e.key === "Escape") setEditingGalleryId(null);
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

                      <div className={`flex items-center gap-3 shrink-0 transition-opacity duration-200 ${isHovered || isGalleryDeleteOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
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

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isGalleryActive}
                            onChange={() => handleToggleGalleryActive(gal.id, isGalleryActive)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>

                        <button
                          type="button"
                          onClick={() => setDeleteGalleryUid(isGalleryDeleteOpen ? null : gal.id)}
                          className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                            isGalleryDeleteOpen ? "bg-rose-600 text-white" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                          }`}
                        >
                          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isGalleryDeleteOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-3"
                        >
                          <span className="text-xs font-semibold text-rose-900 block">¿Eliminar esta galería completa?</span>
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

                    {gal.items.length > 0 ? (
                      <Reorder.Group 
                        axis="y" 
                        values={gal.items} 
                        onReorder={(newOrder) => handleReorderItems(gal.id, newOrder)}
                        className="space-y-2 pt-1"
                      >
                        {gal.items.map((item) => {
                          const isItemDeleteOpen = deleteItemTarget.galleryId === gal.id && deleteItemTarget.itemId === item.id;
                          const isItemActive = item.isActive !== false;
                          const isThisItemSaving = savingItemId === item.id;

                          return (
                            <Reorder.Item 
                              key={item.id} 
                              value={item} 
                              onDragEnd={() => handleSaveItemsOrder(item)}
                              className="list-none bg-white border border-slate-200 p-3 rounded-xl shadow-sm"
                            >
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3">
                                  
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div 
                                      className="text-slate-400 hover:text-purple-700 flex flex-col gap-0.5 justify-center shrink-0 px-1 transition-colors cursor-grab active:cursor-grabbing"
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

                                    <img src={item.url} alt="Preview" className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 shadow-sm" />
                                    
                                    {isThisItemSaving && (
                                      <svg className="w-5 h-5 animate-spin text-purple-600 shrink-0 ml-1" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={isItemActive}
                                        onChange={() => handleToggleItemActive(gal.id, item.id, isItemActive)}
                                        className="sr-only peer"
                                      />
                                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>

                                    <button
                                      type="button"
                                      onClick={() => setDeleteItemTarget(isItemDeleteOpen ? { galleryId: null, itemId: null } : { galleryId: gal.id, itemId: item.id })}
                                      className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                                        isItemDeleteOpen ? "bg-rose-600 text-white" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                                      }`}
                                    >
                                      <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                                      <span className="text-xs font-semibold text-rose-950 block">¿Eliminar esta imagen?</span>
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setDeleteItemTarget({ galleryId: null, itemId: null })}
                                          className="bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer"
                                        >
                                          Cancelar
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteItem(gal.id, item.id)}
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
                        })}
                      </Reorder.Group>
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

      {/* MODAL PARA SUBIR IMAGEN */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {modalGalleryId && targetGalleryForModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl shadow-xl border border-purple-100 w-full max-w-md overflow-hidden p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-slate-900">
                    Añadir imagen a &quot;{targetGalleryForModal.title}&quot;
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelImageSelection}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className={`flex flex-col items-center justify-center border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-6 bg-purple-50/30 transition text-center relative group ${loading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={loading}
                      onChange={handleModalFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    {modalTempPreview ? (
                      <div className="space-y-3 flex flex-col items-center">
                        <img src={modalTempPreview} alt="Preview nueva" className="max-h-48 rounded-xl object-contain shadow-sm" />
                        <span className="text-xs text-purple-700 font-medium bg-purple-100 px-3 py-1 rounded-full">
                          Haz clic o arrastra otra para cambiar
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center">
                        <svg className="w-10 h-10 text-purple-500 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2.5 2.5 0 012.828 0L16 16m-2-2l1.586-1.586a2.5 2.5 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-black">Arrastra tu imagen aquí o haz clic</span>
                        <span className="text-xs text-black">PNG, JPG, WEBP hasta 10MB</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelImageSelection}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmImageSelection}
                    disabled={!modalTempFile || loading}
                    className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
                  >
                    {loading ? "Subiendo..." : "Aceptar"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}