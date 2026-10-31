"use client";

import { useState } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import DeleteButton from "../ui/DeleteButton";
import DragIcon from "../ui/DragIcon";

export default function StoreCardItem({
  item,
  onDragEnd,
  onToggleActive,
  onToggleFeatured,
  onUpdateOffer,
  onDeleteTrack,
  editingTitleId,
  setEditingTitleId,
  tempTitle,
  setTempTitle,
  handleSaveTitle,
  deleteConfirmId,
  setDeleteConfirmId,
}) {
  const [isOfferOpen, setIsOfferOpen] = useState(false);

  const isEditing = editingTitleId === item.id;
  const isDeleteOpen = deleteConfirmId === item.id;
  const isFeatured = item.isFeatured === true;

  const hasPrice = item.price !== null && item.price !== undefined;

  console.log("item", item)

  // Tipo de descuento actual ("amount" o "percentage")
  const [discountType, setDiscountType] = useState(item.discountType || "amount"); 

  // Valores independientes para monto y porcentaje
  const [amountValue, setAmountValue] = useState(
    item.discountType === "amount" ? (item.discountValue ?? item.discountPrice ?? 0) : 0
  );
  const [percentageValue, setPercentageValue] = useState(
    item.discountType === "percentage" ? (item.discountValue ?? 0) : 0
  );

  const currentInputValue = discountType === "amount" ? amountValue : percentageValue;

  const handleInputChange = (val) => {
    if (discountType === "amount") {
      setAmountValue(val);
    } else {
      setPercentageValue(val);
    }
  };

  const handleTypeChange = (newType) => {
    setDiscountType(newType);
  };

  const handleSaveOffer = (e) => {
    e.preventDefault();
    const val = Number(currentInputValue) || 0;
    
    let finalDiscountPrice = 0;
    let finalDiscountValue = 0;

    if (val > 0) {
      if (discountType === "percentage") {
        finalDiscountValue = val;
        const originalPrice = Number(item.price || 0);
        finalDiscountPrice = Math.max(0, originalPrice - (originalPrice * (val / 100)));
      } else {
        finalDiscountValue = val;
        finalDiscountPrice = val;
      }
    }

    if (typeof onUpdateOffer === "function") {
      onUpdateOffer(item.id, {
        isOnSale: val > 0,
        discountType,
        discountValue: finalDiscountValue,
        discountPrice: Number(finalDiscountPrice.toFixed(2)),
      });
    }
    setIsOfferOpen(false);
  };

  return (
    <Reorder.Item
      key={item.id}
      value={item}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="list-none bg-white border border-slate-300 p-3.5 rounded-xl cursor-grab active:cursor-grabbing shadow-sm"
    >
      {/* Contenedor principal con items-center para fijarlo arriba */}
      <div className="flex items-center gap-3">
        {/* 1. Bloque de arrastre alineado arriba */}
        <div className="pt-1 shrink-0">
          <DragIcon />
        </div>

        {/* 2. Bloque derecho que agrupa la info, imagen y acciones */}
        <div className="flex flex-col gap-3 overflow-hidden w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
              {/* Imagen Preview del producto (a la izquierda de la info, como lo tenías) */}
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title || "Preview"}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                  🛍️
                </div>
              )}

              {/* Información del producto */}
              <div className="flex-1 min-w-0 pr-1">
                {/* Título editable mediante el patrón centralizado con LinkItem */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTitle(item.id);
                        if (e.key === "Escape") setEditingTitleId(null);
                      }}
                      className="w-full text-sm font-medium text-slate-800 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4
                      onClick={() => {
                        setEditingTitleId(item.id);
                        setTempTitle(item.title || "");
                      }}
                      className="text-sm font-medium text-slate-800 truncate cursor-pointer hover:underline transition-colors"
                      title="Haz clic para editar el nombre"
                    >
                      {item.title || "Sin título"}
                    </h4>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                  {hasPrice ? (
                    item.isOnSale && item.discountPrice > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-slate-400">
                          {item.currency || "S/"} {Number(item.price || 0).toFixed(2)}
                        </span>
                        <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          {item.currency || "S/"} {Number(item.discountPrice).toFixed(2)}
                          {item.discountType === "percentage" && item.discountValue ? ` (-${item.discountValue}%)` : ""}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-700">
                        {item.currency || "S/"} {Number(item.price || 0).toFixed(2)}
                      </span>
                    )
                  ) : null}

                  {hasPrice && (
                    <span>·</span>
                  )}

                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 truncate max-w-[120px]">
                    {item.category || "General"}
                  </span>

                  {hasPrice && item.isOnSale && item.discountPrice > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">
                      Oferta
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fila inferior dentro del bloque derecho: Todos los íconos juntos (Estrella con color original, Oferta, Switch y Tachito) */}
          <div className="flex items-center gap-3 text-xs" onClick={(e) => e.stopPropagation()}>
            {/* Botón de Destacar (Estrella con su color amarillo original) */}
            <button
              type="button"
              onClick={() => onToggleFeatured && onToggleFeatured(item.id)}
              className={`cursor-pointer transition-all p-1 ${
                isFeatured ? "text-black" : "text-slate-400 hover:text-slate-700"
              }`}
              title={isFeatured ? "Quitar destacado" : "Destacar producto"}
            >
              <svg
                className="w-5 h-5"
                fill={isFeatured ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke={isFeatured ? "currentColor" : "currentColor"}
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>

            {/* Botón de Oferta (Desactivado si no tiene precio) */}
            <button
              type="button"
              disabled={!hasPrice}
              onClick={() => {
                if (!hasPrice) return;
                setIsOfferOpen(!isOfferOpen);
                setDeleteConfirmId(null);
              }}
              className={`transition-all ${
                !hasPrice 
                  ? "opacity-30 cursor-not-allowed text-slate-400" 
                  : item.isOnSale 
                    ? "text-purple-600 cursor-pointer" 
                    : "text-slate-400 hover:text-black cursor-pointer"
              }`}
              title={hasPrice ? "Configurar oferta" : "Añade un precio para configurar ofertas"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </button>

            {/* Switch de Activo/Oculto */}
            <label className="relative inline-flex items-center cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={item.isActive !== false}
                onChange={() => onToggleActive(item.id)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>

            {/* Botón de eliminar / Tachito */}
            <DeleteButton
              isOpen={isDeleteOpen}
              onClick={() => {
                setDeleteConfirmId(isDeleteOpen ? null : item.id);
                setIsOfferOpen(false);
              }}
            />
          </div>

          {/* Panel desplegable de ofertas */}
          <AnimatePresence>
            {isOfferOpen && hasPrice && (
              <motion.form
                onSubmit={handleSaveOffer}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5 mt-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800">Tipo de descuento</span>
                  <div className="flex bg-slate-200 p-0.5 rounded-lg text-[11px] font-medium">
                    <button
                      type="button"
                      onClick={() => handleTypeChange("amount")}
                      className={`px-2 py-1 rounded-md transition cursor-pointer ${
                        discountType === "amount" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Monto ({item.currency || "S/"})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange("percentage")}
                      className={`px-2 py-1 rounded-md transition cursor-pointer ${
                        discountType === "percentage" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Porcentaje (%)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 block">
                    {discountType === "amount" ? "Precio final de descuento" : "Porcentaje de descuento"}
                  </label>
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-slate-900">
                    <input
                      type="number"
                      step="0.01"
                      placeholder={discountType === "amount" ? "0.00" : "0"}
                      value={currentInputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                    />
                    <span className="px-3 bg-slate-50 border-l border-slate-200 text-xs text-slate-500 font-medium py-1.5">
                      {discountType === "amount" ? (item.currency || "S/") : "%"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    * Si el valor es 0, la oferta se desactivará.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsOfferOpen(false)}
                    className="bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-3 py-1 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-800"
                  >
                    Guardar
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Panel desplegable de confirmación de eliminación */}
          <AnimatePresence>
            {isDeleteOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-rose-50/50 border border-rose-100 rounded-lg p-3 space-y-2.5 mt-1"
              >
                <span className="text-xs font-semibold text-rose-950 block">
                  ¿Eliminar este producto?
                </span>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    className="bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTrack(item.id)}
                    className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Reorder.Item>
  );
}