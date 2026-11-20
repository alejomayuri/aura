"use client";

import { useState, useRef, useEffect } from "react";
import {
  Link2,
  Headphones,
  Image as ImageIcon,
  ShoppingBag,
  Home,
  ChevronDown,
} from "lucide-react";

function getPageTypeIcon(type, className = "w-3.5 h-3.5 text-purple-600 shrink-0") {
  if (type === "home") return <Home className={className} />;
  if (type === "audio") return <Headphones className={className} />;
  if (type === "image") return <ImageIcon className={className} />;
  if (type === "store") return <ShoppingBag className={className} />;
  return <Link2 className={className} />;
}

function extractPageItems(page) {
  if (!page) return [];

  const pageType = page.type;

  if (pageType === "image") {
    const fromGalleries = (page.galleries || []).flatMap((gal) =>
      (gal.items || []).map((item) => ({
        ...item,
        galleryTitle: gal.title,
      }))
    );
    return fromGalleries.length > 0 ? fromGalleries : page.items || [];
  }

  if (pageType === "store") {
    return page.items || page.products || [];
  }

  return page.items || [];
}

export default function WeeklySummary({
  portfolioData = {},
  pagesList = [],
  selectedPageFilter,
  setSelectedPageFilter,
  totalViews: totalViewsProp,
  totalClicks: totalClicksProp,
  conversionRate: conversionRateProp,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resolvedPages =
    Array.isArray(pagesList) && pagesList.length > 0
      ? pagesList
      : Array.isArray(portfolioData?.pages)
      ? portfolioData.pages
      : [];

  const isHomeSelected =
    selectedPageFilter === "home" || selectedPageFilter === "all" || !selectedPageFilter;

  // Encontrar la página seleccionada actual para validar su type y extraer sus elementos reales
  const selectedPageObj = !isHomeSelected
    ? resolvedPages.find(
        (page, idx) => (page.id || page.title || `page-${idx}`) === selectedPageFilter
      )
    : null;

  const pageType = selectedPageObj?.type;
  const shouldShowTopThree =
    isHomeSelected ||
    pageType === "link" ||
    pageType === "audio" ||
    pageType === "image" ||
    pageType === "store";

  const isAudioType = pageType === "audio";
  const isImageType = pageType === "image";
  const isStoreType = pageType === "store";

  // Ranking para Home: las 3 páginas más visitadas con data real
  const topVisitedPages = [...resolvedPages]
    .map((page, idx) => {
      const firstGalleryImg = page?.galleries?.[0]?.items?.[0]?.url;
      const firstItemImg =
        page?.items?.imageUrl ||
        page?.items?.[0]?.imageUrl ||
        page?.items?.[0]?.image ||
        page?.items?.[0]?.imagen ||
        page?.items?.[0]?.cover ||
        page?.items?.[0]?.thumbnail ||
        (page?.type === "image" ? page?.items?.[0]?.url : null);

      return {
        ...page,
        views: Number(page.views ?? page.visits ?? 0),
        previewImage:
          page.image ||
          page.imagen ||
          page.cover ||
          page.thumbnail ||
          firstGalleryImg ||
          firstItemImg ||
          null,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  // Elementos reales de la página seleccionada (cuando no es Home)
  const rawItems = extractPageItems(selectedPageObj);

  const topPageItems = [...rawItems]
    .map((item) => ({
      ...item,
      clicks: Number(item.clicks ?? 0),
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 3);

  // Cálculo de métricas semanales reales si no vienen explícitamente por props
  const homeRealViews = Number(
    portfolioData?.views ??
      portfolioData?.homeViews ??
      portfolioData?.visits ??
      0
  );

  const allItemsClicks = resolvedPages.reduce((acc, p) => {
    const itemsInPage = extractPageItems(p);
    const pageClicks = itemsInPage.reduce(
      (sum, it) => sum + (Number(it.clicks) || 0),
      0
    );
    return acc + pageClicks;
  }, 0);

  const selectedPageClicks = rawItems.reduce(
    (sum, it) => sum + (Number(it.clicks) || 0),
    0
  );

  const computedViews = isHomeSelected
    ? homeRealViews
    : Number(selectedPageObj?.views ?? selectedPageObj?.visits ?? 0);

  const computedClicks = isHomeSelected ? allItemsClicks : selectedPageClicks;

  const computedConversionRate =
    computedViews > 0
      ? ((computedClicks / computedViews) * 100).toFixed(1)
      : "0.0";

  const totalViews =
    typeof totalViewsProp === "number" ? totalViewsProp : computedViews;
  const totalClicks =
    typeof totalClicksProp === "number" ? totalClicksProp : computedClicks;
  const conversionRate =
    conversionRateProp !== undefined && conversionRateProp !== null
      ? conversionRateProp
      : computedConversionRate;

  const getHeaderLabel = () => {
    if (isHomeSelected) return "Top 3 Páginas Más Visitadas";
    if (isAudioType) return "Top 3 Audios de esta página";
    if (isImageType) return "Top 3 Imágenes de esta página";
    if (isStoreType) return "Top 3 Productos de esta página";
    return "Top 3 Enlaces de esta página";
  };

  const getHeaderIcon = () => {
    if (isHomeSelected) return <Home className="w-4 h-4 text-purple-600" />;
    if (isAudioType) return <Headphones className="w-4 h-4 text-purple-600" />;
    if (isImageType) return <ImageIcon className="w-4 h-4 text-purple-600" />;
    if (isStoreType) return <ShoppingBag className="w-4 h-4 text-purple-600" />;
    return <Link2 className="w-4 h-4 text-purple-600" />;
  };

  const getFallbackIcon = (typeOverride) => {
    const targetType = typeOverride || pageType;
    if (targetType === "audio") return <Headphones className="w-4 h-4" />;
    if (targetType === "image") return <ImageIcon className="w-4 h-4" />;
    if (targetType === "store") return <ShoppingBag className="w-4 h-4" />;
    if (targetType === "link") return <Link2 className="w-4 h-4" />;
    return <Home className="w-4 h-4" />;
  };

  const getEmptyMessage = () => {
    if (isHomeSelected) return "No hay páginas creadas todavía.";
    if (isAudioType) return "No hay elementos de audio configurados en esta página.";
    if (isImageType) return "No hay imágenes configuradas en esta página.";
    if (isStoreType) return "No hay productos configurados en esta página.";
    return "No hay enlaces configurados en esta página.";
  };

  const selectedLabel = isHomeSelected
    ? "Home"
    : selectedPageObj?.title || `Página (${selectedPageObj?.type || "página"})`;
  const selectedIconType = isHomeSelected ? "home" : selectedPageObj?.type;

  return (
    <div className="lg:col-span-2 space-y-3">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 space-y-6">
        {/* Título y Selector de páginas con íconos a la izquierda */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-slate-900">Resumen de la Semana</h3>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center justify-between gap-2.5 min-w-[180px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3.5 py-2 outline-none focus:border-purple-500 transition cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                {getPageTypeIcon(selectedIconType)}
                <span className="truncate">{selectedLabel}</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPageFilter("home");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                    isHomeSelected
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {getPageTypeIcon("home")}
                  <span className="truncate">Home</span>
                </button>

                {resolvedPages.map((page, idx) => {
                  const optionValue = page.id || page.title || `page-${idx}`;
                  const isOptionSelected = selectedPageFilter === optionValue;
                  const optionLabel = page.title || `Página ${idx + 1} (${page.type})`;

                  return (
                    <button
                      key={page.id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedPageFilter(optionValue);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                        isOptionSelected
                          ? "bg-purple-50 text-purple-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {getPageTypeIcon(page.type)}
                      <span className="truncate">{optionLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Métrica 1: Visitas Totales */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Visitas Totales</p>
            <h4 className="text-2xl font-black text-slate-900">{Number(totalViews).toLocaleString()}</h4>
            <p className="text-[11px] text-emerald-600 font-medium">Tráfico verificado (semanal)</p>
          </div>

          {/* Métrica 2: Clics en Enlaces */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Clics en Enlaces</p>
            <h4 className="text-2xl font-black text-slate-900">{Number(totalClicks).toLocaleString()}</h4>
            <p className="text-[11px] text-purple-600 font-medium">Interacciones semanales</p>
          </div>

          {/* Métrica 3: Tasa de Conversión */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tasa de Conversión</p>
            <h4 className="text-2xl font-black text-slate-900">{conversionRate}%</h4>
            <p className="text-[11px] text-emerald-600 font-medium">Visitantes que hicieron clic</p>
          </div>
        </div>

        {/* CONDICIONAL: Top de páginas más visitadas en Home o Top 3 de ítems en páginas específicas */}
        {shouldShowTopThree && (
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                {getHeaderIcon()} {getHeaderLabel()}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {isHomeSelected ? "Home" : selectedPageObj?.title}
              </span>
            </div>

            {isHomeSelected ? (
              <div className="space-y-2">
                {topVisitedPages.length > 0 ? (
                  topVisitedPages.map((page, idx) => (
                    <div
                      key={page.id || idx}
                      className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm text-xs"
                    >
                      <div className="flex items-center gap-3 truncate mr-3">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>

                        {page.previewImage ? (
                          <img
                            src={page.previewImage}
                            alt={page.title || "Página"}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            {getFallbackIcon(page.type)}
                          </div>
                        )}

                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">
                            {page.title || `Página ${idx + 1}`}
                          </p>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            Tipo: {page.type || "página"}
                          </span>
                        </div>
                      </div>

                      <span className="font-bold text-slate-900 shrink-0">
                        {Number(page.views).toLocaleString()} visitas
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-2">
                    {getEmptyMessage()}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {topPageItems.length > 0 ? (
                  topPageItems.map((item, idx) => {
                    const itemImage =
                      item.imageUrl ||
                      item.image ||
                      item.imagen ||
                      item.cover ||
                      item.artwork ||
                      item.thumbnail ||
                      item.icon ||
                      (isImageType ? item.url : null);

                    const formattedPrice =
                      item.price !== undefined && item.price !== null && item.price !== ""
                        ? typeof item.price === "number"
                          ? `${item.currency || "S/"} ${Number(item.price).toFixed(2)}`
                          : item.price
                        : "";

                    const itemSubtitle = isStoreType
                      ? formattedPrice || item.description || item.subtitle || ""
                      : item.galleryTitle ||
                        item.description ||
                        item.artist ||
                        item.subtitle ||
                        (isImageType ? "" : item.url) ||
                        "";

                    return (
                      <div
                        key={item.id || idx}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm text-xs"
                      >
                        <div className="flex items-center gap-3 truncate mr-3">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                            {idx + 1}
                          </span>

                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={item.title || item.name || "Ítem"}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                              {getFallbackIcon()}
                            </div>
                          )}

                          <div className="truncate">
                            <p className="font-semibold text-slate-800 truncate">
                              {item.title ||
                                item.name ||
                                item.url ||
                                (isStoreType
                                  ? "Producto sin título"
                                  : isImageType
                                  ? "Imagen sin título"
                                  : isAudioType
                                  ? "Audio sin título"
                                  : "Enlace sin título")}
                            </p>
                            {itemSubtitle &&
                              (!isImageType && !isStoreType && item.url ? (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-purple-600 hover:underline truncate block"
                                >
                                  {item.url}
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-500 truncate block">
                                  {itemSubtitle}
                                </span>
                              ))}
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          {Number(item.clicks).toLocaleString()} clics
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-2">
                    {getEmptyMessage()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}