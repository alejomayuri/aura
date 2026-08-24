"use client";

import { getTemplateStyles } from "@/app/config/themeStyles";
import PortfolioLayout from "@/app/components/PortfolioLayout";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Portfolio({ portfolioData, template }) {
  const pathname = usePathname();
  const imageSrc = portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image;
  
  const currentTemplate = template || portfolioData?.template || "minimal";
  const styles = getTemplateStyles(currentTemplate);

  // Condición para mostrar la etiqueta solo en home (/) o en rutas que incluyan /admin
  const showBadge = pathname === "/" || (pathname && pathname.includes("/admin"));

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

  const featuredLinks = pages
    .filter((page) => page.type === "link" && page.items)
    .flatMap((page) => page.items)
    .filter((item) => item.isFeatured === true);

  return (
    <PortfolioLayout portfolioData={portfolioData} template={template}>
      {/* Etiqueta flotante absoluta (Visible solo en / y en /admin) */}
      {showBadge && (
        <span className={`text-[9px] py-0.5 font-medium uppercase tracking-widest z-20 ${styles.badge}`}>
          {currentTemplate}
        </span>
      )}

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

      {/* Trabajos / Colecciones / Páginas internas */}
      {pages.length > 0 && (
        <div className="space-y-3 pt-3 mt-1 ">
          {pages.map((page) => {
            if (page.type === "link") return null;
            let previewImages = page.type === "image" && page.galleries ? page.galleries.flatMap(g => g.items || []).slice(0, 3) : [];

            return (
              <Link 
                key={page.id} 
                href={`/${portfolioData?.slug}/${page.slug || page.id}`}
                className={`w-full p-3 transition-all duration-200 cursor-pointer block ${styles.pageCard}`}
              >
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
              </Link>
            );
          })}
        </div>
      )}

      {/* Links Destacados */}
      {featuredLinks.length > 0 && (
        <div className="space-y-2 pt-3 mt-3">
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold mb-1">Links Destacados</p>
          {featuredLinks.map((link) => {
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
            })}
        </div>
      )}
    </PortfolioLayout>
  );
}