export default function Portfolio({ portfolioData }) {
  const imageSrc = portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image;
  const currentTemplate = portfolioData?.template || "minimal";

  // Clases y estilos dinámicos según la plantilla seleccionada
  const getTemplateStyles = () => {
    switch (currentTemplate) {
      case "neon":
        return {
          container: "bg-slate-950 border-purple-500/50 shadow-lg shadow-purple-500/20",
          title: "text-purple-400 font-extrabold tracking-wider",
          badge: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
          imageWrapper: "border-purple-500/40 bg-purple-950/20",
          socialIconBtn: "bg-purple-950/40 border-purple-500/40 text-purple-300 hover:bg-purple-900/60 hover:border-purple-400",
          description: "text-purple-200/80 font-light italic"
        };
      case "classic":
        return {
          container: "bg-zinc-900 border-zinc-700 shadow-md",
          title: "text-zinc-100 font-serif tracking-normal",
          badge: "bg-zinc-800 text-zinc-300 border border-zinc-700",
          imageWrapper: "border-zinc-700 bg-zinc-950",
          socialIconBtn: "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500",
          description: "text-zinc-300 font-serif"
        };
      case "minimal":
      default:
        return {
          container: "bg-slate-900 border-slate-800 shadow-xl",
          title: "text-white font-bold tracking-tight",
          badge: "bg-slate-800 text-slate-300 border border-slate-700",
          imageWrapper: "border-slate-800 bg-slate-950",
          socialIconBtn: "bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700",
          description: "text-slate-400 font-normal"
        };
    }
  };

  const styles = getTemplateStyles();

  // Función para detectar la red social y retornar el ícono correspondiente o el genérico
  const getSocialIcon = (url) => {
    if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
    
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
    } else if (lowerUrl.includes("whatsapp.com") || lowerUrl.includes("wa.me")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
    } else if (lowerUrl.includes("linkedin.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
    } else if (lowerUrl.includes("github.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
    } else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
    } else if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
    } else if (lowerUrl.includes("facebook.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
    } else if (lowerUrl.includes("tiktok.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
    }
    
    return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  };

  // Obtenemos los links del estado; si no hay ninguno registrado, se puede dejar un array vacío
  const socialLinks = portfolioData?.socialLinks || [];

  return (
    <div className={`w-full max-w-xs border rounded-2xl p-5 space-y-4 transition-all duration-300 ${styles.container}`}>
      
      {/* Indicador de la plantilla activa en la vista previa */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Estilo</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase ${styles.badge}`}>
          {currentTemplate}
        </span>
      </div>

      {/* 1. Vista previa de la Imagen Principal */}
      <div className={`w-full h-44 rounded-xl overflow-hidden flex items-center justify-center border ${styles.imageWrapper}`}>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt="Imagen Principal" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-slate-500 italic">Sin imagen principal</span>
        )}
      </div>

      {/* 2. Título Principal */}
      <div className="space-y-1 text-center">
        <h1 className={`text-base ${styles.title}`}>
          {portfolioData?.title || "Título de tu Portfolio"}
        </h1>
      </div>

      {/* 3. Botones dinámicos basados en los links del Admin Form */}
      {socialLinks.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2.5 py-1">
          {socialLinks.map((linkItem, index) => {
            const iconUrl = getSocialIcon(linkItem.url);
            // Aseguramos que la URL tenga un formato válido con http/https si el usuario no lo escribió
            const formattedUrl = linkItem.url.startsWith("http") ? linkItem.url : `https://${linkItem.url}`;

            return (
              <a
                key={index}
                href={formattedUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={linkItem.url}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 shadow-sm ${styles.socialIconBtn}`}
              >
                <img 
                  src={iconUrl} 
                  alt="Ícono de enlace" 
                  className="w-4 h-4 opacity-80 hover:opacity-100 transition-opacity" 
                  style={{ filter: "invert(1)" }} 
                />
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-1">
          <span className="text-[11px] text-slate-500 italic">No hay redes sociales configuradas</span>
        </div>
      )}

      {/* 4. Descripción dinámica adaptada al template */}
      <div className="text-center">
        <p className={`text-xs leading-relaxed whitespace-pre-wrap ${styles.description}`}>
          {portfolioData?.description || "Escribe una breve bio o descripción para tu portfolio..."}
        </p>
      </div>

    </div>
  );
}