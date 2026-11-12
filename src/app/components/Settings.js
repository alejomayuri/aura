"use client";

import { useState } from "react";
import Title from "./AdminFormsComponents/Title";
import { 
  sendPasswordResetEmail, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  deleteUser,
  signOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { savePortfolioData } from "@/lib/db";

export default function Settings({ user, portfolioData, setPortfolioData }) {
  // Estados para la sección Usuario (Nombre)
  const [name, setName] = useState(portfolioData?.name || "");
  const [userMessage, setUserMessage] = useState({ text: "", type: "" });
  const [savingUser, setSavingUser] = useState(false);

  // Estados para Data y privacidad (Restablecer contraseña por correo)
  const [resetMessage, setResetMessage] = useState({ text: "", type: "" });
  const [sendingReset, setSendingReset] = useState(false);

  // Estados para Gestión de la cuenta (Slug y Plan)
  const [slug, setSlug] = useState(portfolioData?.slug || "");
  const [slugMessage, setSlugMessage] = useState({ text: "", type: "" });
  const [savingSlug, setSavingSlug] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState(false);

  // Estados para Borrar la cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const planType = portfolioData?.plan || "gratis";

  // Manejar actualización del Nombre de usuario
  const handleSaveUser = async (e) => {
    e.preventDefault();
    setUserMessage({ text: "", type: "" });
    setSavingUser(true);

    try {
      const updatedData = { ...portfolioData, name: name.trim() };
      const success = await savePortfolioData(user.uid, updatedData);

      if (success) {
        setPortfolioData(updatedData);
        setUserMessage({ text: "¡Nombre actualizado con éxito!", type: "success" });
      } else {
        setUserMessage({ text: "Error al guardar en la base de datos.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setUserMessage({ text: "Error al actualizar el nombre.", type: "error" });
    } finally {
      setSavingUser(false);
    }
  };

  // Enviar correo de restablecimiento de contraseña
  const handleSendPasswordReset = async () => {
    setResetMessage({ text: "", type: "" });
    setSendingReset(true);

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetMessage({ 
        text: "¡Correo enviado! Revisa tu bandeja de entrada para cambiar tu contraseña.", 
        type: "success" 
      });
    } catch (error) {
      console.error(error);
      setResetMessage({ text: "Error al enviar el correo de recuperación.", type: "error" });
    } finally {
      setSendingReset(false);
    }
  };

  // 2. Manejar actualización del Slug (nombre de usuario)
  const handleSaveSlug = async (e) => {
    e.preventDefault();
    setSlugMessage({ text: "", type: "" });

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    if (!cleanSlug) {
      setSlugMessage({ text: "El nombre de usuario no es válido.", type: "error" });
      return;
    }

    setSavingSlug(true);
    try {
      const updatedData = { ...portfolioData, slug: cleanSlug };
      const success = await savePortfolioData(user.uid, updatedData);

      if (success) {
        setPortfolioData(updatedData);
        setSlug(cleanSlug);
        setSlugMessage({ text: "¡Nombre de usuario actualizado con éxito!", type: "success" });
      } else {
        setSlugMessage({ text: "Error al guardar el nombre de usuario.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setSlugMessage({ text: "Error al actualizar.", type: "error" });
    } finally {
      setSavingSlug(false);
    }
  };

  // 3. Simular pasar a plan Pro
  const handleUpgradeToPro = async () => {
    setUpgradingPlan(true);
    try {
      const updatedData = { ...portfolioData, plan: "pro" };
      const success = await savePortfolioData(user.uid, updatedData);
      if (success) {
        setPortfolioData(updatedData);
        alert("¡Felicidades! Ahora estás en el plan Pro.");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el plan.");
    } finally {
      setUpgradingPlan(false);
    }
  };

  // 4. Borrar cuenta
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");
    setDeletingAccount(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      signOut(auth);
    } catch (error) {
      console.error(error);
      setDeleteError(
        error.code === "auth/wrong-password" 
          ? "Contraseña incorrecta." 
          : "Ocurrió un error al eliminar la cuenta. Intente iniciar sesión nuevamente."
      );
      setDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-transparent border-none rounded-2xl p-6 space-y-6 text-slate-900 font-['Poppins']">
      <Title title="Configuración" />

      {/* SECCIÓN 1: USUARIO */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex flex-col gap-2 justify-between">
          <h2 className="text-base font-medium text-slate-950 tracking-wide truncate">
            Usuario
          </h2>
          <p className="text-xs text-slate-500">Gestiona tu información personal.</p>
        </div>
       
        <div className="space-y-4 pt-2">
          {/* Editar Nombre con botón al lado */}
          <form onSubmit={handleSaveUser} className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Nombre</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                disabled={savingUser}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {savingUser ? "Guardando..." : "Actualizar"}
              </button>
            </div>
            {userMessage.text && (
              <p className={`text-xs font-medium ${userMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                {userMessage.text}
              </p>
            )}
          </form>

          {/* Correo electrónico (solo lectura) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
            <input 
              type="email" 
              disabled 
              value={user?.email || ""} 
              className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 cursor-not-allowed select-none"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: DATA Y PRIVACIDAD (RESTABLECER CONTRASEÑA) */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col gap-2 justify-between">
          <h2 className="text-base font-medium text-slate-950 tracking-wide truncate">
            Data y privacidad
          </h2>
          <p className="text-xs text-slate-500">Envía un enlace a tu correo electrónico para cambiar tu contraseña de forma segura.</p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={handleSendPasswordReset}
            disabled={sendingReset}
            className="px-4 py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            {sendingReset ? "Enviando correo..." : "Enviar enlace de cambio de contraseña"}
          </button>

          {resetMessage.text && (
            <p className={`text-xs font-medium ${resetMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
              {resetMessage.text}
            </p>
          )}
        </div>
      </section>

      {/* SECCIÓN 3: GESTIÓN DE LA CUENTA */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col gap-2 justify-between">
          <h2 className="text-base font-medium text-slate-950 tracking-wide truncate">
            Gestión de la cuenta
          </h2>
          <p className="text-xs text-slate-500">Administra tu información de cuenta y preferencias.</p>
        </div>

        {/* Editar Slug */}
        <form onSubmit={handleSaveSlug} className="space-y-3 pb-6 border-b border-slate-100">
          <label className="text-sm font-medium text-slate-700">Nombre de usuario (Slug)</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-slate-400">lightjaus.com/</span>
              <input 
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full pl-28 pr-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={savingSlug}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {savingSlug ? "Guardando..." : "Actualizar"}
            </button>
          </div>
          {slugMessage.text && (
            <p className={`text-xs font-medium ${slugMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
              {slugMessage.text}
            </p>
          )}
        </form>

        {/* Tipo de plan y opción Pro */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan actual</p>
            <p className="text-base font-bold text-slate-900 capitalize mt-0.5">{planType}</p>
          </div>
          {planType !== "pro" ? (
            <button
              onClick={handleUpgradeToPro}
              disabled={upgradingPlan}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {upgradingPlan ? "Procesando..." : "Pasarme a plan Pro 🚀"}
            </button>
          ) : (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
              Plan Pro Activo ✨
            </span>
          )}
        </div>
      </section>

      {/* SECCIÓN 4: BORRAR LA CUENTA */}
      <section className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200/60 space-y-4">
        <h2 className="text-base font-bold text-rose-900">Zona de peligro</h2>
        <p className="text-xs text-rose-700/80">Una vez que borres tu cuenta, no hay vuelta atrás. Por favor, tenlo por seguro.</p>
        
        <div className="flex justify-end">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Borrar cuenta
          </button>
        </div>
      </section>

      {/* Modal de confirmación para borrar cuenta */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-rose-900">¿Estás completamente seguro?</h3>
            <p className="text-sm text-slate-600">
              Esta acción eliminará permanentemente tu portfolio, páginas y datos de Firebase. Ingresa tu contraseña actual para confirmar:
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <input 
                type="password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Tu contraseña actual"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              />

              {deleteError && (
                <p className="text-xs font-medium text-rose-600">{deleteError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteError(""); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={deletingAccount}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {deletingAccount ? "Eliminando..." : "Sí, borrar cuenta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}