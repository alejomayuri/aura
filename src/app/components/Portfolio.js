"use client";

import { useState } from "react";
import { getTemplateStyles } from "@/app/config/themeStyles";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Portfolio({ portfolioData, template }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const imageSrc = portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image;
  
  const currentTemplate = template || portfolioData?.template || "minimal";
  const styles = getTemplateStyles(currentTemplate);

  // Verificación: Solo se muestra en páginas de portfolio, excluyendo /admin y home
  const isPortfolioPage = pathname && pathname !== "/" && !pathname.includes("/admin");

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
    <div className={`w-full flex justify-center overflow-hidden ${currentTemplate === 'glass' ? 'bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-200 rounded-3xl' : ''}`}>
      <div className={`relative w-full max-w-xl border p-5 transition-all duration-300 ${styles.container}`}>
        
        {/* Botón Menú Hamburguesa */}
        {isPortfolioPage && (
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="absolute top-5 right-5 z-50 p-2 bg-white/50 backdrop-blur-md border border-black/10 rounded-full shadow-sm hover:scale-105 transition-all"
          >
            <div className="flex flex-col gap-1 w-4">
              <div className="w-4 h-0.5 bg-black"></div>
              <div className="w-4 h-0.5 bg-black"></div>
              <div className="w-4 h-0.5 bg-black"></div>
            </div>
          </button>
        )}

        {/* Overlay con fondo oscuro opcional para resaltar el menú del 70% */}
        {isMenuOpen && (
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Menú deslizante desde abajo de la pantalla (70% de alto, ancho limitado al contenedor) */}
        <div 
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[70vh] z-[100] bg-white p-6 flex flex-col justify-between rounded-t-3xl shadow-2xl transition-all duration-300 ease-out transform ${
            isMenuOpen 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 translate-y-full pointer-events-none"
          }`}
        >
          <button onClick={() => setIsMenuOpen(false)} className="self-end text-black text-2xl font-bold p-2">✕</button>
          <div className="flex flex-col gap-4 mt-2 overflow-y-auto">
            {pages.map((p) => <Link key={p.id} href="#" className="text-2xl font-bold text-black" onClick={() => setIsMenuOpen(false)}>{p.title}</Link>)}
          </div>
          <div className="flex flex-col gap-6 mb-2">
            <p className="text-sm font-medium">Únete a {portfolioData?.slug || "Aura"} en Aura</p>
            <a href="https://aura.so" className="w-full py-4 bg-black text-white text-center rounded-full font-bold">Unirse a Aura</a>
          </div>
        </div>

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

        {/* Trabajos / Colecciones */}
        {pages.length > 0 && (
          <div className="space-y-3 pt-3 mt-1 border-t border-slate-800/50">
            {pages.map((page) => {
              if (page.type === "link") return null;
              let previewImages = page.type === "image" && page.galleries ? page.galleries.flatMap(g => g.items || []).slice(0, 3) : [];

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
        )}

        {/* Links Destacados */}
        {featuredLinks.length > 0 && (
          <div className="space-y-2 pt-3 mt-3 border-t border-slate-800/50">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold mb-1">Links Destacados</p>
            {featuredLinks.map((link) => (
              <a key={link.id} href={link.url.startsWith("http") ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className={`w-full p-3 transition-all duration-200 cursor-pointer block flex items-center justify-between gap-2 ${styles.pageCard}`}>
                <span className={`text-xs font-semibold whitespace-normal break-words pr-1 ${styles.pageTitle}`}>{link.title}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-60 shrink-0 font-bold self-center">{currentTemplate === 'terminal' ? '[↗]' : '→'}</span>
              </a>
            ))}
          </div>
        )}

        {/* Call to Action - Optimizado */}
        {isPortfolioPage && (
          <>
            <div className="mt-8 flex justify-center">
              <a 
                href="https://aura.so" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 bg-white text-black font-bold text-[11px] rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 border border-slate-100"
              >
                Únete a {portfolioData?.slug || "Aura"} en Aura
              </a>
            </div>

            {/* Footer */}
            <footer className="mt-10 pt-5 border-t border-slate-800/10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] tracking-widest opacity-40">
              <a href="/cookies" className="hover:opacity-100 transition-opacity text-black">Política de cookies</a>
              <a href="/privacy" className="hover:opacity-100 transition-opacity text-black">Privacidad</a>
              <a href="/report" className="hover:opacity-100 transition-opacity text-black">Reportar</a>
              <Link href="/" className="hover:opacity-100 transition-opacity text-black">
                Explorar
              </Link>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}