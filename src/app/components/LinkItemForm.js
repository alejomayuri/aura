"use client";

import { useState, useEffect } from "react";

export default function LinkItemForm({ onAddLink, loading }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("website");
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Activamos la animación justo después de montarse el componente
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setError("Por favor completa el título y la URL del enlace.");
      return;
    }

    setError(null);

    const newLinkItem = {
      id: Date.now().toString(),
      title: title.trim(),
      url: url.trim(),
      icon: icon,
      isFeatured: isFeatured,
      createdAt: new Date().toISOString()
    };

    onAddLink(newLinkItem);

    setTitle("");
    setUrl("");
    setIsFeatured(false);
    setIcon("website");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm transition-all duration-300 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-medium text-slate-950 tracking-wide truncate">Añadir nuevo link</h3>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* URL de Destino */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">URL</label>
        <input 
          type="url"
          required
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500/50 shadow-sm"
        />
      </div>

      {/* Título del Botón */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Título</label>
        <input 
          type="text"
          required
          placeholder="Título del link"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500/50 shadow-sm"
        />
      </div>

      {/* Opción Booleana: Destacar Link */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
        <div className="space-y-0.5">
          <label htmlFor="featured-toggle" className="text-sm font-medium text-slate-900 cursor-pointer block">
            Destacar este enlace
          </label>
          <p className="text-xs text-slate-500">
            Aparecerá en el home.
          </p>
        </div>
        <input
          id="featured-toggle"
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-4 h-4 accent-purple-600 rounded bg-white border-slate-300 cursor-pointer"
        />
      </div>

      {/* Botón de Enviar */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:bg-black disabled:text-white rounded-xl text-sm font-medium shadow-sm transition-all shrink-0 cursor-pointer"
        >
          {loading ? "Añadiendo..." : "Añadir Enlace a la Lista"}
        </button>
      </div>
    </form>
  );
}