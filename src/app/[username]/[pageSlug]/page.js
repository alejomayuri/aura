"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import PagePreview from "@/app/components/PagePreview";

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

export default function PublicCustomPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.username?.toLowerCase().trim();
  const pageSlug = resolvedParams.pageSlug?.toLowerCase().trim();

  const [portfolioData, setPortfolioData] = useState(null);
  const [targetPage, setTargetPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPortfolioAndPage = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "portfolios"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(true);
        } else {
          const userData = querySnapshot.docs[0].data();
          setPortfolioData(userData);

          const foundPage = userData?.pages?.find(
            (p) => p.slug === pageSlug || p.id === pageSlug
          );

          if (!foundPage) {
            setError(true);
          } else {
            setTargetPage(foundPage);
          }
        }
      } catch (err) {
        console.error("Error al obtener la página desde Firebase:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug && pageSlug) {
      fetchPortfolioAndPage();
    }
  }, [slug, pageSlug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-start justify-center p-0 md:pt-8">
        <div className="w-full max-w-[576px] min-h-screen md:min-h-[calc(100vh-2rem)] bg-white border-0 md:border md:border-slate-200/95 md:rounded-t-[32px] p-6 sm:p-8 flex flex-col items-center animate-pulse shadow-xl md:pt-24 pt-24">
          {/* Avatar Skeleton */}
          <div className="w-28 h-28 bg-slate-100 rounded-full mb-6 border border-slate-200/50" />
          
          {/* Título y subtítulo Skeleton */}
          <div className="w-56 h-6 bg-slate-100 rounded-xl mb-3" />
          <div className="w-36 h-4 bg-slate-100 rounded-lg mb-8" />
          
          {/* Redes sociales o iconos Skeleton */}
          <div className="flex gap-3 mb-8">
            <div className="w-11 h-11 bg-slate-100 rounded-2xl" />
            <div className="w-11 h-11 bg-slate-100 rounded-2xl" />
            <div className="w-11 h-11 bg-slate-100 rounded-2xl" />
            <div className="w-11 h-11 bg-slate-100 rounded-2xl" />
          </div>

          {/* Tarjetas / Enlaces Skeleton con bloques de distintos altos */}
          <div className="w-full space-y-4">
            <div className="w-full h-16 bg-slate-100/90 rounded-2xl border border-slate-200/40" />
            <div className="w-full h-20 bg-slate-100/90 rounded-2xl border border-slate-200/40" />
            <div className="w-full h-14 bg-slate-100/90 rounded-2xl border border-slate-200/40" />
            <div className="w-full h-24 bg-slate-100/90 rounded-2xl border border-slate-200/40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !portfolioData || !targetPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-2 text-purple-400">404</h1>
        <h2 className="text-xl font-bold mb-3">Esta página no existe</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          La dirección <code className="text-purple-300 font-mono">aura.com/{slug}/{pageSlug}</code> no está disponible.
        </p>
        <Link 
          href={`/${slug}`} 
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-600/30"
        >
          Volver al portfolio de {portfolioData?.title || slug}
        </Link>
      </div>
    );
  }

  const currentTemplate = portfolioData.template || "minimal";
  const primaryColor = portfolioData.colors?.primaryColor || "#9333ea";
  
  const desktopBackground = getComplementaryBackgroundColor(primaryColor);

  return (
        <div className="min-h-screen w-full flex justify-center py-0 md:py-8" style={{ backgroundColor: desktopBackground }}>
          <PagePreview page={targetPage} portfolioData={portfolioData} />
        </div>
  );
}