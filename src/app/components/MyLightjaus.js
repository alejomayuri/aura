"use client";

import { useState } from "react";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  X,
  MessageCircle,
  Send,
  Share,
  Globe2
} from "lucide-react";

export default function MyLightjaus({ portfolioData, user }) {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Estados para los selectores de análisis
  const [selectedPageFilter, setSelectedPageFilter] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7days");

  // Generación del slug y URL pública
  const slug = portfolioData?.slug || portfolioData?.title?.toLowerCase().replace(/[^a-z0-9]/g, "-") || user?.uid?.slice(0, 8) || "mi-lightjaus";
  const publicUrl = `https://lightjaus.com/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Estadísticas calculadas de las páginas del portafolio
  const pagesList = portfolioData?.pages || [];
  const totalPages = pagesList.length;
  const imagePages = pagesList.filter(p => p.type === "image")?.length || 0;
  const linkPages = pagesList.filter(p => p.type === "link")?.length || 0;
  const audioPages = pagesList.filter(p => p.type === "audio")?.length || 0;
  const activeTemplate = portfolioData?.template || "Minimal";
  
  // Generador de datos simulados dinámicos según el intervalo y la página
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

  // Cálculos para las coordenadas del gráfico lineal SVG (Ancho: 500, Alto: 160)
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

  // Área bajo la curva para el gradiente
  const areaString = `${pathString} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 font-['Poppins']">
      
      {/* 1. Encabezado independiente con el @{slug} */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">@{slug}</h2>
        </div>

        {/* Botones de Compartir y Visitar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-4 py-2.5 rounded-xl transition border border-slate-200"
          >
            <Share2 className="w-4 h-4" /> Compartir
          </button>
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition shadow-md shadow-purple-600/20"
          >
            <ExternalLink className="w-4 h-4" /> Visitar
          </a>
        </div>
      </div>

      {/* 2. ÚNICO BLOQUE CONTENEDOR con estadísticas y gráfico (sin íconos) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        
        {/* Tarjetas de Estadísticas / Resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Visitas Totales</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">{totalViews.toLocaleString()}</h4>
          </div>

          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Páginas Totales</p>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">{totalPages}</h4>
          </div>

          <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Plantilla</p>
            <h4 className="text-lg font-bold text-slate-900 capitalize mt-1">{activeTemplate}</h4>
          </div>
        </div>

        {/* Desglose por Tipos de Página */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Páginas tipo link</span>
            <span className="text-lg font-bold text-slate-900">{linkPages}</span>
          </div>

          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Páginas tipo imagen</span>
            <span className="text-lg font-bold text-slate-900">{imagePages}</span>
          </div>

          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Páginas tipo audio</span>
            <span className="text-lg font-bold text-slate-900">{audioPages}</span>
          </div>
        </div>

        {/* Gráfico Lineal de Visitas con Selectores */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rendimiento de Visitas</h3>
              <p className="text-xs text-slate-500">Evolución del tráfico en tu portafolio</p>
            </div>

            {/* Selectores de Página e Intervalo de Tiempo */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedPageFilter}
                onChange={(e) => setSelectedPageFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-purple-500 transition"
              >
                <option value="all">Todas las páginas (Global)</option>
                {pagesList.map((page, idx) => (
                  <option key={page.id || idx} value={page.id || page.title || `page-${idx}`}>
                    {page.title || `Página ${idx + 1} (${page.type})`}
                  </option>
                ))}
              </select>

              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-purple-500 transition"
              >
                <option value="7days">Últimos 7 días</option>
                <option value="30days">Últimos 30 días</option>
                <option value="year">Este año</option>
              </select>
            </div>
          </div>

          {/* Contenedor del Gráfico Lineal con Eje Vertical */}
          <div className="pt-4 pb-2 flex gap-4 items-center">
            {/* Eje Vertical (Y) */}
            <div className="h-44 flex flex-col justify-between text-[10px] font-medium text-slate-400 text-right pr-2 select-none">
              <span>{maxViews}</span>
              <span>{Math.round(maxViews * 0.75)}</span>
              <span>{Math.round(maxViews * 0.5)}</span>
              <span>{Math.round(maxViews * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Zona Gráfica Línea SVG */}
            <div className="flex-1 relative h-44 border-b border-l border-slate-200">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
                <div className="border-b border-slate-100 w-full" />
              </div>

              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9333ea" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <path d={areaString} fill="url(#purpleGradient)" />

                <path 
                  d={pathString} 
                  fill="none" 
                  stroke="#9333ea" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="5" 
                      className="fill-white stroke-purple-600 stroke-[3px] transition-transform group-hover:scale-125" 
                    />
                    <text 
                      x={p.x} 
                      y={p.y - 12} 
                      textAnchor="middle" 
                      className="text-[10px] font-bold fill-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {p.views}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Eje Horizontal (X) Etiquetas */}
          <div className="flex justify-between pl-10 pr-2 text-xs font-medium text-slate-400">
            {currentChartData.map((item, idx) => (
              <span key={idx} className="text-center flex-1">{item.label}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Modal de Compartir */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Compartir tu Lightjaus</h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">Enlace público</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                <input 
                  type="text" 
                  readOnly 
                  value={publicUrl} 
                  className="bg-transparent text-xs text-slate-700 px-2 outline-none w-full font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500">Compartir directamente en:</label>
              <div className="grid grid-cols-4 gap-3">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Visita mi Lightjaus! ${publicUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition border border-emerald-100"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-[11px] font-medium">WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent("¡Visita mi Lightjaus!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-600 transition border border-sky-100"
                >
                  <Send className="w-5 h-5" />
                  <span className="text-[11px] font-medium">Twitter</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition border border-blue-100"
                >
                  <Share className="w-5 h-5" />
                  <span className="text-[11px] font-medium">Facebook</span>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition border border-indigo-100"
                >
                  <Globe2 className="w-5 h-5" />
                  <span className="text-[11px] font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}