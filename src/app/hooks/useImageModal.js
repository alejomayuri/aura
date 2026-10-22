import { useState } from "react";
import { uploadToCloudinary, deleteImageFromCloudinary } from "@/app/services/cloudinaryService";

export function useImageModal(onImageChange) {
  const [modalLinkId, setModalLinkId] = useState(null);
  const [modalTempFile, setModalTempFile] = useState(null);
  const [modalTempPreview, setModalTempPreview] = useState(null);
  const [modalRemoveImage, setModalRemoveImage] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openModal = (linkId) => {
    setModalLinkId(linkId);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
  };

  const closeModal = () => {
    setModalLinkId(null);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
  };

  const handleModalFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setModalTempFile(file);
    setModalTempPreview(URL.createObjectURL(file));
    setModalRemoveImage(false);
  };

  const handleConfirm = async (currentImageUrl) => {
    if (!modalLinkId) return null;
    setUploading(true);

    try {
      let finalImageUrl = currentImageUrl;

      if (modalRemoveImage) {
        if (currentImageUrl) {
          await deleteImageFromCloudinary(currentImageUrl);
        }
        finalImageUrl = null;
      } else if (modalTempFile) {
        const newUrl = await uploadToCloudinary(modalTempFile);
        if (newUrl) {
          if (currentImageUrl) {
            await deleteImageFromCloudinary(currentImageUrl);
          }
          finalImageUrl = newUrl;
        }
      }

      if (typeof onImageChange === "function") {
        await onImageChange(modalLinkId, finalImageUrl);
      }

      closeModal();
      return true;
    } catch (err) {
      console.error("Error al procesar la imagen del modal:", err);
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    modalLinkId,
    modalTempPreview,
    modalRemoveImage,
    setModalRemoveImage,
    uploading,
    openModal,
    closeModal,
    handleModalFileSelect,
    handleConfirm,
  };
}