"use client";

import { useState } from "react";

export default function SoundPreview({ page, styles, portfolioData, blockColor, textColor }) {
  // Filtramos solo las pistas que estén activas
  const items = (page?.items || []).filter((item) => item.isActive !== false);

  // Estado para controlar el modal de la canción clásica seleccionada
  const [selectedTrackModal, setSelectedTrackModal] = useState(null);

  // Función auxiliar para renderizar los iconos de plataformas (con tamaño ampliado)
  const renderPlatformIcon = (name, s, isWhite = false) => {
    const lowerName = (name || "").toLowerCase();

    if (lowerName.includes("open") || lowerName.includes("spotify")) {
      return (
        <svg className={`w-${s} h-${s} ${isWhite ? "text-white" : "text-green-600"} shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
        </svg>
      );
    }
    if (lowerName.includes("youtube")) {
      return (
        <svg className={`w-${s} h-${s} text-red-600 shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    if (lowerName.includes("soundcloud")) {
      return (
        <svg className={`w-${s} h-${s} text-red-600 shrink-0 inline-block mr-1`} viewBox="0 0 22 11" width="24" height="24">
            <path d="M19.0148 4.51539C18.6135 4.51539 18.2372 4.59065 17.886 4.74116C17.6351 2.0821 15.4025 0 12.6933 0C12.016 0 11.3888 0.125428 10.8119 0.351197C10.5861 0.426454 10.5359 0.526796 10.5359 0.702395V10.0593C10.5359 10.2349 10.6864 10.3854 10.862 10.4105C10.862 10.4105 18.9897 10.4105 19.0399 10.4105C20.6705 10.4105 22 9.08096 22 7.4504C21.9498 5.84493 20.6454 4.51539 19.0148 4.51539Z" fill="#FF5500"></path>
            <path d="M0.50171 6.04561C0.301026 6.04561 0.125428 6.22121 0.125428 6.42189L0 7.72634L0.125428 9.03079C0.125428 9.23147 0.301026 9.40707 0.50171 9.40707C0.702395 9.40707 0.877993 9.23147 0.877993 9.03079L1.00342 7.72634L0.877993 6.42189C0.877993 6.19612 0.702395 6.04561 0.50171 6.04561Z" fill="#FF5500"></path>
            <path d="M2.00685 4.91676C1.80617 4.91676 1.63057 5.09236 1.63057 5.29305L1.50514 7.72634L1.63057 10.0342C1.63057 10.2349 1.80617 10.4105 2.00685 10.4105C2.20754 10.4105 2.38314 10.2349 2.38314 10.0342L2.50856 7.72634L2.38314 5.29305C2.38314 5.09236 2.20754 4.91676 2.00685 4.91676Z" fill="#FF5500"></path>
            <path d="M3.51196 5.44356C3.31128 5.44356 3.13568 5.61916 3.13568 5.81984L3.01025 7.72634L3.13568 10.0342C3.13568 10.2349 3.31128 10.4105 3.51196 10.4105C3.71265 10.4105 3.88825 10.2349 3.88825 10.0342L4.01367 7.72634L3.88825 5.81984C3.88825 5.61916 3.71265 5.44356 3.51196 5.44356Z" fill="#FF5500"></path>
            <path d="M5.01711 3.41164C4.81642 3.41164 4.64082 3.58723 4.64082 3.78792L4.5154 7.72635L4.64082 10.0342C4.64082 10.2349 4.81642 10.4105 5.01711 10.4105C5.21779 10.4105 5.39339 10.2349 5.39339 10.0342L5.51882 7.72635L5.39339 3.78792C5.39339 3.58723 5.21779 3.41164 5.01711 3.41164Z" fill="#FF5500"></path>
            <path d="M6.52223 2.4333C6.32155 2.4333 6.14595 2.6089 6.14595 2.80959L6.02052 7.72635L6.14595 10.0342C6.14595 10.2349 6.32155 10.4105 6.52223 10.4105C6.72292 10.4105 6.89852 10.2349 6.89852 10.0342L7.02394 7.72635L6.89852 2.80959C6.89852 2.6089 6.72292 2.4333 6.52223 2.4333Z" fill="#FF5500"></path>
            <path d="M8.02738 2.96008C7.82669 2.96008 7.65109 3.13568 7.65109 3.33637L7.52567 7.72633L7.65109 10.0342C7.65109 10.2349 7.82669 10.4105 8.02738 10.4105C8.22806 10.4105 8.40366 10.2349 8.40366 10.0342L8.52909 7.72633L8.40366 3.33637C8.40366 3.1106 8.22806 2.96008 8.02738 2.96008Z" fill="#FF5500"></path>
            <path d="M9.5325 1.42987C9.33182 1.42987 9.15622 1.60547 9.15622 1.80615L9.03079 7.72634L9.15622 10.0342C9.15622 10.2349 9.33182 10.4105 9.5325 10.4105C9.73319 10.4105 9.90879 10.2349 9.90879 10.0342L10.0342 7.72634L9.90879 1.80615C9.90879 1.60547 9.73319 1.42987 9.5325 1.42987Z" fill="#FF5500"></path>
        </svg>
      );
    }
    if (lowerName.includes("apple")) {
      return (
        <svg className={`w-${s} h-${s} text-pink-600 shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.99 5.83c.57-.69.96-1.65.86-2.61-.83.03-1.84.55-2.43 1.24-.52.6-.98 1.58-.85 2.53.93.07 1.85-.47 2.42-1.16z"/>
        </svg>
      );
    }
    if (lowerName.includes("deezer")) {
      return (
        <svg className={`w-${s} h-${s} text-purple-600 shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 16.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM19.2 11h3.6v9.5h-3.6V11zM0 11h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM0 5.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4z"/>
        </svg>
      );
    }
    if (lowerName.includes("tidal")) {
      return (
        <svg className={`w-${s} h-${s} text-cyan-600 shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 3.993L8.008 7.997 4.004 3.993 0 7.997l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004zM12.012 16.007l4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004-4.004 4.004 4.004 4.004z"/>
        </svg>
      );
    }

    return (
      <svg className={`w-${s} h-${s} text-slate-500 shrink-0 inline-block mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  };

  return (
    <div key={page.id} className="space-y-3 mb-8">
        <span className={`block whitespace-normal break-words mb-1.5 ${styles.pageTitle}`}
            style={{ color: textColor }}
        >
            {page.title}
        </span>
        <div className="space-y-3">
        {items.length > 0 ? (
            items.map((item) => {
            const layout = item.layout || "classic";
            const displayTitle = item.title || "Pista de música";
            const displayArtist = item.artist || item.subtitle || item.author || "Artista";
            const embedUrl = item.url;
            
            const resolvedBlockColor = blockColor || portfolioData?.colors?.secondaryColor;
            const blockStyle = resolvedBlockColor ? { backgroundColor: resolvedBlockColor } : {};
            const textStyle = textColor ? { color: textColor } : portfolioData?.colors?.textColor ? { color: portfolioData.colors.textColor } : {};

            // Layout "featured" (o "features") muestra el reproductor iframe
            if (layout === "featured" || layout === "features") {
                return (
                <div 
                    key={item.id}
                    className={`w-full p-2 relative overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-center mb-3 ${styles.pageCard}`}
                    style={blockStyle}
                >
                    {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className=""
                        title={item.title || "Spotify Player"}
                    />
                    ) : (
                    <p className="text-xs text-center opacity-50 py-4">No hay enlace de embed disponible</p>
                    )}
                </div>
                );
            }

            // Layout "classic" con imagen a la izquierda, texto centrado y limitado con puntos suspensivos
            return (
                <div 
                    key={item.id}
                    onClick={() => setSelectedTrackModal(item)}
                    className={`w-full p-2 min-h-[68px] transition-all duration-200 cursor-pointer relative flex items-center mb-3 hover:scale-[1.01] ${styles.pageCard}`}
                    style={blockStyle}
                >
                    {/* Imagen fija a la izquierda absoluta */}
                    <div className={`w-[48px] h-[48px] shrink-0 overflow-hidden z-10 ${styles.radiusImageLink || ''}`}>
                        {item.thumbnail ? (
                            <img src={item.thumbnail} alt={displayTitle} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg">🎵</span>
                        )}
                    </div>

                    {/* Contenedor de texto con posicionamiento absoluto y truncado con puntos suspensivos */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-16 w-full">
                        <span className={`text-center truncate max-w-full px-2 ${styles.pageTitle}`} style={textStyle} title={displayTitle}>
                            {displayTitle}
                        </span>
                        <span className="text-[12px] opacity-60 truncate max-w-full flex items-center justify-center pointer-events-auto" style={textStyle}>
                            {renderPlatformIcon("spotify", "3")}
                            <span className="truncate">Song · {displayArtist}</span>
                        </span>
                    </div>
                </div>
            );
        })) : (
            <p className="text-xs text-center italic opacity-50 py-6">No hay pistas de audio agregadas aún.</p>
        )}
        </div>

        {/* MODAL INTERACTIVO */}
        {selectedTrackModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div 
                    className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-black overflow-hidden max-h-[92vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botón de cierre */}
                    <button
                        onClick={() => setSelectedTrackModal(null)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-700 cursor-pointer z-20 font-semibold"
                    >
                        ✕
                    </button>

                    {/* TÍTULO Y ARTISTA FIJOS ARRIBA */}
                    <div className="text-center space-y-1 pr-6 pl-6 shrink-0 pt-2 pb-4 bg-white z-10">
                        <h3 className="text-lg tracking-tight text-black truncate max-w-full " title={selectedTrackModal.title || "Pista de música"}>
                            {selectedTrackModal.title || "Pista de música"}
                        </h3>
                        <p className="text-sm text-slate-600 flex items-center justify-center max-w-full truncate font-medium">
                            {renderPlatformIcon("spotify", "4")}
                            <span className="truncate">Song · {selectedTrackModal.artist || "Artista"}</span>
                        </p>
                    </div>

                    {/* CONTENIDO QUE HACE SCROLL (REPRODUCTOR, PLATAFORMAS Y BOTÓN) */}
                    <div className="space-y-5 pt-4 overflow-y-auto flex-1 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {/* Reproductor de la canción en versión grande */}
                        <div className="w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0">
                            {selectedTrackModal.url ? (
                                <iframe
                                    src={selectedTrackModal.url}
                                    width="100%"
                                    height="352"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    title="Spotify Player Modal Large"
                                />
                            ) : (
                                <p className="text-xs text-center text-slate-500 py-12">Reproductor no disponible</p>
                            )}
                        </div>

                        {/* Lista de plataformas extra */}
                        <div className="space-y-2.5">
                            <span className="text-md text-slate-700 tracking-wider block font-semibold">
                                Escuchar en
                            </span>
                            {selectedTrackModal.platforms && selectedTrackModal.platforms.filter(p => p.isActive !== false).length > 0 ? (
                                <div className="flex flex-col gap-2.5 pb-2">
                                    {selectedTrackModal.platforms
                                        .filter((plat) => plat.isActive !== false)
                                        .map((plat) => (
                                            <a
                                                key={plat.id || plat.url}
                                                href={plat.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-300 transition text-md text-black group shadow-sm bg-white hover:bg-slate-50"
                                            >
                                                <span className="flex items-center gap-2.5 truncate">
                                                    {renderPlatformIcon(plat.name, "6")}
                                                    <span className="truncate">{plat.name}</span>
                                                </span>
                                                <svg className="w-4 h-4 text-slate-400 transition transform group-hover:translate-x-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 italic py-2">No hay plataformas extra añadidas a esta pista.</p>
                            )}
                        </div>

                        {/* Botón Open in Spotify abajo a la izquierda */}
                        <div className="flex justify-start pt-2 pb-2">
                            <a
                                href={selectedTrackModal.originalUrl || selectedTrackModal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-black text-white font-bold text-md shadow-md transition transform cursor-pointer"
                            >
                                {renderPlatformIcon("spotify", "5", true)}
                                <span>Open in Spotify</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}