/*Devuelve la URL del icono SVG correspondiente según la URL de la red social.*/
export function getSocialIcon(url) {
  if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes("instagram.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
  if (lowerUrl.includes("whatsapp.com") || lowerUrl.includes("wa.me")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
  if (lowerUrl.includes("linkedin.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
  if (lowerUrl.includes("github.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
  if (lowerUrl.includes("music.youtube")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtubemusic.svg";
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
  if (lowerUrl.includes("facebook.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
  if (lowerUrl.includes("tiktok.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
  if (lowerUrl.includes("spotify")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/spotify.svg";
  if (lowerUrl.includes("music.apple")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/applemusic.svg";
  
  return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
}