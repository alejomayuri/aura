"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar({ user, activeTab, setActiveTab, portfolioData }) {
  // Extraemos las páginas del portfolio (si existen)
  const pages = portfolioData?.pages || [];

  return (
    <aside className="w-64 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/80 p-6 flex flex-col justify-between z-20 shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-600/25">
            P
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">Portfolio Studio</h1>
            <span className="text-[11px] text-purple-400 font-medium">Firestore Conectado</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {/* Botón 1: Página Principal */}
          <button
            onClick={() => setActiveTab("main")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none ${
              activeTab === "main"
                ? "bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Página Principal
          </button>

          {/* Botón 2: Páginas (Gestión general de contenido / trabajos) */}
          <button
            onClick={() => setActiveTab("pages")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none ${
              activeTab === "pages"
                ? "bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Páginas de Trabajos
          </button>

          {/* SUBSECCIÓN: Páginas creadas por el usuario en tiempo real */}
          <div className="pl-4 pt-1 pb-1 space-y-1 relative">
            {/* Línea conectora visual elegante */}
            <div className="absolute left-6 top-0 bottom-2 w-px bg-slate-800"></div>

            {pages.length > 0 ? (
              pages.map((page) => {
                const tabIdentifier = `${page.id || page.slug}`;
                const isActive = activeTab === tabIdentifier;

                return (
                  <button
                    key={page.id || page.slug}
                    onClick={() => setActiveTab(tabIdentifier)}
                    className={`w-full flex items-center justify-between pl-6 pr-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                      isActive
                        ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      {page.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 uppercase tracking-wider shrink-0 border border-slate-700/50">
                      {page.type}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="pl-6 py-1 text-[11px] text-slate-500 italic">
                No hay páginas creadas aún
              </div>
            )}
          </div>

          {/* Botón 3: Diseño */}
          <button
            onClick={() => setActiveTab("design")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none ${
              activeTab === "design"
                ? "bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Diseño
          </button>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-400 truncate pr-2">{user?.email}</p>
          <button 
            onClick={() => signOut(auth)}
            className="py-1.5 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[11px] font-semibold transition-all focus:outline-none cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}