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
    <>
      {/* Menú y Overlay con desenfoque, animación suave y control de eventos */}
      {isPortfolioPage && (<div className={`fixed inset-0 z-[100] flex justify-center items-end transition-all duration-300 ${
        isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}>
        
        {/* Overlay oscuro con desenfoque (blur) y animación de opacidad */}
        <div 
          onClick={() => setIsMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Menú deslizante con efecto smooth (translate-y) e interactividad garantizada */}
        <div 
          className={`relative w-full max-w-xl h-auto max-h-[70vh] bg-white p-6 flex flex-col rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out transform z-20 overflow-y-auto pointer-events-auto ${
            isMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="self-end text-black text-2xl font-bold p-2 mb-1 cursor-pointer"
          >
            ✕
          </button>
          
          {/* Contenedor con separación moderada y uniforme entre bloques */}
          <div className="flex flex-col gap-6 pb-4">
            
            {/* Bloque 1: Links de navegación */}
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                className="text-2xl font-bold text-black cursor-pointer hover:opacity-75 transition-opacity" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {pages.map((p) => (
                <Link 
                  key={p.id} 
                  href="#" 
                  className="text-2xl font-bold text-black cursor-pointer hover:opacity-75 transition-opacity" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {p.title}
                </Link>
              ))}
            </div>

            {/* Bloque 2: Redes sociales */}
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
                      title={linkItem.url}
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

            {/* Bloque 3: Textos informativos */}
            <div className="flex flex-col gap-1 text-left">
              <p className="text-lg font-bold text-black">Únete a {portfolioData?.slug || "Aura"} en Aura</p>
              <p className="text-base font-normal text-black">¿Te gustaría tener un portfolio como este?</p>
            </div>

            {/* Bloque 4: Botones de acción */}
            <div className="flex gap-3">
              <Link 
                href="https://aura.so" 
                className="flex-1 py-4 bg-black text-white text-center rounded-full font-bold transition-transform hover:scale-[1.02] cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Regístrate gratis
              </Link>
              <Link 
                href="https://aura.so" 
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-black text-center rounded-full font-bold transition-transform hover:scale-[1.02] cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver más
              </Link>
            </div>

          </div>
        </div>

      </div>)}

      {/* Contenedor Principal del Portfolio */}
      <div className={`w-full flex justify-center ${currentTemplate === 'glass' ? 'bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-200 rounded-3xl' : ''}`}>
        <div className={`relative w-full max-w-xl border p-5 transition-all duration-300 ${styles.container}`}>
          
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
                  <span className={`text-[12px] font-semibold whitespace-normal break-words pr-1 ${styles.pageTitle}`}>{link.title}</span>
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
                <Link href="/cookies" className="hover:opacity-100 transition-opacity text-black">Política de cookies</Link>
                <Link href="/privacy" className="hover:opacity-100 transition-opacity text-black">Privacidad</Link>
                <Link href="/report" className="hover:opacity-100 transition-opacity text-black">Reportar</Link>
                <Link href="/" className="hover:opacity-100 transition-opacity text-black">
                  Explorar
                </Link>
              </footer>
            </>
          )}
        </div>
      </div>
    </>
  );
}