"use client";

import { useState } from "react";
import { getTemplateStyles } from "@/app/config/themeStyles";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PortfolioLayout({ portfolioData, template, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
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

  return (
    <main className={`${styles.bgScreen || "min-h-screen bg-slate-950 relative"} pt-0 xl:pt-12 flex flex-col items-center justify-start`}>
      
      {/* Menú y Overlay: Se oculta visualmente por completo y bloquea interacción si no está abierto */}
      {isPortfolioPage && (
        <div className={`fixed inset-0 z-[100] flex justify-center items-end transition-all duration-300 ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}>
          {/* Overlay oscuro con desenfoque */}
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Menú deslizante */}
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
              {/* Bloque 1: Links de navegación */}
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

              {/* Bloque 3: Textos y botones de acción */}
              <div className="flex flex-col gap-1 text-left">
                <p className="text-lg font-bold text-black">Únete a {portfolioData?.slug || "Aura"} en Aura</p>
                <p className="text-base font-normal text-black">¿Te gustaría tener un portfolio como este?</p>
              </div>

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
        </div>
      )}

      {/* Contenedor Principal del Layout con el Fondo Correspondiente */}
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

          {/* Contenido inyectado */}
          {children}

          {/* Footer compartido para páginas públicas */}
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
    </main>
  );
}