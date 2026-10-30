"use client";

import { use } from "react";
import Portfolio from "@/app/components/Portfolio";
import { demo1, demo2 } from "@/app/config/demos";
// Importa también tus otros demos si los tienes en el archivo de configuración:
// import { demo1, demo2, demo3 } from "@/app/config/demos";

// Objeto que mapea el nombre del demo de la URL con su respectivo archivo/objeto de datos
const demoMap = {
  demo1: demo1,
  demo2: demo2,
  // demo3: demo3, // Descomenta e importa cuando tengas demo3
};

// Función inteligente que evita transformar colores oscuros/negros en azules u otros tonos brillantes
function getComplementaryBackgroundColor(hex) {
  if (!hex || typeof hex !== "string") return "#1e293b";

  let cleanHex = hex.replace("#", "").toUpperCase();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }

  const num = parseInt(cleanHex.substring(0, 6), 16); 
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

  if (l < 0.15 || s < 0.10) {
    if (l > 0.7) return "#e2e8f0"; 
    return "#18181b"; 
  }

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
  // En Next.js (App Router), params se unwrapea usando React.use() en componentes cliente
  const resolvedParams = use(params);
  const demoKey = resolvedParams?.demo; // Captura el valor de [demo] de la URL

  // Selecciona el demo según el mapa, o por defecto usa demo1 si no existe
  const portfolioData = demoMap[demoKey] || demo1;

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