"use client";

import { useState } from "react";
import { getTemplateStyles } from "@/app/config/themeStyles";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Helper para obtener las clases de alineación de texto e hijos
const getAlignClass = (align) => {
  switch (align) {
    case "left":
      return "text-left items-start";
    case "right":
      return "text-right items-end";
    case "center":
    default:
      return "text-center items-center";
  }
};

const getImageStyleClass = (style) => {
  switch (style) {
    case "creative-blob":
      return "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]";
    case "square-rounded":
      return "rounded-xl";
    case "horizontal":
      return "rounded-t-2xl";
    case "fade-bottom":
      return "rounded-t-2xl";
    case "full-width":
      return "rounded-full";
    case "rounded":
      return "w-30 h-30 object-cover shadow-sm rounded-full";
    default:
      return "w-30 h-30 object-cover shadow-sm rounded-full";
  }
};

const getImageStyleWrapperClass = (style) => {
  switch (style) {
    case "creative-blob":
      return "w-20 h-20";
    case "square-rounded":
      return "w-20 h-20";
    case "horizontal":
      return "w-full h-20";
    case "fade-bottom":
      return "w-full h-25";
    case "full-width":
      return "w-full h-22.5";
    case "rounded":
      return "pt-24";
    default:
      return "pt-24";
  }
};

export default function PortfolioLayout({ portfolioData, template, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const currentTemplate = template || portfolioData?.template || "minimal";
  const styles = getTemplateStyles(currentTemplate);

  // Verificación: Solo se muestra en páginas de portfolio, excluyendo /admin y home
  const isPortfolioPage = pathname && pathname !== "/" && !pathname.includes("/admin");

  const imageSrc = portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image;
  const titleAlign = portfolioData?.titleAlign || "center";
  const alignmentClasses = getAlignClass(titleAlign);

  const bioAlign = portfolioData?.bioAlign || "center";
  const bioAlignmentClasses = getAlignClass(bioAlign);

  const socialPosition = portfolioData?.socialPosition || "top";

  const imageStyle = portfolioData?.imageStyle || "rounded";
  const imageStyleClass = getImageStyleClass(imageStyle);
  const imageWrapperClass = getImageStyleWrapperClass(imageStyle);

  console.log("PortfolioLayout - portfolioData:", portfolioData);

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

  // Función reutilizable para renderizar las redes sociales
  const renderSocialLinks = () => {
    if (socialLinks.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center justify-center mt-1 gap-3 py-3">
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
    );
  };

  return (
    <>
      {/* Menú y Overlay */}
      {isPortfolioPage && (
        <div className={`fixed inset-0 z-[100] flex justify-center items-end transition-all duration-300 ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}>
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className={`relative w-full max-w-xl h-auto max-h-[70vh] bg-white p-6 flex flex-col rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out transform z-20 overflow-y-auto pointer-events-auto ${
            isMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="self-end text-black text-2xl font-bold p-2 mb-1 cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex flex-col gap-6 pb-4">
              <div className="flex flex-col gap-3">
                <Link 
                  href={`/${portfolioData?.slug || ""}`} 
                  className="text-2xl font-bold text-black cursor-pointer hover:opacity-75 transition-opacity" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {pages.map((p) => (
                  <Link 
                    key={p.id} 
                    href={`/${portfolioData?.slug}/${p.slug || p.id}`} 
                    className="text-2xl font-bold text-black cursor-pointer hover:opacity-75 transition-opacity" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex items-center justify-around py-1">
                  {socialLinks.map((linkItem, index) => {
                    const iconUrl = getSocialIcon(linkItem.url);
                    const formattedUrl = linkItem.url.startsWith("http") ? linkItem.url : `https://${linkItem.url}`;

                    return (
                      <a
                        key={index}
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <img 
                          src={iconUrl} 
                          alt="Red social" 
                          className="w-7 h-7" 
                          style={{ filter: "brightness(0)" }} 
                        />
                      </a>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col gap-1 text-left">
                <p className="text-lg font-bold text-black">Únete a {portfolioData?.slug || "Lightjaus"} en Lightjaus</p>
                <p className="text-base font-normal text-black">¿Te gustaría tener un portfolio como este?</p>
              </div>

              <div className="flex gap-3">
                <Link 
                  href="https://lightjaus.so" 
                  className="flex-1 py-4 bg-black text-white text-center rounded-full font-bold transition-transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Regístrate gratis
                </Link>
                <Link 
                  href="https://lightjaus.so" 
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-black text-center rounded-full font-bold transition-transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor Principal del Layout */}
      <div className={`w-full flex justify-center ${currentTemplate === 'glass' ? 'bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-200' : ''}`}>
        <div className={`relative w-full max-w-xl p-5 pt-0 transition-all duration-300 ${styles.container}`}>
          
          {/* Botón Menú Hamburguesa */}
          {isPortfolioPage && (
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="absolute top-5 right-5 z-50 p-2 bg-white border border-black/10 rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex flex-col gap-1 w-4">
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
              </div>
            </button>
          )}

          {/* CABECERA GLOBAL COMÚN (Imagen, Título, Bio y Redes Top) */}
          <div className={styles.headerLayout}>
            <div className={`flex w-full justify-center mb-2.5 z-10 ${imageWrapperClass}`}>
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt="Perfil" 
                  className={`${imageStyleClass}`}
                />
              ) : (
                <span className="text-[10px] opacity-50 italic">Sin img</span>
              )}
            </div>

            <div className={`px-4 w-full flex flex-col ${styles.textContainer}`}>
              <h1 className={`w-full ${styles.title} text-[1.5rem] ${alignmentClasses} mb-1`}>
                {portfolioData?.title || "Tu Título Aquí"}
              </h1>
              <p className={`w-full whitespace-pre-wrap ${styles.description} text-[16px]/5.5 ${bioAlignmentClasses}`}>
                {portfolioData?.description || "Bio o descripción de tu portfolio..."}
              </p>
            </div>
          </div>

          {/* Redes Sociales ARRIBA si socialPosition es 'top' */}
          {socialPosition === "top" && renderSocialLinks()}

          {/* Contenido inyectado (Páginas internas, links destacados, etc.) */}
          {children}

          {/* Redes Sociales ABAJO si socialPosition es 'bottom' */}
          {socialPosition === "bottom" && renderSocialLinks()}

          {/* Footer compartido para páginas públicas */}
          {isPortfolioPage && (
            <>
              <div className="mt-8 flex justify-center">
                <a 
                  href="https://lightjaus.so" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-white text-black font-bold text-[11px] rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 border border-slate-100"
                >
                  Únete a {portfolioData?.slug || "Lightjaus"} en Lightjaus
                </a>
              </div>

              <footer className="mt-10 pt-5 border-t border-slate-800/10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] tracking-widest opacity-40">
                <Link href="/cookies" className="hover:opacity-100 transition-opacity text-black">Política de cookies</Link>
                <Link href="/privacy" className="hover:opacity-100 transition-opacity text-black">Privacidad</Link>
                <Link href="/report" className="hover:opacity-100 transition-opacity text-black">Reportar</Link>
                <Link href="/" className="hover:opacity-100 transition-opacity text-black">Explorar</Link>
              </footer>
            </>
          )}
        </div>
      </div>
    </>
  );
}