"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import PagePreview from "@/app/components/PagePreview";

export default function PublicCustomPage({ params }) {
  // Resolvemos los parámetros dinámicos de la URL en Next.js (App Router)
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
        // Consultamos en la colección de portfolios filtrando por el campo "slug"
        const q = query(collection(db, "portfolios"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(true);
        } else {
          const userData = querySnapshot.docs[0].data();
          setPortfolioData(userData);

          // Buscamos dentro del array "pages" la página que coincida con el pageSlug o id
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

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-slate-400">Cargando página...</p>
      </div>
    );
  }

  // Pantalla de error 404 si no se encuentra el portfolio o la subpágina
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      {/* Navegación superior para regresar al portfolio principal */}
      <nav className="w-full max-w-xl mb-6 flex items-center justify-between">
        <Link 
          href={`/${slug}`} 
          className="text-xs uppercase font-bold tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Volver a {portfolioData?.title || slug}
        </Link>
        <span className="text-xs font-mono text-slate-600">/{slug}/{pageSlug}</span>
      </nav>

      {/* Renderizado idéntico usando tu componente PagePreview */}
      <div className="w-full max-w-xl flex flex-col items-center">
        <PagePreview page={targetPage} portfolioData={portfolioData} />
      </div>
    </main>
  );
}