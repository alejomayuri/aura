"use client";

import { getTemplateStyles } from "@/app/config/themeStyles";
import PortfolioLayout from "@/app/components/PortfolioLayout"; // 👈 Importamos el layout compartido

export default function PagePreview({ page, portfolioData }) {
  const currentTemplate = portfolioData?.template || "minimal";

  // Obtenemos los estilos desde el archivo externo
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

  return (
    <PortfolioLayout portfolioData={portfolioData} template={currentTemplate}>

      

      {/* ================= 3. TÍTULO Y CONTENIDO ESPECÍFICO DE ESTA PÁGINA ================= */}
      <div className="mb-6">
        <h2 className={`text-lg ${styles.pageTitle} ${currentTemplate === 'minimal' ? '!text-white font-bold' : ''}`}>{page.title}</h2>
        <p className="text-[10px] opacity-50 mt-1 uppercase tracking-wider font-mono">/{page.slug}</p>
      </div>

      {/* Muestra para página tipo LINK */}
      {page.type === "link" && (
        <div className="space-y-3">
          {page.items && page.items.length > 0 ? (
            page.items.map((link) => {
              const iconUrl = getSocialIcon(link.url);
              const formattedUrl = link.url.startsWith("http") ? link.url : `https://${link.url}`;
              const iconFilter = styles.customIconFilter ? styles.customIconFilter : styles.invertIcon ? "invert(1)" : "none";
              
              return (
                <a
                  key={link.id}
                  href={formattedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full p-3 py-5 transition-all duration-200 cursor-pointer block flex items-center justify-center gap-2 mb-3 ${styles.pageCard}`}                >
                  <img src={iconUrl} alt="icon" className="w-4 h-4 shrink-0" style={{ filter: iconFilter }} />
                  <span className={`text-xs font-semibold whitespace-normal break-words ${styles.pageTitle} ${currentTemplate === 'minimal' ? '!text-slate-200 font-medium' : ''}`}>
                    {link.title}
                  </span>
                </a>
              );
            })
          ) : (
            <p className="text-xs text-center italic opacity-50">No hay enlaces agregados aún.</p>
          )}
        </div>
      )}

      {/* Muestra para página tipo IMAGE / GALLERY (Estilo Masonry) */}
      {page.type === "image" && (
        <div className="space-y-6">
          {page.galleries && page.galleries.length > 0 ? (
            page.galleries.map(gal => (
              <div key={gal.id} className="space-y-2">
                <h3 className={`text-[10px] uppercase font-bold tracking-wider ${styles.pageTitle} ${currentTemplate === 'minimal' ? '!text-slate-400' : ''}`}>{gal.title}</h3>
                
                <div className="columns-2 gap-2 space-y-2">
                  {gal.items?.map(img => (
                    <div key={img.id} className={`overflow-hidden bg-white/5 break-inside-avoid ${styles.miniImgShape}`}>
                      <img 
                        src={img.url} 
                        className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity block" 
                        alt="img" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-center italic opacity-50">No hay galerías creadas para esta página.</p>
          )}
        </div>
      )}

      {/* Tipos en desarrollo (Audio, Text...) */}
      {page.type !== "link" && page.type !== "image" && (
        <div className="text-center py-10 opacity-50 text-xs italic">
          Vista previa para contenido tipo {page.type} en desarrollo...
        </div>
      )}
    </PortfolioLayout>
  );
}