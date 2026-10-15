export const getTemplateStyles = (currentTemplate) => {
  switch (currentTemplate) {
    // ================= NUEVOS TEMAS LOCOS Y EXTREMOS =================
    
    
    
    
    case "classic":
      return {
          title: "text-zinc-100 font-serif tracking-normal text-lg",
          socialIconBtn: "w-10 h-10 flex items-center justify-center",    
          svgHeight: 7,
          svgWidth: 7,     
          pageTitle: "text-zinc-200 font-serif",
          socialGap: "gap-2"
      };
    case "brutal":
      return {
        headerLayout: "flex flex-col items-start gap-2",
        description: "text-black font-bold tracking-tight text-center",
        title: "text-black font-black tracking-tighter uppercase leading-none",
        socialIconBtn: "w-10 h-10 border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]",
        pageCard: "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none text-left mb-3",
        svgHeight: 5,
        svgWidth: 5,
        pageTitle: "font-medium",
        socialGap: "gap-3"
      };
    case "glass":
      return {
        description: "text-slate-700 font-bold tracking-tight text-center",
        title: "text-slate-800 font-bold text-lg tracking-tight",
        socialIconBtn: "w-11 h-11 backdrop-blur-sm border border-white/50 text-slate-700 rounded-2xl hover:bg-white/50 hover:scale-105 transition-all shadow-sm flex items-center justify-center",
        pageCard: "backdrop-blur-md border border-white/40 hover:bg-white/30 rounded-[1.5rem] text-left shadow-sm",
        pageTitle: "text-slate-700 font-semibold text-md",
        radiusImageLink: "rounded-md",
        svgHeight: 5,
        svgWidth: 5,
        socialGap: "gap-2"
      };
    case "comic":
      return {
        container: "border-4 border-black rounded-t-[2rem]",
        description: "text-black font-bold tracking-tight text-center",
        title: "text-black font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_#fff]",
        socialIconBtn: "w-10 h-10 border-3 border-black text-black hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center font-bold",
        pageCard: "border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-xl text-left",
        pageTitle: "text-black font-black uppercase text-md tracking-tight",
        radiusImageLink: "rounded-md",
        svgHeight: 5,
        svgWidth: 5,
        socialGap: "gap-2"
      };
    case "y2k":
      return {
        container: "border-4 border-lime-300",
        description: "font-bold tracking-tight",
        title: "text-lime-300 font-black uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        socialIconBtn: "w-10 h-10 bg-lime-300 border-2 border-fuchsia-950 text-fuchsia-950 transition-all rounded-none flex items-center justify-center shadow-[3px_3px_0px_0px_#000]",
        pageCard: "border-2 border-fuchsia-950 shadow-[4px_4px_0px_0px_#581c87] hover:bg-lime-300 transition-all rounded-none text-left font-mono",
        pageTitle: "text-fuchsia-950 font-black text-md uppercase",
        svgHeight: 5,
        svgWidth: 5,
        socialGap: "gap-2"
      };
    case "terminal":
      return {
        description: "text-green-400 font-mono",
        title: "font-mono text-green-400 font-bold text-base before:content-['>_'] before:mr-1",
        socialIconBtn: "w-11 h-11 ",
        pageCard: "border border-green-500/30 hover:bg-green-900/20 text-left rounded-none border-l-4 hover:border-l-green-400",
        pageTitle: "font-mono text-green-400 text-md",
        svgHeight: 7,
        svgWidth: 7,
        socialGap: "gap-1"
      };
    case "minimal":
    default:
      return {
        container: "shadow-xl rounded-t-3xl relative",
        description: "font-bold",
        title: "font-bold tracking-tight",
        socialIconBtn: "w-10 h-10 flex items-center justify-center",
        svgHeight: 7,
        svgWidth: 7,
        pageCard: "shadow-sm rounded-2xl text-left",
        pageTitle: "text-md font-medium ",
        radiusImageLink: "rounded-md",
        socialGap: "gap-2"
      };
    case "holographic":
      return {
        container: "shadow-xl rounded-t-3xl relative",
        description: "text-white font-bold text-center",
        title: "text-white font-extrabold tracking-wide drop-shadow-md",
        socialIconBtn: "w-10 h-10 flex items-center justify-center",
        pageCard: "shadow-sm rounded-2xl text-left",
        pageTitle: "text-white font-bold text-md",
        svgHeight: 7,
        svgWidth: 7,
        socialGap: "gap-2",
        radiusImageLink: "rounded-md",
      };
    case "neon":
      return {
        bgScreen: "bg-slate-950 flex items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]",
        container: "bg-slate-950 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-none border-x-2 border-y-0 relative overflow-hidden",
        description: "font-bold",
        title: "font-bold tracking-widest uppercase",
        socialIconBtn: "w-10 h-10 flex items-center justify-center",
        svgHeight: 7,
        svgWidth: 7,
        pageCard: "border border-purple-500/30",
        pageTitle: "font-medium uppercase tracking-wider",
        socialGap: "gap-2"
      };
  }
};