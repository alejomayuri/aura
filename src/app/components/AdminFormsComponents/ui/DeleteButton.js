import React from 'react';

/**
 * Componente de botón con ícono de papelera/tacho para alternar o activar la eliminación de un elemento.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Indica si el panel de confirmación está abierto para cambiar el color del botón.
 * @param {Function} props.onClick - Handler a ejecutar al hacer clic.
 * @param {string} [props.className=""] - Clases CSS adicionales opcionales.
 */
export const DeleteButton = ({ isOpen = false, onClick, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`transition-all cursor-pointer flex items-center justify-center ${
        isOpen ? "text-rose-600" : "text-slate-500 hover:text-rose-600"
      } ${className}`}
    >
      <svg
        className="w-4 h-4 stroke-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
};

export default DeleteButton;