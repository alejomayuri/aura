import Link from "next/link";

export default function ImagePageCard({ page, portfolioSlug, styles, layout, currentTemplate, blockColor, textColor }) {
  const cardLayout = page.layout || layout || "row";

  // 1. Obtenemos y filtramos solo las imágenes que están activas (isActive !== false)
  const activeItems = page.type === "image" && page.galleries 
    ? page.galleries.flatMap(g => g.items || []).filter(img => img.isActive !== false) 
    : [];

  // Si no hay ninguna imagen activa, no renderizamos la tarjeta
  if (page.type === "image" && (activeItems.length === 0 || !page.galleries || page.galleries.length === 0)) {
    return null;
  }

  // Layout "row": hasta 3 imágenes activas en cuadrícula cuadrada
  const previewImages = activeItems.slice(0, 3);

  // Layout "single": la primera imagen activa disponible
  const singleImage = activeItems[0] || null;

  // Layout "carousel": hasta las primeras 5 imágenes activas
  const carouselImages = activeItems.slice(0, 5);

  // Layout "grid": hasta las primeras 4 imágenes activas para mostrar en cuadrícula de 2x2
  const gridImages = activeItems.slice(0, 4);

  return (
    <Link 
      href={`/${portfolioSlug}/${page.slug || page.id}`}
      className={`w-full p-3 transition-all duration-200 mb-8 cursor-pointer block ${styles.pageCard}`}
      style={{background: blockColor}}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`truncate pr-2 ${styles.pageTitle}`} style={{color: textColor}}>{page.title}</span>
      </div>
      
      {cardLayout === "single" && singleImage ? (
        <div className="mt-2 overflow-hidden bg-slate-900 flex items-center justify-center">
          <img 
            src={singleImage.url} 
            alt={page.title || "Preview"} 
            className="w-full h-auto object-contain transition-opacity"
          />
        </div>
      ) : cardLayout === "carousel" && carouselImages.length > 0 ? (
        /* Carrusel con scroll horizontal fino y limpio */
        <div className="relative mt-2">
          <div className="flex gap-2.5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-2 [-webkit-overflow-scrolling:touch] custom-scrollbar">
            {carouselImages.map((img, idx) => (
              <div 
                key={img.id || idx} 
                className={`h-[200px] shrink-0 snap-start flex items-center justify-center overflow-hidden`}
              >
                <img 
                  src={img.url} 
                  alt="Carousel Preview" 
                  className="h-full w-auto object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      ) : cardLayout === "grid" && gridImages.length > 0 ? (
        /* Layout Grid: Cuadrícula simétrica de 2x2 con imágenes cuadradas */
        <div className="grid grid-cols-2 gap-2 mt-2">
          {gridImages.map((img, idx) => (
            <div key={img.id || idx} className="aspect-square overflow-hidden bg-slate-900">
              <img src={img.url} alt="Grid Preview" className="w-full h-full object-cover transition-opacity" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {previewImages.map((img, idx) => (
            <div key={img.id || idx} className={`overflow-hidden`}>
              <img src={img.url} alt="Preview" className="aspect-square w-full h-full object-cover transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}