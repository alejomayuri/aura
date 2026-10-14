import Link from "next/link";

export default function ImagePageCard({ page, portfolioSlug, styles, layout, currentTemplate }) {
  const cardLayout = page.layout || layout || "row";

  // Layout "row": hasta 3 imágenes en cuadrícula cuadrada
  const previewImages = page.type === "image" && page.galleries 
    ? page.galleries.flatMap(g => g.items || []).slice(0, 3) 
    : [];

  // Layout "single": la primera imagen de la primera galería
  const singleImage = page.type === "image" && page.galleries?.[0]?.items?.[0] 
    ? page.galleries[0].items[0] 
    : null;

  // Layout "carousel": hasta las primeras 5 imágenes
  const carouselImages = page.type === "image" && page.galleries 
    ? page.galleries.flatMap(g => g.items || []).slice(0, 5) 
    : [];

  // Layout "grid": hasta las primeras 4 imágenes para mostrar en columnas
  const gridImages = page.type === "image" && page.galleries 
    ? page.galleries.flatMap(g => g.items || []).slice(0, 4) 
    : [];

  if (page.type === "image" && (!page.galleries || page.galleries.length === 0)) {
    return null;
  }

  return (
    <Link 
      href={`/${portfolioSlug}/${page.slug || page.id}`}
      className={`w-full p-3 transition-all duration-200 cursor-pointer block ${styles.pageCard}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs truncate pr-2 ${styles.pageTitle}`}>{page.title}</span>
        <span className="text-[9px] uppercase tracking-wider opacity-50 shrink-0 font-bold">
          {currentTemplate === 'terminal' ? '[+]' : '→'}
        </span>
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
        /* Layout Grid: 2 columnas con espaciado */
        <div className="mt-2 columns-2 gap-2 space-y-2">
          {gridImages.map((img, idx) => (
            <div key={img.id || idx} className="overflow-hidden break-inside-avoid bg-slate-900">
              <img src={img.url} alt="Grid Preview" className="w-full h-auto object-cover transition-opacity" />
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