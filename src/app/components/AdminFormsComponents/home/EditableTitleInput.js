'use client';
import React from 'react';
import { useState } from 'react';

export default function EditableTitleInput({
  portfolioData,
  setPortfolioData,
  isEditingTitle,
  setIsEditingTitle,
  onSave,
  saving,
  stableLinks,
  stablePages,
}) {

    const [loading, setLoading] = useState(false);

  const handleSaveTitle = async () => {
    setIsEditingTitle(false);
    setLoading(true);
    const updatedData = {
      ...portfolioData,
      socialLinks: stableLinks,
      pages: stablePages,
    };

    if (typeof onSave === "function") {
      await onSave(updatedData);
    }
    setLoading(false);
  };

  const handleAlignChange = async (align) => {
    const newPortfolioData = { ...portfolioData, titleAlign: align };
    setPortfolioData(newPortfolioData);
    if (typeof onSave === "function") {
      await onSave({
        ...newPortfolioData,
        socialLinks: stableLinks,
        pages: stablePages,
      });
    }
  };

  return (
    <div className="space-y-3">
      {isEditingTitle ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={portfolioData?.title || ""}
              onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
              onBlur={(e) => {
                if (!e.currentTarget.parentElement?.parentElement?.contains(e.relatedTarget)) {
                  handleSaveTitle();
                }
              }}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') { 
                  e.preventDefault();
                  handleSaveTitle(); 
                } 
              }}
              className="w-full bg-white border border-slate-900 rounded-xl px-4 py-3 text-lg font-semibold text-slate-900 focus:outline-none shadow-sm"
              placeholder="Ej. Mi Portfolio Profesional"
            />
          </div>

          {/* OPCIONES DE ALINEACIÓN */}
          <div className="flex items-center gap-1.5 pt-1">
            {/* Izquierda */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAlignChange("left")}
              title="Alinear a la izquierda"
              className={`p-2 rounded-lg border transition-all ${
                (portfolioData?.titleAlign || "left") === "left"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
              </svg>
            </button>

            {/* Centro */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAlignChange("center")}
              title="Alinear al centro"
              className={`p-2 rounded-lg border transition-all ${
                portfolioData?.titleAlign === "center"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
              </svg>
            </button>

            {/* Derecha */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAlignChange("right")}
              title="Alinear a la derecha"
              className={`p-2 rounded-lg border transition-all ${
                portfolioData?.titleAlign === "right"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => loading || setIsEditingTitle(true)}
          className="w-full bg-transparent border-none px-0 py-2 text-lg font-semibold text-slate-900 flex items-center justify-start gap-2.5 transition group cursor-pointer w-fit"
        >
          <span className={portfolioData?.title ? "text-slate-900 font-semibold group-hover:underline decoration-slate-900 underline-offset-4 transition-all" : "text-slate-400 italic font-normal text-base group-hover:underline decoration-slate-400 underline-offset-4 transition-all"}>
            {portfolioData?.title || "Sin título principal (Haz clic para editar)"}
          </span>
          {loading ? (
                <svg className="w-5 h-5 animate-spin text-purple-600 shrink-0 ml-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <button
                    type="button"
                    onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                    }}
                    className="text-slate-400 group-hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-0.5 text-xs font-medium shrink-0"
                    title="Editar título"
                >
                    <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar
                </button>
            )}
          
        </div>
      )}
    </div>
  );
}