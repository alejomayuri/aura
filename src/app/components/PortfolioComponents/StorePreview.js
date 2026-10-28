"use client";

import { useState } from "react";

export default function StorePreview({ page, portfolioData, styles, blockColor, home = false }) {
  const items = page?.items || [];
  const categories = page?.categories?.length > 0 ? page.categories : ["General"];
  
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // 1. Filtrar productos activos y aplicar el filtro de "featured" si estamos en el home
  const activeItems = items.filter(item => {
    if (item.isActive === false) return false;
    if (home && !item.isFeatured) return false; // Solo featured si es home
    return true;
  });

  const filteredItems = selectedCategory === "Todos" 
    ? activeItems 
    : activeItems.filter(item => item.category === selectedCategory);

  if (activeItems.length === 0) {
    return null; // Si no hay productos destacados en el home, no renderiza nada para mantener limpio el diseño
  }

  return (
    <div className="w-full space-y-4">
      {/* Título de la tienda si está en el home */}
      {home && (
        <span className={`block whitespace-normal break-words mb-1.5 ${styles.pageTitle}`}
        >
          {page.title}
        </span>
      )}

      {/* Selector de categorías (oculto en el home o si solo hay una categoría) */}
      {(categories.length > 1 && !home) && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSelectedCategory("Todos")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
              selectedCategory === "Todos"
                ? "bg-black text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-black text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Cuadrícula de productos con proporción fija de 170px / 280px (aspect-[17/28]) */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => {
            const isFeatured = item.isFeatured === true;
            const isOnSale = item.isOnSale && item.discountPrice > 0;
            const currencySymbol = item.currency || "S/";
            const resolvedBlockColor = blockColor || portfolioData?.colors?.secondaryColor;
            const blockStyle = resolvedBlockColor ? { backgroundColor: resolvedBlockColor } : {};

          return (
            <a
                key={item.id}
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col transition-all duration-200 overflow-hidden aspect-[17/28] ${styles.pageCard}`}
                style={blockStyle}
            >
              {/* Imagen arriba (altura proporcional) */}
              <div className="w-full h-[45%] bg-slate-100 relative overflow-hidden border-b border-slate-100 shrink-0">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title || "Producto"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🛍️
                  </div>
                )}
                
                {isOnSale && (
                  <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase shadow-xs">
                    Oferta
                  </span>
                )}
              </div>

              {/* Contenido abajo: Nombre, precio y botón distribuidos uniformemente */}
              <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block truncate">
                    {item.category || "General"}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {item.title || "Sin título"}
                  </h4>
                </div>

                <div className="space-y-2">
                  {/* Precios */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isOnSale ? (
                      <div className="flex flex-col">
                        <span className="line-through text-slate-400 text-[10px]">
                          {currencySymbol} {Number(item.price || 0).toFixed(2)}
                        </span>
                        <span className="font-bold text-rose-600 text-xs">
                          {currencySymbol} {Number(item.discountPrice).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-900 text-xs">
                        {currencySymbol} {Number(item.price || 0).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Botón de comprar */}
                  <div className="w-full py-1.5 bg-slate-900 group-hover:bg-black text-white text-[11px] font-medium rounded-xl text-center transition-colors shadow-xs flex items-center justify-center gap-1">
                    <span>Ver producto</span>
                    <svg className="w-3 h-3 transform -rotate-45 group-hover:rotate-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}