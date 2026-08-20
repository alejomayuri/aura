"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);

      // Si el usuario ya tiene un slug configurado, lo enviamos directamente al dashboard
      try {
        const docRef = doc(db, "portfolios", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().slug) {
          router.push("/admin");
          return;
        }
      } catch (err) {
        console.error("Error al verificar datos existentes:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Formatear automáticamente el input para que sea un slug válido
  const handleSlugChange = (e) => {
    const rawValue = e.target.value;
    const formattedSlug = rawValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Reemplaza espacios por guiones
      .replace(/[^a-z0-9-]/g, ""); // Elimina caracteres no alfanuméricos

    setSlug(formattedSlug);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!slug) {
      setError("Por favor escribe una URL para tu portfolio.");
      return;
    }

    if (slug.length < 3) {
      setError("La URL debe tener al menos 3 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Verificar si el slug ya existe en Firestore para OTRO usuario
      const portfoliosRef = collection(db, "portfolios");
      const q = query(portfoliosRef, where("slug", "==", slug));
      const querySnapshot = await getDocs(q);

      const isTaken = querySnapshot.docs.some(docSnap => docSnap.id !== user.uid);

      if (isTaken) {
        setError("Esta URL ya está en uso. Por favor elige otra.");
        setSubmitting(false);
        return;
      }

      // 2. Guardar o actualizar el documento del portfolio con el nuevo slug
      const userDocRef = doc(db, "portfolios", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // Actualizar añadiendo el slug
        await setDoc(userDocRef, { slug }, { merge: true });
      } else {
        // Crear plantilla base por defecto si es usuario nuevo
        await setDoc(userDocRef, {
          slug,
          title: "Mi Portfolio",
          mainImage: "",
          template: "minimal",
          pages: [],
          createdAt: new Date().toISOString()
        });
      }

      // 3. Redirigir al panel de administración
      router.push("/admin");
    } catch (err) {
      console.error("Error guardando el slug:", err);
      setError("Ocurrió un error al guardar tu URL. Inténtalo de nuevo.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden px-4">
      {/* Efectos decorativos de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
            Paso 2 de 2
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Elige tu URL</h2>
          <p className="text-sm text-slate-400 mt-2">
            Esta será la dirección única con la que tus visitantes accederán a tu portfolio.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Tu enlace personalizado
            </label>
            <div className="flex items-center rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
              <span className="px-3 py-3 text-slate-500 text-sm font-mono border-r border-slate-800/80 bg-slate-900/50 select-none shrink-0">
                aura.com/
              </span>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="mi-nombre"
                required
                maxLength={30}
                className="w-full px-3 py-3 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none text-sm font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Solo letras minúsculas, números y guiones. Sin espacios.
            </p>
          </div>

          {/* Vista previa en vivo */}
          {slug && (
            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Tu web estará disponible en:</span>
              <span className="text-xs font-mono font-semibold text-purple-400 break-all">
                https://aura.com/{slug}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !slug}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-600/25 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {submitting ? "Reservando tu URL..." : "Continuar al Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}