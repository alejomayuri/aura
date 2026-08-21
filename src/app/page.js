"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Portfolio from "@/app/components/Portfolio"; // Importación correcta de tu componente real

// --- COMPONENTE AUXILIAR: Efecto de Escritura Robusto (Typer Animation) ---
function UrlTyper() {
  const urls = ["opal-home", "fromsoftware", "studio-amber", "buenabakery", "maria-dev"];
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  // Usamos useRef para mantener el índice actual sin re-renderizados innecesarios del efecto
  const indexRef = useRef(0);

  useEffect(() => {
    let timeoutId;
    let currentChar = 0;
    let isDeleting = false;

    const typeLoop = () => {
      const currentWord = urls[indexRef.current];

      if (!isDeleting) {
        // Escribiendo caracteres uno a uno
        currentChar++;
        setDisplayText(currentWord.substring(0, currentChar));

        if (currentChar === currentWord.length) {
          // Palabra completa: pausa de 2 segundos antes de empezar a borrar
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeLoop();
          }, 2000);
        } else {
          timeoutId = setTimeout(typeLoop, 100);
        }
      } else {
        // Borrando caracteres uno a uno
        currentChar--;
        setDisplayText(currentWord.substring(0, currentChar));

        if (currentChar === 0) {
          // Palabra totalmente borrada: pasar a la siguiente palabra
          isDeleting = false;
          indexRef.current = (indexRef.current + 1) % urls.length;
          timeoutId = setTimeout(typeLoop, 400);
        } else {
          timeoutId = setTimeout(typeLoop, 60);
        }
      }
    };

    timeoutId = setTimeout(typeLoop, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Efecto independiente para el parpadeo del cursor
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="font-mono text-xl md:text-2xl bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 inline-flex items-center shadow-inner mb-6 h-14">
      <span className="text-slate-500 select-none">aura.com/</span>
      <span className="text-purple-400 font-bold">{displayText}</span>
      <span className={`text-purple-400 select-none ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
    </div>
  );
}
// --- FIN COMPONENTE AUXILIAR ---

export default function LandingPage() {
  const [activeTheme, setActiveTheme] = useState("y2k");

  const availableThemes = [
    { id: "y2k", name: "Y2K" },
    { id: "neon", name: "Neon Cyber" },
    { id: "comic", name: "Comic" },
    { id: "glass", name: "Glassmorphism" }
  ];

  const samplePortfolioData = {
    title: "Alex Creator",
    description: "Diseñador visual y creador de experiencias digitales.",
    mainImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    socialLinks: [
      { url: "https://instagram.com/alex" },
      { url: "https://twitter.com/alex" },
      { url: "https://github.com/alex" }
    ],
    pages: [
      {
        id: "1",
        title: "Galería Fotográfica",
        type: "image",
        galleries: [
          {
            items: [
              { id: "g1", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200" },
              { id: "g2", url: "https://res.cloudinary.com/dz3p460iu/image/upload/v1787184411/c4u1bhy0xsboq85v9j4s.png" },
              { id: "g3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200" }
            ]
          }
        ]
      },
      {
        id: "2",
        title: "Mi Tienda Online",
        type: "link",
        items: [
          { id: "l1", title: "🛍️ Comprar mis recursos (Preset Pack)", url: "https://gumroad.com", isFeatured: true },
          { id: "l2", title: "🎨 Ver mis ilustraciones", url: "https://behance.net", isFeatured: true },
          { id: "l3", title: "📹 Tutoriales en YouTube", url: "https://youtube.com", isFeatured: true }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      
      {/* Elementos decorativos animados de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[110px] pointer-events-none" />

      {/* --- NAVBAR --- */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10 transition-all">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-xl font-black tracking-wider bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
            AURA
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
            MVP
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/admin/login" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Iniciar sesión
          </Link>
          <Link 
            href="/admin/register" 
            className="text-sm font-medium px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Crear mi portfolio
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION CON ANIMACIÓN --- */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-purple-300 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Tu portfolio autogestionable en minutos
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Tu espacio online, <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
            a tu manera y sin código.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-6">
          Diseña una web única con tu propia URL personalizada. Muestra tu trabajo, tus enlaces clave y tus proyectos en un solo lugar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link 
            href="/admin/register" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all text-center"
          >
            Empieza gratis
          </Link>
          <a 
            href="#ejemplos" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-2xl hover:scale-105 active:scale-95 transition-all text-center backdrop-blur-md"
          >
            Ver ejemplos
          </a>
        </div>
      </section>

      {/* --- SECCIÓN INTERACTIVA CON TU COMPONENTE PORTFOLIO Y TEMAS REALES --- */}
      <section className="max-w-6xl mx-auto px-6 pb-28 relative z-10">
        <div className="p-4 md:p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Panel de control izquierdo (Selector de Themes) */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Control Total</span>
              <h3 className="text-3xl font-bold">Un panel privado para gestionar todo tu contenido</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Modifica textos, alterna tus estilos visuales en tiempo real y organiza tanto tu galería de trabajos como tus enlaces clave tipo Linktree de forma totalmente intuitiva.
              </p>
              
              {/* Selector interactivo de Themes reales */}
              <div className="pt-3">
                <span className="text-xs font-medium text-slate-300 block mb-2">Prueba cambiar de theme en tiempo real:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTheme(t.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        activeTheme === t.id 
                          ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 scale-105' 
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:scale-[1.02]'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Renderizado de tu Componente Portfolio Real */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="transition-all duration-300 hover:scale-[1.01]">
                <Portfolio 
                  portfolioData={samplePortfolioData} 
                  template={activeTheme} 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- BLOQUE: CUSTOMIZABLE EN MINUTOS (CON ANIMACIÓN DE URL) --- */}
      <section className="max-w-5xl mx-auto px-6 pb-24 relative z-10">
        <div className="bg-gradient-to-r from-purple-900/20 via-slate-900/40 to-indigo-900/20 border border-slate-800/80 rounded-3xl p-8 md:p-12 text-center backdrop-blur-md hover:border-purple-500/30 transition-all hover:scale-[1.01]">
          
          {/* Componente de tipado seguro */}
          <UrlTyper />

          <span className="block text-xs font-semibold uppercase tracking-widest text-purple-400">Sin complicaciones</span>
          <h2 className="text-3xl font-extrabold mt-1">Configúralo todo en cuestión de minutos</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-3">
            Elige tu dirección web única, añade tu imagen de perfil, carga tus enlaces y sube tus fotos de forma rápida. Sin configuraciones de servidores ni código complejo.
          </p>
        </div>
      </section>

      {/* --- BLOQUE: MULTIMEDIA --- */}
      <section className="max-w-6xl mx-auto px-6 pb-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Versatilidad total</span>
          <h2 className="text-3xl md:text-4xl font-extrabold">Comparte cualquier tipo de contenido</h2>
          <p className="text-slate-400 text-sm mt-2">No te limites a texto. Muestra tu talento con múltiples formatos multimedia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl text-center hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl mb-4">
              🖼️
            </div>
            <h4 className="font-bold text-slate-100 mb-1">Imágenes y Galerías</h4>
            <p className="text-xs text-slate-400">Ideal para fotografía, tatuajes, arte y diseño visual.</p>
          </div>

          <div className="p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl text-center hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl mb-4">
              🎬
            </div>
            <h4 className="font-bold text-slate-100 mb-1">Videos y Reels</h4>
            <p className="text-xs text-slate-400">Muestra tus clips destacados y proyectos audiovisuales.</p>
          </div>

          <div className="p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl text-center hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 text-xl mb-4">
              🎵
            </div>
            <h4 className="font-bold text-slate-100 mb-1">Música y Podcasts</h4>
            <p className="text-xs text-slate-400">Comparte tus pistas de audio, producciones o episodios.</p>
          </div>

          <div className="p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl text-center hover:scale-105 transition-all">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl mb-4">
              🔗
            </div>
            <h4 className="font-bold text-slate-100 mb-1">Enlaces Clave</h4>
            <p className="text-xs text-slate-400">Redes sociales, tienda online y eventos en un solo lugar.</p>
          </div>
        </div>
      </section>

      {/* --- BLOQUE: REDES Y ESTADÍSTICAS --- */}
      <section className="max-w-6xl mx-auto px-6 pb-28 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition-all hover:scale-[1.01]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Difusión masiva</span>
            <h3 className="text-2xl font-bold mt-2">Comparte en todas tus redes sociales</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Coloca tu enlace único <code className="text-purple-300 font-mono">aura.com/tu-nombre</code> en tu biografía de Instagram, TikTok, Twitter o LinkedIn y redirige a todo tu público a un portfolio profesional.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3 text-xs text-purple-300 font-mono">
            <span>#LinkEnBio</span> • <span>#Viral</span> • <span>#Pro</span>
          </div>
        </div>

        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col justify-between hover:border-slate-700 transition-all hover:scale-[1.01]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Métricas claras</span>
            <h3 className="text-2xl font-bold mt-2">Visualiza estadísticas de tus visitas</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Monitoreá cuántas personas visitan tu perfil, qué enlaces hacen clic con más frecuencia y descubre qué contenido genera más interacción en tu comunidad.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Visitas únicas</span>
            <span className="text-emerald-400 font-bold">+1,240 este mes</span>
          </div>
        </div>
      </section>

      {/* --- CREADORES QUE CONFIAN --- */}
      <section id="ejemplos" className="max-w-6xl mx-auto px-6 pb-28 relative z-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-400 block mb-3">Inspiración</span>
        <h2 className="text-3xl md:text-4xl font-extrabold">Creadores que ya confían en Aura</h2>
        <p className="text-slate-400 text-sm mt-2">Descubre cómo diferentes profesionales muestran su talento.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-105 group">
            <div className="h-40 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl mb-4 border border-slate-800/60 flex items-center justify-center text-slate-600 font-mono text-xs">
              [Galería de Tatuajes]
            </div>
            <span className="text-xs text-purple-400 font-mono">aura.com/carlos-ink</span>
            <h4 className="text-lg font-bold mt-1 text-slate-100 group-hover:text-purple-300 transition-colors">Carlos • Tatuador</h4>
            <p className="text-xs text-slate-400 mt-2">Portfolio visual con estilo oscuro para mostrar piezas de tinta únicas.</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-105 group">
            <div className="h-40 bg-gradient-to-br from-indigo-900/35 to-blue-900/30 rounded-xl mb-4 border border-slate-800/60 flex items-center justify-center text-slate-600 font-mono text-xs">
              [Galería de Fotografía]
            </div>
            <span className="text-xs text-purple-400 font-mono">aura.com/sofia-ph</span>
            <h4 className="text-lg font-bold mt-1 text-slate-100 group-hover:text-purple-300 transition-colors">Sofía • Fotógrafa</h4>
            <p className="text-xs text-slate-400 mt-2">Enfoque minimalista para capturar la atención en sesiones de retrato.</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-105 group">
            <div className="h-40 bg-gradient-to-br from-purple-950/40 to-pink-950/30 rounded-xl mb-4 border border-slate-800/60 flex items-center justify-center text-slate-600 font-mono text-xs">
              [Enlaces y Servicios]
            </div>
            <span className="text-xs text-purple-400 font-mono">aura.com/lucas-dev</span>
            <h4 className="text-lg font-bold mt-1 text-slate-100 group-hover:text-purple-300 transition-colors">Lucas • Creador</h4>
            <p className="text-xs text-slate-400 mt-2">Estructura híbrida tipo linktree combinada con muestras de proyectos.</p>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION FINAL --- */}
      <section className="max-w-4xl mx-auto px-6 pb-28 text-center relative z-10">
        <div className="p-10 md:p-14 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            ¿Listo para destacar en internet?
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto mb-8">
            Únete hoy mismo a Aura, elige tu enlace personalizado y crea tu portfolio autogestionable en menos de 2 minutos.
          </p>
          
          <Link 
            href="/admin/register" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            Crear mi portfolio ahora
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-900 py-12 px-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-300 tracking-wider">AURA</span>
            <span>— Tu portfolio online autogestionable</span>
          </div>
          <p>© {new Date().getFullYear()} Aura MVP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}