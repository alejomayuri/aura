"use client";

import { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Link2,
  Headphones,
  Image as ImageIcon,
  ShoppingBag,
  Home,
  ChevronDown,
  Calendar,
} from "lucide-react";

function getPageTypeIcon(type, className = "w-3.5 h-3.5 text-black-600 shrink-0") {
  if (type === "home") return <Home className={className} />;
  if (type === "audio") return <Headphones className={className} />;
  if (type === "image") return <ImageIcon className={className} />;
  if (type === "store") return <ShoppingBag className={className} />;
  return <Link2 className={className} />;
}

const TIME_RANGE_OPTIONS = [
  { value: "7days", label: "Últimos 7 días" },
  { value: "30days", label: "Últimos 30 días" },
  { value: "year", label: "Este año" },
];

function CustomTrafficTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const viewsValue = Number(payload[0]?.value ?? 0);

  return (
    <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-800 text-xs space-y-0.5">
      <p className="text-[11px] font-medium text-slate-300">{label}</p>
      <p className="font-bold text-purple-300">
        {viewsValue.toLocaleString()} {viewsValue === 1 ? "visita" : "visitas"}
      </p>
    </div>
  );
}

export default function TrafficEvolutionChart({
  pagesList = [],
  eventsList = [],
}) {
  const [chartPageFilter, setChartPageFilter] = useState("home");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7days");
  const [isChartPageDropdownOpen, setIsChartPageDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const chartPageDropdownRef = useRef(null);
  const timeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        chartPageDropdownRef.current &&
        !chartPageDropdownRef.current.contains(e.target)
      ) {
        setIsChartPageDropdownOpen(false);
      }
      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(e.target)
      ) {
        setIsTimeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isChartHomeSelected =
    chartPageFilter === "home" || chartPageFilter === "all";

  const chartSelectedPageObj = !isChartHomeSelected
    ? pagesList.find(
        (page, idx) => (page.id || page.title || `page-${idx}`) === chartPageFilter
      )
    : null;

  const chartSelectedLabel = isChartHomeSelected
    ? "Home"
    : chartSelectedPageObj?.title ||
      `Página (${chartSelectedPageObj?.type || "página"})`;
  const chartSelectedIconType = isChartHomeSelected
    ? "home"
    : chartSelectedPageObj?.type;

  const selectedTimeLabel =
    TIME_RANGE_OPTIONS.find((opt) => opt.value === selectedTimeRange)?.label ||
    "Últimos 7 días";

  const getChartData = () => {
    const now = new Date();
    const validEvents = eventsList.filter((ev) => {
      if (ev.type !== "page_view") return false;
      if (isChartHomeSelected) {
        return ev.target === "home" || !ev.pageId;
      }
      const matchesId =
        chartSelectedPageObj?.id &&
        String(ev.pageId) === String(chartSelectedPageObj.id);
      const matchesSlug =
        chartSelectedPageObj?.slug && ev.pageSlug === chartSelectedPageObj.slug;
      return matchesId || matchesSlug;
    });

    if (selectedTimeRange === "7days") {
      const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      const buckets = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

        const count = validEvents.filter(
          (ev) => ev.dateObj && ev.dateObj >= start && ev.dateObj <= end
        ).length;

        buckets.push({
          label: dayNames[d.getDay()],
          views: count,
        });
      }
      return buckets;
    }

    if (selectedTimeRange === "30days") {
      const buckets = [];
      for (let w = 3; w >= 0; w--) {
        const end = new Date(now);
        end.setDate(now.getDate() - w * 7);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const count = validEvents.filter(
          (ev) => ev.dateObj && ev.dateObj >= start && ev.dateObj <= end
        ).length;

        buckets.push({
          label: `Sem ${4 - w}`,
          views: count,
        });
      }
      return buckets;
    }

    const monthNames = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];
    const currentMonth = now.getMonth();
    const buckets = [];
    for (let m = Math.max(0, currentMonth - 3); m <= currentMonth; m++) {
      const count = validEvents.filter(
        (ev) =>
          ev.dateObj &&
          ev.dateObj.getFullYear() === now.getFullYear() &&
          ev.dateObj.getMonth() === m
      ).length;

      buckets.push({
        label: monthNames[m],
        views: count,
      });
    }
    return buckets;
  };

  const currentChartData = getChartData();
  const maxRawViews = Math.max(...currentChartData.map((d) => d.views), 0);
  const yAxisMax = maxRawViews < 4 ? 4 : Math.ceil(maxRawViews * 1.2);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Evolución Detallada del Tráfico
          </h3>
        </div>

        {/* Selectores de página y tiempo con estilo de WeeklySummary */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dropdown de página */}
          <div className="relative" ref={chartPageDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsChartPageDropdownOpen((prev) => !prev);
                setIsTimeDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-2.5 min-w-[180px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3.5 py-2 outline-none focus:border-black-500 transition cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                {getPageTypeIcon(chartSelectedIconType)}
                <span className="truncate">{chartSelectedLabel}</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                  isChartPageDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isChartPageDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30">
                <button
                  type="button"
                  onClick={() => {
                    setChartPageFilter("home");
                    setIsChartPageDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                    isChartHomeSelected
                      ? "bg-black-50 text-black-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {getPageTypeIcon("home")}
                  <span className="truncate">Home</span>
                </button>

                {pagesList.map((page, idx) => {
                  const optionValue = page.id || page.title || `page-${idx}`;
                  const isOptionSelected = chartPageFilter === optionValue;
                  const optionLabel = page.title || `Página ${idx + 1} (${page.type})`;

                  return (
                    <button
                      key={page.id || idx}
                      type="button"
                      onClick={() => {
                        setChartPageFilter(optionValue);
                        setIsChartPageDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                        isOptionSelected
                          ? "bg-black-50 text-black-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {getPageTypeIcon(page.type)}
                      <span className="truncate">{optionLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dropdown de rango de tiempo */}
          <div className="relative" ref={timeDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsTimeDropdownOpen((prev) => !prev);
                setIsChartPageDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-2.5 min-w-[165px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3.5 py-2 outline-none focus:border-black-500 transition cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <Calendar className="w-3.5 h-3.5 text-black-600 shrink-0" />
                <span className="truncate">{selectedTimeLabel}</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                  isTimeDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isTimeDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30">
                {TIME_RANGE_OPTIONS.map((opt) => {
                  const isSelected = selectedTimeRange === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedTimeRange(opt.value);
                        setIsTimeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? "bg-black-50 text-black-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gráfico con Recharts */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentChartData}
            margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
          >
            <defs>
              <linearGradient id="trafficPurpleFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="label"
              axisLine={{ stroke: null }}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
              dy={8}
            />

            <YAxis
              domain={[0, yAxisMax]}
              allowDecimals={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            />

            <Tooltip
              content={<CustomTrafficTooltip />}
              cursor={{
                stroke: "#e2e8f0",
                strokeWidth: 1.5,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="views"
              stroke="#9333ea"
              strokeWidth={3}
              fill="url(#trafficPurpleFill)"
              activeDot={{
                r: 6,
                fill: "#ffffff",
                stroke: "#9333ea",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}