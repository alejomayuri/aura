"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import PagePreview from "@/app/components/PagePreview";

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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-slate-400">Cargando página...</p>
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

  return (
        <PagePreview page={targetPage} portfolioData={portfolioData} />
  );
}