"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import LinkItemForm from "@/app/components/LinkItemForm";

export default function LinkPageEditor({ portfolioData, selectedPageId, onUpdatePortfolio }) {
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Buscamos la página activa actual por ID o slug
  const selectedPage = portfolioData?.pages?.find(
    (p) => p.id === selectedPageId || p.slug === selectedPageId
  );

  if (!selectedPage) {
    return <p className="text-xs text-slate-500 italic">Selecciona una página de tipo enlace válida.</p>;
  }

  // Función que recibe el objeto "newLinkItem" de tu LinkItemForm y lo guarda
  const handleAddLinkItem = async (newLinkItem) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      setError("No hay una sesión activa en Firebase.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const updatedItems = [...(selectedPage.items || []), newLinkItem];

      // Reemplazamos los items solo en la página que coincide
      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
          return { ...page, items: updatedItems };
        }
        return page;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
      setSuccessMsg("¡Enlace añadido con éxito!");
      setTimeout(() => setSuccessMsg(null), 4000);
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
      setSuccessMsg("Enlace eliminado correctamente.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Error al eliminar enlace:", err);
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white tracking-tight">Gestionar Enlaces: {selectedPage.title}</h2>
        <p className="text-xs text-slate-400 mt-1">Añade botones externos para tu sección tipo Linktree.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl transition-all duration-300">
          {successMsg}
        </div>
      )}

      {/* Tu formulario intacto recibiendo las props correctas */}
      <LinkItemForm onAddLink={handleAddLinkItem} loading={loading} />

      {/* Listado visual de los enlaces registrados */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Enlaces Registrados ({selectedPage.items?.length || 0})
        </h3>
        
        {selectedPage.items && selectedPage.items.length > 0 ? (
          <div className="space-y-2">
            {selectedPage.items.map((link) => (
              <div key={link.id} className="flex items-center justify-between bg-slate-950/40 border border-slate-800/80 px-4 py-3 rounded-xl gap-3">
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate block">{link.title}</span>
                    {link.isFeatured && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium">Destacado</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{link.url}</p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] uppercase font-medium px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">
                    {link.icon}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteLinkItem(link.id)}
                    className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic text-center py-4">No hay enlaces agregados todavía.</p>
        )}
      </div>
    </div>
  );
}