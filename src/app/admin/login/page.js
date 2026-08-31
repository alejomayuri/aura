"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // <-- Nuevo estado para evitar el parpadeo
  const router = useRouter();

  // Verificar si el usuario ya está autenticado antes de mostrar nada
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin"); // Usamos replace para que no guarde esta página en el historial
      } else {
        setCheckingAuth(false); // Solo mostramos el contenido si NO está logueado
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Login tradicional con Correo y Contraseña
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      setError("Credenciales incorrectas o usuario no autorizado.");
      setLoading(false);
    }
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/admin");
    } catch (err) {
      setError("No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  // Si está comprobando la sesión, devolvemos un contenedor vacío o un fondo blanco para evitar ver el formulario
  if (checkingAuth) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900 font-sans overflow-hidden">
      {/* Columna Izquierda: Formulario sin bordes y con espacio para el logo arriba */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between pt-6 pb-8 px-8 sm:px-12 lg:px-16 relative z-10 overflow-y-auto">
        {/* Logo superior alineado más arriba a la izquierda */}
        <div className="-ml-2">
          <Link href="/" className="inline-block">
            <img 
              src="/logo.png" 
              alt="lightjaus Logo" 
              className="h-12 sm:h-16 object-contain brightness-0" 
            />
          </Link>
        </div>

        {/* Contenedor central del formulario */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Bienvenido de nuevo</h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">Accede a tu cuenta</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Botón de Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="w-full mb-6 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.36 7.22 24 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.99 0 12s.43 3.88 1.18 5.4l4.09-3.16z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.64 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center my-6 text-slate-400">
            <div className="flex-1 border-t border-purple-100" />
            <span className="px-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">o con email</span>
            <div className="flex-1 border-t border-purple-100" />
          </div>

          {/* Formulario tradicional */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Correo electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-purple-50/40 border border-purple-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-800 focus:ring-1 focus:ring-purple-800 transition-all font-normal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-purple-50/40 border border-purple-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-800 focus:ring-1 focus:ring-purple-800 transition-all font-normal"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-900 to-indigo-800 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Entrando..." : "Acceder con Email"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-600 font-normal">
              ¿No tienes cuenta?{" "}
              <Link href="/admin/register" className="text-purple-900 font-semibold hover:underline">
                  Regístrate
              </Link>
          </div>
        </div>

        {/* Pie inferior izquierdo */}
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} Lightjaus. Todos los derechos reservados.
        </div>
      </div>

      {/* Columna Derecha: Espacio para imagen grande con diseño decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 relative items-center justify-center p-12 overflow-hidden">
        {/* Círculos de luz decorativos de fondo */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Contenedor de la imagen grande */}
        <div className="relative z-10 w-full h-full max-w-xl max-h-[800px] rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden flex items-center justify-center bg-purple-950/50 backdrop-blur-md">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000" 
            alt="Preview Portfolio Lightjaus" 
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
}