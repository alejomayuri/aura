"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/app/components/Sidebar";
import Portfolio from "@/app/components/Portfolio";
import AdminForm from "@/app/components/AdminForm";
import DesignForm from "@/app/components/DesignForm";
import PagesManager from "@/app/components/PagesManager";
import ImagePageEditor from "@/app/components/ImagePageEditor";
import LinkPageEditor from "@/app/components/LinkPageEditor";
import AudioPageEditor from "@/app/components/AudioPageEditor";
import StorePageEditor from "@/app/components/StorePageEditor";
import PagePreview from "@/app/components/PagePreview";
import MyLightjaus from "@/app/components/MyLightjaus";
import Settings from "@/app/components/Settings"; 
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
  const [previewPageId, setPreviewPageId] = useState("home");

  // Estado para el menú desplegable de compartir en la vista previa
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  if (checkingAuth || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src="/logo.png" 
              alt="lightjaus Logo" 
              className="h-14 sm:h-20 object-contain brightness-0" 
            />
          </motion.div>
        </div>
      </div>
    );
  }

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    const foundPage = portfolioData.pages.pages?.find(p => p.id === tab || p.slug === tab) || portfolioData.pages.find(p => p.id === tab || p.slug === tab);
    if (foundPage) {
      setSelectedSubPageId(tab);
      setPreviewPageId(foundPage.id);
    } else if (["main", "pages", "my-lightjaus", "design"].includes(tab)) {
      setSelectedSubPageId(null);
      setPreviewPageId("home");
    }
  };

  const selectedPage = portfolioData.pages?.find(
    p => p.id === selectedSubPageId || p.slug === selectedSubPageId
  );

  const previewPage = previewPageId === "home" 
    ? null 
    : portfolioData.pages?.find(p => p.id === previewPageId || p.slug === previewPageId);

  // Variables para la URL de compartir basadas en la vista actual (Home o Subpágina)
  const portfolioSlug = portfolioData?.slug || "";
  const pageSlug = previewPage?.slug || previewPage?.id || "";
  const absoluteShareUrl = previewPage 
    ? `https://lightjaus.com/${portfolioSlug}/${pageSlug}`
    : `https://lightjaus.com/${portfolioSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(absoluteShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {activeTab === "settings" && (
          <Settings user={user} portfolioData={portfolioData} setPortfolioData={setPortfolioData} />
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

        {activeTab !== "design" && activeTab !== "settings" && selectedPage && selectedPage.type === "image" && (
          <ImagePageEditor 
            portfolioData={portfolioData}
            selectedPageId={selectedSubPageId}
            updatePortfolio={updatePortfolio}
            onSave={handleSave}
          />
        )}

        {activeTab !== "design" && activeTab !== "settings" && selectedPage && selectedPage.type === "link" && (
          <LinkPageEditor 
            portfolioData={portfolioData}
            selectedPageId={selectedSubPageId}
            updatePortfolio={updatePortfolio}
            onSave={handleSave}
          />
        )}

        {activeTab !== "design" && activeTab !== "settings" && selectedPage && selectedPage.type === "audio" && (
          <AudioPageEditor 
            portfolioData={portfolioData}
            selectedPageId={selectedSubPageId}
            updatePortfolio={updatePortfolio}
            onSave={handleSave}
          />
        )}

        {activeTab !== "design" && activeTab !== "settings" && selectedPage && selectedPage.type === "store" && (
          <StorePageEditor 
            portfolioData={portfolioData}
            selectedPageId={selectedSubPageId}
            updatePortfolio={updatePortfolio}
            onSave={handleSave}
          />
        )}
      </div>

      {/* ================= 3. VISTA PREVIA ================= */}
      {(activeTab !== "my-lightjaus" && activeTab !== "settings") && (
        <section className="w-[680px] bg-slate-50 p-6 pt-20 flex flex-col items-center justify-start overflow-y-auto relative z-10 shrink-0">
          <div className="w-[400px] relative mb-4">
            <div className="flex justify-between items-center gap-3">
              {/* Selector de páginas con mejor diseño y padding */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-sm flex-1 hover:border-slate-300 transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div className="relative flex items-center w-full">
                  <select
                    value={previewPage ? previewPage.id : "home"}
                    onChange={(e) => setPreviewPageId(e.target.value)}
                    aria-label="Seleccionar página para vista previa"
                    className="appearance-none bg-transparent text-[11px] font-bold uppercase tracking-wider text-slate-800 pr-6 focus:outline-none cursor-pointer truncate w-full"
                  >
                    <option value="home">Home (Principal)</option>
                    {portfolioData?.pages?.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title || "Sin título"}
                      </option>
                    ))}
                  </select>
                  <svg 
                    className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* BOTÓN MITAD Y MITAD (VISITAR / COMPARTIR) */}
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden shrink-0">
                
                {/* Primera mitad: Visitar Portfolio */}
                <a
                  href={absoluteShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Visitar portfolio"
                  className="px-3.5 py-2.5 text-slate-700 hover:text-black hover:bg-slate-50 transition-all border-r border-slate-200/80 flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* Segunda mitad: Botón Compartir que despliega el box flotante */}
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  title="Compartir"
                  className="px-3.5 py-2.5 text-slate-700 hover:text-black hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* DESPLEGABLE FLOTANTE SOBRE EL PREVIEW */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white border border-purple-100 rounded-2xl p-4 space-y-3 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-semibold text-slate-700">
                      {previewPage ? "Compartir página" : "Compartir portfolio"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowShareMenu(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Cerrar"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 bg-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 shadow-sm">
                    <span className="text-xs font-medium select-all truncate">
                      <span className="text-slate-900">lightjaus.com</span>
                      <span className="text-slate-600">/{portfolioSlug}{previewPage ? `/${pageSlug}` : ""}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink();
                      }}
                      className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      {copied ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-purple-900 block">Compartir en redes sociales</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(() => {
                        const shareTitle = previewPage ? (previewPage.title || "") : (portfolioData?.title || "Mi Portfolio");
                        const whatsappText = `Mira este contenido: ${shareTitle} ${absoluteShareUrl}`;
                        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
                        
                        return (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                          >
                            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            <span>WhatsApp</span>
                          </a>
                        );
                      })()}

                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteShareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.588 9 4.7V8z"/></svg>
                        <span>Facebook</span>
                      </a>
                      <a
                        href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(absoluteShareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(absoluteShareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 4.979 0 11.111c0 3.497 1.745 6.616 4.472 8.654V24l4.08-2.242c1.093.303 2.248.464 3.448.464 6.627 0 12-4.979 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.56-6.963 3.13 3.26 5.888-3.26-6.56 6.963z"/></svg>
                        <span>Messenger</span>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mira este contenido`)}&url=${encodeURIComponent(absoluteShareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        <span>X</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteShareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col items-center justify-center gap-1.5 bg-transparent text-slate-700 hover:bg-purple-50 hover:text-purple-700 px-2 py-2.5 rounded-xl text-[11px] font-medium transition"
                      >
                        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-[400px] h-[750px] bg-white border-slate-900 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col">
            <div className="hide-scrollbar w-full h-full overflow-y-auto flex flex-col">
              {previewPage ? (
                <PagePreview page={previewPage} portfolioData={portfolioData} />
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