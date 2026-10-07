import React, { useState } from 'react';

export const ImageStyleOption = ({ 
  styleValue = 'rounded', 
  label = 'Redonda', 
  currentImageDisplay, 
  portfolioData, 
  setPortfolioData,
  onSave // <--- 1. Recibe la función para guardar en la base de datos (opcional si prefieres hacerlo directo)
}) => {
  const [loading, setLoading] = useState(false);

  const isSelected = (portfolioData?.imageStyle || 'rounded') === styleValue;
  const isFullWidth = styleValue === 'full-width';
  const isFadeBottom = styleValue === 'fade-bottom';
  const isHorizontal = styleValue === 'horizontal';
  const isSquareRounded = styleValue === 'square-rounded';
  const isCreativeBlob = styleValue === 'creative-blob';

  // Función local para obtener el icono según la URL del enlace social
  const getSocialIconMini = (url) => {
    if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
    if (lowerUrl.includes("whatsapp.com") || lowerUrl.includes("wa.me")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
    if (lowerUrl.includes("linkedin.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
    if (lowerUrl.includes("github.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
    if (lowerUrl.includes("facebook.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
    if (lowerUrl.includes("tiktok.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
    return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  };

  const socialLinks = portfolioData?.socialLinks || [];

  // 2. Manejador del clic para actualizar el estado y disparar el guardado en BD
  const handleClick = async () => {
    const updatedData = { ...portfolioData, imageStyle: styleValue };
    
    // Actualizamos el estado local de React
    setPortfolioData(updatedData);

    // Si pasas una función de guardado (por ejemplo, una API o Server Action), la llamamos
    if (onSave && loading === false) {
      try {
        setLoading(true);
        await onSave(updatedData); // Aquí enviarías los datos a tu base de datos
      } catch (error) {
        console.error("Error al guardar el estilo de imagen en la base de datos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
        isSelected
          ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
      } `}
    >
      <div className="w-full h-64 bg-emerald-200/80 rounded-2xl p-0 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-emerald-300 relative">
        
        {/* Estructura condicional según el tipo de estilo */}
        {isCreativeBlob ? (
          <>
            {currentImageDisplay ? (
                <img src={currentImageDisplay} alt="Preview" className="rounded-[30%_70%_70%_30%/30%_30%_70%_70%] aspect-square object-cover w-20 h-20 mt-3" />
            ) : (
              <div className="w-20 h-20 rounded-2xl rounded-tr-xs bg-emerald-300/80 shrink-0 flex items-center justify-center text-xs text-emerald-800 mt-3">📷</div>
            )}
          </>
        ) : isSquareRounded ? (
          <>
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Preview" className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs mt-3" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-emerald-300/80 shrink-0 flex items-center justify-center text-xs text-emerald-800 mt-3">📷</div>
            )}
          </>
        ) : isHorizontal ? (
          <div className="px-1.5 w-full">
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Preview" className="w-full h-20 rounded-lg object-cover shrink-0 shadow-xs mt-3" />
            ) : (
              <div className="w-full h-20 rounded-lg bg-emerald-300/80 shrink-0 flex items-center justify-center text-xs text-emerald-800 mt-3">📷</div>
            )}
          </div>
        ) : isFadeBottom ? (
          <div className="relative w-full h-24 shrink-0">
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Preview" className="w-full h-23 object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-300/80 flex items-center justify-center text-xs text-emerald-800">📷</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-200 via-emerald-200/40 to-transparent"></div>
          </div>
        ) : isFullWidth ? (
          currentImageDisplay ? (
            <img src={currentImageDisplay} alt="Preview" className="w-full h-20 object-cover shrink-0" />
          ) : (
            <div className="w-full h-20 bg-emerald-300/80 shrink-0 flex items-center justify-center text-xs text-emerald-800">📷</div>
          )
        ) : (
          currentImageDisplay ? (
            <img 
              src={currentImageDisplay} 
              alt="Preview" 
              className="w-18 h-18 object-cover mt-3 shadow-sm rounded-full" 
            />
          ) : (
            <div className="w-18 h-18 bg-emerald-300/80 shrink-0 mt-3 flex items-center justify-center text-xs text-emerald-800 rounded-full">
              📷
            </div>
          )
        )}

        <span className={`text-[10px] font-semibold text-emerald-950 px-2 line-clamp-2 leading-snug text-center ${isFadeBottom ? 'z-10 -mt-5' : ''}`}>
          {portfolioData?.title || "Sin título"}
        </span>

        {/* Redes sociales */}
        <div className="flex items-center justify-center gap-1.5 px-2 z-10 w-full flex-wrap">
          {socialLinks.length > 0 ? (
            socialLinks.slice(0, 5).map((link, idx) => {
              const iconSrc = getSocialIconMini(link.url);
              return (
                <div key={idx} className="w-4 h-4 rounded-full bg-white shadow-2xs flex items-center justify-center p-0.5">
                  <img src={iconSrc} alt="social icon" className="w-2.5 h-2.5 object-contain opacity-80" />
                </div>
              );
            })
          ) : (
            <>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs flex items-center justify-center text-[7px]">🌐</div>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs flex items-center justify-center text-[7px]">💬</div>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs flex items-center justify-center text-[7px]">📸</div>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs flex items-center justify-center text-[7px]">💻</div>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs flex items-center justify-center text-[7px]">🐦</div>
            </>
          )}
        </div>

        {/* Bloques de contenido */}
        <div className="w-full space-y-1.5 px-1.5 opacity-90 z-10 pt-1">
          <div className="w-full h-7 bg-white rounded-sm shadow-2xs"></div>
          <div className="w-full h-7 bg-white rounded-sm shadow-2xs"></div>
          <div className="w-full h-7 bg-white rounded-sm shadow-2xs"></div>
        </div>
      </div>

      <span className="text-[11px] font-semibold text-slate-700 mt-2">
        {loading ? (
          <svg className="w-5 h-5 animate-spin text-purple-600 shrink-0 ml-1" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>) : label}
      </span>
    </button>
  );
};