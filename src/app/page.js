"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Portfolio from "@/app/components/Portfolio";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { samplePortfolioData } from "@/app/config/demos";

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
    <div className="font-mono text-2xl sm:text-3xl md:text-5xl bg-[#581C87] text-white rounded-2xl px-6 sm:px-10 py-5 inline-flex items-center mb-8 h-20 sm:h-24 max-w-full overflow-hidden">
      <span className="text-[#E0E7FF] sm:h-13 select-none truncate ">lightjaus.com/</span>
      <span className="font-bold sm:h-13 text-white truncate">{displayText}</span>
      <span className={`select-none sm:h-13 text-[#EF4444] ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
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
        className={`inline-block text-[#2563EB] transition-all duration-300 transform ${
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

  const [colors, setColors] = useState({
    primaryColor: "#c026d3",
    secondaryColor: "#67e8f9",
    primaryColorEnd: null,
    socialColor: "#bef264",
    textColor: "#3b0764",
    iconsColor: "#3b0764",
    titleColor: "#bef264",
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Comprobar autenticación en el home para redirigir si ya hay sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

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

  // Pantalla en blanco mientras verifica el estado de autenticación para evitar parpadeos
  if (checkingAuth) {
    return <div className="min-h-screen bg-[#FAFAFA]" />;
  }

  const availableThemes = [
    { 
      id: "y2k", 
      name: "Y2K", 
      colors: { 
        primaryColor: "#c026d3",
        secondaryColor: "#67e8f9",
        primaryColorEnd: null,
        socialColor: "#bef264",
        textColor: "#3b0764",
        iconsColor: "#3b0764",
        titleColor: "#bef264", 
      } 
    },
    { 
      id: "neon", 
      name: "Neon Cyber", 
      colors: { 
        primaryColor: "#020617ff",
        secondaryColor: "#2e1065ff",
        primaryColorEnd: null,
        socialColor: null,
        textColor: "#c084fcff",
        iconsColor: "#a855f7ff",
        titleColor: "#e9d5ffff",
      } 
    },
    { 
      id: "comic", 
      name: "Comic", 
      colors: { 
        primaryColor: "#fef08a",
        secondaryColor: "#ffffff",
        primaryColorEnd: null,
        socialColor: "#22d3ee",
        textColor: "#000000",
        iconsColor: "#000000",
        titleColor: "#000000",
      } 
    },
    { 
      id: "glass", 
      name: "Glassmorphism", 
      colors: { 
        primaryColor: "#fbcfe8",
        primaryColorEnd: "#c7d2fe",
        secondaryColor: "#f3e8ff",
        socialColor: "#f3e8ff",
        textColor: "#334155",
        iconsColor: "#475569",
        titleColor: "#1e293b",
      } 
    }
  ];

  const handleThemeChange = (themeObj) => {
    setActiveTheme(themeObj.id);
    setColors(themeObj.colors);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] selection:bg-[#EF4444] selection:text-white relative overflow-x-hidden font-sans text-base">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* --- NAVBAR FLOTANTE RESPONSIVE --- */}
      <header className="fixed top-3 sm:top-4 inset-x-0 z-999 flex justify-center px-4 sm:px-6 pointer-events-none">
        <div className={`pointer-events-auto transition-all duration-300 w-full max-w-6xl bg-[#FAFAFA]/95 backdrop-blur-md border border-[#E0E7FF] shadow-lg shadow-[#09090B]/5 flex items-center justify-between px-4 sm:px-6 h-18 sm:h-20 rounded-2xl ${
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
              className="text-base font-semibold text-[#09090B]/70 hover:text-[#2563EB] transition-colors px-4 py-2"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/admin/register" 
              className="text-base font-semibold px-6 py-3 bg-[#2563EB] text-white rounded-xl shadow-md hover:bg-[#1D4ED8] transition-all"
            >
              Regístrate gratis
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#09090B] hover:text-[#2563EB] focus:outline-none"
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
          <div className="absolute top-24 inset-x-4 sm:inset-x-6 bg-[#FAFAFA] border border-[#E0E7FF] rounded-2xl shadow-xl p-6 flex flex-col gap-4 pointer-events-auto md:hidden">
            <Link 
              href="/admin/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#09090B] hover:text-[#2563EB] py-2 text-center border-b border-[#E0E7FF]"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/admin/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold px-6 py-3 bg-[#2563EB] text-white rounded-xl shadow-md text-center"
            >
              Regístrate gratis
            </Link>
          </div>
        )}
      </header>

      {/* --- HERO SECTION (Fondo Blanco Limpio #FAFAFA) --- */}
      <section className="w-full bg-[#FAFAFA] pt-36 sm:pt-40 pb-24 sm:pb-32 text-center relative">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15] text-[#09090B]">
            <div>Tu</div>
            <div><WordRotator /></div>
            <div>en un solo lugar.</div>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#09090B]/70 max-w-3xl mx-auto mt-6 sm:mt-2 font-normal leading-relaxed">
            Un link para compartir tu trabajo, tu arte y tus proyectos desde tu Instagram, TikTok, YouTube o cualquier otra red social.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-10 sm:mt-12">
            <Link 
              href="/admin/register" 
              className="w-full sm:w-auto px-9 py-4 sm:py-5 bg-[#EF4444] text-white font-semibold text-base rounded-xl shadow-lg hover:bg-[#84CC16] hover:text-[#09090B] transition-all text-center"
            >
              Empieza gratis
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#2563EB] py-20 sm:py-28 text-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">Un espacio digital que muestra quién eres</h3>
              <p className="text-[#E0E7FF] text-base sm:text-lg md:text-xl leading-relaxed font-normal">
                Modifica textos, alterna tus estilos visuales en tiempo real y organiza tanto tu galería de trabajos como tus enlaces de forma totalmente intuitiva.
              </p>
              
              <div className="pt-4">
                <span className="text-2xs font-semibold text-[#E0E7FF] block mb-3">Prueba cambiar de theme en tiempo real:</span>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {availableThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t)}
                      className={`px-4 sm:px-5 cursor-pointer py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                        activeTheme === t.id 
                          ? 'bg-[#84CC16] text-[#09090B] font-bold shadow-md' 
                          : 'bg-[#581C87] text-[#E0E7FF] hover:bg-[#EF4444] hover:text-white'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center p-4 sm:p-8">
              <div className="w-[400px] h-[750px] bg-white border-4 border-[#09090B] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col shrink-0">
                <div className="hide-scrollbar w-full h-full overflow-y-auto flex flex-col">
                  <Portfolio 
                    portfolioData={{...samplePortfolioData, colors: colors}} 
                    template={activeTheme} 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- BLOQUE: CUSTOMIZABLE EN MINUTOS (Fondo Negro Profundo #09090B) --- */}
      <section className="w-full bg-[#581C87] py-20 sm:py-28 text-white border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <UrlTyper />

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-2 text-white tracking-tight leading-[1.1]">Configúralo todo en cuestión de minutos</h2>
          <p className="text-[#E0E7FF]/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 font-normal leading-relaxed">
            Elige tu dirección web única, añade tu imagen de perfil, carga tus enlaces y sube tus fotos de forma rápida. Sin configuraciones de servidores ni código complejo.
          </p>

          <div className="mt-10">
            <Link 
              href="/admin/register" 
              className="inline-block w-full sm:w-auto px-9 py-4 sm:py-5 bg-[#A3E635] text-[#09090B] font-bold text-base rounded-xl shadow-lg hover:bg-[#84CC16] transition-all text-center"
            >
              Crear mi link ahora
            </Link>
          </div>
        </div>
      </section>

      {/* --- BLOQUE: MULTIMEDIA (Fondo Verde Matcha #84CC16) --- */}
      <section className="w-full bg-[#84CC16] py-20 sm:py-32 text-[#09090B] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-[120px]">
              
              <div className="col-span-1 row-span-2 p-6 bg-[#09090B] text-white rounded-3xl shadow-md flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center text-xl font-bold">
                  🔗
                </div>
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg text-white tracking-tight">Links Clave</h4>
                  <p className="text-xs text-[#E0E7FF] mt-1">Redes y URLs importantes en un solo toque.</p>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 row-span-1 p-5 bg-[#2563EB] text-white rounded-3xl shadow-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold text-sm sm:text-base text-white">E-commerce / Tienda</h4>
                  <p className="text-[11px] text-[#E0E7FF]/80 mt-0.5">Vende productos y recursos digitales directamente.</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#09090B] text-white flex items-center justify-center text-lg font-bold shrink-0 ml-3">
                  🛍️
                </div>
              </div>

              <div className="col-span-1 row-span-1 p-5 bg-[#EF4444] rounded-3xl shadow-sm border border-[#09090B]/10 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-[#84CC16]/20 text-[#09090B] flex items-center justify-center text-base font-bold">
                  💻
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Software</h4>
                  <p className="text-[11px] text-white/70">Apps y código.</p>
                </div>
              </div>

              <div className="col-span-1 row-span-1 p-5 bg-[#FAFAFA] rounded-3xl shadow-sm border border-[#09090B]/10 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-[#84CC16]/20 text-[#09090B] flex items-center justify-center text-base font-bold">
                  🖼️
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#09090B]">Galerías</h4>
                  <p className="text-[11px] text-[#09090B]/70">Fotos y arte.</p>
                </div>
              </div>

              <div className="col-span-1 row-span-1 p-5 bg-[#FAFAFA] rounded-3xl shadow-sm border border-[#09090B]/10 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-[#84CC16]/20 text-[#09090B] flex items-center justify-center text-base font-bold">
                  🎵
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#09090B]">Música</h4>
                  <p className="text-[11px] text-[#09090B]/70">Pistas y audios.</p>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 row-span-1 p-5 bg-[#581C87] rounded-3xl shadow-sm border border-[#09090B]/10 flex items-center justify-between hover:scale-[1.01] transition-all duration-300 group">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">Videos & Reels</h4>
                  <p className="text-[11px] text-white/70 mt-0.5">Integra tus clips y contenido audiovisual.</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#FAFAFA] text-[#84CC16] flex items-center justify-center text-base font-bold shrink-0 ml-3">
                  🎬
                </div>
              </div>

            </div>

            <div className="lg:col-span-6 text-left space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#09090B] tracking-tight leading-[1.1]">
                Comparte cualquier tipo de contenido
              </h2>
              <p className="text-[#09090B]/80 text-lg sm:text-xl leading-relaxed font-medium">
                Organiza bloques de links clave para tus redes, añade herramientas de software, tu tienda online, galerías visuales o elementos multimedia en un diseño único y profesional.
              </p>
              
              <div className="pt-4">
                <Link 
                  href="/admin/register" 
                  className="inline-block px-9 py-4 sm:py-5 bg-[#09090B] text-white font-semibold text-base rounded-xl shadow-lg hover:bg-[#2563EB] transition-all text-center"
                >
                  Diseña tu espacio multimedia
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- BLOQUE: REDES Y ESTADÍSTICAS (Fondo Rojo Carmesí #EF4444) --- */}
      <section className="w-full bg-[#EF4444] py-20 sm:py-28 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <div className="p-8 sm:p-12 bg-[#09090B] text-white rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 bg-[#EF4444] text-white rounded-full inline-block mb-6">Difusión masiva</span>
              <h3 className="text-3xl md:text-4xl font-bold mt-2 text-white leading-[1.1]">Comparte en todas tus redes sociales</h3>
              <p className="text-[#E0E7FF] text-base sm:text-lg md:text-xl mt-6 leading-relaxed font-normal">
                Coloca tu enlace único <code className="bg-[#EF4444] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-md font-mono text-xs sm:text-sm font-bold">lightjaus.com/tu-nombre</code> en tu biografía de Instagram, TikTok, Twitter o LinkedIn y redirige a todo tu público a un portfolio profesional.
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/15 flex items-center gap-3 text-sm text-[#84CC16] font-mono font-semibold">
              <span>#LinkEnBio</span> • <span>#Viral</span> • <span>#Pro</span>
            </div>
          </div>

          <div className="p-8 sm:p-12 bg-[#2563EB] text-white rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 bg-[#09090B] text-white rounded-full inline-block mb-6">Métricas claras</span>
              <h3 className="text-3xl md:text-4xl font-bold mt-2 text-white leading-[1.1]">Visualiza estadísticas de tus visitas</h3>
              <p className="text-[#E0E7FF] text-base sm:text-lg md:text-xl mt-6 leading-relaxed font-normal">
                Monitorea cuántas personas visitan tu perfil, qué enlaces hacen clic con más frecuencia y descubre qué contenido genera más interacción en tu comunidad.
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-[#E0E7FF] font-mono font-semibold">
              <span>Visitas únicas</span>
              <span className="bg-[#84CC16] text-[#09090B] px-4 py-1.5 rounded-full font-bold">+1,240 este mes</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CREADORES QUE CONFIAN (Fondo Blanco Limpio #FAFAFA) --- */}
      <section id="ejemplos" className="w-full bg-[#FAFAFA] py-20 sm:py-28 text-[#09090B] text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#09090B] tracking-tight leading-[1.1]">
            Creadores que ya confían en Lightjaus
          </h2>
          <p className="text-[#09090B]/70 text-base sm:text-lg md:text-xl mt-4 font-normal">Descubre cómo diferentes profesionales muestran su talento.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="bg-[#EF4444] text-[#09090B] rounded-2xl p-8 shadow-md">
              <div className="h-44 bg-[#EEF2FF] rounded-xl mb-6 flex items-center justify-center text-[#2563EB] font-mono text-xs font-semibold">
                [Galería de Tatuajes]
              </div>
              <span className="text-xs text-[#09090B] font-mono font-bold">lightjaus.com/carlos-ink</span>
              <h4 className="text-lg font-bold mt-2 text-[#09090B]">Carlos • Tatuador</h4>
              <p className="text-sm text-[#09090B]/70 mt-3 font-normal leading-relaxed">Portfolio visual con estilo único para mostrar piezas de tinta.</p>
            </div>

            <div className="bg-[#84CC16] text-[#09090B] rounded-2xl p-8 shadow-md">
              <div className="h-44 bg-[#EEF2FF] rounded-xl mb-6 flex items-center justify-center text-[#2563EB] font-mono text-xs font-semibold">
                [Galería de Fotografía]
              </div>
              <span className="text-xs text-[#09090B] font-mono font-bold">lightjaus.com/sofia-ph</span>
              <h4 className="text-lg font-bold mt-2 text-[#09090B]">Sofía • Fotógrafa</h4>
              <p className="text-sm text-[#09090B]/70 mt-3 font-normal leading-relaxed">Enfoque minimalista para capturar la atención en sesiones de retrato.</p>
            </div>

            <div className="bg-[#581C87] text-[#09090B] rounded-2xl p-8 shadow-md">
              <div className="h-44 bg-[#EEF2FF] rounded-xl mb-6 flex items-center justify-center text-[#2563EB] font-mono text-xs font-semibold">
                [Enlaces y Servicios]
              </div>
              <span className="text-xs text-white font-mono font-bold">lightjaus.com/lucas-dev</span>
              <h4 className="text-lg font-bold mt-2 text-[#fff]">Lucas • Creador</h4>
              <p className="text-sm text-[#fff]/70 mt-3 font-normal leading-relaxed">Estructura híbrida combinada con muestras de proyectos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION FINAL (Fondo Azul Cobalto #2563EB) --- */}
      <section className="w-full bg-[#2563EB] py-20 sm:py-28 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="p-8 sm:p-14 rounded-3xl bg-[#09090B] text-white shadow-2xl relative overflow-hidden border border-white/10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 relative z-10 leading-[1.1]">
              ¿Listo para destacar en internet?
            </h2>
            <p className="text-[#E0E7FF] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal relative z-10 leading-relaxed">
              Únete hoy mismo a Lightjaus, elige tu enlace personalizado y crea tu portfolio autogestionable en menos de 2 minutos.
            </p>
            
            <Link 
              href="/admin/register" 
              className="inline-block w-full sm:w-auto px-10 py-4 sm:py-5 bg-[#A3E635] text-[#09090B] font-bold text-base rounded-xl shadow-lg hover:bg-[#84CC16] transition-all relative z-10"
            >
              Crear mi portfolio ahora
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER (Fondo Negro Profundo #09090B) --- */}
      <footer className="w-full bg-[#09090B] text-[#E0E7FF]/60 py-12 sm:py-14 px-6 text-center text-xs border-t border-white/10">
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