"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function Sidebar({ user, activeTab, setActiveTab, portfolioData }) {
  // Extraemos las páginas del portfolio (si existen)
  const pages = portfolioData?.pages || [];
  
  // Agrupamos las páginas por su tipo
  const groupedPages = pages.reduce((acc, page) => {
    const type = page.type || "GENERAL";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(page);
    return acc;
  }, {});

  const isMyLightjausActive = activeTab === "my-lightjaus";
  const isMainActive = activeTab === "main";
  const isCreateActive = activeTab === "create-page" || activeTab === "pages";

  return (
    <aside style={{ width: "240px", fontFamily: "'Poppins', sans-serif" }} className="bg-white border-r border-purple-100 p-4 flex flex-col justify-between z-25 shrink-0 text-slate-900 shadow-sm relative font-['Poppins']">
      <div>
        {/* Logo integrado en negro */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="lightjaus Logo" 
              className="h-9 sm:h-11 object-contain brightness-0" 
            />
          </Link>
        </div>

        <nav className="space-y-0.5">
          {/* Opción: Mi Lightjaus */}
          <button
            onClick={() => setActiveTab("my-lightjaus")}
            className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-sm transition-all cursor-pointer ${
              isMyLightjausActive
                ? "text-purple-700 bg-purple-50/75 font-bold"
                : "text-slate-900 font-normal hover:text-black hover:bg-purple-50/75"
            }`}
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Mi Lightjaus
          </button>

          {/* Categoría Padre: Páginas */}
          <div className="space-y-0.5 pt-0.5">
            <button
              onClick={() => setActiveTab("pages")}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-sm font-normal text-slate-900 hover:text-black hover:bg-purple-50/75 focus:outline-none transition-all cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Páginas
              </span>
              <svg className="w-4 h-4 transition-transform duration-200 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Subsección desplegada automáticamente */}
            <div className="pl-3 pt-0.5 pb-0.5 space-y-1 relative">
              {/* Línea conectora visual en tono lila claro */}
              <div className="absolute left-4.5 top-0 bottom-2 w-px bg-purple-100"></div>

              {/* Opción 1: Home */}
              <button
                onClick={() => setActiveTab("main")}
                className={`w-full flex items-center justify-between pl-4 pr-2.5 py-1 rounded-lg text-sm transition-all cursor-pointer ${
                  isMainActive
                    ? "text-purple-700 font-bold bg-purple-50/75"
                    : "text-slate-900 font-normal hover:text-black hover:bg-purple-50/75"
                }`}
              >
                <span className="truncate">
                  Home
                </span>
              </button>

              {/* Páginas agrupadas por tipo */}
              {Object.keys(groupedPages).length > 0 && (
                <div className="space-y-1.5 pt-0.5">
                  {Object.entries(groupedPages).map(([type, typePages]) => (
                    <div key={type} className="space-y-0.5">
                      {/* Subtítulo del grupo / tipo */}
                      <div className="pl-4 text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                        {type}
                      </div>
                      
                      {/* Páginas pertenecientes a este tipo */}
                      <div className="space-y-0.5">
                        {typePages.map((page) => {
                          const tabIdentifier = `${page.id || page.slug}`;
                          const isActive = activeTab === tabIdentifier;

                          return (
                            <button
                              key={page.id || page.slug}
                              onClick={() => setActiveTab(tabIdentifier)}
                              className={`w-full flex items-center justify-between pl-5 pr-2.5 py-1 rounded-lg text-sm transition-all cursor-pointer ${
                                isActive
                                  ? "text-purple-700 font-bold bg-purple-50/75"
                                  : "text-slate-900 font-normal hover:text-black hover:bg-purple-50/75"
                              }`}
                            >
                              <span className="truncate">
                                {page.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Opción: Crear página */}
              <button
                onClick={() => setActiveTab("pages")}
                className={`w-full flex items-center gap-2 pl-4 pr-2.5 py-1 rounded-lg text-sm transition-all cursor-pointer mt-0.5 ${
                  isCreateActive && activeTab === "pages"
                    ? "text-purple-700 font-bold bg-purple-50/75"
                    : "text-slate-900 font-normal hover:text-black hover:bg-purple-50/75"
                }`}
              >
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="truncate">
                  Crear página
                </span>
              </button>
            </div>
          </div>

          {/* Botón de Diseño */}
          <button
            onClick={() => setActiveTab("design")}
            className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${
              activeTab === "design"
                ? "text-purple-700 bg-purple-50/75 font-bold"
                : "text-slate-900 font-normal hover:text-black hover:bg-purple-50/75"
            }`}
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Diseño
          </button>
        </nav>
      </div>

      <div className="pt-2.5 border-t border-purple-100">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-900 truncate pr-2">{user?.email}</p>
          <button 
            onClick={() => signOut(auth)}
            className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all focus:outline-none cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}