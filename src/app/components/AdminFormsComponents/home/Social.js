// components/Social.jsx
import { Reorder } from "framer-motion";

export default function Social({
  linkItem,
  iconUrl,
  stableLinks,
  portfolioData,
  setPortfolioData,
  isConfirmingDelete,
  setDeleteConfirmUid,
  handleRemoveLink,
}) {
  return (
    <Reorder.Item
      key={linkItem.uid}
      value={linkItem}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        zIndex: 50,
      }}
      className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-3 shadow-sm border border-purple-100 hover:border-purple-200 cursor-grab active:cursor-grabbing relative select-none"
    >
      {/* Indicador de arrastre */}
      <div 
        className="text-slate-600 hover:text-purple-700 flex flex-col gap-0.5 justify-center shrink-0 px-1 transition-colors cursor-grab active:cursor-grabbing" 
        title="Arrastrar para ordenar"
      >
        <div className="flex gap-0.5">
          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
        </div>
        <div className="flex gap-0.5">
          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
        </div>
        <div className="flex gap-0.5">
          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
          <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
        </div>
      </div>

      {/* Ícono de la red social */}
      <div className="w-9 h-9 flex items-center justify-center bg-purple-50 border border-purple-100 rounded-lg shrink-0 pointer-events-none">
        <img src={iconUrl} alt="Ícono red social" className="w-4.5 h-4.5 text-slate-900" />
      </div>
      
      {/* Input de la URL */}
      <input
        type="text"
        value={linkItem.url}
        onChange={(e) => {
          const updatedLinks = stableLinks.map(l => 
            l.uid === linkItem.uid ? { ...l, url: e.target.value } : l
          );
          setPortfolioData({ ...portfolioData, socialLinks: updatedLinks });
        }}
        className="w-full bg-transparent border-none text-sm text-slate-900 focus:outline-none"
      />

      {/* Switch para activar/desactivar */}
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={linkItem.enabled ?? true}
          onChange={(e) => {
            const updatedLinks = stableLinks.map(l => 
              l.uid === linkItem.uid ? { ...l, enabled: e.target.checked } : l
            );
            setPortfolioData({ ...portfolioData, socialLinks: updatedLinks });
          }}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
      </label>

      {/* Confirmación integrada en pantalla para eliminar */}
      {isConfirmingDelete ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              handleRemoveLink(linkItem.uid);
              setDeleteConfirmUid(null);
            }}
            className="bg-black hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
          >
            Remover
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirmUid(null)}
            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-900 text-xs px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setDeleteConfirmUid(linkItem.uid)}
          className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer shrink-0"
          title="Eliminar link"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </Reorder.Item>
  );
}