"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { getTemplateStyles } from "@/app/config/themeStyles";
import Portfolio from "@/app/components/Portfolio";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Función inteligente que evita transformar colores oscuros/negros en azules u otros tonos brillantes
function getComplementaryBackgroundColor(hex) {
  if (!hex || typeof hex !== "string") return "#1e293b";

  let cleanHex = hex.replace("#", "").toUpperCase();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }

  const num = parseInt(cleanHex.substring(0, 6), 16);
  if (isNaN(num)) return "#1e293b";

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const rNorm = r / 255,
    gNorm = g / 255,
    bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm),
    min = Math.min(rNorm, gNorm, bNorm);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  if (l < 0.15 || s < 0.1) {
    if (l > 0.7) return "#e2e8f0";
    return "#18181b";
  }

  const adjustedLightness = 0.4;
  const adjustedSaturation = Math.min(Math.max(s * 0.85, 0.45), 0.75);

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let q =
    adjustedLightness < 0.5
      ? adjustedLightness * (1 + adjustedSaturation)
      : adjustedLightness + adjustedSaturation - adjustedLightness * adjustedSaturation;
  let p = 2 * adjustedLightness - q;

  const toHex = (x) => {
    const hexVal = Math.round(hue2rgb(p, q, x) * 255).toString(16);
    return hexVal.length === 1 ? "0" + hexVal : hexVal;
  };

  return `#${toHex(h + 1 / 3)}${toHex(h)}${toHex(h - 1 / 3)}`;
}

async function registerPortfolioHomeVisit(docId, slug) {
  if (!docId || typeof window === "undefined") return;

  const sessionKey = `lj_home_visited_${slug || docId}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, "1");

  try {
    const portfolioRef = doc(db, "portfolios", docId);
    await updateDoc(portfolioRef, {
      views: increment(1),
    });

    await addDoc(collection(db, "portfolios", docId, "analyticsEvents"), {
      type: "page_view",
      target: "home",
      slug: slug || "",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error al registrar visita al home:", err);
  }
}

export default function UserPortfolioPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.username?.toLowerCase().trim();

  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioDocId, setPortfolioDocId] = useState(null);
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
          setPortfolioDocId(userDoc.id);
          setPortfolioData(userData);
          registerPortfolioHomeVisit(userDoc.id, slug);
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
      <div className="min-h-screen w-full bg-slate-50 flex items-start justify-center p-0 md:pt-8">
        <div className="w-full max-w-[576px] min-h-screen md:min-h-[calc(100vh-2rem)] bg-white border-0 md:border md:border-slate-200/95  p-6 sm:p-8 flex flex-col items-center animate-pulse shadow-xl md:pt-24 pt-24">
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

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-2 text-purple-400">404</h1>
        <h2 className="text-xl font-bold mb-3">Este portfolio no existe</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          La dirección <code className="text-purple-300 font-mono">lightjaus.com/{slug}</code> no está asociada a ningún creador activo en Lightjaus.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-600/30"
        >
          Volver al inicio.
        </Link>
      </div>
    );
  }

  const currentTemplate = portfolioData.template || "minimal";
  const primaryColor = portfolioData.colors?.primaryColor || "#9333ea";

  const desktopBackground = getComplementaryBackgroundColor(primaryColor);

  return (
    <div
      className="min-h-screen w-full flex justify-center p-0 md:pt-8 md:pb-0 overflow-x-hidden"
      style={{ backgroundColor: desktopBackground }}
    >
      <div className="w-full max-w-[576px] min-h-screen md:min-h-[calc(100vh-2rem)] shadow-2xl flex flex-col overflow-hidden">
        <Portfolio
          portfolioData={portfolioData}
          portfolioDocId={portfolioDocId}
          template={currentTemplate}
        />
      </div>
    </div>
  );
}