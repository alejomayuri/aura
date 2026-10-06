import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: "dz3p460iu",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para extraer el public_id de una URL de Cloudinary
function getPublicIdFromUrl(url) {
  const regex = /\/v\d+\/(.+)\.[a-z]+$/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const publicId = getPublicIdFromUrl(imageUrl);

    if (!publicId) {
      return NextResponse.json({ error: "Invalid Cloudinary URL" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}