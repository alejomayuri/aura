"use client";

import { ArrowUpRight } from "lucide-react";

const DEFAULT_UPDATES = [
    {
    id: "smart-colors",
    badge: "Nueva Función",
    badgeColor: "text-purple-600",
    timeLabel: "Hace 2 días",
    title: "Personalización de Colores Inteligentes",
    description:
      "Ahora los fondos adaptativos detectan la paleta de tu marca con mayor precisión.",
  },
  {
    id: "specialized-pages",
    badge: "Nueva Función",
    badgeColor: "text-purple-600",
    timeLabel: "Reciente",
    title: "Páginas especializadas",
    description:
      "Ahora puedes añadir páginas especializadas a tu Lightjaus para organizar mejor tu contenido y destacar distintas secciones.",
  },
  {
    id: "store-pages",
    badge: "Nueva Función",
    badgeColor: "text-purple-600",
    timeLabel: "Reciente",
    title: "Páginas tipo tienda",
    description:
      "Se han incorporado las páginas tipo tienda para mostrar tus productos, precios y ofertas directamente en tu portafolio.",
  },
  {
    id: "forest-template",
    badge: "Nueva Plantilla",
    badgeColor: "text-emerald-600",
    timeLabel: "Reciente",
    title: "Nueva plantilla Forest",
    description:
      "Ya está disponible la plantilla Forest con un estilo natural y renovado para darle una nueva identidad visual a tu página.",
  },
];

export default function UpdatesAndTips({
  items = DEFAULT_UPDATES,
  onViewAllNotes,
}) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 flex flex-col justify-between space-y-5">
      <h3 className="text-lg font-semibold text-slate-900">
        Actualizaciones
      </h3>

      <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  item.badgeColor || "text-purple-600"
                }`}
              >
                {item.badge}
              </span>
              <span className="text-[10px] text-slate-400">
                {item.timeLabel}
              </span>
            </div>
            <h5 className="text-xs font-bold text-slate-900">
              {item.title}
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={onViewAllNotes}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Ver todas las notas de versión <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}