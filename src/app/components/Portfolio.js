"use client";

import { getTemplateStyles } from "@/app/config/themeStyles";
import PortfolioLayout from "@/app/components/PortfolioLayout";
import ImagePageCard from "@/app/components/PortfolioComponents/ImagePageCard";
import LinkPageCard from "@/app/components/PortfolioComponents/LinkPageCard";
import SoundPreview from "@/app/components/PortfolioComponents/SoundPreview"; // Ajusta la ruta según donde lo hayas guardado

export default function Portfolio({ portfolioData, template }) {
  const currentTemplate = template || portfolioData?.template || "minimal";
  const styles = getTemplateStyles(currentTemplate);

  const pages = portfolioData?.pages || [];

  return (
    <PortfolioLayout portfolioData={portfolioData} template={template}>
      {/* Contenedor principal que respeta estrictamente el orden de las páginas */}
      {pages.length > 0 && (
        <div className="space-y-3 pt-3 mt-1 px-6.5">
          {pages.map((page) => {
            if (!page?.showOnHome) return null;

            if (page.type === "link") {
              return (
                <LinkPageCard 
                  key={page.id}
                  home={true}
                  page={page}
                  blockColor={portfolioData?.colors?.secondaryColor}
                  textColor={portfolioData?.colors?.textColor}
                  styles={styles}
                  currentTemplate={currentTemplate}
                />
              );
            }

            if (page.type === "image") {
              return (
                <ImagePageCard 
                  key={page.id}
                  page={page}
                  layout={page.layout}
                  blockColor={portfolioData?.colors?.secondaryColor}
                  textColor={portfolioData?.colors?.textColor}
                  portfolioSlug={portfolioData?.slug}
                  styles={styles}
                  currentTemplate={currentTemplate}
                />
              );
            }

            // Renderizado para páginas tipo AUDIO / SOUND en el home
            if (page.type === "audio" || page.type === "sound") {
              return (
                <div key={page.id} className="space-y-2">
                  <SoundPreview 
                    page={page} 
                    portfolioData={portfolioData}
                    blockColor={portfolioData?.colors?.secondaryColor}
                    textColor={portfolioData?.colors?.textColor}
                    styles={styles}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </PortfolioLayout>
  );
}