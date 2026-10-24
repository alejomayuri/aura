"use client";

import { useState } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import DeleteButton from "../ui/DeleteButton";
import DragIcon from "../ui/DragIcon";

export default function AudioCardItem({
  item,
  onDragEnd,
  onToggleActive,
  onUpdateLayout,
  onDeleteTrack,
  onAddPlatform,
  onTogglePlatformActive,
  onReorderPlatforms,
  onSavePlatformsOrder,
  onDeletePlatform
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isPlatformFormOpen, setIsPlatformFormOpen] = useState(false);
  const [newPlatformUrl, setNewPlatformUrl] = useState("");

  const isActive = item.isActive !== false;
  const displayUrl = item.originalUrl || item.url;
  const displayTitle = item.title || "Pista de Spotify";
  const currentLayout = item.layout || "classic";
  const platforms = item.platforms || [];

  const handlePlatformSubmit = (e) => {
    e.preventDefault();
    if (!newPlatformUrl.trim()) return;
    onAddPlatform(item.id, newPlatformUrl);
    setNewPlatformUrl("");
  };

  // Función para renderizar el icono de plataforma ampliado
  const renderPlatformIcon = (name) => {
    const lowerName = (name || "").toLowerCase();

    if (lowerName.includes("open") || lowerName.includes("spotify")) {
      return (
        <svg className="w-6 h-6 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
        </svg>
      );
    }
    if (lowerName.includes("youtube")) {
      return (
        <svg className="w-6 h-6 text-red-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    if (lowerName.includes("soundcloud")) {
      return (
        <svg className="w-6 h-6 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.56 8.87c-.36 0-.71.05-1.04.15-.31-.83-1.12-1.42-2.07-1.42-1.22 0-2.21.99-2.21 2.21 0 .16.02.31.05.47-.95.31-1.63 1.2-1.63 2.25 0 1.31 1.06 2.38 2.38 2.38h11.25c1.1 0 2-.9 2-2 0-.99-.71-1.81-1.66-1.97-.13-1.48-1.35-2.65-2.84-2.65-.63 0-1.21.21-1.68.57-.49-.36-1.09-.58-1.74-.58z"/>
        </svg>
      );
    }
    if (lowerName.includes("apple")) {
      return (
        <svg className="w-6 h-6 text-pink-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.99 5.83c.57-.69.96-1.65.86-2.61-.83.03-1.84.55-2.43 1.24-.52.6-.98 1.58-.85 2.53.93.07 1.85-.47 2.42-1.16z"/>
        </svg>
      );
    }
    if (lowerName.includes("deezer")) {
      return (
        <svg className="w-6 h-6 text-purple-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 16.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM19.2 11h3.6v9.5h-3.6V11zM0 11h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM0 5.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4z"/>
        </svg>
      );
    }
    if (lowerName.includes("tidal")) {
      return (
        <svg className="w-6 h-6 text-cyan-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 3.993L8.008 7.997 4.004 3.993 0 7.997l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004zM12.012 16.007l4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004-4.004 4.004 4.004 4.004z"/>
        </svg>
      );
    }

    return (
      <svg className="w-6 h-6 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  };

  return (
    <Reorder.Item
      value={item}
      onDragEnd={onDragEnd}
      className="list-none bg-white border border-slate-300 rounded-xl p-4 shadow-sm space-y-3 cursor-grab active:cursor-grabbing"
    >
      {/* Parte Superior: Imagen, Icono de Spotify a la izquierda del título y textos */}
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
          {/* Contenedor del Icono de Spotify + Nombre de la canción */}
          <div className="flex items-center gap-1 mb-1">
            <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
            </svg>
            <span className="text-sm font-medium text-slate-950 truncate block cursor-pointer hover:underline">
              {displayTitle}
            </span>
          </div>

          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 truncate block cursor-pointer hover:underline "
          >
            {displayUrl}
          </a>
        </div>
      </div>

      {/* Bloque Inferior: Botón de Layout, Botón + Añadir plataforma, Switch activo y Borrar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Botón de Layout */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLayoutOpen(!isLayoutOpen);
              setIsPlatformFormOpen(false);
              setIsDeleteOpen(false);
            }}
            className={`py-1 px-3 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
              isLayoutOpen 
                ? "border-black text-black" 
                : "border-slate-200 text-slate-600"
            }`}
            title="Configurar layout de esta canción"
          >
            <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span className="py-1.5 text-xs font-medium rounded-t-lg transition-colors">Layout</span>
          </button>

          {/* Botón + Añadir plataforma */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlatformFormOpen(!isPlatformFormOpen);
              setIsLayoutOpen(false);
              setIsDeleteOpen(false);
            }}
            className={`py-1 px-3 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-medium ${
              isPlatformFormOpen 
                ? "border-black text-black" 
                : "border-slate-200 text-slate-600"
            }`}
          >
            <span className="py-1.5 text-xs font-medium rounded-t-lg transition-colors">+ Añadir plataforma</span>
          </button>
        </div>

        {/* Switch de Activo e Icono de Borrar */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => onToggleActive(item.id)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
          </label>

          <DeleteButton
            isOpen={isDeleteOpen}
            onClick={() => {
              setIsDeleteOpen(!isDeleteOpen);
              setIsLayoutOpen(false);
              setIsPlatformFormOpen(false);
            }}
          />
        </div>
      </div>

      {/* Desplegable: Configurar Layout individual con íconos Clásico y Banner */}
      <AnimatePresence>
        {isLayoutOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2"
          >
            <div className="flex justify-start gap-3">
              {/* Clásico */}
              <button
                type="button"
                onClick={() => {
                  onUpdateLayout(item.id, "classic");
                  setIsLayoutOpen(false);
                }}
                className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2.5 cursor-pointer transition-all text-center group max-w-[140px] w-full ${
                  currentLayout === "classic"
                    ? "border-black text-black bg-white shadow-xs"
                    : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                }`}
              >
                <div className="h-11 w-full flex items-center justify-center transition-colors overflow-hidden">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="1" y="2.5" width="22" height="5" rx="1" strokeWidth="1" />
                    <rect x="1" y="9.5" width="22" height="5" rx="1" strokeWidth="1" />
                    <rect x="1" y="16.5" width="22" height="5" rx="1" strokeWidth="1" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${
                  currentLayout === "classic" ? "text-black font-semibold" : "text-slate-800"
                }`}>
                  Clásico
                </span>
              </button>

              {/* Banner / Featured */}
              <button
                type="button"
                onClick={() => {
                  onUpdateLayout(item.id, "featured");
                  setIsLayoutOpen(false);
                }}
                className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2.5 cursor-pointer transition-all text-center group max-w-[140px] w-full ${
                  currentLayout === "featured"
                    ? "border-black text-black bg-white shadow-xs"
                    : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                }`}
              >
                <div className="h-11 w-full flex items-center justify-center transition-colors overflow-hidden">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="0.5" y="3" width="23" height="18" rx="1.5" strokeWidth="1" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${
                  currentLayout === "featured" ? "text-black font-semibold" : "text-slate-800"
                }`}>
                  Banner
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desplegable: Añadir y gestionar plataformas adicionales */}
      <AnimatePresence>
        {isPlatformFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3"
          >
            
            <form onSubmit={handlePlatformSubmit} className="flex gap-2">
              <input
                type="url"
                placeholder="Pega el enlace (ej. https://youtube.com/...)"
                value={newPlatformUrl}
                onChange={(e) => setNewPlatformUrl(e.target.value)}
                required
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                Añadir
              </button>
            </form>

            {platforms.length > 0 ? (
              <Reorder.Group 
                axis="y" 
                values={platforms} 
                onReorder={(newOrder) => onReorderPlatforms(item.id, newOrder)}
                className="space-y-2 pt-2"
              >
                {platforms.map((plat) => {
                  const isPlatformActive = plat.isActive !== false;

                  return (
                    <Reorder.Item
                      key={plat.id}
                      value={plat}
                      onDragEnd={() => onSavePlatformsOrder(item.id)}
                      className="list-none bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-3 shadow-xs cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                        <DragIcon />
                        {renderPlatformIcon(plat.name)}
                        <div className="flex flex-col truncate flex-1">
                          <span className="text-xs font-semibold text-slate-900 truncate">{plat.name === "Open" ? "Spotify" : plat.name}</span>
                          <a href={plat.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-purple-600 truncate">
                            {plat.url}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Switch de activación para la plataforma */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPlatformActive}
                            onChange={() => onTogglePlatformActive(item.id, plat.id)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[5px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600" />
                        </label>

                        {/* Botón de borrador (Tachito) */}
                        <button
                          type="button"
                          onClick={() => onDeletePlatform(item.id, plat.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                          title="Eliminar plataforma"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            ) : (
              <p className="text-[11px] text-slate-400 italic text-center py-1">No hay plataformas adicionales añadidas.</p>
            )}
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
                onClick={() => setIsDeleteOpen(false)}
                className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => onDeleteTrack(item.id)}
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
}