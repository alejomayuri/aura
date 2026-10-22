/*Sube una imagen a Cloudinary usando un preset de subida.*/
export async function uploadToCloudinary(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "pataki_portfolio_upload");

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/dz3p460iu/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.secure_url || null;
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    return null;
  }
}

/*Elimina una imagen alojada en Cloudinary a través del endpoint backend.*/
export async function deleteImageFromCloudinary(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    console.warn("deleteImageFromCloudinary recibió un valor inválido que no es una URL:", imageUrl);
    return;
  }
  try {
    const res = await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    
    if (!res.ok) {
      console.error("No se pudo eliminar la imagen de Cloudinary");
    }
  } catch (err) {
    console.error("Error al conectar con la API de eliminación:", err);
  }
}