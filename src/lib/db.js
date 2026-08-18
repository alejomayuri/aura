import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Obtener los datos del portfolio del usuario
export async function getPortfolioData(userId) {
  try {
    const docRef = doc(db, "portfolios", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Si no existe, devolvemos una estructura por defecto
      const defaultData = {
        title: "Mi Estudio / Portfolio",
        subtitle: "Creador Digital & Artista",
        bio: "Escribe algo breve sobre ti y tu trabajo aquí...",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        ctaText1: "Reservar Cita",
        ctaUrl1: "#",
        ctaText2: "Ver Trabajos",
        ctaUrl2: "#",
        links: [
          { id: 1, title: "Instagram", url: "https://instagram.com" },
          { id: 2, title: "Mis Proyectos", url: "#" }
        ],
        gallery: [
          "https://images.unsplash.com/photo-1598371835697-3932e0e448a6?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1611501275017-9b65de040a7e?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=600&auto=format&fit=crop&q=80"
        ]
      };
      // Lo guardamos de una vez en Firestore para inicializarlo
      await setDoc(docRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error al obtener el portfolio:", error);
    return null;
  }
}

// Guardar/Actualizar los datos del portfolio del usuario
export async function savePortfolioData(userId, data) {
  try {
    const docRef = doc(db, "portfolios", userId);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error al guardar el portfolio:", error);
    return false;
  }
}