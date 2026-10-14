export const getTemplateStyles = (currentTemplate) => {
  switch (currentTemplate) {
    // ================= NUEVOS TEMAS LOCOS Y EXTREMOS =================
    case "y2k":
      return {
        bgScreen: "bg-fuchsia-950 min-h-screen flex items-center justify-center",
        container: "bg-fuchsia-600 border-4 border-lime-300 shadow-[10px_10px_0px_0px_#bef264] rounded-none relative transform",
        badge: "bg-lime-300 text-fuchsia-950 font-black tracking-widest text-[10px] px-3 py-1 absolute top-2 right-2 border-2 border-fuchsia-950",
        headerLayout: "flex flex-col items-center",
        description: "text-fuchsia-950 font-bold tracking-tight text-center",
        imageWrapper: "w-28 h-28 rounded-full border-4 border-dashed border-lime-300 bg-cyan-400 p-1 shadow-[5px_5px_0px_0px_#000] mb-3 animate-pulse",
        textContainer: "text-center w-full",
        title: "text-lime-300 font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        socialWrapper: "flex flex-wrap items-center justify-center gap-2 py-3 bg-fuchsia-900/40 border-y-2 border-lime-300 my-2",
        socialIconBtn: "w-10 h-10 bg-lime-300 border-2 border-fuchsia-950 text-fuchsia-950 transition-all rounded-none flex items-center justify-center shadow-[3px_3px_0px_0px_#000]",
        pageCard: "bg-cyan-300 border-2 border-fuchsia-950 shadow-[4px_4px_0px_0px_#581c87] hover:bg-lime-300 transition-all rounded-none text-left font-mono",
        pageTitle: "text-fuchsia-950 font-black text-xs uppercase",
        invertIcon: false
      };
    case "holographic":
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-900",
        container: " border-2 border-white/80 shadow-[0_0_40px_rgba(236,72,153,0.5)] rounded-t-[3.5rem] relative pt-16 overflow-hidden backdrop-blur-2xl",
        badge: "bg-white/30 text-white font-bold backdrop-blur-md border border-white/50 rounded-full px-4 absolute top-4 right-4 text-[10px] tracking-widest shadow-lg",
        headerLayout: "flex flex-col items-center",
        description: "text-white font-bold tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-full border-4 border-white/90 bg-gradient-to-r from-teal-300 to-pink-300 p-1 shadow-2xl mb-3",
        textContainer: "text-center px-4",
        title: "text-white font-extrabold tracking-wide drop-shadow-md",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-4 bg-white/10 backdrop-blur-md rounded-2xl mx-2 my-2 border border-white/20",
        socialIconBtn: "w-10 h-10 rounded-full border border-white/50 text-white transition-all shadow-md flex items-center justify-center hover:scale-110",
        pageCard: "bg-white/15 backdrop-blur-md border border-white/40 hover:bg-white/30 rounded-2xl text-left shadow-lg transition-all",
        pageTitle: "text-white font-bold text-xs tracking-wider",
        invertIcon: false
      };
    case "comic":
      return {
        bgScreen: "bg-sky-400 min-h-screen flex items-center justify-center",
        container: "bg-yellow-200 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-t-[2rem] relative pt-12 overflow-hidden",
        badge: "bg-red-600 text-yellow-200 font-black tracking-widest uppercase border-2 border-black absolute top-3 right-4 px-3 py-0.5 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3",
        headerLayout: "flex flex-col items-center",
        description: "text-black font-bold tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3 rotate-2",
        textContainer: "text-center w-full",
        title: "text-black font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_#fff]",
        socialWrapper: "flex flex-wrap items-center justify-center gap-2.5 py-3 border-y-4 border-black my-2 bg-white/50",
        socialIconBtn: "w-10 h-10 border-3 border-black text-black hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center font-bold",
        pageCard: "bg-white border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl text-left",
        pageTitle: "text-black font-black uppercase text-xs tracking-tight",
        invertIcon: false
      };

    // ================= TEMAS ANTERIORES =================
    case "neon":
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]",
        container: "bg-slate-950 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-none border-x-2 border-y-0 relative overflow-hidden pt-10",
        badge: "bg-purple-900/50 text-purple-300 border border-purple-500/50 rounded-none absolute top-3 right-4",
        headerLayout: "flex flex-col",
        description: "text-purple-300 font-bold tracking-tight text-center",
        imageWrapper: "w-[calc(100%+2.5rem)] h-36 rounded-none border-b-2 border-purple-500/40 bg-purple-950/20 -mx-5 -mt-5 mb-4 skew-y-1 transform origin-top-left",
        textContainer: "text-right relative z-10",
        title: "text-purple-400 font-extrabold tracking-widest uppercase text-lg",
        socialWrapper: "flex flex-wrap items-center justify-end gap-2 py-3",
        socialIconBtn: "w-9 h-9 flex items-center justify-center rounded-none border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 hover:-translate-y-1 transition-transform",
        pageCard: "bg-purple-950/20 border border-purple-500/30 hover:border-purple-400 rounded-none text-left",
        pageTitle: "text-purple-300 font-bold uppercase tracking-wider",
        invertIcon: true
      };
    case "classic":
      return {
        bgScreen: "bg-zinc-950 min-h-screen flex items-center justify-center",
        container: "bg-zinc-900 border-zinc-700 shadow-md rounded-t-sm relative pt-12",
        badge: "bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-sm font-serif absolute top-3 right-4",
        headerLayout: "flex flex-row items-center gap-4 mb-2",
        description: "text-zinc-400 font-serif tracking-wide text-center",
        imageWrapper: "w-20 h-20 shrink-0 rounded-sm border border-zinc-600 bg-zinc-950",
        textContainer: "text-left flex-1",
        title: "text-zinc-100 font-serif tracking-normal text-lg",
        socialWrapper: "flex flex-wrap items-center justify-start gap-2 pt-4 border-t border-zinc-800 mt-2",
        socialIconBtn: "w-8 h-8 flex items-center justify-center rounded-sm border border-zinc-700 hover:bg-zinc-700 transition-colors",
        pageCard: "bg-zinc-800/50 border border-zinc-700 hover:border-zinc-500 rounded-sm text-left",
        pageTitle: "text-zinc-200 font-serif font-semibold",
        invertIcon: true
      };
    case "brutal":
      return {
        bgScreen: "bg-zinc-900 min-h-screen flex items-center justify-center",
        container: "border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none relative",
        badge: "bg-white text-black border-2 border-black font-black uppercase absolute top-3 right-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        headerLayout: "flex flex-col items-start gap-2",
        description: "text-black font-bold tracking-tight text-center",
        imageWrapper: "w-full h-32 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none mb-2",
        textContainer: "text-left w-full",
        title: "text-black font-black tracking-tighter uppercase leading-none",
        socialWrapper: "flex flex-wrap items-center justify-start gap-3 py-4",
        socialIconBtn: "w-10 h-10 border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]",
        pageCard: "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none text-left mb-3",
        pageTitle: "text-black font-black uppercase text-xs",
        // invertIcon: false
        customIconFilter: "invert(0.5) sepia(1) hue-rotate(80deg) saturate(500%)"
      };
    case "glass":
      return {
        bgScreen: "bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-200",
        container: "bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-t-[2.5rem] relative overflow-hidden",
        badge: "bg-white/20 text-slate-700 backdrop-blur-md border border-white/50 rounded-full absolute top-4 right-5 px-3 py-1 shadow-sm",
        headerLayout: "flex flex-col items-center gap-3",
        description: "text-slate-700 font-bold tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-[2rem] border-2 border-white/60 shadow-xl bg-white/20 p-1",
        textContainer: "text-center w-full px-2",
        title: "text-slate-800 font-bold text-lg tracking-tight",
        socialWrapper: "flex flex-wrap items-center justify-center gap-2.5 py-4",
        socialIconBtn: "w-11 h-11 backdrop-blur-sm border border-white/50 text-slate-700 rounded-2xl hover:bg-white/50 hover:scale-105 transition-all shadow-sm flex items-center justify-center",
        pageCard: "bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 rounded-[1.5rem] text-left shadow-sm",
        pageTitle: "text-slate-700 font-semibold text-xs",
        invertIcon: false
      };
    case "terminal":
      return {
        bgScreen: "bg-zinc-950 min-h-screen flex items-center justify-center",
        container: "bg-black border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)] rounded-none relative font-mono pt-10",
        badge: "bg-black text-green-400 border border-green-500/50 absolute top-2 right-2 text-[9px] px-2",
        headerLayout: "flex flex-col items-start gap-3",
        description: "text-green-400 font-mono tracking-tight",
        imageWrapper: "w-16 h-16 rounded-none border border-green-500/50 grayscale opacity-90",
        textContainer: "text-left w-full",
        title: "text-green-400 font-bold text-base before:content-['>_'] before:mr-1",
        socialWrapper: "flex flex-col items-start w-full gap-1.5 py-3 border-t border-dashed border-green-500/30 mt-2",
        socialIconBtn: "w-full py-1.5 px-2 border border-green-500/20 text-green-400 hover:bg-green-900/30 hover:border-green-500 text-xs flex items-center justify-start gap-2.5 transition-colors rounded-none",
        pageCard: "bg-transparent border border-green-500/30 hover:bg-green-900/20 text-left rounded-none border-l-4 hover:border-l-green-400",
        pageTitle: "text-green-400 text-xs",
        invertIcon: false,
        showSocialText: true,
        customIconFilter: "invert(0.5) sepia(1) hue-rotate(80deg) saturate(500%)"
      };
    case "minimal":
    default:
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center",
        container: "bg-slate-900 border-slate-800 shadow-xl rounded-t-3xl relative pt-14 mt-8",
        badge: "bg-slate-800 text-slate-300 border border-slate-700 rounded-full px-3 absolute top-4 right-4",
        headerLayout: "gap-2 flex flex-col items-center",
        description: "text-slate-700 font-bold tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-950 absolute -top-12 left-1/2 -translate-x-1/2 shadow-lg",
        textContainer: "text-center",
        title: "text-white font-bold tracking-tight",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-3",
        socialIconBtn: "w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 transition-colors",
        pageCard: "bg-slate-800/30 border border-slate-700 hover:border-slate-600 rounded-2xl text-left",
        pageTitle: "text-slate-200 font-medium text-xs",
        invertIcon: true
      };
  }
};