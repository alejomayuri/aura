"use client";

import { useState, useEffect, useRef } from "react";
import Title from "./AdminFormsComponents/Title";
import PagesList from "./AdminFormsComponents/PagesList";
import { contentTypes } from "@/app/config/contentTypes";

export default function PagesManager({ portfolioData, setPortfolioData, onSave, onSelectPage }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pageType, setPageType] = useState("image");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const localPages = portfolioData?.pages || [];

  // Manejo de clics fuera del formulario
  useEffect(() => {
    function handleClickOutside(event) {
      if (showForm && formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");  

    setSlug(generatedSlug);
  };

  // Sincronización optimizada utilizando la función global onSave
  const syncAndSave = async (updatedPages, successMessage = null) => {
    try {
      const updatedData = { ...portfolioData, pages: updatedPages };
      setPortfolioData(updatedData);

      if (typeof onSave === "function") {
        await onSave(updatedData);
      }

      if (successMessage) {
        setSuccessMsg(successMessage);
      }
    } catch (err) {
      console.error("Error al actualizar páginas:", err);
      setError(`Error al guardar: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Por favor completa el título y el slug.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const newPage = {
      uid: Date.now().toString(),
      id: Date.now().toString(),
      title: title.trim(),
      slug: slug.trim(),
      type: pageType,
      showOnHome: true,
      layout: "row",
      items: [],
      createdAt: new Date().toISOString()
    };

    const updatedPages = [...localPages, newPage];
    await syncAndSave(updatedPages, "¡Página creada y guardada con éxito!");

    setLoading(false);
    setTitle("");
    setSlug("");
    setPageType("image");
    setShowForm(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']">
      <Title title="Crear Página" />

      {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}
      {successMsg && <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">{successMsg}</p>}

      <div ref={formRef} className="space-y-3">
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            <span>+ Crear página</span>
          </button>
        )}

        <div className={`grid transition-all duration-300 ease-in-out ${showForm ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
          <div className="overflow-hidden space-y-2">
            <form onSubmit={handleSubmit} className="bg-white border border-slate-300 p-5 rounded-xl space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Nombre</label>
                <input 
                  type="text"
                  required
                  placeholder="Nombre de la página"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Contenido</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {contentTypes.map((type) => {
                    const isSelected = pageType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPageType(type.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-100 border-black shadow-sm ring-1 ring-black"
                            : "bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-black text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
                          {type.icon}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-900">{type.title}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{type.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:bg-black disabled:text-white rounded-xl text-sm font-medium shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  {loading ? "Guardando..." : "Crear página"}
                </button>
              </div>
            </form>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 pb-4">
        <PagesList 
          pages={localPages}
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          onSave={onSave}
          onSelectPage={onSelectPage}
          onReorderPages={async (newPages) => {
            // Se llama a syncAndSave para actualizar el estado y guardarlo en la base de datos
            await syncAndSave(newPages);
          }}
          emptyMessage="No hay páginas guardadas en la base de datos todavía."
        />
      </div>
    </div>
  );
}