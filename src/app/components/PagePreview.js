"use client";

import { getTemplateStyles } from "@/app/config/themeStyles";
import PortfolioLayout from "@/app/components/PortfolioLayout";
import ImageGalleryView from "@/app/components/PortfolioComponents/ImageGalleryView";
import LinkPageCard from "./PortfolioComponents/LinkPageCard";
import SoundPreview from "./PortfolioComponents/SoundPreview";
import StorePreview from "./PortfolioComponents/StorePreview"; // <-- Importamos tu componente StorePreview

export default function PagePreview({ page, portfolioData }) {
  const currentTemplate = portfolioData?.template || "minimal";

  const styles = getTemplateStyles(currentTemplate);

  return (
    <PortfolioLayout portfolioData={portfolioData} template={currentTemplate}>

      {/* ================= TÍTULO Y CONTENIDO ESPECÍFICO DE ESTA PÁGINA ================= */}
      <div className="my-4 px-6.5">
        <h2 className={`text-lg ${styles.pageTitle}`}
          style={{color: portfolioData?.colors?.titleColor}}
        >{page.title}</h2>
      </div>

      {page.type === "link" && (
        <div className="space-y-3 px-6.5">
          {page.items && page.items.length > 0 ? (
            <LinkPageCard 
                key={page.id}
                page={page}
                blockColor={portfolioData?.colors?.secondaryColor}
                textColor={portfolioData?.colors?.textColor}
                styles={styles}
                currentTemplate={currentTemplate}
                internal={true}
            />
          ) : (
            <p className="text-xs text-center italic opacity-50">No hay enlaces agregados aún.</p>
          )}
        </div>
      )}

      {/* Muestra para página tipo IMAGE / GALLERY */}
      {page.type === "image" && (
        <ImageGalleryView 
          page={page} 
          styles={styles} 
          currentTemplate={currentTemplate}
          galleryColor={portfolioData?.colors?.textColor}
        />
      )}

      {/* Muestra para página tipo AUDIO */}
      {(page.type === "audio" || page.type === "sound") && (
        <div className="px-6.5">
          <SoundPreview 
            page={page} 
            portfolioData={portfolioData}
            blockColor={portfolioData?.colors?.secondaryColor}
            styles={styles}
          />
        </div>
      )}

      {/* Muestra para página tipo STORE (Tienda de productos) */}
      {page.type === "store" && (
        <div className="px-6.5">
          <StorePreview 
            page={page} 
            portfolioData={portfolioData}
            blockColor={portfolioData?.colors?.secondaryColor}
            primaryColor={portfolioData?.colors?.primaryColor}
            secondaryColor={portfolioData?.colors?.secondaryColor}
            textColor={portfolioData.colors?.textColor}
            titleColor={portfolioData?.colors?.titleColor}
            socialColor={portfolioData?.colors?.socialColor}
            styles={styles}
          />
        </div>
      )}

      {/* Tipos en desarrollo (otros tipos restantes) */}
      {page.type !== "link" && page.type !== "image" && page.type !== "audio" && page.type !== "sound" && page.type !== "store" && (
        <div className="text-center py-10 opacity-50 text-xs italic">
          Vista previa para contenido tipo {page.type} en desarrollo...
        </div>
      )}
    </PortfolioLayout>
  );
}