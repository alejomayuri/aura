export default function LinkPageCard({ page, styles, internal, blockColor, textColor, home = false }) {
  if (!page?.items || page.items.length === 0) return null;

  return (
    <div key={page.id} className="space-y-3 mb-8">
      {home && (
        <span className={`block whitespace-normal break-words mb-1.5 ${styles.pageTitle}`}
          style={{ color: textColor }}
        >
          {page.title}
        </span>
      )}
      {page.items.map((link) => {
        // Si isFeatured no es true, omitimos el link y no se muestra
        if (link.isFeatured !== true && !internal) return null;
        if (!link.isActive) return null;

        const formattedUrl = link.url.startsWith("http") ? link.url : `https://${link.url}`;
        const layout = link.layout || "classic"; // Por defecto usa classic

        // Layout "featured": mantiene relación de aspecto 350px / 240px
        if (layout === "featured") {
          return (
            <a
              key={link.id || link.url}
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full aspect-[350/240] p-4 relative overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-center mb-3 ${styles.pageCard}`}
              style={{ backgroundColor: blockColor }}
            >
              {/* Imagen de fondo si existe */}
              {link.imageUrl && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={link.imageUrl} 
                    alt={link.title || "Featured Background"} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Capa oscura semitransparente para mejorar el contraste del texto */}
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              )}

              {/* Título centrado en el medio */}
              <span 
                className={`relative z-10 text-center whitespace-normal break-words px-4 ${styles.pageTitle}`}
                style={{ color: textColor }}
              >
                {link.title}
              </span>
            </a>
          );
        }

        // Layout "classic"
        return (
          <a
            key={link.id || link.url}
            href={formattedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full p-2 min-h-[68px] transition-all duration-200 cursor-pointer grid items-center mb-3 ${styles.pageCard}`}
            style={{
              gridTemplateColumns: link.imageUrl ? '52px 1fr 52px' : '1fr',
              backgroundColor: blockColor
            }}
          >
            {/* Si hay imagen, se muestra cuadrada (48px), sin bordes ni redondeos, dentro del bloque */}
            {link.imageUrl ? (
              <div className={`w-[48px] h-[48px] shrink-0 overflow-hidden ${styles.radiusImageLink || ''}`}>
                <img 
                  src={link.imageUrl} 
                  alt={link.title || "Thumbnail"} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : null}

            {/* Título del enlace centrado */}
            <span 
              className={`text-center whitespace-normal break-words px-2 ${styles.pageTitle}`}
              style={{ color: textColor }}
            >
              {link.title}
            </span>

            {/* Espaciador invisible para equilibrar el centro si hay imagen */}
            {link.imageUrl ? <div aria-hidden="true" /> : null}
          </a>
        );
      })}
    </div>
  );
}