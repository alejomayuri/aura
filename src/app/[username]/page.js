"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { getTemplateStyles } from "@/app/config/themeStyles";
import Portfolio from "@/app/components/Portfolio";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Función inteligente que evita transformar colores oscuros/negros en azules u otros tonos brillantes
function getComplementaryBackgroundColor(hex) {
  if (!hex || typeof hex !== "string") return "#1e293b";

  let cleanHex = hex.replace("#", "").toUpperCase();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }

  const num = parseInt(cleanHex.substring(0, 6), 16); // Ignoramos canal alfa si lo trae (ej: ff)
  if (isNaN(num)) return "#1e293b";

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; 
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  // 1. SI EL COLOR PRINCIPAL ES OSCURO (Luminosidad baja, < 0.15) o NEUTRO (Saturación baja, < 0.10):
  // Devolvemos un gris neutro elegante (más claro que el negro, sin matices de colores extraños).
  if (l < 0.15 || s < 0.10) {
    if (l > 0.7) return "#e2e8f0"; // Blanco / gris claro
    return "#18181b"; // Gris oscuro neutro y sobrio (evita por completo el azul)
  }

  // 2. PARA COLORES VIVOS / CLAROS: Aplicamos el punto medio adaptativo con total seguridad
  const adjustedLightness = 0.40; 
  const adjustedSaturation = Math.min(Math.max(s * 0.85, 0.45), 0.75); 

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let q = adjustedLightness < 0.5 ? adjustedLightness * (1 + adjustedSaturation) : adjustedLightness + adjustedSaturation - adjustedLightness * adjustedSaturation;
  let p = 2 * adjustedLightness - q;

  const toHex = x => {
    const hexVal = Math.round(hue2rgb(p, q, x) * 255).toString(16);
    return hexVal.length === 1 ? "0" + hexVal : hexVal;
  };

  return `#${toHex(h + 1/3)}${toHex(h)}${toHex(h - 1/3)}`;
}

export default function UserPortfolioPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.username?.toLowerCase().trim();

  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserFromFirestore = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "portfolios"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(true);
        } else {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setPortfolioData(userData);
        }
      } catch (err) {
        console.error("Error al obtener el portfolio desde Firebase:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchUserFromFirestore();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-slate-400">Cargando aura.com/{slug}...</p>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-2 text-purple-400">404</h1>
        <h2 className="text-xl font-bold mb-3">Este portfolio no existe</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          La dirección <code className="text-purple-300 font-mono">aura.com/{slug}</code> no está asociada a ningún creador activo en Aura.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-600/30"
        >
          Volver al inicio de Aura
        </Link>
      </div>
    );
  }

  const currentTemplate = portfolioData.template || "minimal";
  const primaryColor = portfolioData.colors?.primaryColor || "#9333ea";
  
  const desktopBackground = getComplementaryBackgroundColor(primaryColor);

  return (
    <div className="min-h-screen w-full flex justify-center py-0 md:py-8" style={{ backgroundColor: desktopBackground }}>
        <Portfolio 
          portfolioData={portfolioData} 
          template={currentTemplate} 
        />
    </div>
  );
}