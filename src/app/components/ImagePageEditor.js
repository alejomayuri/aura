"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import GalleryCard from "./AdminFormsComponents/typeImage/GalleryCard";
import ImageModal from "@/app/components/AdminFormsComponents/modals/ImageModal";
import { useImageModal } from "@/app/hooks/useImageModal";
import { deleteImageFromCloudinary } from "@/app/services/cloudinaryService";

export default function ImagePageEditor({ portfolioData, selectedPageId, updatePortfolio, onSave }) {
  const selectedPage = portfolioData?.pages?.find((p) => (p.id || p.slug) === selectedPageId);

  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [deleteGalleryUid, setDeleteGalleryUid] = useState(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState({ galleryId: null, itemId: null });

  const [loading, setLoading] = useState(false);
  const [savingItemId, setSavingItemId] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const galleries = selectedPage?.galleries || [];

  // Función unificada para actualizar el estado local y persistir globalmente
  const savePortfolioChanges = async (updatedPages) => {
    try {
      if (typeof updatePortfolio === "function") {
        updatePortfolio({ pages: updatedPages });
      }

      if (typeof onSave === "function") {
        await onSave({ ...portfolioData, pages: updatedPages });
      }
    } catch (err) {
      console.error("Error al guardar los cambios del portfolio:", err);
      setError(`Error al guardar: ${err.message}`);
    }
  };

  // Integración del custom hook para la subida de imágenes a las galerías
  const {
    modalLinkId: modalGalleryId,
    modalTempPreview,
    modalRemoveImage,
    setModalRemoveImage,
    uploading,
    openModal: openGalleryModal,
    closeModal: closeGalleryModal,
    handleModalFileSelect,
    handleConfirm: confirmGalleryImageHook,
  } = useImageModal(async (galleryId, newImageUrl) => {
    if (!selectedPage || !newImageUrl) return;

    const newItem = {
      id: crypto.randomUUID(),
      url: newImageUrl,
      title: "",
      description: "",
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedGalleries = galleries.map((gal) => {
      if (gal.id === galleryId) {
        return { ...gal, items: [newItem, ...gal.items] };
      }
      return gal;
    });

    const updatedPages = portfolioData.pages.map((p) => {
      if ((p.id || p.slug) === selectedPageId) {
        return { ...p, galleries: updatedGalleries };
      }
      return p;
    });

    await savePortfolioChanges(updatedPages);
  });

  if (!selectedPage) {
    return <div className="text-sm text-slate-500">Selecciona una página válida desde el menú lateral.</div>;
  }

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!newGalleryTitle.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const newGallery = {
        id: crypto.randomUUID(),
        title: newGalleryTitle.trim(),
        isActive: true,
        layout: "grid",
        items: []
      };

      const updatedGalleries = [newGallery, ...galleries];
      
      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      await savePortfolioChanges(updatedPages);
      setNewGalleryTitle("");
      setSuccessMsg(`Galería "${newGallery.title}" creada con éxito.`);
    } catch (err) {
      console.error("Error al crear galería:", err);
      setError("No se pudo crear la galería.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLayout = async (galleryId, newLayout) => {
    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          return { ...gal, layout: newLayout };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      await savePortfolioChanges(updatedPages);
    } catch (err) {
      console.error("Error al guardar el layout:", err);
      setError("No se pudo guardar la opción de layout.");
    }
  };

  const handleReorderGalleries = (newOrderGalleries) => {
    const updatedPages = portfolioData.pages.map((p) => {
      if ((p.id || p.slug) === selectedPageId) {
        return { ...p, galleries: newOrderGalleries };
      }
      return p;
    });
    
    if (typeof updatePortfolio === "function") {
      updatePortfolio({ pages: updatedPages }, false);
    }
  };

  const handleSaveGalleriesOrder = async () => {
    setError(null);
    try {
      if (typeof onSave === "function") {
        await onSave(portfolioData);
      }
    } catch (err) {
      console.error("Error al guardar orden de galerías:", err);
      setError("No se pudo guardar el nuevo orden de las galerías.");
    }
  };

  const handleReorderItems = (galleryId, newOrderItems) => {
    const updatedGalleries = galleries.map((gal) => {
      if (gal.id === galleryId) {
        return { ...gal, items: newOrderItems };
      }
      return gal;
    });

    const updatedPages = portfolioData.pages.map((p) => {
      if ((p.id || p.slug) === selectedPageId) {
        return { ...p, galleries: updatedGalleries };
      }
      return p;
    });

    if (typeof updatePortfolio === "function") {
      updatePortfolio({ pages: updatedPages }, false);
    }
  };

  const handleSaveItemsOrder = async (droppedItem) => {
    setSavingItemId(droppedItem.id);
    setError(null);

    try {
      if (typeof onSave === "function") {
        await onSave(portfolioData);
      }
    } catch (err) {
      console.error("Error al guardar orden de imágenes:", err);
      setError("No se pudo guardar el nuevo orden de las imágenes.");
    } finally {
      setSavingItemId(null);
    }
  };

  const handleUpdateGalleryTitle = async (galleryId, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;

    const updatedGalleries = galleries.map((gal) => {
      if (gal.id === galleryId) {
        return { ...gal, title: newTitle.trim() };
      }
      return gal;
    });

    const updatedPages = portfolioData.pages.map((p) => {
      if ((p.id || p.slug) === selectedPageId) {
        return { ...p, galleries: updatedGalleries };
      }
      return p;
    });

    await savePortfolioChanges(updatedPages);
  };

  const handleUpdateItemTitle = async (galleryId, itemId, newTitle) => {
    setSavingItemId(itemId);

    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          const updatedItems = (gal.items || []).map((item) => {
            if (item.id === itemId) {
              return { ...item, title: newTitle };
            }
            return item;
          });
          return { ...gal, items: updatedItems };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      await savePortfolioChanges(updatedPages);
    } catch (err) {
      console.error("Error al actualizar el título de la imagen:", err);
      setError("No se pudo actualizar el título de la imagen.");
    } finally {
      setSavingItemId(null);
    }
  };

  const handleToggleGalleryActive = async (galleryId, currentActiveState) => {
    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          return { ...gal, isActive: currentActiveState === undefined ? false : !currentActiveState };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      await savePortfolioChanges(updatedPages);
    } catch (err) {
      console.error("Error al cambiar estado de galería:", err);
      setError("No se pudo actualizar el estado de la galería.");
    }
  };

  const handleToggleItemActive = async (galleryId, itemId, currentActiveState) => {
    try {
      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          const updatedItems = gal.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, isActive: currentActiveState === undefined ? false : !currentActiveState };
            }
            return item;
          });
          return { ...gal, items: updatedItems };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      await savePortfolioChanges(updatedPages);
    } catch (err) {
      console.error("Error al cambiar estado de imagen:", err);
      setError("No se pudo actualizar el estado de la imagen.");
    }
  };

  const handleDeleteItem = async (galleryId, itemId) => {
    try {
      const targetGallery = galleries.find((gal) => gal.id === galleryId);
      const targetItem = targetGallery?.items?.find((item) => item.id === itemId);

      if (targetItem?.url) {
        await deleteImageFromCloudinary(targetItem.url);
      }

      const updatedGalleries = galleries.map((gal) => {
        if (gal.id === galleryId) {
          return { ...gal, items: gal.items.filter((item) => item.id !== itemId) };
        }
        return gal;
      });

      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      await savePortfolioChanges(updatedPages);
      setDeleteItemTarget({ galleryId: null, itemId: null });
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
      setError("No se pudo eliminar la imagen.");
    }
  };

  const handleDeleteGallery = async (galleryId) => {
    try {
      const targetGallery = galleries.find((gal) => gal.id === galleryId);
      if (targetGallery && targetGallery.items && targetGallery.items.length > 0) {
        await Promise.all(
          targetGallery.items.map((item) => {
            if (item.url) {
              return deleteImageFromCloudinary(item.url);
            }
            return Promise.resolve();
          })
        );
      }

      const updatedGalleries = galleries.filter((gal) => gal.id !== galleryId);
      const updatedPages = portfolioData.pages.map((p) => {
        if ((p.id || p.slug) === selectedPageId) {
          return { ...p, galleries: updatedGalleries };
        }
        return p;
      });

      await savePortfolioChanges(updatedPages);
      setDeleteGalleryUid(null);
    } catch (err) {
      console.error("Error al eliminar galería:", err);
      setError("No se pudo eliminar la galería.");
    }
  };

  const targetGalleryForModal = galleries.find(g => g.id === modalGalleryId);

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <Title 
          title={selectedPage?.title}
          externalRoute={`/${portfolioData.slug}/${selectedPage?.slug}`}
          openInNewTab={true}
        />
        <p className="text-sm text-slate-500">Página tipo imagen</p>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">{error}</div>}
      {successMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3.5 rounded-xl">{successMsg}</div>}

      <form onSubmit={handleCreateGallery} className="flex items-center gap-2.5 bg-transparent border-none p-0 shadow-none">
        <input
          type="text"
          placeholder="Nombre de la galería (ej. Vestidos, Zapatos...)"
          value={newGalleryTitle}
          onChange={(e) => setNewGalleryTitle(e.target.value)}
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !newGalleryTitle.trim()}
          className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:bg-black disabled:text-white rounded-xl text-sm font-medium shadow-sm transition-all shrink-0 cursor-pointer"
        >
          Crear Galería
        </button>
      </form>

      <Reorder.Group 
        axis="y" 
        values={galleries} 
        onReorder={handleReorderGalleries}
        className="space-y-4 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {galleries.length > 0 ? (
          galleries.map((gal) => {
            return (
              <GalleryCard
                key={gal.id}
                gal={gal}
                handleSaveGalleriesOrder={handleSaveGalleriesOrder}
                handleUpdateGalleryTitle={handleUpdateGalleryTitle}
                handleToggleGalleryActive={handleToggleGalleryActive}
                handleDeleteGallery={handleDeleteGallery}
                handleReorderItems={handleReorderItems}
                handleSaveItemsOrder={handleSaveItemsOrder}
                handleToggleItemActive={handleToggleItemActive}
                handleDeleteItem={handleDeleteItem}
                handleUpdateItemTitle={handleUpdateItemTitle}
                handleSelectLayout={handleSelectLayout}
                setModalGalleryId={openGalleryModal}
                deleteGalleryUid={deleteGalleryUid}
                setDeleteGalleryUid={setDeleteGalleryUid}
                deleteItemTarget={deleteItemTarget}
                setDeleteItemTarget={setDeleteItemTarget}
                savingItemId={savingItemId}
              />
            );
          })
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay galerías creadas para esta página todavía.</p>
        )}
      </Reorder.Group>

      {/* MODAL REUTILIZADO DE IMAGEN */}
      <ImageModal
        isOpen={Boolean(modalGalleryId && targetGalleryForModal)}
        onClose={closeGalleryModal}
        title={`Añadir imagen a "${targetGalleryForModal?.title || ""}"`}
        currentImageDisplay={null}
        modalTempPreview={modalTempPreview}
        modalRemoveImage={modalRemoveImage}
        setModalRemoveImage={setModalRemoveImage}
        uploading={uploading}
        handleModalFileSelect={handleModalFileSelect}
        handleConfirmImageSelection={async () => {
          await confirmGalleryImageHook(null);
        }}
      />
    </div>
  );
}