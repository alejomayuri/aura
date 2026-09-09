"use client";

import { useState, useMemo } from "react";
import { Reorder } from "framer-motion";

export default function AdminForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const stableLinks = useMemo(() => {
    const links = portfolioData.socialLinks || [];
    return links.map(link => ({
      ...link,
      uid: link.id || link.uid || link.url
    }));
  }, [portfolioData.socialLinks]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const getSocialIcon = (url) => {
    if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
    if (lowerUrl.includes("whatsapp.com") || lowerUrl.includes("wa.me")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
    if (lowerUrl.includes("linkedin.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
    if (lowerUrl.includes("github.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
    if (lowerUrl.includes("facebook.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
    if (lowerUrl.includes("tiktok.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
    return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  };

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    const newLink = { uid: Date.now().toString(), url: newLinkUrl.trim() };
    setPortfolioData({ ...portfolioData, socialLinks: [...stableLinks, newLink] });
    setNewLinkUrl("");
  };

  const handleRemoveLink = (uidToRemove) => {
    setPortfolioData({
      ...portfolioData,
      socialLinks: stableLinks.filter((link) => link.uid !== uidToRemove),
    });
  };

  const handleReorder = (newSocialLinks) => {
    setPortfolioData({ ...portfolioData, socialLinks: newSocialLinks });
  };

  const handleSaveWithUpload = async () => {
    let finalImageUrl = portfolioData.mainImage;
    let updatedData = { ...portfolioData, socialLinks: stableLinks };

    if (selectedFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "pataki_portfolio_upload");

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dz3p460iu/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          finalImageUrl = data.secure_url;
          updatedData.mainImage = finalImageUrl;
          setPortfolioData(updatedData);
        }
      } catch (error) {
        console.error("Error al subir la imagen a Cloudinary:", error);
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    if (typeof onSave === "function") {
      await onSave(updatedData);
    } else {
      await onSave();
    }

    setSelectedFile(null);
    setLocalPreview(null);
  };

  const currentImageDisplay = localPreview || portfolioData.mainImage || portfolioData.imagen || portfolioData.image;

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Página Principal</h2>
        {saveMessage && (
          <span className={`text-sm px-3.5 py-1.5 rounded-lg font-medium border ${
            saveMessage.includes("exito") || saveMessage.includes("éxito") 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
            {saveMessage}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-base font-semibold text-slate-900 block">Título Principal</label>
        <input
          type="text"
          value={portfolioData.title || ""}
          onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
          className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 shadow-sm"
          placeholder="Ej. Mi Portfolio Profesional"
        />
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-base font-semibold text-slate-900 block">Imagen Principal</label>
        <div className="w-full bg-transparent p-0 flex justify-start">
          <div className="relative w-full max-w-[240px] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
            {currentImageDisplay ? (
              <img src={currentImageDisplay} alt="Imagen principal actual" className="w-full h-auto object-contain max-h-[300px]" />
            ) : (
              <span className="text-xs text-slate-400 italic py-10">No hay imagen principal seleccionada</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="cursor-pointer bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ? "Subiendo..." : "Cambiar Imagen"}
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={uploading || saving} />
          </label>
          {selectedFile && !uploading && <span className="text-xs text-amber-600 italic">Imagen lista para guardar...</span>}
          {uploading && <span className="text-xs text-purple-600">Subiendo a Cloudinary...</span>}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-base font-semibold text-slate-900 block">Biografía</label>
        <textarea
          rows="3"
          value={portfolioData.description || ""}
          onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
          className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 resize-none shadow-sm"
          placeholder="Escribe una breve bio o descripción para tu portfolio..."
        />
      </div>

      <div className="space-y-3 pt-4 pb-4 px-4 bg-slate-50 border border-purple-100 rounded-2xl shadow-sm">
        <label className="text-base font-semibold text-slate-900 block">Redes Sociales y Enlaces</label>

        {stableLinks.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={stableLinks} 
            onReorder={handleReorder}
            className="space-y-2.5 pt-1 list-none"
          >
            {stableLinks.map((linkItem) => {
              const iconUrl = getSocialIcon(linkItem.url);

              return (
                <Reorder.Item 
                  key={linkItem.uid}
                  value={linkItem}
                  whileDrag={{
                    scale: 1.02,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    zIndex: 50,
                  }}
                  className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-3 shadow-sm border border-purple-100 hover:border-purple-200 cursor-grab active:cursor-grabbing relative select-none"
                >
                  {/* Puntos más pequeños (w-0.5 h-0.5) y compactos (gap-0.5) */}
                  <div className="text-slate-600 hover:text-purple-700 flex flex-col gap-0.5 justify-center shrink-0 px-1 transition-colors cursor-grab active:cursor-grabbing" title="Arrastrar para ordenar">
                    <div className="flex gap-0.5">
                      <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                      <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                    </div>
                    <div className="flex gap-0.5">
                      <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                      <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                    </div>
                    <div className="flex gap-0.5">
                      <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                      <span className="w-0.5 h-0.5 bg-current rounded-full"></span>
                    </div>
                  </div>

                  <div className="w-9 h-9 flex items-center justify-center bg-purple-50 border border-purple-100 rounded-lg shrink-0 pointer-events-none">
                    <img src={iconUrl} alt="Ícono red social" className="w-4.5 h-4.5 text-slate-900" />
                  </div>
                  
                  <input
                    type="text"
                    value={linkItem.url}
                    onChange={(e) => {
                      const updatedLinks = stableLinks.map(l => 
                        l.uid === linkItem.uid ? { ...l, url: e.target.value } : l
                      );
                      setPortfolioData({ ...portfolioData, socialLinks: updatedLinks });
                    }}
                    className="w-full bg-transparent border-none text-sm text-slate-900 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveLink(linkItem.uid)}
                    className="text-slate-400 hover:text-rose-600 text-sm px-3 py-1 transition cursor-pointer"
                    title="Eliminar link"
                  >
                    ✕
                  </button>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <p className="text-xs text-slate-500 italic pt-1">No hay enlaces agregados todavía.</p>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
            className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 shadow-sm"
            placeholder="Ej. https://instagram.com/tu_usuario o cualquier web"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-medium transition border border-purple-100 shrink-0 cursor-pointer"
          >
            Añadir
          </button>
        </div>
      </div>

      <button
        onClick={handleSaveWithUpload}
        disabled={saving || uploading}
        className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition focus:outline-none shadow-md cursor-pointer"
      >
        {uploading ? "Subiendo imagen..." : saving ? "Guardando..." : "Guardar Cambios en Firestore"}
      </button>
    </div>
  );
}