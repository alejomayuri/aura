"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import { PageItem } from "./PageItem";

export default function PagesList({
  pages = [],
  portfolioData,
  setPortfolioData,
  onSave,
  onSelectPage,
  onReorderPages,
  emptyMessage = "No hay páginas creadas todavía.",
}) {
  const [openLayoutPageUid, setOpenLayoutPageUid] = useState(null);
  const [openSharePageUid, setOpenSharePageUid] = useState(null);
  const [openDeletePageUid, setOpenDeletePageUid] = useState(null);

  const portfolioSlug = portfolioData?.slug || portfolioData?.username || "tu-usuario";

  return (
    <div className="space-y-3 pt-1 pb-4">
      {pages.length > 0 ? (
        <Reorder.Group 
          axis="y" 
          values={pages} 
          onReorder={onReorderPages}
          className="space-y-2.5 list-none"
        >
          {pages.map((page) => {
            const pageUid = page.uid || page.id;
            const isVisibleOnHome = page.showOnHome !== false; 
            const pageType = page.type || page.template || "Página";
            const isImageType = pageType.toLowerCase() === "image" || pageType.toLowerCase() === "imagen";
            const isLinkType = pageType.toLowerCase() === "link"
            const isAudioType = pageType.toLowerCase() === "audio"
            const isStoreType = pageType.toLowerCase() === "store"
            const pageSlug = page.slug || page.path || "";
            const absoluteShareUrl = typeof window !== "undefined" 
              ? `${window.location.origin}/${portfolioSlug}/${pageSlug}` 
              : `/${portfolioSlug}/${pageSlug}`;

            // Control de visibilidad compartido
            const handleTogglePageVisibility = async (uid) => {
              const updatedPages = pages.map((p) => {
                if ((p.uid || p.id) === uid) {
                  return { ...p, showOnHome: p.showOnHome === false ? true : false };
                }
                return p;
              });

              const updatedData = { ...portfolioData, pages: updatedPages };
              setPortfolioData(updatedData);
              if (typeof onSave === "function") {
                await onSave(updatedData);
              }
            };

            // Control de layout compartido
            const handleUpdatePageLayout = async (uid, layoutType) => {
              const updatedPages = pages.map((p) => {
                if ((p.uid || p.id) === uid) {
                  return { ...p, layout: layoutType };
                }
                return p;
              });

              const updatedData = { ...portfolioData, pages: updatedPages };
              setPortfolioData(updatedData);
              if (typeof onSave === "function") {
                await onSave(updatedData);
              }
            };

            return (
              <PageItem
                key={pageUid}
                page={page}
                pageType={pageType}
                pageSlug={pageSlug}
                portfolioSlug={portfolioSlug}
                absoluteShareUrl={absoluteShareUrl}
                isVisibleOnHome={isVisibleOnHome}
                isImageType={isImageType}
                isLinkType={isLinkType}
                isAudioType={isAudioType}
                isStoreType={isStoreType}
                isLayoutOpen={openLayoutPageUid === pageUid}
                isShareOpen={openSharePageUid === pageUid}
                isDeleteOpen={openDeletePageUid === pageUid}
                currentLayout={page.layout || "grid-3"}
                
                handleTogglePageVisibility={handleTogglePageVisibility}
                setOpenLayoutPageUid={setOpenLayoutPageUid}
                setOpenSharePageUid={setOpenSharePageUid}
                setOpenDeletePageUid={setOpenDeletePageUid}
                handleUpdatePageLayout={handleUpdatePageLayout}
                
                stablePages={pages}
                portfolioData={portfolioData}
                setPortfolioData={(newData) => {
                  if (newData && newData.pages) {
                    const updatedData = { ...portfolioData, pages: newData.pages };
                    setPortfolioData(updatedData);
                    if (typeof onSave === "function") {
                      onSave(updatedData);
                    }
                  }
                }}
                onSelectPage={onSelectPage}
              />
            );
          })}
        </Reorder.Group>
      ) : (
        <p className="text-xs text-slate-500 italic text-center py-4">{emptyMessage}</p>
      )}
    </div>
  );
}