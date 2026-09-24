"use client";

import { Check, Sparkles, Layout } from "lucide-react";

export default function DesignForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage }) {
  // Opciones completas de plantillas
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
      previewColor: "bg-purple-950 border-purple-500/50"
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
      previewColor: "bg-slate-200 border-slate-300"
    },
    {
      id: "terminal",
      name: "Terminal de Comandos",
      description: "Estilo consola de código puro con tipografía monoespaciada verde.",
      previewColor: "bg-black border-green-500"
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
      previewColor: "bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 border-white"
    },
    {
      id: "comic",
      name: "Comic / Pop-Art",
      description: "Est estilo historieta con bordes negros marcados y sombras duras.",
      previewColor: "bg-yellow-200 border-black"
    },
    {
      id: "zine",
      name: "Zine / Papel Rasgado",
      description: "Estética fanzine monocromática, punk analógico y texturas raw.",
      previewColor: "bg-zinc-100 border-zinc-900"
    },
    {
      id: "zen",
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 font-['Poppins'] max-w-4xl mx-auto">
      {/* Cabecera del formulario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Configurar plantilla del portafolio</h2>
            <p className="text-xs text-slate-500 mt-0.5">Selecciona la apariencia visual que tendrá tu página pública.</p>
          </div>
        </div>

        {saveMessage && (
          <span className={`text-xs px-3 py-1.5 rounded-xl font-medium border ${
            saveMessage.includes("exito") || saveMessage.includes("éxito") 
              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}>
            {saveMessage}
          </span>
        )}
      </div>

      {/* Lista de Plantillas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
        {templates.map((t) => {
          const isSelected = portfolioData.template === t.id || (!portfolioData.template && t.id === "minimal");
          
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTemplate(t.id)}
              className={`cursor-pointer border rounded-2xl p-4 transition-all flex items-center justify-between ${
                isSelected 
                  ? "bg-purple-50/60 border-purple-500 shadow-sm shadow-purple-500/5" 
                  : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">{t.name}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Activa
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
              </div>

              {/* Indicador visual en miniatura */}
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${t.previewColor}`}>
                <div className={`w-3.5 h-3.5 rounded-full ${isSelected ? "bg-purple-600 ring-4 ring-purple-200" : "bg-slate-300"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón de Guardar */}
      <button
        onClick={() => {
          if (typeof onSave === "function") {
            onSave();
          }
        }}
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-xs transition shadow-md shadow-purple-600/20 focus:outline-none flex items-center justify-center gap-2"
      >
        {saving ? (
          "Guardando cambios..."
        ) : (
          <>
            <Check className="w-4 h-4" /> Guardar Cambios en Firestore
          </>
        )}
      </button>
    </div>
  );
}