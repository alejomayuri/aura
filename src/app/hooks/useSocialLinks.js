import { useState, useMemo } from "react";

export function useSocialLinks(portfolioData, setPortfolioData, onSave) {
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [showAddSocialForm, setShowAddSocialForm] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [deleteConfirmUid, setDeleteConfirmUid] = useState(null);

  const stableLinks = useMemo(() => {
    const links = portfolioData?.socialLinks || [];
    return links.map(link => ({
      ...link,
      uid: link.id || link.uid || link.url
    }));
  }, [portfolioData?.socialLinks]);

  const socialPosition = portfolioData?.socialPosition || "bottom";

  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;
    
    const newLink = { uid: Date.now().toString(), url: newLinkUrl.trim(), enabled: true };
    const updatedLinks = [...stableLinks, newLink];
    const updatedData = { ...portfolioData, socialLinks: updatedLinks };

    setPortfolioData(updatedData);
    setNewLinkUrl("");
    setShowAddSocialForm(false);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la nueva red social:", error);
      }
    }
  };

  const handleReorder = async (newSocialLinks) => {
    const updatedData = { ...portfolioData, socialLinks: newSocialLinks };
    setPortfolioData(updatedData);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar reordenamiento de redes:", error);
      }
    }
  };

  const handleChangeSocialPosition = async (position) => {
    const updatedData = {
      ...portfolioData,
      socialLinks: stableLinks,
      socialPosition: position,
    };

    setPortfolioData(updatedData);

    if (typeof onSave === "function") {
      try {
        await onSave(updatedData);
      } catch (error) {
        console.error("Error al guardar la posición de las redes sociales:", error);
      }
    }
  };

  const handleCloseSocialModal = () => {
    setIsSocialModalOpen(false);
    setShowAddSocialForm(false);
    setNewLinkUrl("");
  };

  return {
    isSocialModalOpen,
    setIsSocialModalOpen,
    showAddSocialForm,
    setShowAddSocialForm,
    newLinkUrl,
    setNewLinkUrl,
    deleteConfirmUid,
    setDeleteConfirmUid,
    stableLinks,
    socialPosition,
    handleAddLink,
    handleReorder,
    handleChangeSocialPosition,
    handleCloseSocialModal,
  };
}