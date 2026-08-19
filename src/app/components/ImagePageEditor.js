"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ImagePageEditor({ portfolioData, selectedPageId, onUpdatePortfolio }) {
  const page = portfolioData.pages.find((p) => (p.id || p.slug) === selectedPageId);

  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [activeGalleryId, setActiveGalleryId] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!page) {
    return <div className="text-xs text-slate-400">Selecciona una página válida desde el menú lateral.</div>;
  }

  const galleries = page.galleries || [];

  // 1. Crear una nueva galería para ESTA página
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

    try {
      // Usamos crypto.randomUUID() para generar un identificador único puro y seguro
      const newGallery = {
        id: crypto.randomUUID(),
        title: newGalleryTitle.trim(),
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

  // 2. Subir imagen a Cloudinary y añadirla a la galería seleccionada
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

      // Usamos crypto.randomUUID() en lugar de Date.now()
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

  // 3. Eliminar una imagen de una galería específica
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
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
      setError("No se pudo eliminar la imagen.");
    }
  };

  // 4. Eliminar una galería completa de esta página
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
    } catch (err) {
      console.error("Error al eliminar galería:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl space-y-6">
      <div>
        <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-md border border-purple-500/20">
          Gestor de Galerías
        </span>
        <h2 className="text-base font-bold text-white tracking-tight mt-1.5">{page.title}</h2>
        <p className="text-xs text-slate-400">
          Gestiona las galerías exclusivas para esta página.
        </p>
      </div>

      {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl">{error}</div>}
      {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl">{successMsg}</div>}

      {/* Formulario para Crear una Nueva Galería */}
      <form onSubmit={handleCreateGallery} className="flex gap-2 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
        <input
          type="text"
          placeholder="Nombre de la galería (ej. Vestidos, Zapatos...)"
          value={newGalleryTitle}
          onChange={(e) => setNewGalleryTitle(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all shrink-0 cursor-pointer"
        >
          Crear Galería
        </button>
      </form>

      {/* Listado de Galerías de ESTA página */}
      <div className="space-y-4">
        {galleries.length > 0 ? (
          galleries.map((gal) => (
            <div key={gal.id} className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{gal.title}</h3>
                  <p className="text-[11px] text-slate-400">{gal.items.length} imágenes registradas</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveGalleryId(activeGalleryId === gal.id ? null : gal.id)}
                    className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    {activeGalleryId === gal.id ? "Cancelar" : "+ Añadir Imagen"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGallery(gal.id)}
                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Borrar Galería
                  </button>
                </div>
              </div>

              {activeGalleryId === gal.id && (
                <form onSubmit={(e) => handleAddImageToGallery(e, gal.id)} className="space-y-3 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <h4 className="text-xs font-semibold text-purple-300">Subir imagen a &quot;{gal.title}&quot;</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300">Archivo de Imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setMediaFile(e.target.files[0])}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300">Título Opcional</label>
                    <input
                      type="text"
                      placeholder="Ej. Vestido de Gala Azul"
                      value={itemTitle}
                      onChange={(e) => setItemTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300">Descripción Corta</label>
                    <input
                      type="text"
                      placeholder="Ej. Tela satinada con detalles bordados..."
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      {loading ? "Subiendo..." : "Guardar Imagen"}
                    </button>
                  </div>
                </form>
              )}

              {gal.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {gal.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl gap-2.5">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img src={item.url} alt={item.title || "Preview"} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-800" />
                        <div className="overflow-hidden">
                          <span className="text-xs font-bold text-white truncate block">{item.title || "Sin título"}</span>
                          <p className="text-[10px] text-slate-400 truncate">{item.description || "Sin descripción"}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(gal.id, item.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-semibold transition-all shrink-0 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic text-center py-2">No hay imágenes en esta galería todavía.</p>
              )}

            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic text-center py-6">No hay galerías creadas para esta página todavía.</p>
        )}
      </div>
    </div>
  );
}