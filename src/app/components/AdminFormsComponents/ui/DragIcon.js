import React from "react";

/**
 * Componente de ícono de agarre para listas e ítems arrastrables (Drag & Drop).
 *
 * @param {Object} props
 * @param {string} [props.className=""] - Clases CSS adicionales para personalizar estilos o márgenes.
 * @param {string} [props.title="Arrastrar para ordenar"] - Texto descriptivo para el tooltip.
 */
export const DragIcon = ({ className = "", title = "Arrastrar para ordenar", ...props }) => {
  return (
    <div
      className={`text-slate-600 flex flex-col gap-0.5 justify-center shrink-0 px-1 transition-colors cursor-grab active:cursor-grabbing select-none ${className}`}
      title={title}
      {...props}
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-0.5">
          <span className="w-0.5 h-0.5 bg-current rounded-full" />
          <span className="w-0.5 h-0.5 bg-current rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default DragIcon;