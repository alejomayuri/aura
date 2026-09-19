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

  // Función para guardar el orden actualizado en Firestore y en el estado global
  const saveSortedItems = async (newItems) => {
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
      console.error("Error al actualizar el orden de los enlaces:", err);
      setError(`Error al reordenar: ${err.message}`);
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
      await saveSortedItems(selectedPage.items);
    }
  };
  // -------------------------------------------------

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
      const updatedItems = [newLinkItem, ...(selectedPage.items || [])];

      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
          return { ...page, items: updatedItems };
        }
        return page;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
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

      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
          return { ...page, items: updatedItems };
        }
        return page;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
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
          Enlaces Registrados ({selectedPage.items?.length || 0})
        </h3>
        
        {selectedPage.items && selectedPage.items.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={selectedPage.items} 
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {selectedPage.items.map((link) => (
                <Reorder.Item 
                  key={link.id} 
                  value={link}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3.5 rounded-xl gap-3 shadow-sm cursor-grab active:cursor-grabbing hover:border-slate-300 hover:shadow-md transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
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

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-950 tracking-wide truncate block">{link.title}</span>
                        {link.isFeatured && (
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-medium">Destacado</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{link.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg">
                      {link.icon}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteLinkItem(link.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
                      title="Borrar enlace"
                    >
                      <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay enlaces agregados todavía.</p>
        )}
      </div>
    </div>
  );
}