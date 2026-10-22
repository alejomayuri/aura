"use client";

import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

function toHex(color) {
  if (!color) return "#000000";
  if (color.startsWith("#")) {
    return color;
  }
  return color;
}

export function ColorPickerItem({ label, colorValue, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  
  const solidHex = toHex(colorValue) || "#000000";
  const [textValue, setTextValue] = useState(solidHex);

  const [prevColorValue, setPrevColorValue] = useState(colorValue);
  if (colorValue !== prevColorValue) {
    setPrevColorValue(colorValue);
    setTextValue(toHex(colorValue) || "#000000");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTextChange = (e) => {
    let val = e.target.value;
    val = val.replace(/[^0-9a-fA-F#]/g, "");
    if (val.indexOf("#") > 0) {
      val = val.replace(/#/g, "");
    }
    if (val.length > 7) {
      val = val.slice(0, 7);
    }
    setTextValue(val);
    onChange(val);
  };

  return (
    <div className="bg-white border border-slate-300 rounded-2xl p-4 flex items-center justify-between w-full">
      <div>
        <span className="text-sm font-semibold text-slate-900 block">{label}</span>
      </div>

      <div className="relative" ref={popoverRef}>
        <div className="rounded-full p-0.5 border border-slate-300 shadow-sm hover:border-slate-400 transition-colors bg-white flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 rounded-full cursor-pointer appearance-none border-0 p-0 overflow-hidden relative flex items-center justify-center"
            style={{ backgroundColor: solidHex }}
          />
        </div>

        {isOpen && (
          <div className="absolute right-0 top-14 z-50 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl flex flex-col items-center gap-3 w-[220px]">
            <HexColorPicker
              color={solidHex}
              onChange={(newColor) => {
                setTextValue(newColor);
                onChange(newColor);
              }}
              className="!w-full !h-40"
            />
            <div className="w-full flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
              <input
                type="text"
                value={textValue}
                onChange={handleTextChange}
                maxLength={7}
                placeholder="#000000"
                className="w-full text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center text-slate-700 outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function GradientColorPickerItem({ label, colorStart, colorEnd, onChangeStart, onChangeEnd }) {
  const [openPicker, setOpenPicker] = useState(null);
  const popoverRef = useRef(null);

  const solidStart = toHex(colorStart) || "#000000";
  const solidEnd = toHex(colorEnd) || "#000000";

  const [textStart, setTextStart] = useState(solidStart);
  const [textEnd, setTextEnd] = useState(solidEnd);

  const [prevStart, setPrevStart] = useState(colorStart);
  if (colorStart !== prevStart) {
    setPrevStart(colorStart);
    setTextStart(toHex(colorStart) || "#000000");
  }

  const [prevEnd, setPrevEnd] = useState(colorEnd);
  if (colorEnd !== prevEnd) {
    setPrevEnd(colorEnd);
    setTextEnd(toHex(colorEnd) || "#000000");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpenPicker(null);
      }
    }
    if (openPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPicker]);

  const handleTextChange = (e, type) => {
    let val = e.target.value;
    val = val.replace(/[^0-9a-fA-F#]/g, "");
    if (val.indexOf("#") > 0) {
      val = val.replace(/#/g, "");
    }
    if (val.length > 7) {
      val = val.slice(0, 7);
    }

    if (type === "start") {
      setTextStart(val);
      onChangeStart(val);
    } else {
      setTextEnd(val);
      onChangeEnd(val);
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-2xl p-4 flex items-center justify-between w-full" ref={popoverRef}>
      <div>
        <span className="text-sm font-semibold text-slate-900 block">{label}</span>
      </div>

      <div className="flex items-center gap-3 relative">
        <div className="rounded-full p-0.5 border border-slate-300 shadow-sm hover:border-slate-400 transition-colors bg-white flex items-center justify-center">
          <button
            type="button"
            onClick={() => setOpenPicker(openPicker === "start" ? null : "start")}
            className="w-12 h-12 rounded-full cursor-pointer appearance-none border-0 p-0 overflow-hidden relative flex items-center justify-center"
            style={{ backgroundColor: solidStart }}
          />
        </div>

        <div className="rounded-full p-0.5 border border-slate-300 shadow-sm hover:border-slate-400 transition-colors bg-white flex items-center justify-center">
          <button
            type="button"
            onClick={() => setOpenPicker(openPicker === "end" ? null : "end")}
            className="w-12 h-12 rounded-full cursor-pointer appearance-none border-0 p-0 overflow-hidden relative flex items-center justify-center"
            style={{ backgroundColor: solidEnd }}
          />
        </div>

        {openPicker && (
          <div className="absolute right-0 top-14 z-50 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl flex flex-col items-center gap-3 w-[220px]">
            <HexColorPicker
              color={openPicker === "start" ? solidStart : solidEnd}
              onChange={(newColor) => {
                if (openPicker === "start") {
                  setTextStart(newColor);
                  onChangeStart(newColor);
                } else {
                  setTextEnd(newColor);
                  onChangeEnd(newColor);
                }
              }}
              className="!w-full !h-40"
            />
            <div className="w-full flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
              <input
                type="text"
                value={openPicker === "start" ? textStart : textEnd}
                onChange={(e) => handleTextChange(e, openPicker)}
                maxLength={7}
                placeholder="#000000"
                className="w-full text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center text-slate-700 outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}