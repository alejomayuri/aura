"use client";

import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import LinkItemForm from "@/app/components/LinkItemForm";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export default function LinkPageEditor({ portfolioData, selectedPageId, onUpdatePortfolio }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Estados para la edición en línea del título
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  // Estados para la edición en línea de la URL
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [tempUrl, setTempUrl] = useState("");
  
  // Referencia para detectar clics fuera del formulario
  const formRef = useRef(null);

  // Buscamos la página activa actual por ID o slug
  const selectedPage = portfolioData?.pages?.find(
    (p) => p.id === selectedPageId || p.slug === selectedPageId
  );

  // Efecto para cerrar el formulario al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (showForm && formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  if (!selectedPage) {
    return <p className="text-xs text-slate-500 italic">Selecciona una página de tipo enlace válida.</p>;
  }

  // Función para guardar cambios generales en Firestore y en el estado global
  const savePortfolioChanges = async (newItems) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
          return { ...page, items: newItems };
        }
        return page;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
    } catch (err) {
      console.error("Error al actualizar los datos:", err);
      setError(`Error al actualizar: ${err.message}`);
    }
  };

  // --- LÓGICA DE REORDENAMIENTO FLUIDO (SOLO UI) ---
  const handleReorder = (newItems) => {
    const updatedPages = portfolioData.pages.map((page) => {
      if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
        return { ...page, items: newItems };
      }
      return page;
    });

    onUpdatePortfolio(updatedPages);
  };

  // --- SE GUARDA EN BASE DE DATOS SOLO AL SOLTAR ---
  const handleDragEnd = async () => {
    if (selectedPage && selectedPage.items) {
      await savePortfolioChanges(selectedPage.items);
    }
  };
  // -------------------------------------------------

  // Función para activar/desactivar un enlace individual con el switch
  const handleToggleActive = async (linkId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          const currentActive = item.isActive !== false;
          return { ...item, isActive: !currentActive };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al actualizar el estado del enlace:", err);
      setError(`Error al actualizar estado: ${err.message}`);
    }
  };

  // Función para alternar el estado de destacado con la estrella
  const handleToggleFeatured = async (linkId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          return { ...item, isFeatured: !item.isFeatured };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al actualizar destacado:", err);
      setError(`Error al actualizar destacado: ${err.message}`);
    }
  };

  // Guardar el título editado del enlace
  const handleSaveTitle = async (linkId) => {
    if (!tempTitle.trim()) {
      setEditingLinkId(null);
      return;
    }

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          return { ...item, title: tempTitle.trim() };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al guardar el título:", err);
      setError(`Error al actualizar título: ${err.message}`);
    } finally {
      setEditingLinkId(null);
    }
  };

  // Guardar la URL editada del enlace
  const handleSaveUrl = async (linkId) => {
    if (!tempUrl.trim()) {
      setEditingUrlId(null);
      return;
    }

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          return { ...item, url: tempUrl.trim() };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al guardar la URL:", err);
      setError(`Error al actualizar URL: ${err.message}`);
    } finally {
      setEditingUrlId(null);
    }
  };

  // Función que recibe el objeto "newLinkItem" y lo coloca al INICIO de la lista
  const handleAddLinkItem = async (newLinkItem) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      setError("No hay una sesión activa en Firebase.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const itemWithActiveState = { 
        ...newLinkItem, 
        isActive: newLinkItem.isActive ?? true,
        isFeatured: newLinkItem.isFeatured ?? false 
      };
      const updatedItems = [itemWithActiveState, ...(selectedPage.items || [])];

      await savePortfolioChanges(updatedItems);
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar el enlace:", err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para borrar un enlace individual de la lista
  const handleDeleteLinkItem = async (linkId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const updatedItems = (selectedPage.items || []).filter((item) => item.id !== linkId);
      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al eliminar enlace:", err);
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{selectedPage.title}</h2>
        </div>
        <p className="text-sm text-slate-500">Página tipo links</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Contenedor principal del formulario con la referencia para el click outside */}
      <div ref={formRef} className="space-y-3">
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            <span>+ Añadir link</span>
          </button>
        )}

        <div 
          className={`grid transition-all duration-300 ease-in-out ${
            showForm ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"
          }`}
        >
          <div className="overflow-hidden space-y-2">
            <div className="bg-transparent border-none p-0 shadow-none pt-1">
              <LinkItemForm onAddLink={handleAddLinkItem} loading={loading} />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Listado con Framer Motion Reorder optimizado */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Links ({selectedPage.items?.length || 0})
        </h3>
        
        {selectedPage.items && selectedPage.items.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={selectedPage.items} 
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {selectedPage.items.map((link) => {
                const isLinkActive = link.isActive !== false;
                const isEditing = editingLinkId === link.id;
                const isEditingUrl = editingUrlId === link.id;
                const isFeatured = link.isFeatured === true;

                return (
                  <Reorder.Item 
                    key={link.id} 
                    value={link}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col bg-white border px-4 py-3.5 rounded-xl gap-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-slate-300 hover:shadow-md transition-colors ${
                      !isLinkActive ? "opacity-60 border-dashed border-slate-300 bg-slate-50/50" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3 overflow-hidden w-full">
                        {/* Icono de arrastre original de puntos */}
                        <div className="text-slate-300 hover:text-slate-500 shrink-0 select-none">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="9" cy="6" r="1.5" />
                            <circle cx="15" cy="6" r="1.5" />
                            <circle cx="9" cy="12" r="1.5" />
                            <circle cx="15" cy="12" r="1.5" />
                            <circle cx="9" cy="18" r="1.5" />
                            <circle cx="15" cy="18" r="1.5" />
                          </svg>
                        </div>

                        {/* Contenedor principal con separación mejorada (space-y-1.5) */}
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
                                className="text-sm font-medium text-slate-950 bg-slate-100 border border-purple-400 rounded px-2 py-0.5 outline-none w-full"
                              />
                            ) : (
                              <span 
                                onClick={() => {
                                  setEditingLinkId(link.id);
                                  setTempTitle(link.title || "");
                                }}
                                title="Haz clic para editar el título"
                                className="text-sm font-medium text-slate-950 tracking-wide truncate block cursor-pointer hover:text-purple-600 transition-colors"
                              >
                                {link.title || "Sin título"}
                              </span>
                            )}
                          </div>

                          {/* Campo de URL con separación clara */}
                          <div>
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
                                className="text-xs text-slate-950 bg-slate-100 border border-purple-400 rounded px-2 py-0.5 outline-none w-full"
                              />
                            ) : (
                              <p 
                                onClick={() => {
                                  setEditingUrlId(link.id);
                                  setTempUrl(link.url || "");
                                }}
                                title="Haz clic para editar la URL"
                                className="text-xs text-slate-500 truncate cursor-pointer hover:text-purple-600 transition-colors"
                              >
                                {link.url || "Sin URL"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Línea divisoria y controles inferiores */}
                    <div className="mt-1 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(link.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
                            isFeatured 
                              ? "bg-amber-50 border-amber-200 text-amber-400" 
                              : "bg-transparent border-slate-200 text-slate-300 hover:text-slate-400"
                          }`}
                          title={isFeatured ? "Quitar destacado" : "Destacar enlace"}
                        >
                          <svg className="w-4 h-4" fill={isFeatured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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

                        <button
                          type="button"
                          onClick={() => handleDeleteLinkItem(link.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
                          title="Borrar enlace"
                        >
                          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay enlaces agregados todavía.</p>
        )}
      </div>
    </div>
  );
}