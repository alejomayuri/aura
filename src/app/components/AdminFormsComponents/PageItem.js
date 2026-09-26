import React from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';

export const PageItem = ({
  page,
  pageType,
  pageSlug,
  portfolioSlug,
  absoluteShareUrl,
  isVisibleOnHome,
  isImageType,
  isLayoutOpen,
  isShareOpen,
  isDeleteOpen,
  currentLayout,
  handleTogglePageVisibility,
  setOpenLayoutPageUid,
  setOpenSharePageUid,
  setOpenDeletePageUid,
  handleUpdatePageLayout,
  stablePages,
  portfolioData,
  setPortfolioData,
}) => {
    return (
        <Reorder.Item 
            key={page.uid}
            value={page}
            whileDrag={{
                scale: 1.02,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                zIndex: 50,
            }}
            className="flex flex-col bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-200 overflow-hidden relative select-none"
        >
            <div className="flex relative w-full">
                {/* Ícono de arrastre */}
                <div 
                    className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center text-slate-400 hover:text-purple-700 transition-colors cursor-grab active:cursor-grabbing bg-slate-50/50 border-r border-slate-100" 
                    title="Arrastrar para ordenar"
                >
                    <div className="flex flex-col gap-0.5">
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
                </div>

                {/* Contenido principal */}
                <div className="flex-1 flex flex-col gap-3 pl-12 pr-3.5 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-9 h-9 flex items-center justify-center bg-purple-50 border border-purple-100 rounded-lg shrink-0 pointer-events-none">
                                <svg className="w-4.5 h-4.5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>

                            <div className="truncate">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-slate-900 truncate">{page.title || page.name || "Página sin título"}</h4>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-100 shrink-0">
                                        {pageType}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">/{pageSlug}</p>
                            </div>
                        </div>

                        {/* Switch para alternar visibilidad en Home */}
                        <label className="relative inline-flex items-center cursor-pointer shrink-0" title="Alternar visibilidad en la página principal">
                            <input
                                type="checkbox"
                                checked={isVisibleOnHome}
                                onChange={() => handleTogglePageVisibility(page.uid)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
                        </label>
                    </div>

                    {/* Botones de acción inferior */}
                    <div className="flex items-center justify-start gap-2 pt-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isImageType) {
                                    setOpenLayoutPageUid(isLayoutOpen ? null : page.uid);
                                    setOpenSharePageUid(null);
                                    setOpenDeletePageUid(null);
                                }
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isImageType 
                                ? (isLayoutOpen ? "text-purple-700 bg-purple-100" : "text-slate-500 hover:text-purple-700 hover:bg-purple-50")
                                : "text-slate-300 cursor-not-allowed"
                            }`}
                            title={isImageType ? "Configurar Layout" : "Solo disponible para páginas de tipo image"}
                        >
                            <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenSharePageUid(isShareOpen ? null : page.uid);
                                setOpenLayoutPageUid(null);
                                setOpenDeletePageUid(null);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isShareOpen ? "text-purple-700 bg-purple-100" : "text-slate-500 hover:text-purple-700 hover:bg-purple-50"
                            }`}
                            title="Compartir página"
                        >
                            <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDeletePageUid(isDeleteOpen ? null : page.uid);
                                setOpenSharePageUid(null);
                                setOpenLayoutPageUid(null);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isDeleteOpen ? "text-rose-600 bg-rose-100" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title="Eliminar página"
                        >
                            <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección desplegable: Confirmar eliminación */}
            <AnimatePresence>
                {isDeleteOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-rose-50/50 border-t border-rose-100 px-4 py-3.5 space-y-3"
                    >
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-rose-900 block">¿Estás seguro de eliminar esta página?</span>
                            <p className="text-[11px] text-slate-600">Esta acción no se puede deshacer y el contenido se perderá.</p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={(e) => {
                                e.stopPropagation();
                                setOpenDeletePageUid(null);
                                }}
                                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedPages = stablePages.filter(p => p.uid !== page.uid);
                                    setPortfolioData({ ...portfolioData, pages: updatedPages });
                                    setOpenDeletePageUid(null);
                                }}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm cursor-pointer flex items-center gap-1.5"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sección desplegable: Compartir */}
            <AnimatePresence>
                {isShareOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-purple-50/50 border-t border-purple-100 px-4 py-3.5 space-y-3"
                        >
                            <span className="text-xs font-semibold text-slate-700 block">Comparte el contenido de la página con este link</span>

                            <div className="flex items-center justify-between gap-2 bg-white border border-purple-100 rounded-xl px-3.5 py-2.5 shadow-sm">
                                <span className="text-sm font-medium select-all truncate">
                                    <span className="text-slate-900">lightjaus.com</span>
                                    <span className="text-slate-600">/{portfolioSlug}/{pageSlug}</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(`https://lightjaus.com/${portfolioSlug}/${pageSlug}`);
                                    }}
                                    className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
                                >
                                    <svg className="w-3.5 h-3.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copiar
                                </button>
                            </div>

                            <div className="space-y-2 pt-1">
                                <span className="text-xs font-semibold text-purple-900 block">Compartir en redes sociales</span>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {(() => {
                                        const whatsappText = `Mira esta página: ${page.title || ""} ${absoluteShareUrl}`;
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
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mira esta página: ${page.title || ""}`)}&url=${encodeURIComponent(absoluteShareUrl)}`}
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

            {/* Sección desplegable: Selección de layout */}
            <AnimatePresence>
                {isImageType && isLayoutOpen && (
                    <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-purple-50/50 border-t border-purple-100 px-4 py-3.5"
                        >
                        <div className="space-y-2.5">
                            <span className="text-xs font-semibold text-purple-900 block">Seleccionar Layout de Imágenes</span>
                            <div className="grid grid-cols-3 gap-2.5">
                                {/* Opción 1: Fila de 3 imágenes */}
                                <button
                                    type="button"
                                    onClick={() => handleUpdatePageLayout(page.uid, "grid-3")}
                                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                    currentLayout === "grid-3" || !currentLayout
                                        ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                        : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                                    }`}
                                >
                                    <svg className={`w-7 h-7 stroke-2 ${currentLayout === "grid-3" || !currentLayout ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <rect x="3" y="5" width="5" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="9.5" y="5" width="5" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="16" y="5" width="5" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "grid-3" || !currentLayout ? "text-white" : "text-slate-600"}`}>
                                        Fila de 3 imágenes
                                    </span>
                                </button>

                                {/* Opción 2: Imagen grande única */}
                                <button
                                    type="button"
                                    onClick={() => handleUpdatePageLayout(page.uid, "single-large")}
                                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                    currentLayout === "single-large"
                                        ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                        : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                                    }`}
                                >
                                    <svg className={`w-7 h-7 stroke-2 ${currentLayout === "single-large" ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "single-large" ? "text-white" : "text-slate-600"}`}>
                                        Imagen grande única
                                    </span>
                                </button>

                                {/* Opción 3: Galería Mosaico */}
                                <button
                                    type="button"
                                    onClick={() => handleUpdatePageLayout(page.uid, "masonry-grid")}
                                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition cursor-pointer gap-2 ${
                                    currentLayout === "masonry-grid"
                                        ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                                        : "bg-white text-slate-700 border-purple-100 hover:bg-purple-50"
                                    }`}
                                >
                                    <svg className={`w-7 h-7 stroke-2 ${currentLayout === "masonry-grid" ? "text-white" : "text-purple-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <rect x="3" y="3" width="10" height="10" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="14" y="3" width="7" height="6" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="14" y="10.5" width="7" height="10.5" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="3" y="14" width="10" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className={`text-xs font-medium leading-tight text-center ${currentLayout === "masonry-grid" ? "text-white" : "text-slate-600"}`}>
                                        Galería Mosaico
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Reorder.Item>
    );
};