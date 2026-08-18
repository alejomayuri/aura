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
    
    // Si no coincide con ninguna conocida, retorna el ícono genérico por defecto
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
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">Página Principal</h2>
        {saveMessage && (
          <span className={`text-xs px-3 py-1 rounded-lg font-medium border ${
            saveMessage.includes("exito") || saveMessage.includes("éxito") 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}>
            {saveMessage}
          </span>
        )}
      </div>

      {/* Campo: Título Principal */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300">Título Principal</label>
        <input
          type="text"
          value={portfolioData.title || ""}
          onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
          placeholder="Ej. Mi Portfolio Profesional"
        />
      </div>

      {/* Campo: Descripción Informativa */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300">Descripción / Texto Informativo</label>
        <textarea
          rows="3"
          value={portfolioData.description || ""}
          onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 resize-none"
          placeholder="Escribe una breve bio o descripción para tu portfolio..."
        />
      </div>

      {/* NUEVA SECCIÓN: Gestión de Links / Redes Sociales */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Redes Sociales y Enlaces</span>
          <span className="text-[10px] text-slate-500">Se detecta el ícono automáticamente</span>
        </label>

        {/* Lista de links existentes */}
        <div className="space-y-2">
          {portfolioData.socialLinks && portfolioData.socialLinks.length > 0 ? (
            portfolioData.socialLinks.map((linkItem, index) => {
              const iconUrl = getSocialIcon(linkItem.url);
              return (
                <div key={index} className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                    <img 
                      src={iconUrl} 
                      alt="Ícono red social" 
                      className="w-3.5 h-3.5 opacity-80" 
                      style={{ filter: "invert(1)" }} 
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
                    className="w-full bg-transparent border-none text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1 transition"
                    title="Eliminar link"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-[11px] text-slate-500 italic">No hay enlaces agregados todavía.</p>
          )}
        </div>

        {/* Espacio abajo para colocar un nuevo link */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
            placeholder="Ej. https://instagram.com/tu_usuario o cualquier web"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium transition border border-slate-700 shrink-0"
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Campo: Imagen Principal con Vista Previa Local */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-medium text-slate-300">Imagen Principal</label>
        
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/50 flex items-center justify-center">
          {currentImageDisplay ? (
            <img 
              src={currentImageDisplay} 
              alt="Imagen principal actual" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-slate-500 italic">No hay imagen principal seleccionada</span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium transition border border-slate-700">
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
            <span className="text-xs text-amber-400 italic">Imagen lista para guardar...</span>
          )}
          {uploading && <span className="text-xs text-purple-400">Subiendo a Cloudinary...</span>}
        </div>
      </div>

      {/* Botón de Guardar */}
      <button
        onClick={handleSaveWithUpload}
        disabled={saving || uploading}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-xs transition focus:outline-none shadow-lg shadow-purple-600/25"
      >
        {uploading ? "Subiendo imagen..." : saving ? "Guardando..." : "Guardar Cambios en Firestore"}
      </button>
    </div>
  );
}