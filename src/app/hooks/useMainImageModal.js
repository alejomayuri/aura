import { useState } from "react";
import { uploadToCloudinary, deleteImageFromCloudinary } from "@/app/services/cloudinaryService";

export function useMainImageModal(portfolioData, setPortfolioData, onSave) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalTempFile, setModalTempFile] = useState(null);
  const [modalTempPreview, setModalTempPreview] = useState(null);
  const [modalRemoveImage, setModalRemoveImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const currentImageDisplay = localPreview !== null 
    ? localPreview 
    : (portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image);

  const handleModalFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModalTempFile(file);
    setModalTempPreview(URL.createObjectURL(file));
    setModalRemoveImage(false);
  };

  const handleConfirmImageSelection = async () => {
    let updatedData = { ...portfolioData };
    const previousImage = currentImageDisplay;

    if (modalRemoveImage) {
      if (previousImage) {
        await deleteImageFromCloudinary(previousImage);
      }

      setLocalPreview("");
      updatedData.mainImage = "";
      updatedData.imagen = "";
      updatedData.image = "";
      setPortfolioData(updatedData);

      closeModal();

      if (typeof onSave === "function") {
        await onSave(updatedData);
      }
      return;
    } 
    
    if (modalTempFile) {
      setUploading(true);
      const finalImageUrl = await uploadToCloudinary(modalTempFile);
      setUploading(false);
      
      if (finalImageUrl) {
        if (previousImage) {
          await deleteImageFromCloudinary(previousImage);
        }

        setLocalPreview(finalImageUrl);
        updatedData.mainImage = finalImageUrl;
        updatedData.imagen = finalImageUrl;
        updatedData.image = finalImageUrl;
        setPortfolioData(updatedData);

        if (typeof onSave === "function") {
          await onSave(updatedData);
        }
      }
    }

    closeModal();
  };

  const closeModal = () => {
    setIsImageModalOpen(false);
    setModalTempFile(null);
    setModalTempPreview(null);
    setModalRemoveImage(false);
  };

  return {
    isImageModalOpen,
    setIsImageModalOpen,
    modalTempPreview,
    modalRemoveImage,
    setModalRemoveImage,
    uploading,
    currentImageDisplay,
    handleModalFileSelect,
    handleConfirmImageSelection,
    handleCancelImageSelection: closeModal,
  };
}