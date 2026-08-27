"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Portfolio from "@/app/components/Portfolio";

function UrlTyper() {
  const urls = ["opal-home", "fromsoftware", "studio-amber", "buenabakery", "maria-dev"];
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    let timeoutId;
    let currentChar = 0;
    let isDeleting = false;

    const typeLoop = () => {
      const currentWord = urls[indexRef.current];

      if (!isDeleting) {
        currentChar++;
        setDisplayText(currentWord.substring(0, currentChar));

        if (currentChar === currentWord.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeLoop();
          }, 2000);
        } else {
          timeoutId = setTimeout(typeLoop, 100);
        }
      } else {
        currentChar--;
        setDisplayText(currentWord.substring(0, currentChar));

        if (currentChar === 0) {
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

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="font-mono text-2xl sm:text-3xl md:text-5xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-2xl px-6 sm:px-10 py-5 inline-flex items-center shadow-lg mb-8 h-20 sm:h-24 border border-purple-400/30 max-w-full overflow-hidden">
      <span className="text-purple-200 select-none truncate">lightjaus.com/</span>
      <span className="font-bold text-white truncate">{displayText}</span>
      <span className={`select-none text-purple-300 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
    </div>
  );
}

function WordRotator() {
  const words = ["website", "link in bio", "tienda", "música", "visión", "trabajo", "presencia"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300);
      
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className="inline-block overflow-hidden py-1 align-bottom">
      <span 
        className={`inline-block bg-gradient-to-r from-purple-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4'
        }`}
      >
        {words[currentIndex]}
      </span>
    </span>
  );
}

export default function LandingPage() {
  const [activeTheme, setActiveTheme] = useState("y2k");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              { id: "g2", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200" },
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-purple-600 selection:text-white relative overflow-x-hidden font-sans text-base">
      
      {/* --- NAVBAR FLOTANTE RESPONSIVE --- */}
      <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
        <div className={`pointer-events-auto transition-all duration-300 w-full max-w-6xl bg-white/90 backdrop-blur-md border border-purple-200/80 shadow-lg shadow-purple-950/5 flex items-center justify-between px-4 sm:px-6 h-18 sm:h-20 rounded-2xl ${
          isScrolled ? 'py-2' : 'py-3'
        }`}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <img 
              src="/logo.png" 
              alt="lightjaus Logo" 
              className="h-12 sm:h-16 object-contain brightness-0" 
            />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/admin/login" 
              className="text-base font-semibold text-slate-600 hover:text-purple-700 transition-colors px-4 py-2"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/admin/register" 
              className="text-base font-semibold px-6 py-3 bg-gradient-to-r from-purple-800 to-indigo-700 text-white rounded-xl shadow-md hover:opacity-95 transition-all shadow-purple-500/20"
            >
              Crear mi portfolio
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-purple-800 focus:outline-none"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-24 inset-x-4 sm:inset-x-6 bg-white/95 backdrop-blur-md border border-purple-200 rounded-2xl shadow-xl p-6 flex flex-col gap-4 pointer-events-auto md:hidden">
            <Link 
              href="/admin/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-700 hover:text-purple-700 py-2 text-center border-b border-purple-50"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/admin/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold px-6 py-3 bg-gradient-to-r from-purple-800 to-indigo-700 text-white rounded-xl shadow-md text-center"
            >
              Crear mi portfolio
            </Link>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="w-full bg-white pt-36 sm:pt-40 pb-24 sm:pb-32 text-center relative">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15] text-slate-900">
            <div>Tu</div>
            <div><WordRotator /></div>
            <div>en un solo lugar.</div>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mt-6 sm:mt-2 font-normal leading-relaxed">
            Un link para compartir tu trabajo, tu arte y tus proyectos desde tu Instagram, TikTok, YouTube o cualquier otra red social.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-10 sm:mt-12">
            <Link 
              href="/admin/register" 
              className="w-full sm:w-auto px-9 py-4 sm:py-5 bg-purple-900 text-white font-semibold text-base rounded-xl shadow-lg hover:bg-purple-800 transition-all text-center shadow-purple-900/20"
            >
              Empieza gratis
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN INTERACTIVA --- */}
      <section className="w-full bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 py-20 sm:py-28 text-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">Un espacio digital que muestra quién eres</h3>
              <p className="text-purple-200/90 text-base sm:text-lg md:text-xl leading-relaxed font-normal">
                Modifica textos, alterna tus estilos visuales en tiempo real y organiza tanto tu galería de trabajos como tus enlaces de forma totalmente intuitiva.
              </p>
              
              <div className="pt-4">
                <span className="text-xs font-semibold text-purple-300 block mb-3">Prueba cambiar de theme en tiempo real:</span>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {availableThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTheme(t.id)}
                      className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                        activeTheme === t.id 
                          ? 'bg-white text-purple-950 font-bold shadow-md' 
                          : 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/80 border border-purple-700/50'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center p-4 sm:p-8 backdrop-blur-sm overflow-x-auto">
              <Portfolio 
                portfolioData={samplePortfolioData} 
                template={activeTheme} 
              />
            </div>

          </div>
        </div>
      </section>

      {/* --- BLOQUE: CUSTOMIZABLE EN MINUTOS --- */}
      <section className="w-full bg-white py-20 sm:py-28 text-slate-900 border-b border-purple-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <UrlTyper />

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-2 text-slate-900 tracking-tight leading-[1.1]">Configúralo todo en cuestión de minutos</h2>
          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 font-normal leading-relaxed">
            Elige tu dirección web única, añade tu imagen de perfil, carga tus enlaces y sube tus fotos de forma rápida. Sin configuraciones de servidores ni código complejo.
          </p>

          <div className="mt-10">
            <Link 
              href="/admin/register" 
              className="inline-block w-full sm:w-auto px-9 py-4 sm:py-5 bg-purple-900 text-white font-semibold text-base rounded-xl shadow-lg hover:bg-purple-800 transition-all text-center shadow-purple-900/20"
            >
              Crear mi link ahora
            </Link>
          </div>
        </div>
      </section>

      {/* --- BLOQUE: MULTIMEDIA (BENTO GRID REORGANIZADO - DISEÑO DINÁMICO) --- */}
      <section className="w-full bg-purple-50/50 py-20 sm:py-32 text-slate-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* IZQUIERDA: BENTO GRID CON NUEVA DISTRIBUCIÓN ASIMÉTRICA */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-[120px]">
              
              {/* Tarjeta 1: Links Clave (Vertical grande a la izquierda) */}
              <div className="col-span-1 row-span-2 p-6 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group border border-purple-700/30">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-xl font-bold backdrop-blur-md shadow-inner border border-white/10">
                  🔗
                </div>
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg text-white tracking-tight">Links Clave</h4>
                  <p className="text-xs text-purple-200 mt-1">Redes y URLs importantes en un solo toque.</p>
                </div>
              </div>

              {/* Tarjeta 2: Tienda E-commerce (Horizontal superior) */}
              <div className="col-span-1 sm:col-span-2 row-span-1 p-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white rounded-3xl shadow-lg flex items-center justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden border border-indigo-700/30">
                <div className="absolute right-0 top-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10">
                  <h4 className="font-bold text-sm sm:text-base text-white">E-commerce / Tienda</h4>
                  <p className="text-[11px] text-purple-100 mt-0.5">Vende productos y recursos digitales directamente.</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/15 text-white flex items-center justify-center text-lg font-bold backdrop-blur-sm border border-white/10 shrink-0 ml-3">
                  🛍️
                </div>
              </div>

              {/* Tarjeta 3: Software / Apps */}
              <div className="col-span-1 row-span-1 p-5 bg-white rounded-3xl shadow-lg shadow-purple-950/5 border border-purple-100/80 flex flex-col justify-between hover:scale-[1.02] hover:border-indigo-200 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-base font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  💻
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Software</h4>
                  <p className="text-[11px] text-slate-500">Apps y código.</p>
                </div>
              </div>

              {/* Tarjeta 4: Galerías */}
              <div className="col-span-1 row-span-1 p-5 bg-white rounded-3xl shadow-lg shadow-purple-950/5 border border-purple-100/80 flex flex-col justify-between hover:scale-[1.02] hover:border-purple-200 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center text-base font-bold group-hover:bg-purple-900 group-hover:text-white transition-colors">
                  🖼️
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Galerías</h4>
                  <p className="text-[11px] text-slate-500">Fotos y arte.</p>
                </div>
              </div>

              {/* Tarjeta 5: Música */}
              <div className="col-span-1 row-span-1 p-5 bg-white rounded-3xl shadow-lg shadow-purple-950/5 border border-purple-100/80 flex flex-col justify-between hover:scale-[1.02] hover:border-purple-200 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center text-base font-bold group-hover:bg-purple-900 group-hover:text-white transition-colors">
                  🎵
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Música</h4>
                  <p className="text-[11px] text-slate-500">Pistas y audios.</p>
                </div>
              </div>

              {/* Tarjeta 6: Videos (Horizontal inferior) */}
              <div className="col-span-1 sm:col-span-2 row-span-1 p-5 bg-white rounded-3xl shadow-lg shadow-purple-950/5 border border-purple-100/80 flex items-center justify-between hover:scale-[1.01] hover:border-purple-200 transition-all duration-300 group">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">Videos & Reels</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Integra tus clips y contenido audiovisual.</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-900 text-white flex items-center justify-center text-base font-bold shadow-inner shrink-0 ml-3">
                  🎬
                </div>
              </div>

            </div>

            {/* DERECHA: TEXTO Y CALL TO ACTION */}
            <div className="lg:col-span-6 text-left space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Comparte cualquier tipo de contenido
              </h2>
              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed font-normal">
                Organiza bloques de links clave para tus redes, añade herramientas de software, tu tienda online, galerías visuales o elementos multimedia en un diseño único y profesional.
              </p>
              
              <div className="pt-4">
                <Link 
                  href="/admin/register" 
                  className="inline-block px-9 py-4 sm:py-5 bg-purple-900 text-white font-semibold text-base rounded-xl shadow-lg hover:bg-purple-800 transition-all shadow-purple-900/20 text-center"
                >
                  Diseña tu espacio multimedia
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- BLOQUE: REDES Y ESTADÍSTICAS --- */}
      <section className="w-full bg-white py-20 sm:py-28 text-slate-900">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 bg-white/10 text-purple-200 rounded-full inline-block mb-6 border border-white/10">Difusión masiva</span>
              <h3 className="text-3xl md:text-4xl font-bold mt-2 text-white leading-[1.1]">Comparte en todas tus redes sociales</h3>
              <p className="text-purple-100/90 text-base sm:text-lg md:text-xl mt-6 leading-relaxed font-normal">
                Coloca tu enlace único <code className="bg-purple-950/80 text-purple-300 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md font-mono text-xs sm:text-sm font-bold border border-purple-700/50">lightjaus.com/tu-nombre</code> en tu biografía de Instagram, TikTok, Twitter o LinkedIn y redirige a todo tu público a un portfolio profesional.
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-3 text-sm text-purple-300 font-mono font-semibold">
              <span>#LinkEnBio</span> • <span>#Viral</span> • <span>#Pro</span>
            </div>
          </div>

          <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 bg-purple-800/60 text-purple-200 rounded-full inline-block mb-6 border border-purple-500/30">Métricas claras</span>
              <h3 className="text-3xl md:text-4xl font-bold mt-2 text-white leading-[1.1]">Visualiza estadísticas de tus visitas</h3>
              <p className="text-slate-300 text-base sm:text-lg md:text-xl mt-6 leading-relaxed font-normal">
                Monitorea cuántas personas visitan tu perfil, qué enlaces hacen clic con más frecuencia y descubre qué contenido genera más interacción en tu comunidad.
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-slate-300 font-mono font-semibold">
              <span>Visitas únicas</span>
              <span className="bg-purple-900/80 text-purple-200 px-4 py-1.5 rounded-full border border-purple-500/30">+1,240 este mes</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CREADORES QUE CONFIAN --- */}
      <section id="ejemplos" className="w-full bg-purple-950 py-20 sm:py-28 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          {/* Título actualizado con mayor tamaño de texto */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Creadores que ya confían en Lightjaus
          </h2>
          <p className="text-purple-200/80 text-base sm:text-lg md:text-xl mt-4 font-normal">Descubre cómo diferentes profesionales muestran su talento.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-lg border border-purple-900/10">
              <div className="h-44 bg-purple-50 rounded-xl mb-6 flex items-center justify-center text-purple-400 font-mono text-xs font-semibold border border-purple-100">
                [Galería de Tatuajes]
              </div>
              <span className="text-xs text-purple-700 font-mono font-bold">lightjaus.com/carlos-ink</span>
              <h4 className="text-lg font-bold mt-2 text-slate-900">Carlos • Tatuador</h4>
              <p className="text-sm text-slate-600 mt-3 font-normal leading-relaxed">Portfolio visual con estilo único para mostrar piezas de tinta.</p>
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-lg border border-purple-900/10">
              <div className="h-44 bg-purple-50 rounded-xl mb-6 flex items-center justify-center text-purple-400 font-mono text-xs font-semibold border border-purple-100">
                [Galería de Fotografía]
              </div>
              <span className="text-xs text-indigo-700 font-mono font-bold">lightjaus.com/sofia-ph</span>
              <h4 className="text-lg font-bold mt-2 text-slate-900">Sofía • Fotógrafa</h4>
              <p className="text-sm text-slate-600 mt-3 font-normal leading-relaxed">Enfoque minimalista para capturar la atención en sesiones de retrato.</p>
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-lg border border-purple-900/10">
              <div className="h-44 bg-purple-50 rounded-xl mb-6 flex items-center justify-center text-purple-400 font-mono text-xs font-semibold border border-purple-100">
                [Enlaces y Servicios]
              </div>
              <span className="text-xs text-purple-900 font-mono font-bold bg-purple-100 px-2 py-0.5 rounded">lightjaus.com/lucas-dev</span>
              <h4 className="text-lg font-bold mt-2 text-slate-900">Lucas • Creador</h4>
              <p className="text-sm text-slate-600 mt-3 font-normal leading-relaxed">Estructura híbrida combinada con muestras de proyectos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION FINAL --- */}
      <section className="w-full bg-white py-20 sm:py-28 text-slate-900 text-center border-t border-purple-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 relative z-10 leading-[1.1]">
              ¿Listo para destacar en internet?
            </h2>
            <p className="text-purple-100 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal relative z-10 leading-relaxed">
              Únete hoy mismo a Lightjaus, elige tu enlace personalizado y crea tu portfolio autogestionable en menos de 2 minutos.
            </p>
            
            <Link 
              href="/admin/register" 
              className="inline-block w-full sm:w-auto px-10 py-4 sm:py-5 bg-white text-purple-950 font-bold text-base rounded-xl shadow-lg hover:bg-purple-50 transition-all relative z-10"
            >
              Crear mi portfolio ahora
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-slate-950 text-slate-400 py-12 sm:py-14 px-6 text-center text-xs border-t border-purple-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wider text-base">Lightjaus</span>
            <span>— Tu portfolio online autogestionable</span>
          </div>
          <p>© {new Date().getFullYear()} Lightjaus. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}