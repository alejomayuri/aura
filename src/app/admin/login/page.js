"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden px-4">
      {/* Círculos de luz decorativos de fondo */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
            Panel Privado
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Bienvenido de nuevo</h2>
          <p className="text-sm text-slate-400 mt-2">Accede para gestionar tu portfolio online</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full mb-6 py-3 px-4 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.36 7.22 24 12 24z" />
            <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.99 0 12s.43 3.88 1.18 5.4l4.09-3.16z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.64 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
          </svg>
          Continuar con Google
        </button>

        <div className="flex items-center my-6 text-slate-600">
          <div className="flex-1 border-t border-slate-800" />
          <span className="px-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">o con email</span>
          <div className="flex-1 border-t border-slate-800" />
        </div>

        {/* Formulario tradicional */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-600/25 active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? "Entrando..." : "Acceder con Email"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-400">
            ¿No tienes cuenta?{" "}
            <Link href="/admin/register" className="text-purple-400 font-semibold hover:underline">
                Regístrate
            </Link>
        </div>
      </div>
    </div>
  );
}