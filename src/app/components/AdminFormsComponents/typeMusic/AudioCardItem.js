"use client";

import { useState } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import DeleteButton from "../ui/DeleteButton";
import DragIcon from "../ui/DragIcon";

export default function AudioCardItem({
  item,
  onDragEnd,
  onToggleActive,
  onUpdateLayout,
  onDeleteTrack,
  onAddPlatform,
  onTogglePlatformActive,
  onReorderPlatforms,
  onSavePlatformsOrder,
  onDeletePlatform
}) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isPlatformFormOpen, setIsPlatformFormOpen] = useState(false);
  const [newPlatformUrl, setNewPlatformUrl] = useState("");

  const isActive = item.isActive !== false;
  const displayUrl = item.originalUrl || item.url;
  const displayTitle = item.title || "Pista de audio";
  const currentLayout = item.layout || "classic";
  const platforms = item.platforms || [];

  const handlePlatformSubmit = (e) => {
    e.preventDefault();
    if (!newPlatformUrl.trim()) return;
    onAddPlatform(item.id, newPlatformUrl);
    setNewPlatformUrl("");
  };

  // Función auxiliar para renderizar el icono principal de la pista según su URL o tipo
  const renderMainTrackIcon = (url) => {
    const lowerUrl = (url || "").toLowerCase();

    if (lowerUrl.includes("music.youtube.com")) {
      return (
        <svg className="w-4 h-4 text-red-600 shrink-0" viewBox="0 0 20 20" width="16" height="16">
          <path fillRule="evenodd" clipRule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM14.7684 9.99997C14.7684 7.37043 12.6298 5.23179 10.0002 5.23179C7.37068 5.23179 5.23204 7.37043 5.23204 9.99997C5.23204 12.6295 7.37068 14.7682 10.0002 14.7682C12.6298 14.7682 14.7684 12.6295 14.7684 9.99997ZM4.77295 9.99997C4.77295 7.11247 7.11272 4.7727 10.0002 4.7727C12.8877 4.7727 15.2275 7.11247 15.2275 9.99997C15.2275 12.8875 12.8877 15.2272 10.0002 15.2272C7.11272 15.2272 4.77295 12.8875 4.77295 9.99997ZM12.6135 9.88651L8.18172 12.6138V7.38651L12.6135 9.88651Z" fill="#FF0000"></path>
        </svg>
      );
    }
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      return (
        <svg className="w-4 h-4 text-red-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    if (lowerUrl.includes("soundcloud.com") || lowerUrl.includes("on.soundcloud.com")) {
      return (
        <svg className="w-4 h-4 text-orange-500 shrink-0" viewBox="0 0 22 11" width="16" height="16">
            <path d="M19.0148 4.51539C18.6135 4.51539 18.2372 4.59065 17.886 4.74116C17.6351 2.0821 15.4025 0 12.6933 0C12.016 0 11.3888 0.125428 10.8119 0.351197C10.5861 0.426454 10.5359 0.526796 10.5359 0.702395V10.0593C10.5359 10.2349 10.6864 10.3854 10.862 10.4105C10.862 10.4105 18.9897 10.4105 19.0399 10.4105C20.6705 10.4105 22 9.08096 22 7.4504C21.9498 5.84493 20.6454 4.51539 19.0148 4.51539Z" fill="#FF5500"></path>
            <path d="M0.50171 6.04561C0.301026 6.04561 0.125428 6.22121 0.125428 6.42189L0 7.72634L0.125428 9.03079C0.125428 9.23147 0.301026 9.40707 0.50171 9.40707C0.702395 9.40707 0.877993 9.23147 0.877993 9.03079L1.00342 7.72634L0.877993 6.42189C0.877993 6.19612 0.702395 6.04561 0.50171 6.04561Z" fill="#FF5500"></path>
            <path d="M2.00685 4.91676C1.80617 4.91676 1.63057 5.09236 1.63057 5.29305L1.50514 7.72634L1.63057 10.0342C1.63057 10.2349 1.80617 10.4105 2.00685 10.4105C2.20754 10.4105 2.38314 10.2349 2.38314 10.0342L2.50856 7.72634L2.38314 5.29305C2.38314 5.09236 2.20754 4.91676 2.00685 4.91676Z" fill="#FF5500"></path>
            <path d="M3.51196 5.44356C3.31128 5.44356 3.13568 5.61916 3.13568 5.81984L3.01025 7.72634L3.13568 10.0342C3.13568 10.2349 3.31128 10.4105 3.51196 10.4105C3.71265 10.4105 3.88825 10.2349 3.88825 10.0342L4.01367 7.72634L3.88825 5.81984C3.88825 5.61916 3.71265 5.44356 3.51196 5.44356Z" fill="#FF5500"></path>
            <path d="M5.01711 3.41164C4.81642 3.41164 4.64082 3.58723 4.64082 3.78792L4.5154 7.72635L4.64082 10.0342C4.64082 10.2349 4.81642 10.4105 5.01711 10.4105C5.21779 10.4105 5.39339 10.2349 5.39339 10.0342L5.51882 7.72635L5.39339 3.78792C5.39339 3.58723 5.21779 3.41164 5.01711 3.41164Z" fill="#FF5500"></path>
            <path d="M6.52223 2.4333C6.32155 2.4333 6.14595 2.6089 6.14595 2.80959L6.02052 7.72635L6.14595 10.0342C6.14595 10.2349 6.32155 10.4105 6.52223 10.4105C6.72292 10.4105 6.89852 10.2349 6.89852 10.0342L7.02394 7.72635L6.89852 2.80959C6.89852 2.6089 6.72292 2.4333 6.52223 2.4333Z" fill="#FF5500"></path>
            <path d="M8.02738 2.96008C7.82669 2.96008 7.65109 3.13568 7.65109 3.33637L7.52567 7.72633L7.65109 10.0342C7.65109 10.2349 7.82669 10.4105 8.02738 10.4105C8.22806 10.4105 8.40366 10.2349 8.40366 10.0342L8.52909 7.72633L8.40366 3.33637C8.40366 3.1106 8.22806 2.96008 8.02738 2.96008Z" fill="#FF5500"></path>
            <path d="M9.5325 1.42987C9.33182 1.42987 9.15622 1.60547 9.15622 1.80615L9.03079 7.72634L9.15622 10.0342C9.15622 10.2349 9.33182 10.4105 9.5325 10.4105C9.73319 10.4105 9.90879 10.2349 9.90879 10.0342L10.0342 7.72634L9.90879 1.80615C9.90879 1.60547 9.73319 1.42987 9.5325 1.42987Z" fill="#FF5500"></path>
        </svg>
      );
    }
    
    // Por defecto Spotify
    return (
      <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
      </svg>
    );
  };

  // Función para renderizar el icono de plataforma ampliado en la lista extra
  const renderPlatformIcon = (name) => {
    const lowerName = (name || "").toLowerCase();

    if (lowerName.includes("open") || lowerName.includes("spotify")) {
      return (
        <svg className="w-6 h-6 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.72.48-1.08.24-2.999-1.8-6.78-2.22-11.221-1.24-.42.06-.84-.18-.9-.6-.06-.42.18-.84.6-.9 4.74-1.02 8.94-.54 12.36 1.62.36.24.48.72.24 1.08zm1.44-3.84c-.301.48-.9.66-1.38.36-3.48-2.1-8.76-2.74-12.84-1.5-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.62-1.38 10.44-.66 14.46 1.8.48.3.66.9.36 1.32zm.12-4.08C14.16 7.2 8.16 7 4.74 8.04c-.66.18-1.38-.18-1.56-.84-.18-.66.18-1.38.84-1.56C9.12 4.44 15.9 4.68 20.4 7.44c.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
        </svg>
      );
    }
    
    if (lowerName.includes("music") && lowerName.includes("youtube")) {
      return (
        <svg className="w-6 h-6 text-red-600 shrink-0" viewBox="0 0 20 20" width="24" height="24">
          <path fillRule="evenodd" clipRule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM14.7684 9.99997C14.7684 7.37043 12.6298 5.23179 10.0002 5.23179C7.37068 5.23179 5.23204 7.37043 5.23204 9.99997C5.23204 12.6295 7.37068 14.7682 10.0002 14.7682C12.6298 14.7682 14.7684 12.6295 14.7684 9.99997ZM4.77295 9.99997C4.77295 7.11247 7.11272 4.7727 10.0002 4.7727C12.8877 4.7727 15.2275 7.11247 15.2275 9.99997C15.2275 12.8875 12.8877 15.2272 10.0002 15.2272C7.11272 15.2272 4.77295 12.8875 4.77295 9.99997ZM12.6135 9.88651L8.18172 12.6138V7.38651L12.6135 9.88651Z" fill="#FF0000"></path>
        </svg>
      );
    }
    if (!lowerName.includes("music") && lowerName.includes("youtube")) {
      return (
        <svg className="w-6 h-6 text-red-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    if (lowerName.includes("soundcloud")) {
      return (
        <svg className={`w-6 h-6 text-red-600 shrink-0 inline-block mr-1`} viewBox="0 0 22 11" width="24" height="24">
            <path d="M19.0148 4.51539C18.6135 4.51539 18.2372 4.59065 17.886 4.74116C17.6351 2.0821 15.4025 0 12.6933 0C12.016 0 11.3888 0.125428 10.8119 0.351197C10.5861 0.426454 10.5359 0.526796 10.5359 0.702395V10.0593C10.5359 10.2349 10.6864 10.3854 10.862 10.4105C10.862 10.4105 18.9897 10.4105 19.0399 10.4105C20.6705 10.4105 22 9.08096 22 7.4504C21.9498 5.84493 20.6454 4.51539 19.0148 4.51539Z" fill="#FF5500"></path>
            <path d="M0.50171 6.04561C0.301026 6.04561 0.125428 6.22121 0.125428 6.42189L0 7.72634L0.125428 9.03079C0.125428 9.23147 0.301026 9.40707 0.50171 9.40707C0.702395 9.40707 0.877993 9.23147 0.877993 9.03079L1.00342 7.72634L0.877993 6.42189C0.877993 6.19612 0.702395 6.04561 0.50171 6.04561Z" fill="#FF5500"></path>
            <path d="M2.00685 4.91676C1.80617 4.91676 1.63057 5.09236 1.63057 5.29305L1.50514 7.72634L1.63057 10.0342C1.63057 10.2349 1.80617 10.4105 2.00685 10.4105C2.20754 10.4105 2.38314 10.2349 2.38314 10.0342L2.50856 7.72634L2.38314 5.29305C2.38314 5.09236 2.20754 4.91676 2.00685 4.91676Z" fill="#FF5500"></path>
            <path d="M3.51196 5.44356C3.31128 5.44356 3.13568 5.61916 3.13568 5.81984L3.01025 7.72634L3.13568 10.0342C3.13568 10.2349 3.31128 10.4105 3.51196 10.4105C3.71265 10.4105 3.88825 10.2349 3.88825 10.0342L4.01367 7.72634L3.88825 5.81984C3.88825 5.61916 3.71265 5.44356 3.51196 5.44356Z" fill="#FF5500"></path>
            <path d="M5.01711 3.41164C4.81642 3.41164 4.64082 3.58723 4.64082 3.78792L4.5154 7.72635L4.64082 10.0342C4.64082 10.2349 4.81642 10.4105 5.01711 10.4105C5.21779 10.4105 5.39339 10.2349 5.39339 10.0342L5.51882 7.72635L5.39339 3.78792C5.39339 3.58723 5.21779 3.41164 5.01711 3.41164Z" fill="#FF5500"></path>
            <path d="M6.52223 2.4333C6.32155 2.4333 6.14595 2.6089 6.14595 2.80959L6.02052 7.72635L6.14595 10.0342C6.14595 10.2349 6.32155 10.4105 6.52223 10.4105C6.72292 10.4105 6.89852 10.2349 6.89852 10.0342L7.02394 7.72635L6.89852 2.80959C6.89852 2.6089 6.72292 2.4333 6.52223 2.4333Z" fill="#FF5500"></path>
            <path d="M8.02738 2.96008C7.82669 2.96008 7.65109 3.13568 7.65109 3.33637L7.52567 7.72633L7.65109 10.0342C7.65109 10.2349 7.82669 10.4105 8.02738 10.4105C8.22806 10.4105 8.40366 10.2349 8.40366 10.0342L8.52909 7.72633L8.40366 3.33637C8.40366 3.1106 8.22806 2.96008 8.02738 2.96008Z" fill="#FF5500"></path>
            <path d="M9.5325 1.42987C9.33182 1.42987 9.15622 1.60547 9.15622 1.80615L9.03079 7.72634L9.15622 10.0342C9.15622 10.2349 9.33182 10.4105 9.5325 10.4105C9.73319 10.4105 9.90879 10.2349 9.90879 10.0342L10.0342 7.72634L9.90879 1.80615C9.90879 1.60547 9.73319 1.42987 9.5325 1.42987Z" fill="#FF5500"></path>
        </svg>
      );
    }
    if (lowerName.includes("apple")) {
      return (
        <svg className={`w-6 h-6 text-red-600 shrink-0 inline-block mr-1`} viewBox="0 0 32 32" width="24" height="24">
            <path fillRule="evenodd" clipRule="evenodd" d="M32 8.86222V10.0089L31.9867 21.9867C31.9867 22.1141 31.9872 22.2415 31.9877 22.3689C31.9886 22.6237 31.9896 22.8785 31.9867 23.1333C31.9867 23.4533 31.9822 23.7778 31.9733 24.0978C31.9623 24.8021 31.8999 25.5047 31.7867 26.2C31.6688 26.8958 31.447 27.57 31.1289 28.2C30.8095 28.8291 30.3925 29.4036 29.8933 29.9022C29.3939 30.4004 28.8195 30.8173 28.1911 31.1378C27.5627 31.4559 26.89 31.6777 26.1956 31.7956C25.5006 31.911 24.7978 31.9734 24.0933 31.9822C23.7733 31.9911 23.4489 31.9956 23.1289 31.9956H10.0044C9.87704 31.9956 9.74963 31.996 9.62222 31.9965C9.36741 31.9975 9.11259 31.9985 8.85778 31.9956C8.53778 31.9956 8.21333 31.9911 7.89333 31.9822C7.18899 31.9712 6.48638 31.9088 5.79111 31.7956C5.09686 31.677 4.42424 31.4553 3.79556 31.1378C2.5299 30.4943 1.50122 29.4657 0.857778 28.2C0.540266 27.5698 0.318566 26.8957 0.2 26.2C0.0845601 25.505 0.0221579 24.8022 0.0133333 24.0978C0.00444444 23.7778 0 23.4533 0 23.1333V8.86222L0.0133333 7.90222C0.02437 7.19788 0.0867577 6.49527 0.2 5.8C0.317891 5.10416 0.539623 4.42997 0.857778 3.8C1.50465 2.53531 2.53434 1.50718 3.8 0.862222C4.42822 0.542685 5.10093 0.319448 5.79556 0.2C6.49055 0.0845601 7.19332 0.0221579 7.89778 0.0133333C8.21778 0.00444444 8.54222 0 8.86222 0H23.1378L24.1067 0.0133333C24.811 0.02437 25.5136 0.0867577 26.2089 0.2C26.9031 0.318584 27.5758 0.540294 28.2044 0.857778C29.4701 1.50122 30.4988 2.5299 31.1422 3.79556C31.4597 4.4258 31.6814 5.09988 31.8 5.79556C31.9154 6.49055 31.9778 7.19332 31.9867 7.89778C31.9956 8.21778 32 8.54222 32 8.86222ZM21.7733 5.03556C21.8578 5.01778 22.5467 4.89778 22.6222 4.88889C23.1378 4.84445 23.4267 5.18223 23.4311 5.72889V20.8178C23.4436 21.2124 23.4138 21.6073 23.3422 21.9956C23.2615 22.389 23.1029 22.7622 22.8756 23.0933C22.6459 23.4233 22.3471 23.6994 22 23.9022C21.6554 24.0994 21.2796 24.2362 20.8889 24.3067C20.3291 24.4528 19.7453 24.483 19.1733 24.3956C18.7418 24.3093 18.3421 24.1064 18.0178 23.8089C17.7699 23.5857 17.5694 23.3149 17.4283 23.0127C17.2871 22.7104 17.2082 22.3829 17.1962 22.0495C17.1841 21.7162 17.2393 21.3838 17.3583 21.0722C17.4773 20.7606 17.6577 20.476 17.8889 20.2356C18.182 19.9392 18.5372 19.7115 18.9289 19.5689C19.5026 19.3733 20.0912 19.2247 20.6889 19.1244C20.7933 19.1044 20.8967 19.0833 21 19.0622C21.1033 19.0411 21.2067 19.02 21.3111 19C21.5783 18.9713 21.8253 18.8447 22.0044 18.6444C22.1599 18.4117 22.2276 18.1314 22.1956 17.8533V10.8044C22.1956 10.2667 21.9556 10.12 21.44 10.2178C21.0711 10.2889 13.1644 11.8844 13.1644 11.8844C12.7156 11.9956 12.56 12.1422 12.56 12.6933V23.0133C12.5664 23.4086 12.5307 23.8034 12.4533 24.1911C12.3727 24.5845 12.214 24.9578 11.9867 25.2889C11.757 25.6189 11.4582 25.8949 11.1111 26.0978C10.7658 26.2944 10.3904 26.4326 10 26.5067C9.44016 26.6528 8.85639 26.683 8.28445 26.5956C7.85185 26.5096 7.45172 26.305 7.12889 26.0044C6.67868 25.593 6.39685 25.0293 6.33778 24.4222C6.29686 24.0622 6.33491 23.6975 6.44928 23.3536C6.56364 23.0098 6.75158 22.695 7 22.4311C7.29314 22.1348 7.64833 21.9071 8.04 21.7645C8.61367 21.5689 9.20227 21.4203 9.8 21.32C9.90445 21.3 10.0078 21.2789 10.1111 21.2578C10.2144 21.2367 10.3178 21.2156 10.4222 21.1956C10.6894 21.1669 10.9364 21.0402 11.1156 20.84C11.2761 20.6141 11.3502 20.3381 11.3244 20.0622V8.16C11.3232 8.05291 11.3306 7.9459 11.3467 7.84C11.3736 7.6017 11.4876 7.38172 11.6667 7.22223C11.8386 7.08575 12.0417 6.99411 12.2578 6.95556H12.2622L21.7733 5.03556Z" fill="url(#paint0_linear_596_28671)"></path>
            <defs>
                <linearGradient id="paint0_linear_596_28671" x1="16" y1="31.876" x2="16" y2="0.689689" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FA233B"></stop>
                    <stop offset="1" stopColor="#FB5C74"></stop>
                </linearGradient>
            </defs>
        </svg>
      );
    }
    if (lowerName.includes("deezer")) {
      return (
        <svg className="w-6 h-6 text-purple-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 16.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM19.2 11h3.6v9.5h-3.6V11zM0 11h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4zM0 5.5h3.6v4H0v-4zm4.8 0h3.6v4H4.8v-4zm4.8 0h3.6v4H9.6v-4zm4.8 0h3.6v4h-3.6v-4z"/>
        </svg>
      );
    }
    if (lowerName.includes("tidal")) {
      return (
        <svg className="w-6 h-6 text-cyan-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.012 3.993L8.008 7.997 4.004 3.993 0 7.997l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004zM12.012 16.007l4.004-4.004 4.004 4.004 4.004-4.004-4.004-4.004-4.004 4.004-4.004-4.004-4.004 4.004 4.004 4.004z"/>
        </svg>
      );
    }

    return (
      <svg className="w-6 h-6 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  };

  return (
    <Reorder.Item
      value={item}
      onDragEnd={onDragEnd}
      className="list-none bg-white border border-slate-300 rounded-xl p-4 shadow-sm space-y-3 cursor-grab active:cursor-grabbing"
    >
      {/* Parte Superior: Imagen, Icono correspondiente a la izquierda del título y textos */}
      <div className="flex items-center gap-3 overflow-hidden">
        <DragIcon />

        <div className="w-14 h-14 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={displayTitle} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-xl">🎵</span>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          {/* Contenedor del Icono dinámico + Nombre de la canción */}
          <div className="flex items-center gap-1.5 mb-1">
            {renderMainTrackIcon(displayUrl)}
            <span className="text-sm font-medium text-slate-950 truncate block cursor-pointer hover:underline">
              {displayTitle}
            </span>
          </div>

          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 truncate block cursor-pointer hover:underline "
          >
            {displayUrl}
          </a>
        </div>
      </div>

      {/* Bloque Inferior: Botón de Layout, Botón + Añadir plataforma, Switch activo y Borrar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Botón de Layout */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLayoutOpen(!isLayoutOpen);
              setIsPlatformFormOpen(false);
              setIsDeleteOpen(false);
            }}
            className={`py-1 px-3 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
              isLayoutOpen 
                ? "border-black text-black" 
                : "border-slate-200 text-slate-600"
            }`}
            title="Configurar layout de esta canción"
          >
            <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span className="py-1.5 text-xs font-medium rounded-t-lg transition-colors">Layout</span>
          </button>

          {/* Botón + Añadir plataforma */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlatformFormOpen(!isPlatformFormOpen);
              setIsLayoutOpen(false);
              setIsDeleteOpen(false);
            }}
            className={`py-1 px-3 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-medium ${
              isPlatformFormOpen 
                ? "border-black text-black" 
                : "border-slate-200 text-slate-600"
            }`}
          >
            <span className="py-1.5 text-xs font-medium rounded-t-lg transition-colors">+ Añadir plataforma</span>
          </button>
        </div>

        {/* Switch de Activo e Icono de Borrar */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => onToggleActive(item.id)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
          </label>

          <DeleteButton
            isOpen={isDeleteOpen}
            onClick={() => {
              setIsDeleteOpen(!isDeleteOpen);
              setIsLayoutOpen(false);
              setIsPlatformFormOpen(false);
            }}
          />
        </div>
      </div>

      {/* Desplegable: Configurar Layout individual con íconos Clásico y Banner */}
      <AnimatePresence>
        {isLayoutOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2"
          >
            <div className="flex justify-start gap-3">
              {/* Clásico */}
              <button
                type="button"
                onClick={() => {
                  onUpdateLayout(item.id, "classic");
                  setIsLayoutOpen(false);
                }}
                className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2.5 cursor-pointer transition-all text-center group max-w-[140px] w-full ${
                  currentLayout === "classic"
                    ? "border-black text-black bg-white shadow-xs"
                    : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                }`}
              >
                <div className="h-11 w-full flex items-center justify-center transition-colors overflow-hidden">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="1" y="2.5" width="22" height="5" rx="1" strokeWidth="1" />
                    <rect x="1" y="9.5" width="22" height="5" rx="1" strokeWidth="1" />
                    <rect x="1" y="16.5" width="22" height="5" rx="1" strokeWidth="1" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${
                  currentLayout === "classic" ? "text-black font-semibold" : "text-slate-800"
                }`}>
                  Clásico
                </span>
              </button>

              {/* Banner / Featured */}
              <button
                type="button"
                onClick={() => {
                  onUpdateLayout(item.id, "featured");
                  setIsLayoutOpen(false);
                }}
                className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2.5 cursor-pointer transition-all text-center group max-w-[140px] w-full ${
                  currentLayout === "featured"
                    ? "border-black text-black bg-white shadow-xs"
                    : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                }`}
              >
                <div className="h-11 w-full flex items-center justify-center transition-colors overflow-hidden">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="0.5" y="3" width="23" height="18" rx="1.5" strokeWidth="1" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${
                  currentLayout === "featured" ? "text-black font-semibold" : "text-slate-800"
                }`}>
                  Banner
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desplegable: Añadir y gestionar plataformas adicionales */}
      <AnimatePresence>
        {isPlatformFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3"
          >
            
            <form onSubmit={handlePlatformSubmit} className="flex gap-2">
              <input
                type="url"
                placeholder="Pega el enlace (ej. https://youtube.com/...)"
                value={newPlatformUrl}
                onChange={(e) => setNewPlatformUrl(e.target.value)}
                required
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                Añadir
              </button>
            </form>

            {platforms.length > 0 ? (
              <Reorder.Group 
                axis="y" 
                values={platforms} 
                onReorder={(newOrder) => onReorderPlatforms(item.id, newOrder)}
                className="space-y-2 pt-2"
              >
                {platforms.map((plat) => {
                  const isPlatformActive = plat.isActive !== false;

                  return (
                    <Reorder.Item
                      key={plat.id}
                      value={plat}
                      onDragEnd={() => onSavePlatformsOrder(item.id)}
                      className="list-none bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-3 shadow-xs cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                        <DragIcon />
                        {renderPlatformIcon(plat.name)}
                        <div className="flex flex-col truncate flex-1">
                          <span className="text-xs font-semibold text-slate-900 truncate">{plat.name === "Open" ? "Spotify" : plat.name}</span>
                          <a href={plat.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-purple-600 truncate">
                            {plat.url}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Switch de activación para la plataforma */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPlatformActive}
                            onChange={() => onTogglePlatformActive(item.id, plat.id)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[5px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600" />
                        </label>

                        {/* Botón de borrador (Tachito) */}
                        <button
                          type="button"
                          onClick={() => onDeletePlatform(item.id, plat.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                          title="Eliminar plataforma"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            ) : (
              <p className="text-[11px] text-slate-400 italic text-center py-1">No hay plataformas adicionales añadidas.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú de confirmación de eliminación */}
      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center justify-between gap-2 text-xs"
          >
            <span className="font-medium text-rose-900">¿Eliminar esta pista de audio?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => onDeleteTrack(item.id)}
                className="bg-rose-600 text-white px-3 py-1.5 rounded-lg font-medium cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}