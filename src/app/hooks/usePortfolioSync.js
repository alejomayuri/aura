import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getPortfolioData, savePortfolioData } from "@/lib/db";
import { useRouter } from "next/navigation";

export function usePortfolioSync() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  
  const [portfolioData, setPortfolioData] = useState({
    title: "",
    mainImage: "",
    template: "minimal",
    pages: [] 
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
      } else {
        setUser(currentUser);
        const data = await getPortfolioData(currentUser.uid);
        if (data) {
          setPortfolioData((prev) => ({
            ...prev,
            ...data
          }));
        }
        setCheckingAuth(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Función unificada para guardar en Firebase con feedback visual automático
  const handleSave = async (dataToSave = portfolioData) => {
    if (!user) return false;
    setSaving(true);
    setSaveMessage("");

    const success = await savePortfolioData(user.uid, dataToSave);
    setSaving(false);

    if (success) {
      setSaveMessage("¡Guardado con éxito!");
      setTimeout(() => setSaveMessage(""), 3000);
      return true;
    } else {
      setSaveMessage("Error al guardar.");
      return false;
    }
  };

  // Función para actualizar el estado local y opcionalmente persistir de inmediato
  const updatePortfolio = (updater, shouldSave = true) => {
    setPortfolioData((prev) => {
      const nextData = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      if (shouldSave) {
        handleSave(nextData);
      }
      return nextData;
    });
  };

  return {
    user,
    loading,
    checkingAuth,
    saving,
    saveMessage,
    portfolioData,
    setPortfolioData,
    handleSave,
    updatePortfolio,
  };
}