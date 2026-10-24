import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url } = await req.json();
    console.log("URL recibida en el servidor:", url);

    if (!url) {
      return NextResponse.json({ error: "No se proporcionó URL" }, { status: 400 });
    }

    // Expresión regular robusta para extraer el ID de la canción (funciona con /intl-es/, ?si=, etc.)
    const match = url.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([a-zA-Z0-9]+)/);
    
    if (!match || !match[1]) {
      console.error("No se pudo extraer el ID de la URL:", url);
      return NextResponse.json({ error: "Enlace de Spotify no válido" }, { status: 400 });
    }
    
    const trackId = match[1];
    console.log("ID de pista extraído con éxito:", trackId);

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("Faltan variables de entorno SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET");
      return NextResponse.json({ error: "Faltan las credenciales en el servidor" }, { status: 500 });
    }

    // 1. Obtener el Token de acceso de Spotify
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
      console.error("Error al autenticar con Spotify:", tokenData);
      return NextResponse.json({ error: "No se pudo autenticar con la API de Spotify", details: tokenData }, { status: 401 });
    }

    const accessToken = tokenData.access_token;

    // 2. Consultar la API oficial de pistas de Spotify
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!trackRes.ok) {
      const errorText = await trackRes.text();
      console.error("Error en la respuesta de Spotify v1/tracks:", trackRes.status, errorText);
      return NextResponse.json({ error: "No se pudo obtener la información de la canción", details: errorText }, { status: trackRes.status });
    }

    const trackData = await trackRes.json();

    const title = trackData.name || "Pista de audio";
    const artist = trackData.artists?.map((a) => a.name).join(", ") || "Artista";
    const thumbnail = trackData.album?.images?.[0]?.url || null;

    return NextResponse.json({
      title,
      artist,
      thumbnail,
    });
  } catch (err) {
    console.error("Error crítico en la API de Spotify:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}