"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import LinkItemForm from "@/app/components/LinkItemForm";
import LinkItem from "./AdminFormsComponents/typeLink/LinkItem";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import React from "react";

export default function LinkPageEditor({ portfolioData, selectedPageId, onUpdatePortfolio }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Estados para la edición en línea del título
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  // Estados para la edición en línea de la URL
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [tempUrl, setTempUrl] = useState("");

  // Estado para la confirmación desplegable de eliminación de un link
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Estado para el desplegable de selección de layout de un link
  const [layoutOpenId, setLayoutOpenId] = useState(null);

  // Estados para el modal de imagen
  const [modalLinkId, setModalLinkId] = useState(null);
  const [modalTempFile, setModalTempFile] = useState(null);
  const [modalTempPreview, setModalTempPreview] = useState(null);
  const [modalRemoveImage, setModalRemoveImage] = useState(false);
  
  // Referencia para detectar clics fuera del formulario
  const formRef = useRef(null);

  // Buscamos la página activa actual por ID o slug
  const selectedPage = portfolioData?.pages?.find(
    (p) => p.id === selectedPageId || p.slug === selectedPageId
  );

  // Efecto para cerrar el formulario al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (showForm && formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  if (!selectedPage) {
    return <p className="text-xs text-slate-500 italic">Selecciona una página de tipo enlace válida.</p>;
  }

  // Función para guardar cambios generales en Firestore y en el estado global
  const savePortfolioChanges = async (newItems) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const updatedPages = portfolioData.pages.map((page) => {
        if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
          return { ...page, items: newItems };
        }
        return page;
      });

      const portfolioRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(portfolioRef, { pages: updatedPages }, { merge: true });

      onUpdatePortfolio(updatedPages);
    } catch (err) {
      console.error("Error al actualizar los datos:", err);
      setError(`Error al actualizar: ${err.message}`);
    }
  };

  // --- LÓGICA DE REORDENAMIENTO FLUIDO (SOLO UI) ---
  const handleReorder = (newItems) => {
    const updatedPages = portfolioData.pages.map((page) => {
      if ((page.id || page.slug) === (selectedPage.id || selectedPage.slug)) {
        return { ...page, items: newItems };
      }
      return page;
    });

    onUpdatePortfolio(updatedPages);
  };

  // --- SE GUARDA EN BASE DE DATOS SOLO AL SOLTAR ---
  const handleDragEnd = async () => {
    if (selectedPage && selectedPage.items) {
      await savePortfolioChanges(selectedPage.items);
    }
  };

  // Abrir modal para un enlace específico
  const handleOpenImageModal = (linkId) => {
    setModalLinkId(linkId);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
  };

  // Cancelar y limpiar selección en modal
  const handleCancelImageSelection = () => {
    setModalLinkId(null);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
  };

  // Seleccionar archivo en el modal
  const handleModalFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setModalTempFile(file);
      setModalTempPreview(URL.createObjectURL(file));
      setModalRemoveImage(false);
    }
  };

  // Función auxiliar para llamar a tu API de Next.js
  const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;
    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (!res.ok) {
        console.error("No se pudo eliminar la imagen de Cloudinary");
      }
    } catch (err) {
      console.error("Error al conectar con la API de eliminación:", err);
    }
  };

  // Confirmar acción del modal (subir nueva imagen o remover existente)
  const handleConfirmImageSelection = async () => {
    if (!modalLinkId) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      let updatedItems = [];
      const oldImageUrl = targetLinkForModal?.imageUrl;

      if (modalRemoveImage) {
        // 1. Eliminar de Cloudinary la imagen existente
        if (oldImageUrl) {
          await deleteImageFromCloudinary(oldImageUrl);
        }

        // 2. Remover del estado local / Firestore
        updatedItems = (selectedPage.items || []).map((item) => {
          if (item.id === modalLinkId) {
            const { imageUrl, ...rest } = item;
            return rest;
          }
          return item;
        });
      } else if (modalTempFile) {
        // Opción: Subir nueva imagen a Cloudinary
        const formData = new FormData();
        formData.append("file", modalTempFile);
        formData.append("upload_preset", "pataki_portfolio_upload"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/dz3p460iu/image/upload", {
          method: "POST",
          body: formData,
        });

        const responseText = await res.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (err) {
          console.error("Error de respuesta del servidor:", responseText);
          throw new Error("El servidor devolvió una respuesta no válida.");
        }

        if (!res.ok) throw new Error(data.error?.message || "Error al subir la imagen");

        const imageUrl = data.secure_url || data.url;

        // Si ya tenía una imagen previa y la reemplazó, eliminamos la vieja de Cloudinary
        if (oldImageUrl) {
          await deleteImageFromCloudinary(oldImageUrl);
        }

        updatedItems = (selectedPage.items || []).map((item) => {
          if (item.id === modalLinkId) {
            return { ...item, imageUrl };
          }
          return item;
        });
      }

      if (updatedItems.length > 0) {
        await savePortfolioChanges(updatedItems);
      }

      handleCancelImageSelection();
    } catch (err) {
      console.error("Error al procesar la imagen:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar directamente desde el thumbnail del LinkItem
  const handleRemoveImage = async (e, linkId) => {
    e.stopPropagation();
    
    const itemToDelete = (selectedPage?.items || []).find((item) => item.id === linkId);

    try {
      if (itemToDelete?.imageUrl) {
        await deleteImageFromCloudinary(itemToDelete.imageUrl);
      }

      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          const { imageUrl, ...rest } = item;
          return rest;
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al borrar la imagen:", err);
    }
  };

  // Función para activar/desactivar un enlace individual con el switch
  const handleToggleActive = async (linkId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          const currentActive = item.isActive !== false;
          return { ...item, isActive: !currentActive };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al actualizar el estado del enlace:", err);
      setError(`Error al actualizar estado: ${err.message}`);
    }
  };

  // Función para alternar el estado de destacado con la estrella
  const handleToggleFeatured = async (linkId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          return { ...item, isFeatured: !item.isFeatured };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al actualizar destacado:", err);
      setError(`Error al actualizar destacado: ${err.message}`);
    }
  };

  // Función para actualizar el layout individual de un enlace
  const handleUpdateLinkLayout = async (linkId, layoutType) => {
    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          return { ...item, layout: layoutType };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al actualizar layout:", err);
      setError(`Error al actualizar layout: ${err.message}`);
    }
  };

  // Guardar el título editado del enlace
  const handleSaveTitle = async (linkId) => {
    if (!tempTitle.trim()) {
      setEditingLinkId(null);
      return;
    }

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          return { ...item, title: tempTitle.trim() };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al guardar el título:", err);
      setError(`Error al actualizar título: ${err.message}`);
    } finally {
      setEditingLinkId(null);
    }
  };

  // Guardar la URL editada del enlace
  const handleSaveUrl = async (linkId) => {
    if (!tempUrl.trim()) {
      setEditingUrlId(null);
      return;
    }

    try {
      const updatedItems = (selectedPage.items || []).map((item) => {
        if (item.id === linkId) {
          return { ...item, url: tempUrl.trim() };
        }
        return item;
      });

      await savePortfolioChanges(updatedItems);
    } catch (err) {
      console.error("Error al guardar la URL:", err);
      setError(`Error al actualizar URL: ${err.message}`);
    } finally {
      setEditingUrlId(null);
    }
  };

  // Función que recibe el objeto "newLinkItem" y lo coloca al INICIO de la lista
  const handleAddLinkItem = async (newLinkItem) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      setError("No hay una sesión activa en Firebase.");
      return;
    }

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

  // Función para borrar un enlace individual de la lista (y su imagen de Cloudinary si existe)
  const handleDeleteLinkItem = async (linkId) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) return;

    try {
      const itemToDelete = (selectedPage.items || []).find((item) => item.id === linkId);

      // Si el enlace a eliminar tenía una imagen, la borramos de Cloudinary
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

  // Link objetivo seleccionado para el modal
  const targetLinkForModal = selectedPage?.items?.find((item) => item.id === modalLinkId);
  const currentImageDisplay = targetLinkForModal?.imageUrl;

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

      {/* Contenedor principal del formulario */}
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

        <div 
          className={`grid transition-all duration-300 ease-in-out ${
            showForm ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"
          }`}
        >
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
                  handleOpenImageModal={handleOpenImageModal}
                  handleRemoveImage={handleRemoveImage}
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

      {/* MODAL PARA SUBIR/REMOVER IMAGEN */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {modalLinkId && targetLinkForModal && (
            <div 
              onClick={handleCancelImageSelection}
              className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 overflow-y-auto cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-md overflow-hidden p-6 space-y-5 my-auto cursor-default"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Actualizar Imagen de &quot;{targetLinkForModal.title || "este enlace"}&quot;
                  </h3>
                  <button
                    type="button"
                    onClick={handleCancelImageSelection}
                    className="text-slate-400 hover:text-black transition-colors cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-6 bg-purple-50/30 transition text-center relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={loading}
                      onChange={handleModalFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    {modalRemoveImage ? (
                      <div className="space-y-2 flex flex-col items-center">
                        <span className="text-sm font-medium text-black">Se eliminará la imagen actual al aceptar</span>
                        <span className="text-xs text-black">Haz clic o arrastra otra si deseas reemplazarla</span>
                      </div>
                    ) : modalTempPreview ? (
                      <div className="space-y-3 flex flex-col items-center">
                        <img src={modalTempPreview} alt="Preview nueva" className="max-h-48 rounded-xl object-contain shadow-sm" />
                        <span className="text-xs text-purple-700 font-medium bg-purple-100 px-3 py-1 rounded-full">
                          Haz clic o arrastra otra para cambiar
                        </span>
                      </div>
                    ) : currentImageDisplay ? (
                      <div className="space-y-3 flex flex-col items-center">
                        <img src={currentImageDisplay} alt="Actual" className="max-h-40 rounded-xl object-contain opacity-80" />
                        <span className="text-xs text-black font-medium">
                          Haz clic aquí para seleccionar una nueva imagen
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center">
                        <svg className="w-10 h-10 text-purple-500 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2.5 2.5 0 012.828 0L16 16m-2-2l1.586-1.586a2.5 2.5 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-black">Arrastra tu imagen aquí o haz clic</span>
                        <span className="text-xs text-black">PNG, JPG, WEBP hasta 10MB</span>
                      </div>
                    )}
                  </div>

                  {currentImageDisplay && !modalRemoveImage && !modalTempFile && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setModalRemoveImage(true);
                          setModalTempFile(null);
                          setModalTempPreview(null);
                        }}
                        className="text-black hover:bg-black/5 text-xs font-medium px-4 py-2 rounded-xl border border-black transition flex items-center justify-center gap-1.5 cursor-pointer w-fit"
                      >
                        <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remover imagen
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelImageSelection}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmImageSelection}
                    disabled={(!modalTempFile && !modalRemoveImage) || loading}
                    className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
                  >
                    {loading ? "Procesando..." : "Aceptar"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}