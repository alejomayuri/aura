"use client";

import { useState } from "react";

export default function AdminForm({ portfolioData, setPortfolioData, onSave, saving, saveMessage }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);

  // Estado local para el campo de texto del nuevo link que se está escribiendo
  const [newLinkUrl, setNewLinkUrl] = useState("");

  // Manejador local de selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
  };

  // Función para detectar la red social y retornar el ícono correspondiente de la CDN
  const getSocialIcon = (url) => {
    if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg"; // Ícono por defecto (Web)
    
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
    } else if (lowerUrl.includes("whatsapp.com") || lowerUrl.includes("wa.me")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
    } else if (lowerUrl.includes("linkedin.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
    } else if (lowerUrl.includes("github.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
    } else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
    } else if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
    } else if (lowerUrl.includes("facebook.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
    } else if (lowerUrl.includes("tiktok.com")) {
      return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
    }
    
    return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  };

  // Agregar un nuevo link a la lista
  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    const currentLinks = portfolioData.socialLinks || [];
    const updatedLinks = [...currentLinks, { url: newLinkUrl.trim() }];
    
    setPortfolioData({ ...portfolioData, socialLinks: updatedLinks });
    setNewLinkUrl(""); // Limpiamos el input
  };

  // Eliminar un link existente de la lista
  const handleRemoveLink = (indexToRemove) => {
    const currentLinks = portfolioData.socialLinks || [];
    const updatedLinks = currentLinks.filter((_, index) => index !== indexToRemove);
    setPortfolioData({ ...portfolioData, socialLinks: updatedLinks });
  };

  // Función modificada para asegurar que el objeto actualizado viaje directo a Firestore
  const handleSaveWithUpload = async () => {
    let finalImageUrl = portfolioData.mainImage;
    let updatedData = { ...portfolioData };

    if (selectedFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "pataki_portfolio_upload"); 

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dz3p460iu/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
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

      {/* Campo: Título Principal */}
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

      {/* Campo: Imagen Principal con Vista Previa Local */}
      <div className="space-y-3 pt-2 border-t border-purple-100">
        <label className="text-base font-semibold text-slate-900 block">Imagen Principal</label>
        
        <div className="w-full bg-transparent p-0 flex justify-start">
          <div className="relative w-full max-w-[240px] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
            {currentImageDisplay ? (
              <img 
                src={currentImageDisplay} 
                alt="Imagen principal actual" 
                className="w-full h-auto object-contain max-h-[300px]"
              />
            ) : (
              <span className="text-xs text-slate-400 italic py-10">No hay imagen principal seleccionada</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-900 px-5 py-3 rounded-xl text-sm font-medium transition border border-purple-100 shadow-sm">
            {uploading ? "Subiendo..." : "Cambiar Imagen"}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileSelect} 
              className="hidden" 
              disabled={uploading || saving}
            />
          </label>
          {selectedFile && !uploading && (
            <span className="text-xs text-amber-600 italic">Imagen lista para guardar...</span>
          )}
          {uploading && <span className="text-xs text-purple-600">Subiendo a Cloudinary...</span>}
        </div>
      </div>

      {/* Campo: Descripción Informativa */}
      <div className="space-y-3 pt-2 border-t border-purple-100">
        <label className="text-base font-semibold text-slate-900 block">Descripción / Texto Informativo</label>
        <textarea
          rows="3"
          value={portfolioData.description || ""}
          onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
          className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 resize-none shadow-sm"
          placeholder="Escribe una breve bio o descripción para tu portfolio..."
        />
      </div>

      {/* SECCIÓN: Gestión de Links / Redes Sociales en Bloque Gris Claro */}
      <div className="space-y-3 pt-4 pb-4 px-4 bg-slate-50 border border-purple-100 rounded-2xl shadow-sm">
        <label className="text-base font-semibold text-slate-900 flex items-center justify-between">
          <span>Redes Sociales y Enlaces</span>
          <span className="text-xs text-slate-500 font-normal">Se detecta el ícono automáticamente</span>
        </label>

        {/* Lista de links existentes */}
        <div className="space-y-2 pt-1">
          {portfolioData.socialLinks && portfolioData.socialLinks.length > 0 ? (
            portfolioData.socialLinks.map((linkItem, index) => {
              const iconUrl = getSocialIcon(linkItem.url);
              return (
                <div key={index} className="flex items-center gap-3 bg-white border border-purple-100 rounded-xl px-3.5 py-3 shadow-sm">
                  <div className="w-9 h-9 flex items-center justify-center bg-purple-50 border border-purple-100 rounded-lg shrink-0">
                    <img 
                      src={iconUrl} 
                      alt="Ícono red social" 
                      className="w-4.5 h-4.5 text-slate-900" 
                    />
                  </div>
                  <input
                    type="text"
                    value={linkItem.url}
                    onChange={(e) => {
                      const updatedLinks = [...portfolioData.socialLinks];
                      updatedLinks[index].url = e.target.value;
                      setPortfolioData({ ...portfolioData, socialLinks: updatedLinks });
                    }}
                    className="w-full bg-transparent border-none text-sm text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="text-slate-400 hover:text-rose-600 text-sm px-3 py-1 transition cursor-pointer"
                    title="Eliminar link"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 italic">No hay enlaces agregados todavía.</p>
          )}
        </div>

        {/* Espacio abajo para colocar un nuevo link */}
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

      {/* Botón de Guardar */}
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