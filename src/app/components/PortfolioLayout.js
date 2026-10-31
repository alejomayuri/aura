"use client";

import { useState } from "react";
import { getTemplateStyles } from "@/app/config/themeStyles";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Helper para obtener las clases de alineación de texto e hijos
const getAlignClass = (align) => {
  switch (align) {
    case "left":
      return "text-left items-start";
    case "right":
      return "text-right items-end";
    case "center":
    default:
      return "text-center items-center";
  }
};

const getImageStyleClass = (style) => {
  switch (style) {
    case "creative-blob":
      return "rounded-[30%_70%_70%_30%/30%_30%_70%_70%] aspect-square object-cover w-38 h-38";
    case "square-rounded":
      return "w-38 h-38 rounded-xl object-cover shrink-0 shadow-xs";
    case "horizontal":
      return "w-full h-48 rounded-xl object-cover shrink-0 shadow-xs";
    case "fade-bottom":
      return "w-full h-auto object-cover";
    case "full-width":
      return "w-full h-auto object-cover";
    case "rounded":
      return "w-30 h-30 object-cover shadow-sm rounded-full";
    default:
      return "w-30 h-30 object-cover shadow-sm rounded-full";
  }
};

const getImageStyleWrapperClass = (style) => {
  switch (style) {
    case "creative-blob":
      return "w-20 pt-16";
    case "square-rounded":
      return "w-20 pt-16 mb-4";
    case "horizontal":
      return "w-full px-5 pt-5";
    case "fade-bottom":
      return "w-full";
    case "full-width":
      return "w-full";
    case "rounded":
      return "pt-24";
    default:
      return "pt-24";
  }
};

export default function PortfolioLayout({ portfolioData, template, children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const currentTemplate = template || portfolioData?.template || "minimal";
  const styles = getTemplateStyles(currentTemplate);

  // Verificación: Solo se muestra en páginas de portfolio, excluyendo /admin y home
  const isPortfolioPage = pathname && pathname !== "/" && !pathname.includes("/admin");

  const imageSrc = portfolioData?.mainImage || portfolioData?.imagen || portfolioData?.image;
  const titleAlign = portfolioData?.titleAlign || "center";
  const alignmentClasses = getAlignClass(titleAlign);

  const bioAlign = portfolioData?.bioAlign || "center";
  const bioAlignmentClasses = getAlignClass(bioAlign);

  const socialPosition = portfolioData?.socialPosition || "top";

  const imageStyle = portfolioData?.imageStyle || "rounded";
  const imageStyleClass = getImageStyleClass(imageStyle);
  const imageWrapperClass = getImageStyleWrapperClass(imageStyle);

  const textColor= portfolioData?.colors?.textColor

  const getSocialIcon = (url) => {
    if (!url) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("instagram")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg";
    if (lowerUrl.includes("wa.me") || lowerUrl.includes("whatsapp")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg";
    if (lowerUrl.includes("linkedin")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg";
    if (lowerUrl.includes("github")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg";
    if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg";
    if (lowerUrl.includes("youtube") || lowerUrl.includes("youtu.be")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg";
    if (lowerUrl.includes("facebook")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg";
    if (lowerUrl.includes("tiktok")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tiktok.svg";
    if (lowerUrl.includes("spotify")) return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/spotify.svg";
    
    return "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
  };

  const getSocialIconSvg = (url, s, f, w, h) => {
    if (!url) {
      // Icono genérico (Globe)
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6h6v-2h-4z"/>
        </svg>
      );
    }

    const lowerUrl = url.toLowerCase();

    // Instagram
    if (lowerUrl.includes("instagram")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    }

    // WhatsApp
    if (lowerUrl.includes("wa.me") || lowerUrl.includes("whatsapp")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      );
    }

    // LinkedIn
    if (lowerUrl.includes("linkedin")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    }

    // GitHub
    if (lowerUrl.includes("github")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    }

    // Twitter / X
    if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    }

    //YouTube Music
    if (lowerUrl.includes("music.youtube")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 20 20" style={{ stroke: s, fill: f }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM14.7684 9.99997C14.7684 7.37043 12.6298 5.23179 10.0002 5.23179C7.37068 5.23179 5.23204 7.37043 5.23204 9.99997C5.23204 12.6295 7.37068 14.7682 10.0002 14.7682C12.6298 14.7682 14.7684 12.6295 14.7684 9.99997ZM4.77295 9.99997C4.77295 7.11247 7.11272 4.7727 10.0002 4.7727C12.8877 4.7727 15.2275 7.11247 15.2275 9.99997C15.2275 12.8875 12.8877 15.2272 10.0002 15.2272C7.11272 15.2272 4.77295 12.8875 4.77295 9.99997ZM12.6135 9.88651L8.18172 12.6138V7.38651L12.6135 9.88651Z"></path>
        </svg>
      );
    }

    //Apple Music
    if (lowerUrl.includes("apple")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 32 32" style={{ stroke: s, fill: f }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M32 8.86222V10.0089L31.9867 21.9867C31.9867 22.1141 31.9872 22.2415 31.9877 22.3689C31.9886 22.6237 31.9896 22.8785 31.9867 23.1333C31.9867 23.4533 31.9822 23.7778 31.9733 24.0978C31.9623 24.8021 31.8999 25.5047 31.7867 26.2C31.6688 26.8958 31.447 27.57 31.1289 28.2C30.8095 28.8291 30.3925 29.4036 29.8933 29.9022C29.3939 30.4004 28.8195 30.8173 28.1911 31.1378C27.5627 31.4559 26.89 31.6777 26.1956 31.7956C25.5006 31.911 24.7978 31.9734 24.0933 31.9822C23.7733 31.9911 23.4489 31.9956 23.1289 31.9956H10.0044C9.87704 31.9956 9.74963 31.996 9.62222 31.9965C9.36741 31.9975 9.11259 31.9985 8.85778 31.9956C8.53778 31.9956 8.21333 31.9911 7.89333 31.9822C7.18899 31.9712 6.48638 31.9088 5.79111 31.7956C5.09686 31.677 4.42424 31.4553 3.79556 31.1378C2.5299 30.4943 1.50122 29.4657 0.857778 28.2C0.540266 27.5698 0.318566 26.8957 0.2 26.2C0.0845601 25.505 0.0221579 24.8022 0.0133333 24.0978C0.00444444 23.7778 0 23.4533 0 23.1333V8.86222L0.0133333 7.90222C0.02437 7.19788 0.0867577 6.49527 0.2 5.8C0.317891 5.10416 0.539623 4.42997 0.857778 3.8C1.50465 2.53531 2.53434 1.50718 3.8 0.862222C4.42822 0.542685 5.10093 0.319448 5.79556 0.2C6.49055 0.0845601 7.19332 0.0221579 7.89778 0.0133333C8.21778 0.00444444 8.54222 0 8.86222 0H23.1378L24.1067 0.0133333C24.811 0.02437 25.5136 0.0867577 26.2089 0.2C26.9031 0.318584 27.5758 0.540294 28.2044 0.857778C29.4701 1.50122 30.4988 2.5299 31.1422 3.79556C31.4597 4.4258 31.6814 5.09988 31.8 5.79556C31.9154 6.49055 31.9778 7.19332 31.9867 7.89778C31.9956 8.21778 32 8.54222 32 8.86222ZM21.7733 5.03556C21.8578 5.01778 22.5467 4.89778 22.6222 4.88889C23.1378 4.84445 23.4267 5.18223 23.4311 5.72889V20.8178C23.4436 21.2124 23.4138 21.6073 23.3422 21.9956C23.2615 22.389 23.1029 22.7622 22.8756 23.0933C22.6459 23.4233 22.3471 23.6994 22 23.9022C21.6554 24.0994 21.2796 24.2362 20.8889 24.3067C20.3291 24.4528 19.7453 24.483 19.1733 24.3956C18.7418 24.3093 18.3421 24.1064 18.0178 23.8089C17.7699 23.5857 17.5694 23.3149 17.4283 23.0127C17.2871 22.7104 17.2082 22.3829 17.1962 22.0495C17.1841 21.7162 17.2393 21.3838 17.3583 21.0722C17.4773 20.7606 17.6577 20.476 17.8889 20.2356C18.182 19.9392 18.5372 19.7115 18.9289 19.5689C19.5026 19.3733 20.0912 19.2247 20.6889 19.1244C20.7933 19.1044 20.8967 19.0833 21 19.0622C21.1033 19.0411 21.2067 19.02 21.3111 19C21.5783 18.9713 21.8253 18.8447 22.0044 18.6444C22.1599 18.4117 22.2276 18.1314 22.1956 17.8533V10.8044C22.1956 10.2667 21.9556 10.12 21.44 10.2178C21.0711 10.2889 13.1644 11.8844 13.1644 11.8844C12.7156 11.9956 12.56 12.1422 12.56 12.6933V23.0133C12.5664 23.4086 12.5307 23.8034 12.4533 24.1911C12.3727 24.5845 12.214 24.9578 11.9867 25.2889C11.757 25.6189 11.4582 25.8949 11.1111 26.0978C10.7658 26.2944 10.3904 26.4326 10 26.5067C9.44016 26.6528 8.85639 26.683 8.28445 26.5956C7.85185 26.5096 7.45172 26.305 7.12889 26.0044C6.67868 25.593 6.39685 25.0293 6.33778 24.4222C6.29686 24.0622 6.33491 23.6975 6.44928 23.3536C6.56364 23.0098 6.75158 22.695 7 22.4311C7.29314 22.1348 7.64833 21.9071 8.04 21.7645C8.61367 21.5689 9.20227 21.4203 9.8 21.32C9.90445 21.3 10.0078 21.2789 10.1111 21.2578C10.2144 21.2367 10.3178 21.2156 10.4222 21.1956C10.6894 21.1669 10.9364 21.0402 11.1156 20.84C11.2761 20.6141 11.3502 20.3381 11.3244 20.0622V8.16C11.3232 8.05291 11.3306 7.9459 11.3467 7.84C11.3736 7.6017 11.4876 7.38172 11.6667 7.22223C11.8386 7.08575 12.0417 6.99411 12.2578 6.95556H12.2622L21.7733 5.03556Z"></path>
            <defs>
                <linearGradient id="paint0_linear_596_28671" x1="16" y1="31.876" x2="16" y2="0.689689" gradientUnits="userSpaceOnUse">
                    <stop stopColor={s}></stop>
                    <stop offset="1" stopColor={s}></stop>
                </linearGradient>
            </defs>
        </svg>
      );
    }

    //Spotify 
    if (lowerUrl.includes("spotify")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
        </svg>
      )
    }

    // YouTube
    if (lowerUrl.includes("youtube") || lowerUrl.includes("youtu.be")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }

    // Facebook
    if (lowerUrl.includes("facebook")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      );
    }

    // TikTok
    if (lowerUrl.includes("tiktok")) {
      return (
        <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.5.18-1.92 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-2.1 0-4.21.02-6.31.02-3.85 0-7.7.02-11.55z"/>
        </svg>
      );
    }

    // Default / Globe
    return (
      <svg className={`w-${w} h-${h} shrink-0 stroke-0`} fill="currentColor" viewBox="0 0 24 24" style={{ stroke: s, fill: f }}>
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6h6v-2h-4z"/>
      </svg>
    );
  };

  const socialLinks = portfolioData?.socialLinks || [];
  const pages = portfolioData?.pages || [];

  const pageColors =  portfolioData?.colors || {};

  // Función reutilizable para renderizar las redes sociales
  const renderSocialLinks = () => {
    if (socialLinks.length === 0) return null;

    return (
      <div className={`flex flex-wrap items-center justify-center ${styles.socialGap} py-3`}>
        {socialLinks.map((linkItem, index) => {
          const formattedUrl = linkItem.url.startsWith("http") ? linkItem.url : `https://${linkItem.url}`;
          const svgHeight = styles.svgHeight
          const svgWidth = styles.svgWidth 
          const socialIconSvg = getSocialIconSvg(linkItem.url, pageColors?.iconsColor || "#000", pageColors?.iconsColor || "#000", svgWidth, svgHeight);


          if (!linkItem?.enabled) return null
          
          return (
            <a
              key={index}
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={linkItem.url}
              className={`flex items-center justify-center transition-all duration-200 ${styles.socialIconBtn}`}
              style={{backgroundColor: pageColors?.socialColor}}
            >
              {socialIconSvg}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Menú y Overlay */}
      {isPortfolioPage && (
        <div className={`fixed inset-0 z-[100] flex justify-center items-end transition-all duration-300 ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}>
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className={`relative w-full max-w-xl h-auto max-h-[70vh] bg-white p-6 flex flex-col rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out transform z-20 overflow-y-auto pointer-events-auto ${
            isMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="self-end text-black text-2xl font-bold p-2 mb-1 cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex flex-col gap-6 pb-4">
              <div className="flex flex-col gap-3">
                <Link 
                  href={`/${portfolioData?.slug || ""}`} 
                  className="text-2xl font-bold text-black cursor-pointer hover:opacity-75 transition-opacity" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {pages.map((p) => (
                  <Link 
                    key={p.id} 
                    href={`/${portfolioData?.slug}/${p.slug || p.id}`} 
                    className="text-2xl font-bold text-black cursor-pointer hover:opacity-75 transition-opacity" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex items-center justify-around py-1">
                  {socialLinks.map((linkItem, index) => {
                    const iconUrl = getSocialIcon(linkItem.url);
                    const formattedUrl = linkItem.url.startsWith("http") ? linkItem.url : `https://${linkItem.url}`;

                    return (
                      <a
                        key={index}
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <img 
                          src={iconUrl} 
                          alt="Red social" 
                          className="w-7 h-7" 
                          style={{ filter: "brightness(0)" }} 
                        />
                      </a>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-col gap-1 text-left">
                <p className="text-lg font-bold text-black">Únete a {portfolioData?.slug || "Lightjaus"} en Lightjaus</p>
                <p className="text-base font-normal text-black">¿Te gustaría tener un portfolio como este?</p>
              </div>

              <div className="flex gap-3">
                <Link 
                  href="https://lightjaus.so" 
                  className="flex-1 py-4 bg-black text-white text-center rounded-full font-bold transition-transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Regístrate gratis
                </Link>
                <Link 
                  href="https://lightjaus.so" 
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-black text-center rounded-full font-bold transition-transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor Principal del Layout */}
      <div className={`w-full flex justify-center`}>
        <div className={`relative w-full max-w-xl pt-0 shadow-2xl rounded-none md:rounded-3xl bg-white transition-all duration-300 ${styles.container}`}
            style={{ background: pageColors?.primaryColorEnd ? `linear-gradient(to top right, ${pageColors?.primaryColor}, ${pageColors?.primaryColorEnd})` : `${pageColors?.primaryColor}` }}>
          
          {/* Botón Menú Hamburguesa */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="absolute top-5 right-5 z-50 p-2 bg-white border border-black/10 rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer"
            >
              <div className="flex flex-col gap-1 w-4">
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black"></div>
              </div>
            </button>

          {/* CABECERA GLOBAL COMÚN (Imagen, Título, Bio y Redes Top) */}
          <div className={styles.headerLayout}>
            <div className={`flex w-full relative justify-center mb-2.5 z-10 ${imageWrapperClass}`}>
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt="Perfil" 
                  className={`${imageStyleClass}`}
                />
              ) : (
                <span className="text-[10px] opacity-50 italic">Sin img</span>
              )}
              {imageStyle === "fade-bottom" && (
                <div 
                  style={{
                    background: `linear-gradient(to top, ${pageColors?.primaryColor}, transparent)`
                  }}
                  className="absolute inset-x-0 bottom-0 h-4/7"
                ></div>
              )}
            </div>

            <div className={`px-4 w-full px-5 flex flex-col ${styles.textContainer}`}>
              <h1 className={`w-full ${styles.title} text-[1.5rem] ${alignmentClasses} mb-1`}
                style={{ color: pageColors?.titleColor || "#000000" }}
              >
                {portfolioData?.title || "Tu Título Aquí"}
              </h1>
              <p className={`w-full whitespace-pre-wrap ${styles.description} text-[16px]/5.5 ${bioAlignmentClasses}`}
                style={{ color: pageColors?.textColor || "#000000" }}
              >
                {portfolioData?.description}
              </p>
            </div>
          </div>

          {/* Redes Sociales ARRIBA si socialPosition es 'top' */}
          {socialPosition === "top" && renderSocialLinks()}

          {/* Contenido inyectado (Páginas internas, links destacados, etc.) */}
          {children}

          {/* Redes Sociales ABAJO si socialPosition es 'bottom' */}
          {socialPosition === "bottom" && renderSocialLinks()}

          {/* Footer compartido para páginas públicas */}
            <>
              <div className="mt-8 flex justify-center">
                <a 
                  href="https://lightjaus.so" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-6 mt-20 py-4 bg-white text-black text-md rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 border border-slate-100`}
                  style={{fontFamily: "'Poppins', sans-serif"}}
                >
                  Únete a Lightjaus
                </a>
              </div>

              <footer style={{fontFamily: "'Poppins', sans-serif"}} className="px-4 mt-3 mb-20 pt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[11px] tracking-widest">
                <Link href="/cookies" style={{color:textColor}} className="transition-opacity">Política de cookies</Link>
                <span  style={{color:textColor}} aria-hidden="true">•</span>
                <Link href="/cookies" style={{color:textColor}} className="transition-opacity">Reportar un problema</Link>
                <span  style={{color:textColor}} aria-hidden="true">•</span>
                <Link href="/cookies" style={{color:textColor}} className="transition-opacity">Privacidad</Link>
                <span  style={{color:textColor}} aria-hidden="true">•</span>
                <Link href="/privacy" style={{color:textColor}} className="transition-opacity">Privacidad</Link>
                <span  style={{color:textColor}} aria-hidden="true">•</span>
                <Link href="/" style={{color:textColor}} className="transition-opacity">Explorar Lightjaus</Link>
              </footer>
            </>
        </div>
      </div>
    </>
  );
}