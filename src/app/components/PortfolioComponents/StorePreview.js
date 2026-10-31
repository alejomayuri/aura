"use client";

import { useState } from "react";

export default function StorePreview({ page, portfolioData, styles, blockColor, primaryColor, socialColor, secondaryColor, titleColor, textColor, iconsColor, home = false }) {
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

  // Verificamos si debe mostrarse como carrusel (layout carrusel y exclusivamente en el home)
  const isCarouselLayout = home && page.layout === "carousel";

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Título de la tienda si está en el home */}
      {(home && page.showTitleOnHome) && (
        <span className={`block text-center whitespace-normal break-words mb-1.5 ${styles.pageTitle}`}
          style={{ color: textColor }}
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
            className={`px-3.5 py-1.5 ${styles.radiusImageLink} text-xs font-medium transition cursor-pointer shrink-0 ${styles.pageCard}`}
            style={{
              backgroundColor: selectedCategory === "Todos" ? blockColor : textColor,
              color: selectedCategory === "Todos" ? textColor : secondaryColor
            }}
          >
            Todos
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 ${styles.radiusImageLink} text-xs font-medium transition cursor-pointer shrink-0 ${styles.pageCard}`}
              style={{
                backgroundColor: selectedCategory === cat ? blockColor : textColor,
                color: selectedCategory === cat ? textColor : secondaryColor
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Renderizado condicional según el layout (Carrusel horizontal en el Home vs Grid / Fila normal) */}
      {isCarouselLayout ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
          {filteredItems.map((item) => {
            const hasPrice = item.price !== null && item.price !== undefined;
            const isOnSale = hasPrice && item.isOnSale && item.discountPrice > 0;
            const currencySymbol = item.currency || "S/";
            const resolvedBlockColor = blockColor || portfolioData?.colors?.secondaryColor;
            const blockStyle = resolvedBlockColor ? { backgroundColor: resolvedBlockColor } : {};

            return (
              <a
                key={item.id}
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col transition-all duration-200 overflow-hidden shrink-0 w-[170px] aspect-[17/28] snap-start ${styles.pageCard}`}
                style={blockStyle}
              >
                {/* Imagen arriba */}
                <div className="w-full h-[65%] bg-slate-100 relative overflow-hidden border-b border-slate-100 shrink-0">
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
                </div>

                {/* Contenido abajo */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
                  <div className="space-y-0.5">
                    <h4 style={{color: textColor}} className="text-[15px] text-slate-900 leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {item.title || "Sin título"}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {hasPrice && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isOnSale ? (
                          <div className="flex flex-col">
                            <span style={{color: textColor}} className="line-through text-slate-400 text-[10px]">
                              {currencySymbol} {Number(item.price).toFixed(2)}
                            </span>
                            <span style={{color: textColor}} className="font-bold text-rose-600 text-[15px]">
                              {currencySymbol} {Number(item.discountPrice).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span style={{color: textColor}} className="font-bold text-slate-900 text-[15px]">
                            {currencySymbol} {Number(item.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => {
              const hasPrice = item.price !== null && item.price !== undefined;
              const isOnSale = hasPrice && item.isOnSale && item.discountPrice > 0;
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
                <div className="w-full h-[65%] bg-slate-100 relative overflow-hidden border-b border-slate-100 shrink-0">
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
                </div>

                {/* Contenido abajo: Nombre, precio y botón distribuidos uniformemente */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
                  <div className="space-y-0.5">
                    <h4 style={{color: textColor}} className="text-[15px] text-slate-900 leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {item.title || "Sin título"}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {/* Precios (solo si tiene precio) */}
                    {hasPrice && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isOnSale ? (
                          <div className="flex flex-col">
                            <span style={{color: textColor}} className="line-through text-slate-400 text-[10px]">
                              {currencySymbol} {Number(item.price).toFixed(2)}
                            </span>
                            <span style={{color: textColor}} className="font-bold text-rose-600 text-[15px]">
                              {currencySymbol} {Number(item.discountPrice).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span style={{color: textColor}} className="font-bold text-slate-900 text-[15px]">
                            {currencySymbol} {Number(item.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}