"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function PagesManager({ portfolioData, onUpdatePages }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pageType, setPageType] = useState("image");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Inicializamos el estado local directamente con las páginas que ya vienen del portfolioData
  const [localPages, setLocalPages] = useState(() => portfolioData?.pages || []);

  // Efecto único para hacer que el mensaje de éxito desaparezca automáticamente a los 4 segundos
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Generación de slug con limpieza de tildes
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");  

    setSlug(generatedSlug);
  };

  // Guardar nueva página en Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !slug.trim()) {
      setError("Por favor completa el título y el slug.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      setError("No hay una sesión activa. Por favor inicia sesión de nuevo.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const newPage = {
        id: Date.now().toString(),
        title: title.trim(),
        slug: slug.trim(),
        type: pageType,
        items: [],
        createdAt: new Date().toISOString()
      };

      const updatedPages = [...localPages, newPage];
      const portfolioRef = doc(db, "portfolios", currentUser.uid);

      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      setLocalPages(updatedPages);
      
      if (onUpdatePages) {
        onUpdatePages(updatedPages);
      }

      setSuccessMsg("¡Página creada y guardada con éxito!");
      setTitle("");
      setSlug("");
      setPageType("image");
    } catch (err) {
      console.error("Error al guardar en Firestore:", err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Borrar página existente
  const handleDeletePage = async (pageId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      setError("No hay una sesión activa.");
      return;
    }

    try {
      const updatedPages = localPages.filter((page) => (page.id || page.slug) !== pageId);
      const portfolioRef = doc(db, "portfolios", currentUser.uid);

      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      setLocalPages(updatedPages);
      
      if (onUpdatePages) {
        onUpdatePages(updatedPages);
      }

      setSuccessMsg("Página eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar la página:", err);
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl space-y-6">
      
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">Crear y Gestionar Páginas</h2>
        <p className="text-xs text-slate-400 mt-1">
          Añade nuevas secciones a tu base de datos o elimina las que ya no necesites.
        </p>
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

      {/* Formulario de Creación */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-950/60 border border-slate-800/80 p-5 rounded-xl shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Nombre de la Página</label>
          <input 
            type="text"
            required
            placeholder="Ej. Colección 2026"
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">URL / Slug Generado</label>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-400 overflow-x-auto">
            <span className="text-purple-400 font-medium">aura.com/mi-portfolio/</span>
            <span className="text-white font-semibold">{slug || "nombre-de-la-pagina"}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Tipo de Contenido (Type)</label>
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="image">Imagen / Galería</option>
            <option value="audio">Audio / Podcast</option>
            <option value="text">Texto / Artículo</option>
            <option value="link">Enlace / Linktree</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all focus:outline-none flex items-center gap-2 cursor-pointer"
          >
            {loading ? "Guardando..." : "Crear y Guardar en BD"}
          </button>
        </div>
      </form>

      {/* Listado de páginas con opción de borrado */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Páginas Registradas ({localPages.length})</h3>
        
        {localPages.length > 0 ? (
          <div className="space-y-2">
            {localPages.map((page, index) => {
              const pageKey = page.id || page.slug;
              return (
                <div key={pageKey} className="flex items-center justify-between bg-slate-950/40 border border-slate-800/80 px-4 py-3 rounded-xl gap-3">
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-white truncate block">{page.title}</span>
                    <p className="text-[11px] text-slate-400 truncate">aura.com/mi-portfolio/<span className="text-purple-300">{page.slug}</span></p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] uppercase font-medium px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">
                      {page.type}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => handleDeletePage(pageKey)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic text-center py-4">No hay páginas guardadas en la base de datos todavía.</p>
        )}
      </div>

    </div>
  );
}