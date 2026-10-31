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

  // Efecto para hacer que el mensaje de error desaparezca automáticamente a los 4 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  const formatAudioUrl = (url, resolvedSoundCloudUrl = "") => {
    if (!url) return "";
    try {
      let cleanUrl = url.trim();

      // Formatear Spotify
      if (cleanUrl.includes("spotify.com") || cleanUrl.startsWith("spotify:")) {
        let spotifyUrl = cleanUrl.split("?")[0];
        if (spotifyUrl.startsWith("spotify:")) {
          const parts = spotifyUrl.split(":");
          if (parts.length >= 3) {
            spotifyUrl = `https://open.spotify.com/${parts[1]}/${parts[2]}`;
          }
        }
        spotifyUrl = spotifyUrl.replace(/\/intl-[a-z]{2}\//, "/");
        const match = spotifyUrl.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
        if (match && match[1] && match[2]) {
          return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
        }
        return spotifyUrl;
      }

      // Formatear YouTube / YouTube Music
      if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be") || cleanUrl.includes("music.youtube.com")) {
        let videoId = "";
        
        if (cleanUrl.includes("youtu.be/")) {
          videoId = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
        } else if (cleanUrl.includes("watch?v=")) {
          const urlParams = new URLSearchParams(cleanUrl.split("?")[1]);
          videoId = urlParams.get("v");
        } else if (cleanUrl.includes("/embed/")) {
          videoId = cleanUrl.split("/embed/")[1]?.split("?")[0];
        }

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Formatear SoundCloud
      const targetScUrl = resolvedSoundCloudUrl || cleanUrl;
      if (cleanUrl.includes("soundcloud.com") || cleanUrl.includes("on.soundcloud.com")) {
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(targetScUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
      }
    } catch (e) {
      console.error("Error formateando URL de audio", e);
    }
    return url;
  };

  const detectPlatformName = (url) => {
    try {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes("music.apple.com")) return "Apple Music";
      if (lowerUrl.includes("music.youtube.com")) return "YouTube Music";
      if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "YouTube";
      if (lowerUrl.includes("soundcloud.com") || lowerUrl.includes("on.soundcloud.com")) return "SoundCloud";
      if (lowerUrl.includes("spotify.com") || lowerUrl.startsWith("spotify:")) return "Spotify";
      
      const hostname = new URL(url).hostname.replace("www.", "");
      return hostname.charAt(0).toUpperCase() + hostname.slice(1).split(".")[0];
    } catch (e) {
      return "Plataforma";
    }
  };

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!trackUrl.trim()) return;

    const rawUrl = trackUrl.trim();
    const lowerRawUrl = rawUrl.toLowerCase();

    // Validación: Solo se permite Spotify, YouTube Music o SoundCloud
    const isSpotify = lowerRawUrl.includes("spotify.com") || lowerRawUrl.startsWith("spotify:");
    const isYouTube = lowerRawUrl.includes("youtube.com") || lowerRawUrl.includes("youtu.be") || lowerRawUrl.includes("music.youtube.com");
    const isSoundCloud = lowerRawUrl.includes("soundcloud.com") || lowerRawUrl.includes("on.soundcloud.com");

    if (!isSpotify && !isYouTube && !isSoundCloud) {
      setError("Solo se permite añadir enlaces de Spotify, YouTube Music o SoundCloud.");
      setTrackUrl(""); // <- Limpia el input inmediatamente al fallar la validación
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const platformName = detectPlatformName(rawUrl);

      let fetchedThumbnail = null;
      let fetchedTitle = "Pista de audio";
      let fetchedArtist = "Artista";
      let resolvedSoundCloudUrl = "";

      if (isSpotify) {
        try {
          const res = await fetch("/api/spotify-track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: rawUrl }),
          });

          const data = await res.json();

          if (res.ok) {
            if (data.title) fetchedTitle = data.title;
            if (data.artist) fetchedArtist = data.artist.replace(/ - Topic$/i, "").trim();
            if (data.thumbnail) fetchedThumbnail = data.thumbnail;
          }
        } catch (apiErr) {
          console.warn("Error de red al conectar con la API de Spotify:", apiErr);
        }
      } 
      else if (isYouTube) {
        try {
          let videoId = "";
          if (rawUrl.includes("youtu.be/")) {
            videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0];
          } else if (rawUrl.includes("watch?v=")) {
            const urlParams = new URLSearchParams(rawUrl.split("?")[1]);
            videoId = urlParams.get("v");
          }

          if (videoId) {
            fetchedThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            
            const oEmbedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            if (oEmbedRes.ok) {
              const oEmbedData = await oEmbedRes.json();
              if (oEmbedData.title) {
                fetchedTitle = oEmbedData.title;
              }
              if (oEmbedData.author_name) {
                fetchedArtist = oEmbedData.author_name.replace(/ - Topic$/i, "").trim();
              }
            }
          }
        } catch (ytErr) {
          console.warn("No se pudo obtener la información de YouTube mediante oEmbed", ytErr);
          fetchedTitle = "Pista de YouTube Music";
        }
      }
      else if (isSoundCloud) {
        try {
          const oEmbedRes = await fetch(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(rawUrl)}`);
          if (oEmbedRes.ok) {
            const oEmbedData = await oEmbedRes.json();
            
            if (oEmbedData.title) {
              const fullTitle = oEmbedData.title;
              if (fullTitle.includes(" by ")) {
                const parts = fullTitle.split(" by ");
                fetchedTitle = parts[0];
                fetchedArtist = parts[1];
              } else {
                fetchedTitle = fullTitle;
              }
            }
            if (oEmbedData.author_name) {
              fetchedArtist = oEmbedData.author_name;
            }
            if (oEmbedData.thumbnail_url) {
              fetchedThumbnail = oEmbedData.thumbnail_url;
            }

            if (oEmbedData.html) {
              const srcMatch = oEmbedData.html.match(/src="([^"]+)"/);
              if (srcMatch && srcMatch[1]) {
                const parsedIframeUrl = new URL(srcMatch[1]);
                const trackParam = parsedIframeUrl.searchParams.get("url");
                if (trackParam) {
                  resolvedSoundCloudUrl = trackParam;
                }
              }
            }
          }
        } catch (scErr) {
          console.warn("No se pudo obtener la información de SoundCloud mediante oEmbed", scErr);
          fetchedTitle = "Pista de SoundCloud";
        }
      }

      const formattedUrl = formatAudioUrl(rawUrl, resolvedSoundCloudUrl);

      const newItem = {
        id: crypto.randomUUID(),
        url: formattedUrl,
        originalUrl: rawUrl,
        title: fetchedTitle,
        artist: fetchedArtist,
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
        <p className="text-sm text-slate-500">Página tipo audio (Spotify / YouTube Music / SoundCloud / Podcasts)</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl transition-all duration-300">
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
                  placeholder="Pega el enlace (ej. Spotify, YouTube Music o SoundCloud)..."
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
                  setError(null);
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