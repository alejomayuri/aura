"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirigir al panel de administración tras registrarse con éxito
      router.push("/admin");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo electrónico ya está registrado.");
      } else {
        setError("No se pudo crear la cuenta. Inténtalo de nuevo.");
      }
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
            Nuevo Administrador
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Crea tu cuenta</h2>
          <p className="text-sm text-slate-400 mt-2">Configura el acceso para tu portfolio online</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Confirmar contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/admin/login" className="text-purple-400 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}