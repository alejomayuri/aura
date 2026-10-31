"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"

export default function SoundPreview({ page, styles, portfolioData, blockColor, textColor, home = false }) {
  // Filtramos solo las pistas que estén activas
  const items = (page?.items || []).filter((item) => item.isActive !== false);

  const pathname = usePathname();
  const isPortfolioPage = pathname && pathname !== "/" && !pathname.includes("/admin");

  // Estado para controlar el modal de la canción seleccionada
  const [selectedTrackModal, setSelectedTrackModal] = useState(null);

  // Funciones auxiliares para identificar plataformas según las URLs
  const isYouTubeMusicUrl = (url) => {
    const lower = (url || "").toLowerCase();
    return lower.includes("music.youtube.com");
  };

  const isYouTubeUrl = (url) => {
    const lower = (url || "").toLowerCase();
    return lower.includes("youtube.com") || lower.includes("youtu.be");
  };

  const isSoundCloudUrl = (url) => {
    const lower = (url || "").toLowerCase();
    return lower.includes("soundcloud.com") || lower.includes("on.soundcloud.com");
  };

  const isAppleMusicUrl = (url) => {
    const lower = (url || "").toLowerCase();
    return lower.includes("apple.com");
  };

  const getTrackType = (originalUrl, embedUrl) => {
    if (isYouTubeMusicUrl(originalUrl) || isYouTubeMusicUrl(embedUrl)) return "youtubemusic";
    if (isYouTubeUrl(originalUrl) || isYouTubeUrl(embedUrl)) return "youtube";
    if (isSoundCloudUrl(originalUrl) || isSoundCloudUrl(embedUrl)) return "soundcloud";
    if (isAppleMusicUrl(originalUrl) || isAppleMusicUrl(embedUrl)) return "applemusic";
    return "spotify";
  };

  // Función auxiliar para obtener el nombre legible de la plataforma
  const getPlatformBrandInfo = (url, fallbackName = "") => {
    const lower = (url || "").toLowerCase();
    if (lower.includes("music.youtube.com")) return { name: "YouTube Music", openLabel: "Open in YouTube Music" };
    if (lower.includes("youtube.com") || lower.includes("youtu.be")) return { name: "YouTube", openLabel: "Open in YouTube" };
    if (lower.includes("soundcloud.com") || lower.includes("on.soundcloud.com")) return { name: "SoundCloud", openLabel: "Open in SoundCloud" };
    if (lower.includes("apple.com")) return { name: "Apple Music", openLabel: "Open in Apple Music" };
    if (lower.includes("deezer.com")) return { name: "Deezer", openLabel: "Open in Deezer" };
    if (lower.includes("tidal.com")) return { name: "Tidal", openLabel: "Open in Tidal" };
    if (lower.includes("bandcamp.com")) return { name: "Bandcamp", openLabel: "Open in Bandcamp" };
    if (lower.includes("spotify.com") || lower.startsWith("spotify:")) return { name: "Spotify", openLabel: "Open in Spotify" };
    
    if (fallbackName) {
      const fbLower = fallbackName.toLowerCase();
      if (fbLower.includes("youtube music")) return { name: "YouTube Music", openLabel: "Open in YouTube Music" };
      if (fbLower.includes("youtube")) return { name: "YouTube", openLabel: "Open in YouTube" };
      if (fbLower.includes("soundcloud")) return { name: "SoundCloud", openLabel: "Open in SoundCloud" };
      if (fbLower.includes("apple")) return { name: "Apple Music", openLabel: "Open in Apple Music" };
      if (fbLower.includes("spotify")) return { name: "Spotify", openLabel: "Open in Spotify" };
      return { name: fallbackName, openLabel: `Open in ${fallbackName}` };
    }

    return { name: "Spotify", openLabel: "Open in Spotify" };
  };

  // Función auxiliar para renderizar los iconos de plataformas
  const renderPlatformIcon = (name, s, isWhite = false, url = "") => {
    const lowerName = (name || "").toLowerCase();
    const isYTM = isYouTubeMusicUrl(url) || lowerName.includes("music.youtube.com");
    const isYT = (isYouTubeUrl(url) || lowerName.includes("youtube")) && !isYTM;
    const isSC = isSoundCloudUrl(url) || lowerName.includes("soundcloud");
    const isApple = isAppleMusicUrl(url) || lowerName.includes("apple");
    const isDeezer = lowerName.includes("deezer");
    const isTidal = lowerName.includes("tidal");

    if (isApple) {
      return (
        <svg className="w-6 h-6 shrink-0 inline-block mr-1" viewBox="0 0 32 32" width="24" height="24">
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                fill="url(#paint0_linear_596)" 
                d="M32 8.86222V10.0089L31.9867 21.9867C31.9867 22.1141 31.9872 22.2415 31.9877 22.3689C31.9886 22.6237 31.9896 22.8785 31.9867 23.1333C31.9867 23.4533 31.9822 23.7778 31.9733 24.0978C31.9623 24.8021 31.8999 25.5047 31.7867 26.2C31.6688 26.8958 31.447 27.57 31.1289 28.2C30.8095 28.8291 30.3925 29.4036 29.8933 29.9022C29.3939 30.4004 28.8195 30.8173 28.1911 31.1378C27.5627 31.4559 26.89 31.6777 26.1956 31.7956C25.5006 31.911 24.7978 31.9734 24.0933 31.9822C23.7733 31.9911 23.4489 31.9956 23.1289 31.9956H10.0044C9.87704 31.9956 9.74963 31.996 9.62222 31.9965C9.36741 31.9975 9.11259 31.9985 8.85778 31.9956C8.53778 31.9956 8.21333 31.9911 7.89333 31.9822C7.18899 31.9712 6.48638 31.9088 5.79111 31.7956C5.09686 31.677 4.42424 31.4553 3.79556 31.1378C2.5299 30.4943 1.50122 29.4657 0.857778 28.2C0.540266 27.5698 0.318566 26.8957 0.2 26.2C0.0845601 25.505 0.0221579 24.8022 0.0133333 24.0978C0.00444444 23.7778 0 23.4533 0 23.1333V8.86222L0.0133333 7.90222C0.02437 7.19788 0.0867577 6.49527 0.2 5.8C0.317891 5.10416 0.539623 4.42997 0.857778 3.8C1.50465 2.53531 2.53434 1.50718 3.8 0.862222C4.42822 0.542685 5.10093 0.319448 5.79556 0.2C6.49055 0.0845601 7.19332 0.0221579 7.89778 0.0133333C8.21778 0.00444444 8.54222 0 8.86222 0H23.1378L24.1067 0.0133333C24.811 0.02437 25.5136 0.0867577 26.2089 0.2C26.9031 0.318584 27.5758 0.540294 28.2044 0.857778C29.4701 1.50122 30.4988 2.5299 31.1422 3.79556C31.4597 4.4258 31.6814 5.09988 31.8 5.79556C31.9154 6.49055 31.9778 7.19332 31.9867 7.89778C31.9956 8.21778 32 8.54222 32 8.86222ZM21.7733 5.03556C21.8578 5.01778 22.5467 4.89778 22.6222 4.88889C23.1378 4.84445 23.4267 5.18223 23.4311 5.72889V20.8178C23.4436 21.2124 23.4138 21.6073 23.3422 21.9956C23.2615 22.389 23.1029 22.7622 22.8756 23.0933C22.6459 23.4233 22.3471 23.6994 22 23.9022C21.6554 24.0994 21.2796 24.2362 20.8889 24.3067C20.3291 24.4528 19.7453 24.483 19.1733 24.3956C18.7418 24.3093 18.3421 24.1064 18.0178 23.8089C17.7699 23.5857 17.5694 23.3149 17.4283 23.0127C17.2871 22.7104 17.2082 22.3829 17.1962 22.0495C17.1841 21.7162 17.2393 21.3838 17.3583 21.0722C17.4773 20.7606 17.6577 20.476 17.8889 20.2356C18.182 19.9392 18.5372 19.7115 18.9289 19.5689C19.5026 19.3733 20.0912 19.2247 20.6889 19.1244C20.7933 19.1044 20.8967 19.0833 21 19.0622C21.1033 19.0411 21.2067 19.02 21.3111 19C21.5783 18.9713 21.8253 18.8447 22.0044 18.6444C22.1599 18.4117 22.2276 18.1314 22.1956 17.8533V10.8044C22.1956 10.2667 21.9556 10.12 21.44 10.2178C21.0711 10.2889 13.1644 11.8844 13.1644 11.8844C12.7156 11.9956 12.56 12.1422 12.56 12.6933V23.0133C12.5664 23.4086 12.5307 23.8034 12.4533 24.1911C12.3727 24.5845 12.214 24.9578 11.9867 25.2889C11.757 25.6189 11.4582 25.8949 11.1111 26.0978C10.7658 26.2944 10.3904 26.4326 10 26.5067C9.44016 26.6528 8.85639 26.683 8.28445 26.5956C7.85185 26.5096 7.45172 26.305 7.12889 26.0044C6.67868 25.593 6.39685 25.0293 6.33778 24.4222C6.29686 24.0622 6.33491 23.6975 6.44928 23.3536C6.56364 23.0098 6.75158 22.695 7 22.4311C7.29314 22.1348 7.64833 21.9071 8.04 21.7645C8.61367 21.5689 9.20227 21.4203 9.8 21.32C9.90445 21.3 10.0078 21.2789 10.1111 21.2578C10.2144 21.2367 10.3178 21.2156 10.4222 21.1956C10.6894 21.1669 10.9364 21.0402 11.1156 20.84C11.2761 20.6141 11.3502 20.3381 11.3244 20.0622V8.16C11.3232 8.05291 11.3306 7.9459 11.3467 7.84C11.3736 7.6017 11.4876 7.38172 11.6667 7.22223C11.8386 7.08575 12.0417 6.99411 12.2578 6.95556H12.2622L21.7733 5.03556Z"
            />
            <defs>
                <linearGradient id="paint0_linear_596" x1="16" y1="31.876" x2="16" y2="0.689689" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FA233B"></stop>
                    <stop offset="1" stopColor="#FB5C74"></stop>
                </linearGradient>
            </defs>
        </svg>
      );
    }

    if (isYTM) {
      return (
        <svg className={`w-${s} h-${s} text-red-600 shrink-0 inline-block mr-1`} viewBox="0 0 20 20" width="16" height="16">
          <path fillRule="evenodd" clipRule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM14.7684 9.99997C14.7684 7.37043 12.6298 5.23179 10.0002 5.23179C7.37068 5.23179 5.23204 7.37043 5.23204 9.99997C5.23204 12.6295 7.37068 14.7682 10.0002 14.7682C12.6298 14.7682 14.7684 12.6295 14.7684 9.99997ZM4.77295 9.99997C4.77295 7.11247 7.11272 4.7727 10.0002 4.7727C12.8877 4.7727 15.2275 7.11247 15.2275 9.99997C15.2275 12.8875 12.8877 15.2272 10.0002 15.2272C7.11272 15.2272 4.77295 12.8875 4.77295 9.99997ZM12.6135 9.88651L8.18172 12.6138V7.38651L12.6135 9.88651Z" fill="#FF0000"></path>
        </svg>
      );
    }

    if (isYT) {
      return (
        <svg className={`w-${s} h-${s} text-red-600 shrink-0`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }

    if (isSC) {
      return (
        <svg className={`w-${s} h-${s} text-orange-500 shrink-0 inline-block mr-1`} viewBox="0 0 22 11" width="24" height="24">
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

    

    if (isDeezer) {
      return (
        <svg className={`w-${s} h-${s} text-purple-600 shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 16.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM19.2 11h3.6v9.5h-3.6V11zM0 11h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM0 5.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4z"/>
        </svg>
      );
    }

    if (isTidal) {
      return (
        <svg className={`w-${s} h-${s} text-cyan-600 shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 3.993L8.008 7.997 4.004 3.993 0 7.997l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004zM12.012 16.007l4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004-4.004 4.004 4.004 4.004z"/>
        </svg>
      );
    }

    // Por defecto Spotify
    return (
      <svg className={`w-${s} h-${s} text-green-600 shrink-0 inline-block mr-1`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
      </svg>
    );
  };

  return (
    <div key={page.id} className="space-y-3 mb-8">
        {(home && page.showTitleOnHome)  && (
            <span className={`block text-center whitespace-normal break-words mb-1.5 ${styles.pageTitle}`}
            style={{ color: textColor }}
            >
            {page.title}
            </span>
        )}
        <div className="space-y-3">
        {items.length > 0 ? (
            items.map((item) => {
            const layout = item.layout || "classic";
            const displayTitle = item.title || "Pista de música";
            const displayArtist = item.artist || item.subtitle || item.author || "Artista";
            const embedUrl = item.url;
            const originalUrl = item.originalUrl || "";
            
            const trackType = getTrackType(originalUrl, embedUrl);
            const brandInfo = getPlatformBrandInfo(originalUrl || embedUrl);
            const brandName = brandInfo.name;

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
                        height={trackType === "soundcloud" ? "166" : "152"}
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className=""
                        title={item.title || "Player"}
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
                            {renderPlatformIcon(brandName, "3", false, originalUrl || embedUrl)}
                            <span className="truncate">{brandName} · {displayArtist}</span>
                        </span>
                    </div>
                </div>
            );
        })) : (
            <p className="text-xs text-center italic opacity-50 py-6">No hay pistas de audio agregadas aún.</p>
        )}
        </div>

        {/* MODAL INTERACTIVO */}
        {(selectedTrackModal && isPortfolioPage) && (
            (() => {
                const originalUrl = selectedTrackModal.originalUrl || "";
                const embedUrl = selectedTrackModal.url || "";
                const trackType = getTrackType(originalUrl, embedUrl);
                const brandInfo = getPlatformBrandInfo(originalUrl || embedUrl);
                const brandName = brandInfo.name;
                const openLabel = brandInfo.openLabel;

                return (
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
                                <h3 className="text-lg tracking-tight text-black truncate max-w-full" title={selectedTrackModal.title || "Pista de música"}>
                                    {selectedTrackModal.title || "Pista de música"}
                                </h3>
                                <p className="text-sm text-slate-600 flex items-center justify-center max-w-full truncate font-medium">
                                    {renderPlatformIcon(brandName, "4", false, originalUrl || embedUrl)}
                                    <span className="truncate">{brandName} · {selectedTrackModal.artist || "Artista"}</span>
                                </p>
                            </div>

                            {/* CONTENIDO QUE HACE SCROLL (REPRODUCTOR Y PLATAFORMAS) */}
                            <div className="space-y-5 pt-2 pb-4 overflow-y-auto flex-1 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {/* Reproductor de la canción grande */}
                                <div className={`w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 ${trackType === "soundcloud" ? "p-1" : ""}`}>
                                    {selectedTrackModal.url ? (
                                        <iframe
                                            src={selectedTrackModal.url}
                                            width="100%"
                                            height={trackType === "soundcloud" ? "166" : "352"}
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                            title="Player Modal Large"
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
                                                .map((plat) => {
                                                    const platBrand = getPlatformBrandInfo(plat.url, plat.name).name;
                                                    return (
                                                        <a
                                                            key={plat.id || plat.url}
                                                            href={plat.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-3.5 rounded-xl border border-gray-300 transition text-md text-black group shadow-sm bg-white hover:bg-slate-50"
                                                        >
                                                            <span className="flex items-center gap-2.5 truncate">
                                                                {renderPlatformIcon(platBrand, "6", false, plat.url)}
                                                                <span className="truncate">{platBrand}</span>
                                                            </span>
                                                            <svg className="w-4 h-4 text-slate-400 transition transform group-hover:translate-x-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </a>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 italic py-2">No hay plataformas extra añadidas a esta pista.</p>
                                    )}
                                </div>
                            </div>

                            {/* BOTÓN OPEN IN FIJO ABAJO */}
                            <div className="pt-3 bg-white border-t border-slate-100 shrink-0">
                                <div className="flex justify-start">
                                    <a
                                        href={selectedTrackModal.originalUrl || selectedTrackModal.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-black text-white font-bold text-md shadow-md transition transform cursor-pointer"
                                    >
                                        {renderPlatformIcon(brandName, "5", true, originalUrl || embedUrl)}
                                        <span>{openLabel}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()
        )}
    </div>
  );
}