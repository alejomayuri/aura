// components/Title.jsx
export default function Title({ 
  title = "Página Principal", 
  externalRoute, 
  openInNewTab = false 
}) {
  const handleButtonClick = () => {
    if (openInNewTab && externalRoute) {
      window.open(externalRoute, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h2>
        {externalRoute && (
          <button
            type="button"
            onClick={handleButtonClick}
            className="p-1.5 text-slate-500 hover:text-black rounded-lg transition-colors cursor-pointer"
            title="Ocultar formulario, ver preview o abrir ruta"
          >
            <svg className="w-5 h-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}