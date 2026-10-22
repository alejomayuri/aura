"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Portfolio from "@/app/components/Portfolio";
import AdminForm from "@/app/components/AdminForm";
import DesignForm from "@/app/components/DesignForm";
import PagesManager from "@/app/components/PagesManager";
import ImagePageEditor from "@/app/components/ImagePageEditor";
import LinkPageEditor from "@/app/components/LinkPageEditor";
import AudioPageEditor from "@/app/components/AudioPageEditor"; // <--- 1. Importas el nuevo componente
import PagePreview from "@/app/components/PagePreview";
import MyLightjaus from "@/app/components/MyLightjaus";
import { usePortfolioSync } from "@/app/hooks/usePortfolioSync";

export default function AdminDashboard() {
  const {
    user,
    loading,
    checkingAuth,
    saving,
    saveMessage,
    portfolioData,
    setPortfolioData,
    handleSave,
    updatePortfolio,
  } = usePortfolioSync();

  const [activeTab, setActiveTab] = useState("my-lightjaus");
  const [selectedSubPageId, setSelectedSubPageId] = useState(null);

  if (checkingAuth || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Cargando panel...</p>
        </div>
      </div>
    );
  }

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    const foundPage = portfolioData.pages.find(p => p.id === tab || p.slug === tab);
    if (foundPage) {
      setSelectedSubPageId(tab);
    } else if (["main", "pages", "my-lightjaus", "design"].includes(tab)) {
      setSelectedSubPageId(null);
    }
  };

  const selectedPage = portfolioData.pages.find(p => p.id === selectedSubPageId || p.slug === selectedSubPageId);

  return (
    <div className="h-screen bg-white text-slate-900 flex overflow-hidden relative">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ================= 1. MENÚ LATERAL ================= */}
      <Sidebar 
        user={user}
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        portfolioData={portfolioData}
      />

      {/* ================= 2. FORMULARIO O CONTENIDO CENTRAL ================= */}
      <div 
        className={`p-6 overflow-y-auto relative z-10 space-y-6 border-r border-slate-300 transition-all duration-300 ${
          activeTab === "my-lightjaus" 
            ? "flex-1 max-w-full" 
            : "w-[420px] lg:flex-1 shrink-0"
        }`} 
        style={{ backgroundColor: "#fff" }}
      >
        {activeTab === "my-lightjaus" && (
          <MyLightjaus portfolioData={portfolioData} user={user} />
        )}

        {activeTab === "main" && (
          <AdminForm 
            portfolioData={portfolioData} 
            setPortfolioData={setPortfolioData} 
            onSave={handleSave}
            saving={saving}
            onSelectPage={handleSelectTab}
          />
        )}

        {activeTab === "design" && (
          <DesignForm 
            portfolioData={portfolioData} 
            setPortfolioData={setPortfolioData} 
            onSave={handleSave}
            saving={saving}
            saveMessage={saveMessage}
          />
        )}

        {activeTab === "pages" && (
          <PagesManager 
            portfolioData={portfolioData} 
            setPortfolioData={setPortfolioData}
            onSave={handleSave}
            onSelectPage={handleSelectTab}
          />
        )}

        {activeTab !== "design" && selectedPage && selectedPage.type === "image" && (
          <ImagePageEditor 
            portfolioData={portfolioData}
            selectedPageId={selectedSubPageId}
            updatePortfolio={updatePortfolio}
            onSave={handleSave}
          />
        )}

        {activeTab !== "design" && selectedPage && selectedPage.type === "link" && (
          <LinkPageEditor 
            portfolioData={portfolioData}
            selectedPageId={selectedSubPageId}
            updatePortfolio={updatePortfolio}
            onSave={handleSave}
          />
        )}

        {/* --- 2. RENDERIZADO DEL EDITOR DE AUDIO --- */}
        {activeTab !== "design" && selectedPage && selectedPage.type === "audio" && (
          <AudioPageEditor 
            portfolioData={portfolioData}
            selectedPageId={selectedSubPageId}
            updatePortfolio={updatePortfolio}
            onSave={handleSave}
          />
        )}
      </div>

      {/* ================= 3. VISTA PREVIA ================= */}
      {activeTab !== "my-lightjaus" && (
        <section className="w-[680px] bg-slate-50 p-6 pt-20 flex flex-col items-center justify-start overflow-y-auto relative z-10 shrink-0">
          <div className="w-[400px] flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
              {selectedPage ? `Vista Previa: ${selectedPage.title}` : "Vista Previa"}
            </span>
            <span className="text-[11px] text-slate-700 bg-white px-3 py-1 rounded-full border border-purple-100 shadow-sm">Live</span>
          </div>

          <div className="w-[400px] h-[750px] bg-white border-slate-900 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col">
            <div className="hide-scrollbar w-full h-full overflow-y-auto flex flex-col">
              {selectedPage ? (
                <PagePreview page={selectedPage} portfolioData={portfolioData} />
              ) : (
                <Portfolio portfolioData={portfolioData} />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}