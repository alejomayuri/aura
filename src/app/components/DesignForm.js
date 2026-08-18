"use client";

export default function DesignForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage }) {
  // Opciones de plantillas de ejemplo
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
      <div className="grid grid-cols-1 gap-4">
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
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${t.previewColor}`}>
                <div className={`w-4 h-4 rounded-full ${isSelected ? "bg-purple-400" : "bg-slate-700"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón de Guardar limpio (Sin pasarle parámetros de eventos) */}
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