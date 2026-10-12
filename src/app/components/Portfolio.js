"use client";

import { getTemplateStyles } from "@/app/config/themeStyles";
import PortfolioLayout from "@/app/components/PortfolioLayout";
import Link from "next/link";

export default function Portfolio({ portfolioData, template }) {
  const currentTemplate = template || portfolioData?.template || "minimal";
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

  const pages = portfolioData?.pages || [];

  const featuredLinks = pages
    .filter((page) => page.type === "link" && page.items)
    .flatMap((page) => page.items)
    .filter((item) => item.isFeatured === true);


  return (
    <PortfolioLayout portfolioData={portfolioData} template={template}>
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
                  className={`w-full p-3 py-5 transition-all duration-200 cursor-pointer block flex items-center justify-center gap-2 mb-3 ${styles.pageCard}`}
                >
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