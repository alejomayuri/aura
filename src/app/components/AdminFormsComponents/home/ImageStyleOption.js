import React, { useState } from 'react';

export const ImageStyleOption = ({ 
  styleValue = 'rounded', 
  label = 'Redonda', 
  currentImageDisplay, 
  portfolioData, 
  setPortfolioData,
  onSave,
  primaryColor
}) => {
  const [loading, setLoading] = useState(false);

  // Obtener el color dinámico prioritario
  const activeBgColor = primaryColor || portfolioData?.colors?.primaryColor || '#10b981';

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

  // Manejador del clic para actualizar el estado y disparar el guardado en BD
  const handleClick = async () => {
    const updatedData = { ...portfolioData, imageStyle: styleValue };
    
    // Actualizamos el estado local de React
    setPortfolioData(updatedData);

    // Si pasas una función de guardado la llamamos
    if (onSave && loading === false) {
      try {
        setLoading(true);
        await onSave(updatedData);
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
      className={`flex flex-col items-center p-2 rounded-2xl border text-center transition-all cursor-pointer ${
        isSelected
          ? 'bg-white border-slate-900 ring-1 ring-slate-900'
          : 'bg-white border-white'
      } `}
    >
      <div 
        className="w-full h-36 rounded-2xl p-2 flex flex-col items-center justify-start gap-2 overflow-hidden shadow-xs border border-black/10 relative transition-colors duration-200"
      >
        
        {/* Estructura condicional según el tipo de estilo */}
        {isCreativeBlob ? (
          <>
            {currentImageDisplay ? (
                <img src={currentImageDisplay} alt="Preview" className="rounded-[30%_70%_70%_30%/30%_30%_70%_70%] aspect-square object-cover w-20 h-20 mt-3" />
            ) : (
              <div className="w-20 h-20 rounded-2xl rounded-tr-xs bg-black/10 shrink-0 flex items-center justify-center text-xs mt-3"></div>
            )}
          </>
        ) : isSquareRounded ? (
          <>
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Preview" className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs mt-3" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-black/10 shrink-0 flex items-center justify-center text-xs mt-3"></div>
            )}
          </>
        ) : isHorizontal ? (
          <div className="px-1.5 w-full">
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Preview" className="w-full h-20 rounded-lg object-cover shrink-0 shadow-xs mt-3" />
            ) : (
              <div className="w-full h-20 rounded-lg bg-black/10 shrink-0 flex items-center justify-center text-xs mt-3"></div>
            )}
          </div>
        ) : isFadeBottom ? (
          <div className="relative w-full h-25 shrink-0">
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Preview" className="w-full h-25 object-cover  rounded-t-2xl" />
            ) : (
              <div className="w-full h-full bg-black/10 flex items-center justify-center text-xs rounded-t-2xl"></div>
            )}
            <div 
              style={{
                background: `linear-gradient(to top, #fff, transparent)`
              }}
              className="absolute inset-0"
            ></div>
          </div>
        ) : isFullWidth ? (
          currentImageDisplay ? (
            <img src={currentImageDisplay} alt="Preview" className="w-full h-22.5 object-cover shrink-0 rounded-t-2xl" />
          ) : (
            <div className="w-full h-20 bg-black/10 shrink-0 flex items-center justify-center text-xs rounded-t-2xl"></div>
          )
        ) : (
          currentImageDisplay ? (
            <img 
              src={currentImageDisplay} 
              alt="Preview" 
              className="w-19.5 h-19.5 object-cover mt-3 shadow-sm rounded-full" 
            />
          ) : (
            <div className="w-18 h-18 bg-black/10 shrink-0 mt-3 flex items-center justify-center text-xs rounded-full"></div>
          )
        )}

        <span className={`text-[12px] font-semibold text-slate-900 px-2 line-clamp-2 leading-snug text-center ${isFadeBottom ? 'z-10 -mt-0.5' : 'mt-2'}`}>
          {label || "Sin título"}
        </span>

        {/* Redes sociales */}
        {/* <div className="flex items-center justify-center gap-1.5 px-2 z-10 w-full flex-wrap">
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
        </div> */}

        {/* Bloques de contenido */}
        {/* <div className="w-full space-y-1.5 px-1.5 opacity-90 z-10 pt-1">
          <div className="w-full h-7 bg-white rounded-sm shadow-2xs"></div>
          <div className="w-full h-7 bg-white rounded-sm shadow-2xs"></div>
          <div className="w-full h-7 bg-white rounded-sm shadow-2xs"></div>
        </div> */}
      </div>

      {/* <span className="text-[12px] font-semibold text-slate-700 mt-2">
        {label}
      </span> */}
    </button>
  );
};