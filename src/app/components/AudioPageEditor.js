"use client";

import { useState } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import DeleteButton from "./AdminFormsComponents/ui/DeleteButton";
import DragIcon from "./AdminFormsComponents/ui/DragIcon";

export default function AudioPageEditor({ portfolioData, selectedPageId, updatePortfolio, onSave }) {
  const selectedPage = portfolioData?.pages?.find((p) => (p.id || p.slug) === selectedPageId);

  const [trackUrl, setTrackUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [openLayoutId, setOpenLayoutId] = useState(null); // Controla qué menú de layout está abierto por tarjeta

  const items = selectedPage?.items || [];

  const savePortfolioChanges = async (newItems) => {
    try {
      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage?.id || selectedPage?.slug)) {
          return { ...page, items: newItems };
        }
        return page;
      });

      if (typeof updatePortfolio === "function") {
        updatePortfolio({ pages: updatedPages });
      }

      if (typeof onSave === "function") {
        await onSave({ ...portfolioData, pages: updatedPages });
      }
    } catch (err) {
      console.error("Error al actualizar los audios:", err);
      setError(`Error al actualizar: ${err.message}`);
    }
  };

  const formatSpotifyUrl = (url) => {
    if (!url) return "";
    try {
      let cleanUrl = url.trim().split("?")[0];

      if (cleanUrl.startsWith("spotify:")) {
        const parts = cleanUrl.split(":");
        if (parts.length >= 3) {
          cleanUrl = `https://open.spotify.com/${parts[1]}/${parts[2]}`;
        }
      }

      cleanUrl = cleanUrl.replace(/\/intl-[a-z]{2}\//, "/");

      if (cleanUrl.includes("/embed/")) {
        return `${cleanUrl}?utm_source=generator&theme=0`;
      }

      const match = cleanUrl.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
      if (match && match[1] && match[2]) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
      }
    } catch (e) {
      console.error("Error formateando URL de Spotify", e);
    }
    return url;
  };

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!trackUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const rawUrl = trackUrl.trim();
      const formattedUrl = formatSpotifyUrl(rawUrl);

      let fetchedThumbnail = null;
      let fetchedTitle = "Pista de audio";

      try {
        const oembedRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(rawUrl)}`);
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.thumbnail_url) fetchedThumbnail = oembedData.thumbnail_url;
          if (oembedData.title) fetchedTitle = oembedData.title;
        }
      } catch (err) {
        console.warn("No se pudo obtener la información de oEmbed:", err);
      }

      const newItem = {
        id: crypto.randomUUID(),
        url: formattedUrl,
        originalUrl: rawUrl,
        title: fetchedTitle,
        thumbnail: fetchedThumbnail,
        layout: "grid", // Layout por defecto individual
        isActive: true,
        createdAt: new Date().toISOString()
      };

      const updatedItems = [newItem, ...items];
      await savePortfolioChanges(updatedItems);

      setTrackUrl("");
    } catch (err) {
      console.error("Error al añadir pista:", err);
      setError("No se pudo añadir la pista.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (newItems) => {
    const updatedPages = portfolioData.pages.map((page) => {
      if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
        return { ...page, items: newItems };
      }
      return page;
    });

    if (typeof updatePortfolio === "function") {
      updatePortfolio({ pages: updatedPages }, false);
    }
  };

  const handleDragEnd = async () => {
    if (selectedPage && items) {
      await savePortfolioChanges(items);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    await savePortfolioChanges(updatedItems);
    setDeleteConfirmId(null);
  };

  const handleToggleActive = async (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isActive: item.isActive === false };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  const handleUpdateItemLayout = async (itemId, newLayout) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, layout: newLayout };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
    setOpenLayoutId(null);
  };

  if (!selectedPage) {
    return <p className="text-xs text-slate-500 italic">Selecciona una página tipo audio válida.</p>;
  }

  const layoutOptions = [
    { id: "grid", name: "Cuadrícula / Grid" },
    { id: "column", name: "Lista / Columna" },
    { id: "card", name: "Tarjeta Completa" }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <Title 
          title={selectedPage?.title}
          externalRoute={`/${portfolioData.slug}/${selectedPage?.slug}`}
          openInNewTab={true}
        />
        <p className="text-sm text-slate-500">Página tipo audio (Spotify / Podcasts)</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Formulario para añadir canción */}
      <form onSubmit={handleAddTrack} className="bg-white border border-slate-300 p-4 rounded-xl space-y-3 shadow-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">Añadir nueva canción mediante enlace</h4>
        <div className="space-y-2">
          <input
            type="url"
            placeholder="Pega el enlace de Spotify (ej. https://open.spotify.com/track/...)"
            value={trackUrl}
            onChange={(e) => setTrackUrl(e.target.value)}
            required
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !trackUrl.trim()}
            className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:opacity-50 rounded-xl text-sm font-medium shadow-sm transition cursor-pointer"
          >
            {loading ? "Obteniendo datos..." : "+ Añadir canción"}
          </button>
        </div>
      </form>

      {/* Lista de pistas */}
      <div className="space-y-3">
        {items.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={items} 
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {items.map((item) => {
                const isDeleteOpen = deleteConfirmId === item.id;
                const isLayoutOpen = openLayoutId === item.id;
                const isActive = item.isActive !== false;
                const displayUrl = item.originalUrl || item.url;
                const displayTitle = item.title || "Pista de Spotify";
                const currentItemLayout = item.layout || "grid";

                return (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    onDragEnd={handleDragEnd}
                    className="list-none bg-white border border-slate-300 rounded-xl p-4 shadow-sm space-y-3 cursor-grab active:cursor-grabbing"
                  >
                    {/* Parte Superior: Imagen a la izquierda y textos a la derecha */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <DragIcon />

                      <div className="w-14 h-14 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={displayTitle} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-xl">🎵</span>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {displayTitle}
                        </h4>
                        <a
                          href={displayUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 hover:text-purple-600 truncate transition-colors mt-0.5"
                        >
                          {displayUrl}
                        </a>
                      </div>
                    </div>

                    {/* Bloque Inferior: Ícono de cuadros (layout), Switch de activo y Tacho para borrar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      {/* Botón con el ícono de cuadros para abrir selector de layout individual */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenLayoutId(isLayoutOpen ? null : item.id);
                          setDeleteConfirmId(null);
                        }}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                          isLayoutOpen 
                            ? "bg-purple-50 border-purple-300 text-purple-700" 
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Configurar layout de esta canción"
                      >
                        <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                        <span className="text-[11px] capitalize">{currentItemLayout}</span>
                      </button>

                      {/* Switch de Activo e Icono de Borrar */}
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => handleToggleActive(item.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                        </label>

                        <DeleteButton
                          isOpen={isDeleteOpen}
                          onClick={() => {
                            setDeleteConfirmId(isDeleteOpen ? null : item.id);
                            setOpenLayoutId(null);
                          }}
                        />
                      </div>
                    </div>

                    {/* Menú desplegable individual de Layouts */}
                    <AnimatePresence>
                      {isLayoutOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2"
                        >
                          <span className="text-[11px] font-semibold text-slate-700 block">Selecciona el diseño para esta pista:</span>
                          <div className="grid grid-cols-3 gap-2">
                            {layoutOptions.map((opt) => {
                              const isSelected = currentItemLayout === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleUpdateItemLayout(item.id, opt.id)}
                                  className={`border rounded-lg p-2 text-[11px] font-medium transition-all cursor-pointer text-center ${
                                    isSelected 
                                      ? "border-black bg-black text-white" 
                                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                                  }`}
                                >
                                  {opt.name}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Menú de confirmación de eliminación */}
                    <AnimatePresence>
                      {isDeleteOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="font-medium text-rose-900">¿Eliminar esta pista de audio?</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-rose-600 text-white px-3 py-1.5 rounded-lg font-medium cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay pistas de audio agregadas todavía.</p>
        )}
      </div>
    </div>
  );
}