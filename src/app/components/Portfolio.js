"use client";

import { getTemplateStyles } from "@/app/config/themeStyles"; // Ajusta la ruta según donde tengas tu archivo de estilos

export default function Portfolio({ portfolioData, template }) {
  const imageSrc = portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image;
  
  // Soporta tanto si viene dentro del objeto como por prop directo del componente padre
  const currentTemplate = template || portfolioData?.template || "minimal";

  // Obtenemos los estilos centralizados desde el archivo de configuración
  const styles = getTemplateStyles(currentTemplate);

  const getSocialIcon = (url) => {
    if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
    if (lowerUrl.includes("wa.me") || lowerUrl.includes("whatsapp")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
    if (lowerUrl.includes("linkedin")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
    if (lowerUrl.includes("github")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
    if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
    if (lowerUrl.includes("youtube") || lowerUrl.includes("youtu.be")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
    if (lowerUrl.includes("facebook")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
    if (lowerUrl.includes("tiktok")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
    
    return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  };

  const socialLinks = portfolioData?.socialLinks || [];
  const pages = portfolioData?.pages || [];

  // Filtrar únicamente los links destacados (`isFeatured === true`)
  const featuredLinks = pages
    .filter((page) => page.type === "link" && page.items)
    .flatMap((page) => page.items)
    .filter((item) => item.isFeatured === true);

  return (
    <div className={`w-full flex justify-center ${currentTemplate === 'glass' ? 'bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-200 p-6 rounded-3xl' : ''}`}>
      <div className={`w-full max-w-xs border p-5 transition-all duration-300 ${styles.container}`}>
        
        {/* Etiqueta flotante absoluta */}
        <span className={`text-[9px] py-0.5 font-medium uppercase tracking-widest z-20 ${styles.badge}`}>
          {currentTemplate}
        </span>

        {/* Cabecera dinámica */}
        <div className={styles.headerLayout}>
          
          <div className={`overflow-hidden flex items-center justify-center z-10 ${styles.imageWrapper}`}>
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt="Perfil" 
                className={`w-full h-full object-cover ${currentTemplate === 'glass' ? 'rounded-[1.8rem]' : ''}`}
              />
            ) : (
              <span className="text-[10px] opacity-50 italic">Sin img</span>
            )}
          </div>

          <div className={`w-full ${styles.textContainer}`}>
            <h1 className={styles.title}>
              {portfolioData?.title || "Tu Título Aquí"}
            </h1>
            <p className={`whitespace-pre-wrap ${styles.description}`}>
              {portfolioData?.description || "Bio o descripción de tu portfolio..."}
            </p>
          </div>

        </div>

        {/* Redes Sociales */}
        {socialLinks.length > 0 ? (
          <div className={styles.socialWrapper}>
            {socialLinks.map((linkItem, index) => {
              const iconUrl = getSocialIcon(linkItem.url);
              const formattedUrl = linkItem.url.startsWith("http") ? linkItem.url : `https://${linkItem.url}`;
              
              const iconFilter = styles.customIconFilter ? styles.customIconFilter : 
                                 styles.invertIcon ? "invert(1)" : "none";
              
              const urlName = linkItem.url.replace(/https?:\/\/(www\.)?/i, "").split('/')[0];

              return (
                <a
                  key={index}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={linkItem.url}
                  className={`flex items-center justify-center border transition-all duration-200 shadow-sm ${styles.socialIconBtn}`}
                >
                  <img 
                    src={iconUrl} 
                    alt="Red social" 
                    className="w-4 h-4 opacity-80 hover:opacity-100 transition-opacity" 
                    style={{ filter: iconFilter }} 
                  />
                  {styles.showSocialText && <span className="text-[10px] uppercase font-mono tracking-wider">[{urlName}]</span>}
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-2">
            <span className="text-[10px] opacity-50 italic">Sin redes sociales</span>
          </div>
        )}

        {/* 1. Trabajos / Colecciones de Imágenes (Primero) */}
        {pages.length > 0 && (
          <div className="space-y-3 pt-3 mt-1 border-t border-slate-800/50">
            <div className="space-y-2.5">
              {pages.map((page) => {
                if (page.type === "link") return null;

                let previewImages = [];
                if (page.type === "image" && page.galleries) {
                  previewImages = page.galleries.flatMap(g => g.items || []).slice(0, 3);
                }

                return (
                  <div key={page.id} className={`w-full p-3 transition-all duration-200 cursor-pointer ${styles.pageCard}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs truncate pr-2 ${styles.pageTitle}`}>{page.title}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-50 shrink-0 font-bold">
                        {currentTemplate === 'terminal' ? '[+]' : '→'}
                      </span>
                    </div>
                    
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 mt-2">
                        {previewImages.map((img, idx) => (
                          <div key={img.id || idx} className={`aspect-square overflow-hidden bg-slate-900 border border-slate-800/50 ${styles.miniImgShape}`}>
                            <img src={img.url} alt="Preview" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Sección de Links Destacados (Al final, estilo Linktree) */}
        {featuredLinks.length > 0 && (
          <div className="space-y-2 pt-3 mt-3 border-t border-slate-800/50">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold mb-1">Links Destacados</p>
            {featuredLinks.map((link) => {
              const formattedUrl = link.url.startsWith("http") ? link.url : `https://${link.url}`;
              return (
                <a
                  key={link.id}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full p-3 transition-all duration-200 cursor-pointer block flex items-center justify-between gap-2 ${styles.pageCard}`}
                >
                  <span className={`text-xs font-semibold whitespace-normal break-words pr-1 ${styles.pageTitle}`}>
                    {link.title}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider opacity-60 shrink-0 font-bold self-center">
                    {currentTemplate === 'terminal' ? '[↗]' : '→'}
                  </span>
                </a>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}