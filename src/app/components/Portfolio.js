"use client";

import { getTemplateStyles } from "@/app/config/themeStyles";
import PortfolioLayout from "@/app/components/PortfolioLayout";
import ImagePageCard from "@/app/components/PortfolioComponents/ImagePageCard"; // Ajusta la ruta según donde lo guardes

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

  return (
    <PortfolioLayout portfolioData={portfolioData} template={template}>
      {/* Contenedor principal que respeta estrictamente el orden de las páginas */}
      {pages.length > 0 && (
        <div className="space-y-3 pt-3 mt-1 px-3">
          {pages.map((page) => {
            if (!page?.showOnHome) return null;

            if (page.type === "link") {
              if (!page.items || page.items.length === 0) return null;

              return (
                <div key={page.id} className="space-y-3">
                  {page.items.map((link) => {
                    const iconUrl = getSocialIcon(link.url);
                    const formattedUrl = link.url.startsWith("http") ? link.url : `https://${link.url}`;
                    const iconFilter = styles.customIconFilter ? styles.customIconFilter : styles.invertIcon ? "invert(1)" : "none";

                    return (
                      <a
                        key={link.id || link.url}
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full p-3 py-5 transition-all duration-200 cursor-pointer block flex items-center justify-center gap-2 mb-3 ${styles.pageCard}`}
                      >
                        <span className={`text-xs font-semibold whitespace-normal break-words ${styles.pageTitle} ${currentTemplate === 'minimal' ? '!text-slate-200 font-medium' : ''}`}>
                          {link.title}
                        </span>
                      </a>
                    );
                  })}
                </div>
              );
            }

            if (page.type === "image") {
              return (
                <ImagePageCard 
                  layout={page.layout}
                  key={page.id}
                  page={page}
                  portfolioSlug={portfolioData?.slug}
                  styles={styles}
                  currentTemplate={currentTemplate}
                />
              )
            }
          })}
        </div>
      )}
    </PortfolioLayout>
  );
}