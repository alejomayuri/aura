export const getTemplateStyles = (currentTemplate) => {
  switch (currentTemplate) {
    // ================= NUEVOS TEMAS LOCOS Y EXTREMOS =================
    case "zen":
    return {
        bgScreen: "bg-[#fdfbf7] min-h-screen flex items-center justify-center",
        container: "bg-[#f5f4f0] border border-[#d1cfc5] shadow-sm rounded-none relative pt-14 mt-8 font-serif",
        badge: "bg-[#e3e1d8] text-[#333] border border-[#c7c5bc] rounded-none px-3 absolute top-4 right-4 text-[10px] tracking-widest uppercase",
        headerLayout: "gap-2 flex flex-col items-center",
        description: "text-[#666] font-normal italic text-xs tracking-wide text-center",
        imageWrapper: "w-24 h-24 rounded-none border border-[#333] bg-[#fff] absolute -top-12 left-1/2 -translate-x-1/2 shadow-md",
        textContainer: "text-center space-y-1 mt-2",
        title: "text-[#1a1a1a] font-normal tracking-wide text-xl",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-3",
        socialIconBtn: "w-10 h-10 flex items-center justify-center rounded-none bg-[#e3e1d8] border border-[#c7c5bc] text-[#333] hover:bg-[#1a1a1a] hover:text-white transition-colors",
        pageCard: "bg-[#eae8df]/60 border border-[#d1cfc5] hover:border-[#1a1a1a] rounded-none text-left transition-colors",
        pageTitle: "text-[#2a2a2a] font-normal text-xs tracking-wide",
        miniImgShape: "rounded-none",
        invertIcon: true
    };
    case "brutalist":
    return {
        bgScreen: "bg-neutral-900 min-h-screen flex items-center justify-center",
        container: "bg-lime-300 border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none relative pt-14 mt-8",
        badge: "bg-black text-lime-300 font-extrabold border-2 border-black rounded-none px-3 absolute top-4 right-4 shadow-[3px_3px_0px_0px_#fff]",
        headerLayout: "gap-2 flex flex-col items-center",
        description: "text-black font-black text-xs tracking-tight text-center uppercase",
        imageWrapper: "w-24 h-24 rounded-none border-4 border-black bg-white absolute -top-12 left-1/2 -translate-x-1/2 shadow-[5px_5px_0px_0px_#000]",
        textContainer: "text-center space-y-1 mt-2",
        title: "text-black font-black tracking-tight text-xl uppercase underline decoration-4",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-3",
        socialIconBtn: "w-10 h-10 flex items-center justify-center rounded-none bg-white border-4 border-black text-black hover:bg-black hover:text-lime-300 transition-none shadow-[3px_3px_0px_0px_#000]",
        pageCard: "bg-white border-4 border-black hover:bg-yellow-200 rounded-none text-left shadow-[5px_5px_0px_0px_#000] transition-none",
        pageTitle: "text-black font-black text-xs uppercase",
        miniImgShape: "rounded-none",
        invertIcon: false
    };
    case "y2k_retro":
    return {
        bgScreen: "bg-purple-950 min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900 via-purple-950 to-black",
        container: "bg-gradient-to-tr from-purple-900 via-fuchsia-800 to-pink-600 border-4 border-pink-300 shadow-[0_0_30px_rgba(236,72,153,0.6)] rounded-t-[40px] relative pt-14 mt-8",
        badge: "bg-pink-300 text-purple-950 font-black border-2 border-white rounded-full px-4 absolute top-4 right-4 shadow-md animate-pulse",
        headerLayout: "gap-2 flex flex-col items-center",
        description: "text-pink-200 font-extrabold text-xs tracking-tight text-center drop-shadow",
        imageWrapper: "w-24 h-24 rounded-full border-4 border-pink-300 bg-purple-950 absolute -top-12 left-1/2 -translate-x-1/2 shadow-xl",
        textContainer: "text-center space-y-1 mt-2",
        title: "text-white font-black tracking-tight text-xl drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-3",
        socialIconBtn: "w-10 h-10 flex items-center justify-center rounded-full bg-pink-400/40 border-2 border-pink-200 text-white hover:bg-pink-300 hover:text-purple-950 transition-all shadow-md",
        pageCard: "bg-purple-950/50 border-2 border-pink-400/50 hover:border-white rounded-3xl text-left shadow-lg backdrop-blur-md",
        pageTitle: "text-pink-100 font-bold text-xs",
        miniImgShape: "rounded-full",
        invertIcon: false
    };
    case "cyberpunk_tech":
    return {
        bgScreen: "bg-zinc-950 min-h-screen flex items-center justify-center bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]",
        container: "bg-black border-2 border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.5)] rounded-none relative pt-14 mt-8 uppercase font-mono",
        badge: "bg-yellow-400 text-black font-extrabold border border-yellow-300 rounded-none px-3 absolute top-4 right-4 rotate-2 shadow-[2px_2px_0px_0px_#fff]",
        headerLayout: "gap-2 flex flex-col items-center",
        description: "text-yellow-400 font-black text-xs tracking-widest text-center drop-shadow-[0_2px_2px_rgba(0,0,0,1)]",
        imageWrapper: "w-24 h-24 rounded-none border-4 border-yellow-400 bg-black absolute -top-12 left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(234,179,8,0.8)] skew-x-6",
        textContainer: "text-center space-y-1 mt-2",
        title: "text-yellow-300 font-black tracking-wider text-xl drop-shadow-[2px_2px_0px_#ff00ff]",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-3",
        socialIconBtn: "w-10 h-10 flex items-center justify-center rounded-none bg-yellow-400 text-black font-bold border-2 border-white hover:bg-pink-500 hover:text-white transition-all shadow-[3px_3px_0px_0px_#fff]",
        pageCard: "bg-yellow-950/40 border-2 border-yellow-400/80 hover:border-pink-500 rounded-none text-left shadow-[4px_4px_0px_0px_rgba(234,179,8,0.5)] transition-all",
        pageTitle: "text-yellow-200 font-bold text-xs tracking-wider",
        miniImgShape: "rounded-none",
        invertIcon: false
    };
    case "y2k":
      return {
        bgScreen: "bg-fuchsia-950 min-h-screen flex items-center justify-center",
        container: "bg-fuchsia-600 border-4 border-lime-300 shadow-[10px_10px_0px_0px_#bef264] rounded-none relative pt-12 transform -rotate-1",
        badge: "bg-lime-300 text-fuchsia-950 font-black tracking-widest text-[10px] px-3 py-1 absolute top-2 right-2 border-2 border-fuchsia-950",
        headerLayout: "flex flex-col items-center",
        description: "text-fuchsia-950 font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-28 h-28 rounded-full border-4 border-dashed border-lime-300 bg-cyan-400 p-1 shadow-[5px_5px_0px_0px_#000] mb-3 animate-pulse",
        textContainer: "text-center space-y-1 w-full",
        title: "text-lime-300 font-black uppercase text-xl tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        socialWrapper: "flex flex-wrap items-center justify-center gap-2 py-3 bg-fuchsia-900/40 border-y-2 border-lime-300 my-2",
        socialIconBtn: "w-10 h-10 bg-lime-300 border-2 border-fuchsia-950 text-fuchsia-950 hover:bg-cyan-400 hover:scale-110 transition-all rounded-none flex items-center justify-center shadow-[3px_3px_0px_0px_#000]",
        pageCard: "bg-cyan-300 border-2 border-fuchsia-950 shadow-[4px_4px_0px_0px_#581c87] hover:bg-lime-300 transition-all rounded-none text-left font-mono",
        pageTitle: "text-fuchsia-950 font-black text-xs uppercase",
        miniImgShape: "rounded-none border-2 border-fuchsia-950",
        invertIcon: false
      };
    case "holographic":
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-900",
        container: "bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 border-2 border-white/80 shadow-[0_0_40px_rgba(236,72,153,0.5)] rounded-t-[3.5rem] relative pt-16 overflow-hidden backdrop-blur-2xl",
        badge: "bg-white/30 text-white font-bold backdrop-blur-md border border-white/50 rounded-full px-4 absolute top-4 right-4 text-[10px] tracking-widest shadow-lg",
        headerLayout: "flex flex-col items-center",
        description: "text-white font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-full border-4 border-white/90 bg-gradient-to-r from-teal-300 to-pink-300 p-1 shadow-2xl mb-3",
        textContainer: "text-center space-y-1.5 px-4",
        title: "text-white font-extrabold tracking-wide text-xl drop-shadow-md",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-4 bg-white/10 backdrop-blur-md rounded-2xl mx-2 my-2 border border-white/20",
        socialIconBtn: "w-10 h-10 rounded-full bg-white/30 border border-white/50 text-white hover:bg-white hover:text-purple-600 transition-all shadow-md flex items-center justify-center hover:scale-110",
        pageCard: "bg-white/15 backdrop-blur-md border border-white/40 hover:bg-white/30 rounded-2xl text-left shadow-lg transition-all",
        pageTitle: "text-white font-bold text-xs tracking-wider",
        miniImgShape: "rounded-xl border border-white/40",
        invertIcon: false
      };
    case "comic":
      return {
        bgScreen: "bg-sky-400 min-h-screen flex items-center justify-center",
        container: "bg-yellow-200 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-t-[2rem] relative pt-12 overflow-hidden",
        badge: "bg-red-600 text-yellow-200 font-black tracking-widest uppercase border-2 border-black absolute top-3 right-4 px-3 py-0.5 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3",
        headerLayout: "flex flex-col items-center",
        description: "text-black font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3 rotate-2",
        textContainer: "text-center space-y-1 w-full",
        title: "text-black font-black uppercase text-xl tracking-tighter drop-shadow-[2px_2px_0px_#fff]",
        socialWrapper: "flex flex-wrap items-center justify-center gap-2.5 py-3 border-y-4 border-black my-2 bg-white/50",
        socialIconBtn: "w-10 h-10 bg-cyan-400 border-3 border-black text-black hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center font-bold",
        pageCard: "bg-white border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl text-left mb-2",
        pageTitle: "text-black font-black uppercase text-xs tracking-tight",
        miniImgShape: "rounded-lg border-2 border-black",
        invertIcon: false
      };
    case "zine":
      return {
        bgScreen: "bg-zinc-300 min-h-screen flex items-center justify-center",
        container: "bg-zinc-100 border-2 border-dashed border-zinc-900 shadow-[8px_8px_0px_0px_#18181b] rounded-none relative pt-12 grayscale contrast-125",
        badge: "bg-black text-white font-mono text-[9px] uppercase px-2 py-0.5 absolute top-2 right-2 rounded-none",
        headerLayout: "flex flex-col items-start px-2",
        description: "text-black font-mono text-[10px] tracking-tight",
        imageWrapper: "w-20 h-20 border-2 border-black bg-zinc-300 rounded-none mb-3 shadow-[4px_4px_0px_0px_#000] rotate-3",
        textContainer: "text-left space-y-1 w-full",
        title: "text-zinc-900 font-mono font-black tracking-widest text-lg uppercase underline decoration-2",
        socialWrapper: "flex flex-col gap-1 py-3 border-y border-zinc-900 my-2 w-full",
        socialIconBtn: "w-full py-1.5 px-3 bg-zinc-200 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs flex items-center justify-start gap-2 rounded-none shadow-[2px_2px_0px_0px_#000]",
        pageCard: "bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-zinc-200 transition-colors text-left rounded-none mb-2",
        pageTitle: "text-black font-mono font-bold text-xs uppercase",
        miniImgShape: "rounded-none border border-black",
        invertIcon: false,
        showSocialText: true
      };

    // ================= TEMAS ANTERIORES =================
    case "neon":
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]",
        container: "bg-slate-950 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-none border-x-2 border-y-0 relative overflow-hidden pt-10",
        badge: "bg-purple-900/50 text-purple-300 border border-purple-500/50 rounded-none absolute top-3 right-4",
        headerLayout: "flex flex-col",
        description: "text-purple-300 font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-[calc(100%+2.5rem)] h-36 rounded-none border-b-2 border-purple-500/40 bg-purple-950/20 -mx-5 -mt-5 mb-4 skew-y-1 transform origin-top-left",
        textContainer: "text-right space-y-1 relative z-10",
        title: "text-purple-400 font-extrabold tracking-widest uppercase text-lg",
        socialWrapper: "flex flex-wrap items-center justify-end gap-2 py-3",
        socialIconBtn: "w-9 h-9 flex items-center justify-center rounded-none bg-purple-950/40 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 hover:-translate-y-1 transition-transform",
        pageCard: "bg-purple-950/20 border border-purple-500/30 hover:border-purple-400 rounded-none text-left",
        pageTitle: "text-purple-300 font-bold uppercase tracking-wider",
        miniImgShape: "rounded-none",
        invertIcon: true
      };
    case "classic":
      return {
        bgScreen: "bg-zinc-950 min-h-screen flex items-center justify-center",
        container: "bg-zinc-900 border-zinc-700 shadow-md rounded-t-sm relative pt-12",
        badge: "bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-sm font-serif absolute top-3 right-4",
        headerLayout: "flex flex-row items-center gap-4 mb-2",
        description: "text-zinc-400 font-serif text-sm tracking-wide text-center",
        imageWrapper: "w-20 h-20 shrink-0 rounded-sm border border-zinc-600 bg-zinc-950",
        textContainer: "text-left space-y-1 flex-1",
        title: "text-zinc-100 font-serif tracking-normal text-lg",
        socialWrapper: "flex flex-wrap items-center justify-start gap-2 pt-4 border-t border-zinc-800 mt-2",
        socialIconBtn: "w-8 h-8 flex items-center justify-center rounded-sm bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors",
        pageCard: "bg-zinc-800/50 border border-zinc-700 hover:border-zinc-500 rounded-sm text-left",
        pageTitle: "text-zinc-200 font-serif font-semibold",
        miniImgShape: "rounded-sm",
        invertIcon: true
      };
    case "brutal":
      return {
        bgScreen: "bg-zinc-900 min-h-screen flex items-center justify-center",
        container: "bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none relative pt-12",
        badge: "bg-white text-black border-2 border-black font-black uppercase absolute top-3 right-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        headerLayout: "flex flex-col items-start gap-2",
        description: "text-black font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-full h-32 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none mb-2",
        textContainer: "text-left space-y-2 w-full",
        title: "text-black font-black tracking-tighter text-xl uppercase leading-none",
        socialWrapper: "flex flex-wrap items-center justify-start gap-3 py-4",
        socialIconBtn: "w-10 h-10 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]",
        pageCard: "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none text-left mb-3",
        pageTitle: "text-black font-black uppercase text-xs",
        miniImgShape: "rounded-none border-2 border-black",
        invertIcon: false
      };
    case "glass":
      return {
        bgScreen: "bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-200",
        container: "bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-t-[2.5rem] relative overflow-hidden pt-14",
        badge: "bg-white/20 text-slate-700 backdrop-blur-md border border-white/50 rounded-full absolute top-4 right-5 px-3 py-1 shadow-sm",
        headerLayout: "flex flex-col items-center gap-3 pt-2",
        description: "text-slate-700 font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-[2rem] border-2 border-white/60 shadow-xl bg-white/20 p-1",
        textContainer: "text-center space-y-1.5 w-full px-2",
        title: "text-slate-800 font-bold text-lg tracking-tight",
        socialWrapper: "flex flex-wrap items-center justify-center gap-2.5 py-4",
        socialIconBtn: "w-11 h-11 bg-white/30 backdrop-blur-sm border border-white/50 text-slate-700 rounded-2xl hover:bg-white/50 hover:scale-105 transition-all shadow-sm flex items-center justify-center",
        pageCard: "bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 rounded-[1.5rem] text-left shadow-sm",
        pageTitle: "text-slate-700 font-semibold text-xs",
        miniImgShape: "rounded-xl border border-white/30",
        invertIcon: false
      };
    case "terminal":
      return {
        bgScreen: "bg-zinc-950 min-h-screen flex items-center justify-center",
        container: "bg-black border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)] rounded-none relative font-mono pt-10",
        badge: "bg-black text-green-400 border border-green-500/50 absolute top-2 right-2 text-[9px] px-2",
        headerLayout: "flex flex-col items-start gap-3",
        description: "text-green-400 font-mono text-[10px] tracking-tight",
        imageWrapper: "w-16 h-16 rounded-none border border-green-500/50 grayscale opacity-90",
        textContainer: "text-left space-y-1 w-full",
        title: "text-green-400 font-bold text-base before:content-['>_'] before:mr-1",
        socialWrapper: "flex flex-col items-start w-full gap-1.5 py-3 border-t border-dashed border-green-500/30 mt-2",
        socialIconBtn: "w-full py-1.5 px-2 bg-transparent border border-green-500/20 text-green-400 hover:bg-green-900/30 hover:border-green-500 text-xs flex items-center justify-start gap-2.5 transition-colors rounded-none",
        pageCard: "bg-transparent border border-green-500/30 hover:bg-green-900/20 text-left rounded-none border-l-4 hover:border-l-green-400",
        pageTitle: "text-green-400 text-xs",
        miniImgShape: "rounded-none opacity-60 grayscale border border-green-500/30",
        invertIcon: false,
        showSocialText: true,
        customIconFilter: "invert(0.5) sepia(1) hue-rotate(80deg) saturate(500%)"
      };
    case "cyberpunk":
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:24px_24px]",
        container: "bg-slate-950 border-2 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-none relative pt-12",
        badge: "bg-cyan-500 text-slate-950 font-black tracking-widest text-[9px] px-2 py-0.5 absolute top-2 right-2",
        headerLayout: "flex flex-col items-start",
        description: "text-cyan-400 font-bold text-xs tracking-tight text-left",
        imageWrapper: "w-full h-28 border-l-4 border-cyan-400 bg-cyan-950/30 mb-3",
        textContainer: "text-left space-y-1 w-full",
        title: "text-cyan-400 font-extrabold uppercase text-lg tracking-wider",
        socialWrapper: "flex flex-wrap items-center gap-2 py-3 border-y border-cyan-500/30 my-2",
        socialIconBtn: "w-9 h-9 bg-cyan-950/40 border border-cyan-500/50 hover:bg-pink-600 hover:border-pink-500 transition-colors rounded-none flex items-center justify-center",
        pageCard: "bg-slate-900/80 border border-cyan-500/30 hover:border-pink-500 text-left rounded-none",
        pageTitle: "text-cyan-300 font-mono text-xs",
        miniImgShape: "rounded-none border border-cyan-500/40",
        invertIcon: true
      };
    case "aurora":
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-950 via-slate-950 to-black",
        container: "bg-slate-900/90 border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.15)] rounded-t-2xl relative pt-12 overflow-hidden",
        badge: "bg-teal-950 text-teal-300 border border-teal-500/40 rounded-full px-3 absolute top-3 right-4",
        headerLayout: "flex flex-col items-center gap-2",
        description: "text-teal-300 font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-md",
        textContainer: "text-center space-y-1 w-full px-3",
        title: "text-teal-200 font-bold tracking-wide text-lg",
        socialWrapper: "flex flex-wrap items-center justify-center gap-2.5 py-3",
        socialIconBtn: "w-9 h-9 rounded-xl bg-teal-950/50 border border-teal-500/30 text-teal-300 hover:bg-teal-900 hover:border-teal-400 transition-all flex items-center justify-center",
        pageCard: "bg-teal-950/20 border border-teal-500/25 hover:border-teal-400/60 rounded-xl text-left",
        pageTitle: "text-teal-200 font-medium text-xs",
        miniImgShape: "rounded-lg border border-teal-500/20",
        invertIcon: false,
        customIconFilter: "invert(0.7) sepia(1) hue-rotate(120deg) saturate(300%)"
      };
    case "retro":
      return {
        bgScreen: "bg-stone-950 min-h-screen flex items-center justify-center",
        container: "bg-amber-950/40 border-2 border-amber-600/60 shadow-[4px_4px_0px_0px_rgba(217,119,6,0.4)] rounded-none relative pt-12 font-mono",
        badge: "bg-amber-600 text-amber-950 font-bold text-[9px] px-2 absolute top-2 right-2 rounded-none uppercase",
        headerLayout: "flex flex-row items-center gap-3 px-3",
        description: "text-amber-400 font-mono text-[10px] tracking-tight",
        imageWrapper: "w-16 h-16 rounded-none border-2 border-amber-600 bg-amber-900 shrink-0",
        textContainer: "text-left space-y-1 flex-1",
        title: "text-amber-400 font-bold uppercase text-base tracking-wider",
        socialWrapper: "flex flex-wrap items-center justify-start gap-2 py-3 px-3 border-t border-amber-600/40 mt-2",
        socialIconBtn: "w-8 h-8 rounded-none bg-amber-900/60 border border-amber-600 hover:bg-amber-600 hover:text-amber-950 transition-colors flex items-center justify-center",
        pageCard: "bg-amber-900/30 border border-amber-600/40 hover:bg-amber-900/60 text-left rounded-none",
        pageTitle: "text-amber-300 text-xs font-bold",
        miniImgShape: "rounded-none border border-amber-600/40",
        invertIcon: true
      };
    case "luxury":
      return {
        bgScreen: "bg-black min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black",
        container: "bg-neutral-950 border border-amber-500/40 shadow-2xl rounded-none relative pt-14",
        badge: "bg-neutral-900 text-amber-400 border border-amber-500/30 rounded-none px-3 absolute top-3 right-4 tracking-widest text-[9px] uppercase",
        headerLayout: "flex flex-col items-center text-center",
        description: "text-amber-400 font-mono text-[10px] tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-full border border-amber-500/60 p-1 bg-neutral-900 shadow-inner mb-2",
        textContainer: "text-center space-y-1.5 px-4",
        title: "text-amber-100 font-serif tracking-widest uppercase text-lg font-light",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-4 border-b border-t border-amber-500/20 my-2",
        socialIconBtn: "w-10 h-10 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 hover:border-amber-400 hover:bg-amber-500/10 transition-all flex items-center justify-center",
        pageCard: "bg-neutral-900/50 border border-amber-500/20 hover:border-amber-500/50 rounded-none text-left transition-colors",
        pageTitle: "text-amber-200 font-serif tracking-wide text-xs",
        miniImgShape: "rounded-none border border-amber-500/30",
        invertIcon: false,
        customIconFilter: "invert(0.8) sepia(0.8) hue-rotate(5deg) saturate(400%)"
      };
    case "minimal":
    default:
      return {
        bgScreen: "bg-slate-950 min-h-screen flex items-center justify-center",
        container: "bg-slate-900 border-slate-800 shadow-xl rounded-t-3xl relative pt-14 mt-8",
        badge: "bg-slate-800 text-slate-300 border border-slate-700 rounded-full px-3 absolute top-4 right-4",
        headerLayout: "gap-2 flex flex-col items-center",
        description: "text-slate-700 font-bold text-xs tracking-tight text-center",
        imageWrapper: "w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-950 absolute -top-12 left-1/2 -translate-x-1/2 shadow-lg",
        textContainer: "text-center space-y-1 mt-2",
        title: "text-white font-bold tracking-tight text-xl",
        socialWrapper: "flex flex-wrap items-center justify-center gap-3 py-3",
        socialIconBtn: "w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors",
        pageCard: "bg-slate-800/30 border border-slate-700 hover:border-slate-600 rounded-2xl text-left",
        pageTitle: "text-slate-200 font-medium text-xs",
        miniImgShape: "rounded-md",
        invertIcon: true
      };
  }
};