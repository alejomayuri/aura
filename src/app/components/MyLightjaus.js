"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  X,
  MessageCircle,
  Send,
  Share,
  Globe2,
  TrendingUp,
  Zap,
  Award,
  Sparkles,
  ArrowUpRight,
  BellRing,
  MousePointerClick,
  Percent,
  Link2
} from "lucide-react";

export default function MyLightjaus({ portfolioData, user }) {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Inicializamos en true directamente para evitar llamadas síncronas a setState en useEffect
  const [mounted] = useState(true);
  
  // Estados para los selectores de análisis
  const [selectedPageFilter, setSelectedPageFilter] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7days");

  // Generación del slug y URL pública
  const slug = portfolioData?.slug || portfolioData?.title?.toLowerCase().replace(/[^a-z0-9]/g, "-") || user?.uid?.slice(0, 8) || "mi-lightjaus";
  const publicUrl = `https://lightjaus.com/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Estadísticas y datos del portafolio
  const pagesList = portfolioData?.pages || [];
  const totalPages = pagesList.length;
  const activeTemplate = portfolioData?.template || "Minimal";
  
  // Encontrar la página seleccionada actual para validar su type y extraer sus links reales
  const selectedPageObj = pagesList.find(
    (page, idx) => (page.id || page.title || `page-${idx}`) === selectedPageFilter
  );
  const isSelectedPageLinkType = selectedPageObj?.type === "link";

  // Extraemos los links reales de la página y simulamos una métrica de clics por enlace si no la traen de base
  const pageLinks = selectedPageObj?.items || [];
  const topPageLinks = [...pageLinks]
    .map((linkItem, idx) => ({
      ...linkItem,
      // Si el enlace no tiene clics registrados, generamos un valor consistente basado en su posición
      clicks: linkItem.clicks || Math.max(15, 120 - (idx * 35))
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 3);

  // Generador de datos simulados dinámicos
  const getChartData = () => {
    let baseMultiplier = selectedPageFilter === "all" ? 1 : 0.4;
    
    if (selectedTimeRange === "7days") {
      return [
        { label: "Lun", views: Math.round(180 * baseMultiplier) },
        { label: "Mar", views: Math.round(240 * baseMultiplier) },
        { label: "Mié", views: Math.round(190 * baseMultiplier) },
        { label: "Jue", views: Math.round(320 * baseMultiplier) },
        { label: "Vie", views: Math.round(280 * baseMultiplier) },
        { label: "Sáb", views: Math.round(410 * baseMultiplier) },
        { label: "Dom", views: Math.round(350 * baseMultiplier) },
      ];
    } else if (selectedTimeRange === "30days") {
      return [
        { label: "Sem 1", views: Math.round(1200 * baseMultiplier) },
        { label: "Sem 2", views: Math.round(1500 * baseMultiplier) },
        { label: "Sem 3", views: Math.round(1350 * baseMultiplier) },
        { label: "Sem 4", views: Math.round(1890 * baseMultiplier) },
      ];
    } else {
      return [
        { label: "Ene", views: Math.round(4200 * baseMultiplier) },
        { label: "Feb", views: Math.round(5100 * baseMultiplier) },
        { label: "Mar", views: Math.round(4800 * baseMultiplier) },
        { label: "Abr", views: Math.round(6200 * baseMultiplier) },
      ];
    }
  };

  const currentChartData = getChartData();
  const maxViews = Math.max(...currentChartData.map(d => d.views)) || 100;
  const totalViews = currentChartData.reduce((acc, curr) => acc + curr.views, 0);

  // Cálculos simulados basados en las visitas para las nuevas métricas
  const totalClicks = Math.round(totalViews * 0.35); // 35% de interacción promedio
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  // Coordenadas para el gráfico SVG
  const svgWidth = 500;
  const svgHeight = 160;
  const points = currentChartData.map((item, index) => {
    const x = (index / (currentChartData.length - 1 || 1)) * svgWidth;
    const y = svgHeight - (item.views / (maxViews || 1)) * (svgHeight - 20) - 10;
    return { x, y, ...item };
  });

  const pathString = points.reduce((acc, p, idx) => (
    idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  ), "");
  const areaString = `${pathString} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-['Poppins']">
      
      {/* 1. SECCIÓN SUPERIOR: Bienvenida y Enlace Público */}
      <div className="bg-white py-6 sm:py-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black font-semibold tracking-tight text-slate-900">Hola de nuevo, {slug}</h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-5 py-3 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4" /> Visitar
          </a>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 bg-[#F2F1EF] cursor-pointer hover:bg-gray-100 text-slate-700 text-xs font-semibold px-5 py-3 rounded-xl transition"
          >
            <Share2 className="w-4 h-4" /> Compartir
          </button>
        </div>
      </div>

      {/* 2. GRID DE VALOR: Métricas Clave e Insights de la Semana */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda & Centro: Estadísticas de Impacto (2 columnas) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 space-y-6">
            
            {/* Título y Selector de páginas integrados en la cabecera del resumen */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-slate-900">Resumen de la Semana</h3>
              <select
                value={selectedPageFilter}
                onChange={(e) => setSelectedPageFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3.5 py-2 outline-none focus:border-purple-500 transition cursor-pointer"
              >
                <option value="all">Todas las páginas (Global)</option>
                {pagesList.map((page, idx) => (
                  <option key={page.id || idx} value={page.id || page.title || `page-${idx}`}>
                    {page.title || `Página ${idx + 1} (${page.type})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Métrica 1: Visitas Totales */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Visitas Totales</p>
                <h4 className="text-2xl font-black text-slate-900">{totalViews.toLocaleString()}</h4>
                <p className="text-[11px] text-emerald-600 font-medium">Tráfico verificado</p>
              </div>

              {/* Métrica 2: Clics en Enlaces */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Clics en Enlaces</p>
                <h4 className="text-2xl font-black text-slate-900">{totalClicks.toLocaleString()}</h4>
                <p className="text-[11px] text-purple-600 font-medium">Interacciones directas</p>
              </div>

              {/* Métrica 3: Tasa de Conversión */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tasa de Conversión</p>
                <h4 className="text-2xl font-black text-slate-900">{conversionRate}%</h4>
                <p className="text-[11px] text-emerald-600 font-medium">Visitantes que hicieron clic</p>
              </div>

            </div>

            {/* CONDICIONAL: Si la página seleccionada es de type "link", mostramos sus 3 enlaces reales más clickeados */}
            {isSelectedPageLinkType && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-purple-600" /> Top 3 Enlaces de esta página
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{selectedPageObj?.title}</span>
                </div>

                <div className="space-y-2">
                  {topPageLinks.length > 0 ? (
                    topPageLinks.map((linkItem, idx) => (
                      <div key={linkItem.id || idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm text-xs">
                        <div className="flex items-center gap-2.5 truncate mr-3">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px] shrink-0">{idx + 1}</span>
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 truncate">{linkItem.title || "Enlace sin título"}</p>
                            <a href={linkItem.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-600 hover:underline truncate block">
                              {linkItem.url}
                            </a>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">{linkItem.clicks} clics</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-2">No hay enlaces configurados en esta página.</p>
                  )}
                </div>
              </div>
            )}

            {/* Bloque Destacado: Contenido Magnético (Insight) */}
            <div className="bg-purple-50/60 border border-purple-100 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-950">Contenido estrella de la semana</h4>
                  <p className="text-xs text-purple-800/80 mt-0.5">Tus enlaces musicales y de redes sociales concentraron el mayor número de clics.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-white px-3 py-1.5 rounded-xl border border-purple-200/60 shrink-0 shadow-sm">
                Ver reporte
              </span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Novedades y Tips de Lightjaus (1 columna) */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 px-1"> Actualizaciones y Tips</h3>
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Nueva Función</span>
                    <span className="text-[10px] text-slate-400">Hace 2 días</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">Personalización de Colores Inteligentes</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Ahora los fondos adaptativos detectan la paleta de tu marca con mayor precisión.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Consejo Pro</span>
                    <span className="text-[10px] text-slate-400">Recomendado</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">Añade enlaces destacados</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Los creadores que fijan un enlace principal aumentan su tasa de conversión un 35%.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Nueva Función</span>
                    <span className="text-[10px] text-slate-400">Hace 2 días</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">Personalización de Colores Inteligentes</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">Ahora los fondos adaptativos detectan la paleta de tu marca con mayor precisión.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5">
                Ver todas las notas de versión <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. SECCIÓN INFERIOR: Gráfico de Rendimiento Detallado */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Evolución Detallada del Tráfico</h3>
            <p className="text-xs text-slate-500">Analiza el comportamiento de tus visitas por página y periodo de tiempo</p>
          </div>

          {/* Selector de tiempo */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-500 transition cursor-pointer"
            >
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
              <option value="year">Este año</option>
            </select>
          </div>
        </div>

        {/* Contenedor del Gráfico SVG */}
        <div className="pt-4 pb-2 flex gap-4 items-center">
          <div className="h-44 flex flex-col justify-between text-[10px] font-medium text-slate-400 text-right pr-2 select-none">
            <span>{maxViews}</span>
            <span>{Math.round(maxViews * 0.75)}</span>
            <span>{Math.round(maxViews * 0.5)}</span>
            <span>{Math.round(maxViews * 0.25)}</span>
            <span>0</span>
          </div>

          <div className="flex-1 relative h-44 border-b border-l border-slate-200">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
              <div className="border-b border-slate-100 w-full" />
            </div>

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="purpleGradientNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path d={areaString} fill="url(#purpleGradientNew)" />

              <path 
                d={pathString} 
                fill="none" 
                stroke="#9333ea" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {points.map((p, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="5.5" 
                    className="fill-white stroke-purple-600 stroke-[3.5px] transition-transform group-hover:scale-125" 
                  />
                  <text 
                    x={p.x} 
                    y={p.y - 12} 
                    textAnchor="middle" 
                    className="text-[11px] font-bold fill-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {p.views}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="flex justify-between pl-10 pr-2 text-xs font-semibold text-slate-500">
          {currentChartData.map((item, idx) => (
            <span key={idx} className="text-center flex-1">{item.label}</span>
          ))}
        </div>
      </div>

      {/* Modal de Compartir renderizado mediante Portal (con botón de copiar en negro) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isShareModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 w-screen h-screen overflow-hidden font-['Poppins']"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative border border-purple-100"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm font-bold text-slate-800 tracking-tight">Compartir portfolio</span>
                  <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 bg-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 shadow-sm">
                  <span className="text-xs font-medium select-all truncate">
                    <span className="text-slate-900">lightjaus.com</span>
                    <span className="text-slate-600">/{slug}</span>
                  </span>
                  {/* Botón Copiar con fondo negro */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink();
                    }}
                    className="bg-black hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold text-purple-900 block">Compartir en redes sociales</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(() => {
                      const whatsappText = `Mira mi Lightjaus: ${publicUrl}`;
                      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
                      
                      return (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                        >
                          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                          <span>WhatsApp</span>
                        </a>
                      );
                    })()}

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.588 9 4.7V8z"/></svg>
                      <span>Facebook</span>
                    </a>
                    <a
                      href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(publicUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(publicUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 4.979 0 11.111c0 3.497 1.745 6.616 4.472 8.654V24l4.08-2.242c1.093.303 2.248.464 3.448.464 6.627 0 12-4.979 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.56-6.963 3.13 3.26 5.888-3.26-6.56 6.963z"/></svg>
                      <span>Messenger</span>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mira mi Lightjaus`)}&url=${encodeURIComponent(publicUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      <span>X</span>
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}