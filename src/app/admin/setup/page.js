"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Lista de palabras reservadas que no se pueden usar como URL
  const reservedSlugs = [
    "admin",
    "login",
    "register",
    "signup",
    "dashboard",
    "api",
    "auth",
    "setup",
    "settings",
    "support",
    "help",
    "terms",
    "privacy"
  ];

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

  // Formatear automáticamente el input para que sea un slug válido (incluyendo guion bajo)
  const handleSlugChange = (e) => {
    const rawValue = e.target.value;
    const formattedSlug = rawValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Reemplaza espacios por guiones
      .replace(/[^a-z0-9-_]/g, ""); // Permite letras, números, guion medio y guion bajo

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

    // Validar si la URL está en la lista de palabras reservadas
    if (reservedSlugs.includes(slug)) {
      setError("Esta palabra no puede ser utilizada como URL.");
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
      <div className="flex h-screen items-center justify-center bg-white text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-slate-900 relative overflow-hidden px-4">
      {/* Logo fijo arriba a la izquierda */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20">
        <Link href="/">
          <img 
            src="/logo.png" 
            alt="lightjaus Logo" 
            className="h-12 sm:h-16 object-contain brightness-0" 
          />
        </Link>
      </div>

      {/* Efectos decorativos de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl p-12 sm:p-16 bg-white text-center relative z-10 mx-auto flex flex-col items-center justify-center">
        <div className="text-center mb-10 w-full max-w-xl">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Elige tu username</h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 font-normal">
            Reconocible y que te represente
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center gap-3 w-full max-w-xl text-left">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-xl">
          <div className="text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Tu enlace personalizado
            </label>
            <div className="flex items-center rounded-2xl bg-purple-50/50 border border-purple-200/80 overflow-hidden focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/20 transition-all shadow-inner">
              <span className="px-4 py-4 text-slate-500 text-base font-mono border-r border-purple-200 bg-purple-100/50 select-none shrink-0">
                lightjaus.com/
              </span>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="mi-nombre"
                required
                maxLength={30}
                className="w-full px-4 py-4 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base font-mono"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Solo letras minúsculas, números, guiones y guiones bajos. Sin espacios.
            </p>
          </div>

          {/* Vista previa en vivo */}
          {slug && (
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-center shadow-sm">
              <span className="text-xs text-slate-600 block mb-1">Tu web estará disponible en:</span>
              <span className="text-sm font-mono font-bold text-purple-900 break-all">
                https://lightjaus.com/{slug}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !slug}
            className="w-full py-4 px-6 bg-purple-900 hover:bg-purple-800 text-white font-semibold text-lg rounded-2xl shadow-lg shadow-purple-900/20 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {submitting ? "Creando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}