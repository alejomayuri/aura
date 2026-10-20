export default function ImageGalleryView({ page, styles, galleryColor }) {
  if (!page?.galleries || page.galleries.length === 0) {
    return <p className="text-xs text-center italic opacity-50">No hay galerías creadas para esta página.</p>;
  }

  return (
    <div className="space-y-6 px-6.5">
      {page.galleries.map((gal) => {
        // Filtramos solo las imágenes activas (isActive !== false)
        const activeItems = gal.items?.filter((img) => img.isActive !== false) || [];

        if (activeItems.length === 0) return null;

        // Determinamos el layout de la galería (por defecto "grid" si no está definido)
        const galleryLayout = gal.layout || "grid";

        return (
          <div key={gal.id} className="space-y-2">
            <h3 className={`text-[12px] uppercase font-bold tracking-wider ${styles.pageTitle}`}
                style={{color: galleryColor}}
            >
              {gal.title}
            </h3>
            
            {galleryLayout === "column" ? (
              /* Layout Column: Imágenes una encima de otra, ancho máximo y altura proporcional */
              <div className="space-y-3">
                {activeItems.map((img) => (
                  <div key={img.id} className={`overflow-hidden bg-white/5 w-full ${styles.miniImgShape || ''}`}>
                    <img 
                      src={img.url} 
                      className="w-full h-auto object-contain transition-opacity block" 
                      alt="img" 
                    />
                  </div>
                ))}
              </div>
            ) : galleryLayout === "row" ? (
              /* Layout Row: Filas de 3 imágenes con proporción cuadrada estilo Instagram */
              <div className="grid grid-cols-2 gap-2">
                {activeItems.map((img) => (
                  <div key={img.id} className={`aspect-square overflow-hidden bg-white/5 ${styles.miniImgShape || ''}`}>
                    <img 
                      src={img.url} 
                      className="w-full h-full object-cover transition-opacity block" 
                      alt="img" 
                    />
                  </div>
                ))}
              </div>
            ) : galleryLayout === "carousel" ? (
              /* Layout Carousel: Scroll horizontal fluido con barra fina y limpia */
              <div className="relative mt-2">
                <div className="flex gap-2.5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-2 [-webkit-overflow-scrolling:touch] custom-scrollbar">
                  {activeItems.map((img) => (
                    <div 
                      key={img.id} 
                      className={`h-[220px] shrink-0 snap-start flex items-center justify-center overflow-hidden bg-white/5 ${styles.miniImgShape || ''}`}
                    >
                      <img 
                        src={img.url} 
                        className="h-full w-auto object-contain transition-opacity block" 
                        alt="img" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Layout Grid (por defecto): Cuadrícula en columnas estilo masonry */
              <div className="columns-2 gap-2 space-y-2">
                {activeItems.map((img) => (
                  <div key={img.id} className={`overflow-hidden bg-white/5 break-inside-avoid ${styles.miniImgShape || ''}`}>
                    <img 
                      src={img.url} 
                      className="w-full h-auto object-contain transition-opacity block" 
                      alt="img" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}