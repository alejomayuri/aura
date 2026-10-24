import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No se proporcionó URL" }, { status: 400 });
    }

    // Extraer el ID de la pista de Spotify
    const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: "Enlace de Spotify no válido" }, { status: 400 });
    }
    const trackId = match[1];

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Faltan las credenciales en el servidor" }, { status: 500 });
    }

    // 1. Obtener el Token de acceso de Spotify usando Client Credentials Flow
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: "No se pudo autenticar con la API de Spotify" }, { status: 401 });
    }

    const accessToken = tokenData.access_token;

    // 2. Consultar la API oficial de pistas de Spotify
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!trackRes.ok) {
      return NextResponse.json({ error: "No se pudo obtener la información de la canción en Spotify" }, { status: trackRes.status });
    }

    const trackData = await trackRes.json();

    const title = trackData.name || "Pista de audio";
    // Si hay varios artistas, los unimos con una coma
    const artist = trackData.artists?.map((a) => a.name).join(", ") || "Artista";
    const thumbnail = trackData.album?.images?.[0]?.url || null;

    return NextResponse.json({
      title,
      artist,
      thumbnail,
    });
  } catch (err) {
    console.error("Error en la ruta de Spotify:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}