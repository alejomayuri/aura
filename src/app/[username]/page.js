"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Portfolio from "@/app/components/Portfolio";
import { getTemplateStyles } from "@/app/config/themeStyles"; // Asegúrate de ajustar esta ruta según la ubicación real de tu función de estilos
import { db } from "@/lib/firebase"; // Asegúrate de que esta sea la ruta correcta a tu instancia de Firebase
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserPortfolioPage({ params }) {
  // Resolvemos los parámetros dinámicos de la URL en Next.js (App Router)
  const resolvedParams = use(params);
  // Normalizamos el slug por si el usuario escribe mayúsculas o espacios
  const slug = resolvedParams.username?.toLowerCase().trim();

  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserFromFirestore = async () => {
      setLoading(true);
      try {
        // Consultamos en la colección de portfolios filtrando por el campo "slug"
        const q = query(collection(db, "portfolios"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(true);
        } else {
          // Tomamos el primer documento que coincida con el slug
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

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-slate-400">Cargando aura.com/{slug}...</p>
      </div>
    );
  }

  // Pantalla de error si no se encuentra el usuario en Firebase
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

  // Obtenemos el template actual y sus estilos correspondientes
  const currentTemplate = portfolioData.template || "minimal";
  const styles = getTemplateStyles(currentTemplate);

  return (
    <main className={`${styles.bgScreen || "min-h-screen bg-slate-950 relative"} pt-0 xl:pt-12`}>
      {/* Renderizamos el componente Portfolio adaptando el fondo de pantalla general por template */}
        <Portfolio 
          portfolioData={portfolioData} 
          template={currentTemplate} 
        />
    </main>
  );
}