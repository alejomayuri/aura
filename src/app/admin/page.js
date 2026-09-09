"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getPortfolioData, savePortfolioData } from "@/lib/db";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Portfolio from "@/app/components/Portfolio";
import AdminForm from "@/app/components/AdminForm";
import DesignForm from "@/app/components/DesignForm";
import PagesManager from "@/app/components/PagesManager";
import ImagePageEditor from "@/app/components/ImagePageEditor";
import LinkPageEditor from "@/app/components/LinkPageEditor";
import PagePreview from "@/app/components/PagePreview";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [activeTab, setActiveTab] = useState("main");
  const [selectedSubPageId, setSelectedSubPageId] = useState(null);
  const router = useRouter();

  const [portfolioData, setPortfolioData] = useState({
    title: "",
    mainImage: "",
    template: "minimal",
    pages: [] 
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
      } else {
        setUser(currentUser);
        const data = await getPortfolioData(currentUser.uid);
        if (data) {
          setPortfolioData((prev) => ({
            ...prev,
            ...data
          }));
        }
        setCheckingAuth(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async (dataToSave = portfolioData) => {
    if (!user) return;
    setSaving(true);
    setSaveMessage("");

    const success = await savePortfolioData(user.uid, dataToSave);
    setSaving(false);

    if (success) {
      setSaveMessage("¡Guardado con éxito!");
      setTimeout(() => setSaveMessage(""), 3000);
    } else {
      setSaveMessage("Error al guardar.");
    }
  };

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
    } else if (tab === "main" || tab === "pages") {
      setSelectedSubPageId(null);
    }
  };

  const selectedPage = portfolioData.pages.find(p => p.id === selectedSubPageId || p.slug === selectedSubPageId);

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden relative">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ================= 1. MENÚ LATERAL ================= */}
      <Sidebar 
        user={user}
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        portfolioData={portfolioData}
      />

      {/* ================= 2. FORMULARIO CONDICIONAL (CENTRO) ================= */}
      <div className="w-[450px] shrink-0 p-6 overflow-y-auto relative z-10 bg-slate-950/40 space-y-6 border-r border-slate-900">
        {activeTab === "main" && (
          <AdminForm 
            portfolioData={portfolioData} 
            setPortfolioData={setPortfolioData} 
            onSave={handleSave}
            saving={saving}
            saveMessage={saveMessage}
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
                user={user}
                onUpdatePages={(newPages) => {
                  setPortfolioData(prev => ({ ...prev, pages: newPages }));
                }} 
            />
        )}

        {activeTab !== "design" && selectedPage && selectedPage.type === "image" && (
            <ImagePageEditor 
                portfolioData={portfolioData}
                selectedPageId={selectedSubPageId}
                onUpdatePortfolio={(updatedPages) => {
                    setPortfolioData(prev => ({ ...prev, pages: updatedPages }));
                }}
            />
        )}

        {activeTab !== "design" && selectedPage && selectedPage.type === "link" && (
            <LinkPageEditor 
                portfolioData={portfolioData}
                selectedPageId={selectedSubPageId}
                onUpdatePortfolio={(updatedPages) => {
                    setPortfolioData(prev => ({ ...prev, pages: updatedPages }));
                }}
            />
        )}
      </div>

      {/* ================= 3. VISTA PREVIA (DERECHA) ================= */}
      <section className="w-[380px] lg:flex-1 bg-slate-950 p-6 flex flex-col items-center justify-start overflow-y-auto relative z-10 shrink-0">
        <div className="w-full flex justify-between items-center mb-4 max-w-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
            {selectedPage ? `Vista Previa: ${selectedPage.title}` : "Vista Previa"}
          </span>
          <span className="text-[11px] text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800/80">Live</span>
        </div>

        {selectedPage ? (
          <PagePreview page={selectedPage} portfolioData={portfolioData} />
        ) : (
          <Portfolio portfolioData={portfolioData} />
        )}
      </section>
    </div>
  );
}