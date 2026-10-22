"use client";

import { useState, useEffect, useRef } from "react";
import LinkItemForm from "@/app/components/LinkItemForm";
import LinkItem from "./AdminFormsComponents/typeLink/LinkItem";
import { AnimatePresence, Reorder } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import React from "react";
import { deleteImageFromCloudinary } from "@/app/services/cloudinaryService";
import { useImageModal } from "@/app/hooks/useImageModal";
import ImageModal from "@/app/components/AdminFormsComponents/modals/ImageModal";

export default function LinkPageEditor({ portfolioData, selectedPageId, updatePortfolio, onSave }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [tempUrl, setTempUrl] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [layoutOpenId, setLayoutOpenId] = useState(null);
  
  const formRef = useRef(null);

  const selectedPage = portfolioData?.pages?.find(
    (p) => p.id === selectedPageId || p.slug === selectedPageId
  );

  const savePortfolioChanges = async (newItems) => {
    try {
      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage?.id || selectedPage?.slug)) {
          return { ...page, items: newItems };
        }
        return page;
      });

      if (typeof updatePortfolio === "function") {
        updatePortfolio({ pages: updatedPages });
      } else if (typeof onSave === "function") {
        await onSave({ ...portfolioData, pages: updatedPages });
      }
    } catch (err) {
      console.error("Error al actualizar los datos:", err);
      setError(`Error al actualizar: ${err.message}`);
    }
  };

  const {
    modalLinkId,
    modalTempPreview,
    modalRemoveImage,
    setModalRemoveImage,
    uploading,
    openModal,
    closeModal,
    handleModalFileSelect,
    handleConfirm,
  } = useImageModal(async (linkId, newImageUrl) => {
    if (!selectedPage) return;
    const updatedItems = (selectedPage.items || []).map((item) => {
      if (item.id === linkId) {
        if (!newImageUrl) {
          const { imageUrl, ...rest } = item;
          return rest;
        }
        return { ...item, imageUrl: newImageUrl };
      }
      return item;
    });

    await savePortfolioChanges(updatedItems);
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (showForm && formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm]);

  if (!selectedPage) {
    return <p className="text-xs text-slate-500 italic">Selecciona una página de tipo enlace válida.</p>;
  }

  const handleReorder = (newItems) => {
    const updatedPages = portfolioData.pages.map((page) => {
      if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
        return { ...page, items: newItems };
      }
      return page;
    });

    if (typeof updatePortfolio === "function") {
      updatePortfolio({ pages: updatedPages }, false);
    }
  };

  const handleDragEnd = async () => {
    if (selectedPage && selectedPage.items) {
      await savePortfolioChanges(selectedPage.items);
    }
  };

  const targetLinkForModal = selectedPage?.items?.find((item) => item.id === modalLinkId);
  const currentImageDisplay = targetLinkForModal?.imageUrl;

  const handleConfirmImageSelection = async () => {
    if (!targetLinkForModal) return;
    await handleConfirm(targetLinkForModal.imageUrl);
  };


  const handleToggleActive = async (linkId) => {
    const updatedItems = (selectedPage.items || []).map((item) => {
      if (item.id === linkId) {
        return { ...item, isActive: item.isActive === false ? true : false };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  const handleToggleFeatured = async (linkId) => {
    const updatedItems = (selectedPage.items || []).map((item) => {
      if (item.id === linkId) {
        return { ...item, isFeatured: !item.isFeatured };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  const handleUpdateLinkLayout = async (linkId, layoutType) => {
    const updatedItems = (selectedPage.items || []).map((item) => {
      if (item.id === linkId) {
        return { ...item, layout: layoutType };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  const handleSaveTitle = async (linkId) => {
    if (!tempTitle.trim()) {
      setEditingLinkId(null);
      return;
    }
    const updatedItems = (selectedPage.items || []).map((item) => {
      if (item.id === linkId) {
        return { ...item, title: tempTitle.trim() };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
    setEditingLinkId(null);
  };

  const handleSaveUrl = async (linkId) => {
    if (!tempUrl.trim()) {
      setEditingUrlId(null);
      return;
    }
    const updatedItems = (selectedPage.items || []).map((item) => {
      if (item.id === linkId) {
        return { ...item, url: tempUrl.trim() };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
    setEditingUrlId(null);
  };

  const handleAddLinkItem = async (newLinkItem) => {
    setLoading(true);
    setError(null);

    try {
      const itemWithActiveState = { 
        ...newLinkItem, 
        isActive: newLinkItem.isActive ?? true,
        isFeatured: newLinkItem.isFeatured ?? false,
        layout: newLinkItem.layout || "classic"
      };
      const updatedItems = [itemWithActiveState, ...(selectedPage.items || [])];

      await savePortfolioChanges(updatedItems);
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar el enlace:", err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLinkItem = async (linkId) => {
    try {
      const itemToDelete = (selectedPage.items || []).find((item) => item.id === linkId);
      if (itemToDelete?.imageUrl) {
        await deleteImageFromCloudinary(itemToDelete.imageUrl);
      }

      const updatedItems = (selectedPage.items || []).filter((item) => item.id !== linkId);
      await savePortfolioChanges(updatedItems);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error al eliminar enlace:", err);
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <Title 
          title={selectedPage?.title}
          externalRoute={`/${portfolioData.slug}/${selectedPage?.slug}`}
          openInNewTab={true}
        />
        <p className="text-sm text-slate-500">Página tipo links</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Formulario para añadir */}
      <div ref={formRef} className="space-y-3">
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            <span>+ Añadir link</span>
          </button>
        )}

        <div className={`grid transition-all duration-300 ease-in-out ${showForm ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
          <div className="overflow-hidden space-y-2">
            <div className="bg-transparent border-none p-0 shadow-none pt-1">
              <LinkItemForm onAddLink={handleAddLinkItem} loading={loading} />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Listado con Framer Motion Reorder */}
      <div className="space-y-3">
        {selectedPage.items && selectedPage.items.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={selectedPage.items} 
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {selectedPage.items.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onDragEnd={handleDragEnd}
                  editingLinkId={editingLinkId}
                  setEditingLinkId={setEditingLinkId}
                  tempTitle={tempTitle}
                  setTempTitle={setTempTitle}
                  handleSaveTitle={handleSaveTitle}
                  editingUrlId={editingUrlId}
                  setEditingUrlId={setEditingUrlId}
                  tempUrl={tempUrl}
                  setTempUrl={setTempUrl}
                  handleSaveUrl={handleSaveUrl}
                  handleOpenImageModal={openModal}
                  handleToggleFeatured={handleToggleFeatured}
                  handleToggleActive={handleToggleActive}
                  layoutOpenId={layoutOpenId}
                  setLayoutOpenId={setLayoutOpenId}
                  deleteConfirmId={deleteConfirmId}
                  setDeleteConfirmId={setDeleteConfirmId}
                  handleUpdateLinkLayout={handleUpdateLinkLayout}
                  handleDeleteLinkItem={handleDeleteLinkItem}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay enlaces agregados todavía.</p>
        )}
      </div>

      <ImageModal
        isOpen={Boolean(modalLinkId && targetLinkForModal)}
        onClose={closeModal}
        title={`Actualizar Imagen de "${targetLinkForModal?.title || "este enlace"}"`}
        currentImageDisplay={currentImageDisplay}
        modalTempPreview={modalTempPreview}
        modalRemoveImage={modalRemoveImage}
        setModalRemoveImage={setModalRemoveImage}
        uploading={uploading}
        handleModalFileSelect={handleModalFileSelect}
        handleConfirmImageSelection={handleConfirmImageSelection}
      />
    </div>
  );
}