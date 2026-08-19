"use client";

import { useState } from "react";

export default function LinkItemForm({ onAddLink, loading }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("website");
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setError("Por favor completa el título y la URL del enlace.");
      return;
    }

    setError(null);

    // Estructura del nuevo link a guardar dentro del array de items de la página
    const newLinkItem = {
      id: Date.now().toString(),
      title: title.trim(),
      url: url.trim(),
      icon: icon,
      isFeatured: isFeatured, // Opción booleana solicitada
      createdAt: new Date().toISOString()
    };

    onAddLink(newLinkItem);

    // Limpiar formulario tras enviar
    setTitle("");
    setUrl("");
    setIsFeatured(false);
    setIcon("website");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Añadir Nuevo Enlace (Linktree)</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Configura botones de redirección hacia tus redes o webs externas.</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Título del Botón */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300">Título del Enlace</label>
        <input 
          type="text"
          required
          placeholder="Ej. Mi Instagram / Agendar Cita / Canal de YouTube"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* URL de Destino */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300">URL de Destino</label>
        <input 
          type="url"
          required
          placeholder="https://instagram.com/tu_usuario"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Selector de Icono / Red Social */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300">Plataforma / Icono</label>
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
        >
          <option value="website">Sitio Web / General</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
          <option value="spotify">Spotify</option>
          <option value="twitter">X (Twitter)</option>
          <option value="github">GitHub</option>
          <option value="calendly">Calendly / Citas</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      {/* Opción Booleana: Destacar Link */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl">
        <div className="space-y-0.5">
          <label htmlFor="featured-toggle" className="text-xs font-medium text-white cursor-pointer block">
            Destacar este enlace
          </label>
          <p className="text-[11px] text-slate-400">
            Aparecerá con un estilo visual llamativo o animado en la parte superior.
          </p>
        </div>
        <input
          id="featured-toggle"
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-4 h-4 accent-purple-600 rounded bg-slate-950 border-slate-700 cursor-pointer"
        />
      </div>

      {/* Botón de Enviar */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all focus:outline-none cursor-pointer"
        >
          {loading ? "Añadiendo..." : "Añadir Enlace a la Lista"}
        </button>
      </div>
    </form>
  );
}