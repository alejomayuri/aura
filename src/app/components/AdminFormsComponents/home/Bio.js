import React from 'react';

export const Bio = ({ portfolioData, setPortfolioData, setIsEditingBio }) => {
  return (
    <div className="space-y-3">
      <textarea
        rows="3"
        autoFocus
        value={portfolioData?.description || ""}
        onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
        onBlur={() => setIsEditingBio(false)}
        className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 resize-none shadow-sm text-left"
        placeholder="Escribe una breve bio o descripción para tu portfolio..."
      />
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setPortfolioData({ ...portfolioData, bioAlign: "left" })}
          className={`p-2 rounded-xl border transition ${
            (!portfolioData?.bioAlign || portfolioData?.bioAlign === "left")
              ? "bg-purple-700 text-white border-purple-700 shadow-sm"
              : "bg-white text-slate-600 border-purple-100 hover:bg-purple-50"
          }`}
          title="Alinear a la izquierda"
        >
          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setPortfolioData({ ...portfolioData, bioAlign: "center" })}
          className={`p-2 rounded-xl border transition ${
            portfolioData?.bioAlign === "center"
              ? "bg-purple-700 text-white border-purple-700 shadow-sm"
              : "bg-white text-slate-600 border-purple-100 hover:bg-purple-50"
          }`}
          title="Alinear al centro"
        >
          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M5 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setPortfolioData({ ...portfolioData, bioAlign: "right" })}
          className={`p-2 rounded-xl border transition ${
            portfolioData?.bioAlign === "right"
              ? "bg-purple-700 text-white border-purple-700 shadow-sm"
              : "bg-white text-slate-600 border-purple-100 hover:bg-purple-50"
          }`}
          title="Alinear a la derecha"
        >
          <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M10 12h10M6 18h14" />
          </svg>
        </button>
      </div>
    </div>
  );
};