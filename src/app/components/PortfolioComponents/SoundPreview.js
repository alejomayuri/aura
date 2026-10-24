"use client";

export default function SoundPreview({ page, styles, portfolioData, blockColor, textColor }) {
  // Filtramos solo las pistas que estén activas
  const items = (page?.items || []).filter((item) => item.isActive !== false);

//   console.log("styles", styles);

  // Función auxiliar para renderizar los iconos de plataformas
  const renderPlatformIcon = (name) => {
    const lowerName = (name || "").toLowerCase();

    if (lowerName.includes("open") || lowerName.includes("spotify")) {
      return (
        <svg className="w-3.5 h-3.5 text-green-500 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
        </svg>
      );
    }
    if (lowerName.includes("youtube")) {
      return (
        <svg className="w-3.5 h-3.5 text-red-600 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    if (lowerName.includes("soundcloud")) {
      return (
        <svg className="w-3.5 h-3.5 text-orange-500 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.56 8.87c-.36 0-.71.05-1.04.15-.31-.83-1.12-1.42-2.07-1.42-1.22 0-2.21.99-2.21 2.21 0 .16.02.31.05.47-.95.31-1.63 1.2-1.63 2.25 0 1.31 1.06 2.38 2.38 2.38h11.25c1.1 0 2-.9 2-2 0-.99-.71-1.81-1.66-1.97-.13-1.48-1.35-2.65-2.84-2.65-.63 0-1.21.21-1.68.57-.49-.36-1.09-.58-1.74-.58z"/>
        </svg>
      );
    }
    if (lowerName.includes("apple")) {
      return (
        <svg className="w-3.5 h-3.5 text-pink-600 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.99 5.83c.57-.69.96-1.65.86-2.61-.83.03-1.84.55-2.43 1.24-.52.6-.98 1.58-.85 2.53.93.07 1.85-.47 2.42-1.16z"/>
        </svg>
      );
    }
    if (lowerName.includes("deezer")) {
      return (
        <svg className="w-3.5 h-3.5 text-purple-600 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 16.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM19.2 11h3.6v9.5h-3.6V11zM0 11h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM0 5.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4z"/>
        </svg>
      );
    }
    if (lowerName.includes("tidal")) {
      return (
        <svg className="w-3.5 h-3.5 text-cyan-500 shrink-0 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 3.993L8.008 7.997 4.004 3.993 0 7.997l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004zM12.012 16.007l4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004-4.004 4.004 4.004 4.004z"/>
        </svg>
      );
    }

    return (
      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                console.log("item", item)
            const resolvedBlockColor = blockColor || portfolioData?.colors?.secondaryColor;
            const blockStyle = resolvedBlockColor ? { backgroundColor: resolvedBlockColor } : {};
            const textStyle = textColor ? { color: textColor } : portfolioData?.colors?.textColor ? { color: portfolioData.colors.textColor } : {};

            // Layout "featured" (o "features") muestra el reproductor iframe dentro de una tarjeta con el blockColor
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

            // Layout "classic" muestra el formato de tarjeta de audio personalizado
            return (
                <div 
                    key={item.id}
                    className={`w-full p-2 min-h-[68px] transition-all duration-200 cursor-pointer grid items-center mb-3 ${styles.pageCard}`}
                    style={blockStyle}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-[48px] h-[48px] shrink-0 overflow-hidden ${styles.radiusImageLink || ''}`}>
                        {item.thumbnail ? (
                            <img src={item.thumbnail} alt={displayTitle} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg">🎵</span>
                        )}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`text-xs font-semibold whitespace-normal break-words ${styles.pageTitle}`} style={textStyle}>
                                {displayTitle}
                                </span>
                            </div>
                            <span className="text-[10px] opacity-60 truncate flex items-center" style={textStyle}>
                                {renderPlatformIcon("spotify")}
                                <span>Song · {displayArtist}</span>
                            </span>
                        </div>
                    </div>
                </div>
            );
            })
        ) : (
            <p className="text-xs text-center italic opacity-50 py-6">No hay pistas de audio agregadas aún.</p>
        )}
        </div>
    </div>
  );
}