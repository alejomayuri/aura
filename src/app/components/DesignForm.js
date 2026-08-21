"use client";

export default function DesignForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage }) {
  // Opciones completas de plantillas (incluyendo las nuevas locuras experimentales)
  const templates = [
    {
      id: "minimal",
      name: "Minimalista",
      description: "Diseño limpio, tipografía moderna y espacios amplios.",
      previewColor: "bg-slate-900 border-slate-700"
    },
    {
      id: "neon",
      name: "Neón / Cyberpunk",
      description: "Ideal para creativos con contrastes oscuros y acentos vibrantes.",
      previewColor: "bg-purple-950 border-purple-500/50 shadow-purple-500/20"
    },
    {
      id: "classic",
      name: "Clásico Profesional",
      description: "Estructura tradicional enfocada 100% en conversión y lectura.",
      previewColor: "bg-zinc-900 border-zinc-700"
    },
    {
      id: "brutal",
      name: "Brutalism",
      description: "Diseño crudo, tipografías pesadas y contrastes directos estilo retro-web.",
      previewColor: "bg-yellow-400 border-black"
    },
    {
      id: "glass",
      name: "Glassmorphism",
      description: "Efecto de cristal esmerilado translúcido con desenfoques modernos.",
      previewColor: "bg-white/30 backdrop-blur-md border-white/50"
    },
    {
      id: "terminal",
      name: "Terminal de Comandos",
      description: "Estilo consola de código puro con tipografía monoespaciada verde.",
      previewColor: "bg-black border-green-500/50"
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk Tech",
      description: "Estética futurista oscura con acentos cian y rosados eléctricos.",
      previewColor: "bg-slate-950 border-cyan-500"
    },
    {
      id: "aurora",
      name: "Aurora Boreal",
      description: "Tonos verde agua / teal fluidos, modernos y sumamente elegantes.",
      previewColor: "bg-slate-900 border-teal-500/40"
    },
    {
      id: "retro",
      name: "Retro 8-Bit",
      description: "Consola antigua cálida con bloques marcados en tonos ámbar.",
      previewColor: "bg-amber-950 border-amber-600"
    },
    {
      id: "luxury",
      name: "Luxury Gold",
      description: "Elegancia minimalista oscura con detalles y tipografías en oro fino.",
      previewColor: "bg-neutral-950 border-amber-500/60"
    },
    // ================= NUEVOS TEMAS LOCOS Y EXTREMOS =================
    {
      id: "y2k",
      name: "Y2K",
      description: "Fucsia eléctrico, verde lima, bordes duros y vibración milenaria.",
      previewColor: "bg-fuchsia-600 border-lime-300"
    },
    {
      id: "holographic",
      name: "Holográfico Tornasol",
      description: "Gradientes tornasol, brillos translúcidos y bordes ultra redondeados.",
      previewColor: "bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 border-white/80"
    },
    {
      id: "comic",
      name: "Comic / Pop-Art",
      description: "Estilo historieta con bordes negros marcados y sombras duras.",
      previewColor: "bg-yellow-200 border-black"
    },
    {
      id: "zine",
      name: "Zine / Papel Rasgado",
      description: "Estética fanzine monocromática, punk analógico y texturas raw.",
      previewColor: "bg-zinc-100 border-zinc-900"
    },
    {
      id: "cyberpunk_tech",
      name: "Cyberpunk Tech",
      description: "Estética futurista oscura con acentos cian y rosados eléctricos.",
      previewColor: "bg-slate-950 border-cyan-500"
    },
    {
      id: "y2k_retro",
      name: "Y2K Retro-Futurista",
      description: "Fucsia eléctrico, verde lima, bordes duros y vibración milenaria.",
      previewColor: "bg-fuchsia-600 border-lime-300"
    },
    {
      id: "brutalist",
      name: "Brutalist",
      description: "Estética minimalista con elementos rústicos y formas geométricas.",
      previewColor: "bg-lime-300 border-black"
    },
    {
      id:"zen",
      name: "Zen",
      description: "Estética minimalista con elementos rústicos y formas geométricas.",
      previewColor: "bg-lime-300 border-black"
    }
  ];

  const handleSelectTemplate = (templateId) => {
    setPortfolioData((prev) => ({
      ...prev,
      template: templateId,
    }));
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Configurar template del portfolio</h2>
          <p className="text-xs text-slate-400 mt-1">Selecciona la apariencia visual que tendrá tu página pública.</p>
        </div>
        {saveMessage && (
          <span className={`text-xs px-3 py-1 rounded-lg font-medium border ${
            saveMessage.includes("exito") || saveMessage.includes("éxito") 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}>
            {saveMessage}
          </span>
        )}
      </div>

      {/* Lista de Plantillas */}
      <div className="grid grid-cols-1 gap-4 max-h-[420px] overflow-y-auto pr-1">
        {templates.map((t) => {
          const isSelected = portfolioData.template === t.id || (!portfolioData.template && t.id === "minimal");
          
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTemplate(t.id)}
              className={`cursor-pointer border rounded-xl p-4 transition-all flex items-center justify-between ${
                isSelected 
                  ? "bg-purple-600/10 border-purple-500 text-white shadow-lg shadow-purple-500/10" 
                  : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{t.name}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full font-medium">Activa</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{t.description}</p>
              </div>

              {/* Indicador visual en miniatura */}
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ml-3 ${t.previewColor}`}>
                <div className={`w-4 h-4 rounded-full ${isSelected ? "bg-purple-400" : "bg-slate-700"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón de Guardar limpio */}
      <button
        onClick={() => {
          if (typeof onSave === "function") {
            onSave();
          }
        }}
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-xs transition focus:outline-none shadow-lg shadow-purple-600/25"
      >
        {saving ? "Guardando..." : "Guardar Cambios en Firestore"}
      </button>
    </div>
  );
}