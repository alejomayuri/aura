"use client";

import { useState, useRef } from "react";
import { Reorder, AnimatePresence } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import StoreCardItem from "./AdminFormsComponents/typeStore/StoreCardItem";
import ImageModal from "@/app/components/AdminFormsComponents/modals/ImageModal";
import { useImageModal } from "@/app/hooks/useImageModal";

export default function StorePageEditor({ portfolioData, selectedPageId, updatePortfolio, onSave }) {
  const selectedPage = portfolioData?.pages?.find((p) => (p.id || p.slug) === selectedPageId);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCurrency, setProductCurrency] = useState("S/"); // "S/" para Soles o "$" para Dólares
  const [productUrl, setProductUrl] = useState("");
  const [productCategory, setProductCategory] = useState("General");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [productThumbnail, setProductThumbnail] = useState("");

  // Estados de control para edición de título y borrado (igual que en LinkItem)
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef(null);

  const items = selectedPage?.items || [];
  const categories = selectedPage?.categories?.length > 0 ? selectedPage.categories : ["General"];

  // Integración del hook useImageModal para la subida de la foto del producto a Cloudinary
  const {
    modalLinkId: isImageModalOpen,
    modalTempPreview,
    modalRemoveImage,
    setModalRemoveImage,
    uploading,
    openModal: openProductImageModal,
    closeModal: closeProductImageModal,
    handleModalFileSelect,
    handleConfirm: confirmProductImageHook,
  } = useImageModal(async (_, newImageUrl) => {
    if (newImageUrl) {
      setProductThumbnail(newImageUrl);
    }
  });

  const savePortfolioChanges = async (newItems, newCategories = categories) => {
    try {
      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage?.id || selectedPage?.slug)) {
          return { ...page, items: newItems, categories: newCategories };
        }
        return page;
      });

      if (typeof updatePortfolio === "function") {
        updatePortfolio({ pages: updatedPages });
      }

      if (typeof onSave === "function") {
        await onSave({ ...portfolioData, pages: updatedPages });
      }
    } catch (err) {
      console.error("Error al actualizar la tienda:", err);
      setError(`Error al actualizar: ${err.message}`);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !productUrl.trim()) {
      setError("El nombre y el enlace de ventas son obligatorios.");
      return;
    }

    let finalCategories = [...categories];
    let finalCategoryName = productCategory;

    if (isAddingNewCategory && newCategoryInput.trim()) {
      finalCategoryName = newCategoryInput.trim();
      if (!finalCategories.includes(finalCategoryName)) {
        finalCategories.push(finalCategoryName);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const newItem = {
        id: crypto.randomUUID(),
        title: productName.trim(),
        price: productPrice.trim() ? Number(productPrice) : 0,
        currency: productCurrency,
        url: productUrl.trim(),
        category: finalCategoryName,
        thumbnail: productThumbnail.trim() || "",
        layout: "classic",
        isActive: true,
        createdAt: new Date().toISOString()
      };

      const updatedItems = [newItem, ...items];
      await savePortfolioChanges(updatedItems, finalCategories);

      // Limpiar el formulario al guardar exitosamente
      setProductName("");
      setProductPrice("");
      setProductUrl("");
      setProductThumbnail("");
      setNewCategoryInput("");
      setIsAddingNewCategory(false);
      setShowForm(false);
    } catch (err) {
      console.error("Error al añadir producto:", err);
      setError("No se pudo añadir el producto.");
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar el título editado al presionar Enter o perder el foco
  const handleSaveTitle = async (itemId) => {
    if (!tempTitle.trim()) {
      setEditingTitleId(null);
      return;
    }

    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, title: tempTitle.trim() };
      }
      return item;
    });

    setEditingTitleId(null);
    await savePortfolioChanges(updatedItems);
  };

  // Función para alternar el estado destacado de la estrella
  const handleToggleFeatured = async (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isFeatured: !item.isFeatured };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  // Función para guardar los cambios de la oferta / descuento
  const handleUpdateOffer = async (itemId, offerData) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, ...offerData };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

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
    if (selectedPage && items) {
      await savePortfolioChanges(items);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setDeleteConfirmId(null);
    await savePortfolioChanges(updatedItems);
  };

  const handleToggleActive = async (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isActive: item.isActive === false };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  if (!selectedPage) {
    return <p className="text-xs text-slate-500 italic">Selecciona una página tipo tienda válida.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <Title 
          title={selectedPage?.title}
          externalRoute={`/${portfolioData.slug}/${selectedPage?.slug}`}
          openInNewTab={true}
        />
        <p className="text-sm text-slate-500">Página tipo tienda (Productos, precios, monedas y enlaces de venta)</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Botón y Formulario para añadir producto */}
      <div ref={formRef} className="space-y-3">
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            <span>+ Añadir producto</span>
          </button>
        )}

        <div className={`grid transition-all duration-300 ease-in-out ${showForm ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
          <div className="overflow-hidden space-y-2">
            <form onSubmit={handleAddProduct} className="bg-white border border-slate-300 p-4 rounded-xl space-y-3 shadow-sm">
              <h4 className="text-sm font-medium text-slate-700">Nuevo Producto</h4>
              
              <div className="space-y-3">
                {/* Nombre del producto */}
                <div className="flex flex-col gap-1.5 mb-3">
                    <label className="text-sm font-medium text-slate-700 block">Nombre</label>
                    <input
                    type="text"
                    placeholder=""
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
                    />
                </div>

                {/* FILA EN PARALELO: Precio y Categoría */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Precio y Selector de Moneda */}
                  <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">Precio</label>
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-slate-900 shadow-sm">
                          <select
                          value={productCurrency}
                          onChange={(e) => setProductCurrency(e.target.value)}
                          className="bg-slate-50 border-r border-slate-200 pl-3 pr-7 py-2 text-sm text-slate-900 focus:outline-none font-medium h-full cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill%3D%22none%22%20stroke=%22%2364748b%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_8px_center] bg-no-repeat"
                          >
                          <option value="S/">S/ PEN</option>
                          <option value="$">$ USD</option>
                          </select>
                          <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 focus:outline-none w-full"
                          />
                      </div>
                  </div>

                  {/* Categoría y Opción para crear nueva */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700">Categoría</label>
                      <button
                      type="button"
                      onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                      className="text-purple-600 hover:underline text-[11px] font-medium cursor-pointer"
                      >
                          {isAddingNewCategory ? "Existente" : "+ Nueva"}
                      </button>
                    </div>

                    {!isAddingNewCategory ? (
                      <select
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm h-[38px]"
                      >
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Nueva categoría..."
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm h-[38px]"
                      />
                    )}
                  </div>
                </div>

                {/* Enlace de ventas */}
                <div className="flex flex-col gap-1.5 mb-3">
                    <label className="text-sm font-medium text-slate-700">Enlace de ventas</label>
                    <input
                    type="url"
                    placeholder="https://www.amazon.com/..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
                    />
                </div>

                {/* Foto del producto con diseño estilo LinkItem */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-sm font-medium text-slate-700">Foto del producto</label>
                  <div className="shrink-0 flex items-center gap-3">
                    {productThumbnail ? (
                      <div className="relative group w-22 h-22 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={productThumbnail}
                          alt="Foto del producto"
                          className="w-full h-full object-cover"
                        />
                        <div
                          onClick={() => openProductImageModal("product_image")}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                          title="Cambiar imagen"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openProductImageModal("product_image")}
                        className="w-22 h-22 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border border-slate-200"
                        title="Añadir imagen"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                    {productThumbnail && (
                      <button
                        type="button"
                        onClick={() => setProductThumbnail("")}
                        className="text-xs text-rose-600 hover:underline cursor-pointer self-end mb-2"
                      >
                        Quitar foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción del formulario */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setProductName("");
                    setProductPrice("");
                    setProductUrl("");
                    setProductThumbnail("");
                    setNewCategoryInput("");
                    setIsAddingNewCategory(false);
                    setShowForm(false);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !productName.trim() || !productUrl.trim()}
                  className="px-5 py-2 bg-black text-white hover:bg-slate-800 disabled:opacity-50 rounded-xl text-xs font-medium shadow-sm transition cursor-pointer"
                >
                  {loading ? "Guardando..." : "Guardar producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="space-y-3">
        {items.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={items} 
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {items.map((item) => (
                <StoreCardItem
                    key={item.id}
                    item={item}
                    onDragEnd={handleDragEnd}
                    onToggleActive={handleToggleActive}
                    onToggleFeatured={handleToggleFeatured}
                    onUpdateOffer={handleUpdateOffer}
                    onDeleteTrack={handleDeleteItem}
                    editingTitleId={editingTitleId}
                    setEditingTitleId={setEditingTitleId}
                    tempTitle={tempTitle}
                    setTempTitle={setTempTitle}
                    handleSaveTitle={handleSaveTitle}
                    deleteConfirmId={deleteConfirmId}
                    setDeleteConfirmId={setDeleteConfirmId}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay productos agregados todavía.</p>
        )}
      </div>

      {/* MODAL REUTILIZADO DE IMAGEN */}
      <ImageModal
        isOpen={Boolean(isImageModalOpen)}
        onClose={closeProductImageModal}
        title="Seleccionar foto del producto"
        currentImageDisplay={productThumbnail}
        modalTempPreview={modalTempPreview}
        modalRemoveImage={modalRemoveImage}
        setModalRemoveImage={setModalRemoveImage}
        uploading={uploading}
        handleModalFileSelect={handleModalFileSelect}
        handleConfirmImageSelection={async () => {
          await confirmProductImageHook(null);
        }}
      />
    </div>
  );
}