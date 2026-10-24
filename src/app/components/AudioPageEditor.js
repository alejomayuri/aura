"use client";

import { useState, useRef, useEffect } from "react";
import { Reorder, AnimatePresence } from "framer-motion";
import Title from "./AdminFormsComponents/Title";
import AudioCardItem from "./AdminFormsComponents/typeMusic/AudioCardItem";

export default function AudioPageEditor({ portfolioData, selectedPageId, updatePortfolio, onSave }) {
  const selectedPage = portfolioData?.pages?.find((p) => (p.id || p.slug) === selectedPageId);

  const [trackUrl, setTrackUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {}
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = selectedPage?.items || [];

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
      }

      if (typeof onSave === "function") {
        await onSave({ ...portfolioData, pages: updatedPages });
      }
    } catch (err) {
      console.error("Error al actualizar los audios:", err);
      setError(`Error al actualizar: ${err.message}`);
    }
  };

  const formatSpotifyUrl = (url) => {
    if (!url) return "";
    try {
      let cleanUrl = url.trim().split("?")[0];

      if (cleanUrl.startsWith("spotify:")) {
        const parts = cleanUrl.split(":");
        if (parts.length >= 3) {
          cleanUrl = `https://open.spotify.com/${parts[1]}/${parts[2]}`;
        }
      }

      cleanUrl = cleanUrl.replace(/\/intl-[a-z]{2}\//, "/");

      if (cleanUrl.includes("/embed/")) {
        return `${cleanUrl}?utm_source=generator&theme=0`;
      }

      const match = cleanUrl.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
      if (match && match[1] && match[2]) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
      }
    } catch (e) {
      console.error("Error formateando URL de Spotify", e);
    }
    return url;
  };

  const detectPlatformName = (url) => {
    try {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "YouTube";
      if (lowerUrl.includes("soundcloud.com")) return "SoundCloud";
      if (lowerUrl.includes("apple.com")) return "Apple Music";
      if (lowerUrl.includes("deezer.com")) return "Deezer";
      if (lowerUrl.includes("tidal.com")) return "Tidal";
      if (lowerUrl.includes("bandcamp.com")) return "Bandcamp";
      
      const hostname = new URL(url).hostname.replace("www.", "");
      return hostname.charAt(0).toUpperCase() + hostname.slice(1).split(".")[0];
    } catch (e) {
      return "Plataforma";
    }
  };

 const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!trackUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const rawUrl = trackUrl.trim();
      const formattedUrl = formatSpotifyUrl(rawUrl);

      let fetchedThumbnail = null;
      let fetchedTitle = "Pista de audio";
      let fetchedArtist = "";

      try {
        const oembedRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(rawUrl)}`);
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.thumbnail_url) {
            fetchedThumbnail = oembedData.thumbnail_url;
          }
          if (oembedData.title) {
            const fullTitle = oembedData.title;
            
            // Spotify oEmbed devuelve títulos como:
            // "Highway Tune - Single de Greta Van Fleet" o "Hypnotize - The Notorious B.I.G."
            if (fullTitle.includes("· Single de")) {
              const parts = fullTitle.split("· Single de");
              fetchedTitle = parts[0].trim();
              fetchedArtist = parts[1].trim();
            } else if (fullTitle.includes("· Álbum de")) {
              const parts = fullTitle.split("· Álbum de");
              fetchedTitle = parts[0].trim();
              fetchedArtist = parts[1].trim();
            } else if (fullTitle.includes(" - ")) {
              const parts = fullTitle.split(" - ");
              fetchedTitle = parts[0].trim();
              fetchedArtist = parts[parts.length - 1].replace(/^(de|por)\s+/i, "").trim();
            } else {
              fetchedTitle = fullTitle;
              fetchedArtist = "Artista";
            }
          }
        }
      } catch (err) {
        console.warn("No se pudo obtener información de oEmbed:", err);
      }

      const newItem = {
        id: crypto.randomUUID(),
        url: formattedUrl,
        originalUrl: rawUrl,
        title: fetchedTitle,
        artist: fetchedArtist || "Artista",
        thumbnail: fetchedThumbnail,
        layout: "classic",
        isActive: true,
        platforms: [],
        createdAt: new Date().toISOString()
      };

      const updatedItems = [newItem, ...items];
      await savePortfolioChanges(updatedItems);

      setTrackUrl("");
      setShowForm(false);
    } catch (err) {
      console.error("Error al añadir pista:", err);
      setError("No se pudo añadir la pista.");
    } finally {
      setLoading(false);
    }
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

  const handleUpdateItemLayout = async (itemId, newLayout) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, layout: newLayout };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  const handleAddPlatform = async (itemId, platformUrl) => {
    const urlToAdd = platformUrl.trim();
    const detectedName = detectPlatformName(urlToAdd);

    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const newPlatform = {
          id: crypto.randomUUID(),
          name: detectedName,
          url: urlToAdd,
          isActive: true
        };
        return {
          ...item,
          platforms: [...(item.platforms || []), newPlatform]
        };
      }
      return item;
    });

    await savePortfolioChanges(updatedItems);
  };

  const handleTogglePlatformActive = async (itemId, platformId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const updatedPlatforms = (item.platforms || []).map((plat) => {
          if (plat.id === platformId) {
            return { ...plat, isActive: plat.isActive === false };
          }
          return plat;
        });
        return { ...item, platforms: updatedPlatforms };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  const handleReorderPlatforms = (itemId, newPlatformsOrder) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, platforms: newPlatformsOrder };
      }
      return item;
    });
    if (typeof updatePortfolio === "function") {
      updatePortfolio({ pages: portfolioData.pages.map(p => (p.id || p.slug) === (selectedPage.id || selectedPage.slug) ? { ...p, items: updatedItems } : p) }, false);
    }
  };

  const handleSavePlatformsOrder = async (itemId) => {
    await savePortfolioChanges(items);
  };

  const handleDeletePlatform = async (itemId, platformId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          platforms: (item.platforms || []).filter(p => p.id !== platformId)
        };
      }
      return item;
    });
    await savePortfolioChanges(updatedItems);
  };

  if (!selectedPage) {
    return <p className="text-xs text-slate-500 italic">Selecciona una página tipo audio válida.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins'] overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <Title 
          title={selectedPage?.title}
          externalRoute={`/${portfolioData.slug}/${selectedPage?.slug}`}
          openInNewTab={true}
        />
        <p className="text-sm text-slate-500">Página tipo audio (Spotify / Podcasts)</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Botón desplegable y Formulario para añadir audio */}
      <div ref={formRef} className="space-y-3">
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-black hover:bg-slate-800 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            <span>+ Añadir audio</span>
          </button>
        )}

        <div className={`grid transition-all duration-300 ease-in-out ${showForm ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
          <div className="overflow-hidden space-y-2">
            <form onSubmit={handleAddTrack} className="bg-white border border-slate-300 p-4 rounded-xl space-y-0.75 shadow-sm">
              <h4 className="text-sm font-medium text-slate-700">Añadir un audio mediante enlace</h4>
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="Pega el enlace de Spotify (ej. https://open.spotify.com/track/...)"
                  value={trackUrl}
                  onChange={(e) => setTrackUrl(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-sm"
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading || !trackUrl.trim()}
                  className="px-5 py-2.5 bg-black text-white hover:bg-slate-800 disabled:opacity-50 rounded-xl text-sm font-medium shadow-sm transition cursor-pointer"
                >
                  {loading ? "Obteniendo datos..." : "+ Añadir canción"}
                </button>
              </div>
            </form>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setTrackUrl("");
                }}
                className="px-4 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pistas */}
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
                <AudioCardItem
                  key={item.id}
                  item={item}
                  onDragEnd={handleDragEnd}
                  onToggleActive={handleToggleActive}
                  onUpdateLayout={handleUpdateItemLayout}
                  onDeleteTrack={handleDeleteItem}
                  onAddPlatform={handleAddPlatform}
                  onTogglePlatformActive={handleTogglePlatformActive}
                  onReorderPlatforms={handleReorderPlatforms}
                  onSavePlatformsOrder={handleSavePlatformsOrder}
                  onDeletePlatform={handleDeletePlatform}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-6">No hay pistas de audio agregadas todavía.</p>
        )}
      </div>
    </div>
  );
}