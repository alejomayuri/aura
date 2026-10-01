'use client';
import React from 'react';
import { useState } from 'react';

export const Bio = ({ portfolioData, setPortfolioData, isEditingBio, setIsEditingBio, onSave, saving, 
  stableLinks, stablePages, }) => {

  const [loading, setLoading] = useState(false);

  const handleSaveBio = async () => {
    setIsEditingBio(false);
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
    const newPortfolioData = { ...portfolioData, bioAlign: align };
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
    <div className="mt-3">
      {isEditingBio ? (
        <>
          <textarea
            rows="3"
            autoFocus
            value={portfolioData?.description || ""}
            onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
            onBlur={(e) => {
              if (!e.currentTarget.parentElement?.parentElement?.contains(e.relatedTarget)) {
                handleSaveBio();
              }
            }}
            onKeyDown={(e) => { 
              if (e.key === 'Enter') { 
                e.preventDefault();
                handleSaveBio(); 
              } 
            }}
            className="w-full bg-white border border-purple-100 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black resize-none shadow-sm text-left"
            placeholder="Escribe una breve bio o descripción para tu portfolio..."
          />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAlignChange("left")}
              title="Alinear a la izquierda"
              className={`p-2 rounded-lg border transition-all ${
                (!portfolioData?.bioAlign || portfolioData?.bioAlign === "left")
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAlignChange("center")}
              className={`p-2 rounded-lg border transition-all ${
                portfolioData?.bioAlign === "center"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
              title="Alinear al centro"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
              </svg>
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAlignChange("right")}
              className={`p-2 rounded-lg border transition-all ${
                portfolioData?.bioAlign === "right"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
              title="Alinear a la derecha"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
              </svg>
            </button>
          </div>
        </>) : (
        <div
          onClick={() => loading || setIsEditingBio(true)}
          className="w-full px-1 py-1 text-sm text-slate-900 cursor-pointer transition hover:underline decoration-slate-900 underline-offset-4"
        >
          {portfolioData?.description || (
            <span className="text-slate-400 italic">Escribe una breve bio o descripción para tu portfolio...</span>
          )}
        </div>
      )}
      {
        loading && (
          <svg className="w-5 h-5 animate-spin text-purple-600 shrink-0 ml-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
        )
      }
    </div>
  );
};