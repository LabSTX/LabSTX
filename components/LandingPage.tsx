import React, { useEffect, useState, useRef, useMemo } from 'react';
import InteractiveMatrixSphere from './InteractiveMatrixSphere';
import { NeoButton } from './NeoButton';
import {
   Ghost, ArrowRight, Box, RefreshCcw, Wallet, Activity,
   Zap, CheckCircle, Terminal, Cpu, Globe, Shield, Code2,
   Copy, Check, Play, Database, Server, Bot, FolderTree, Rocket,
   Github, Twitter, ExternalLink, FileText, BookOpen, Calendar, MapPin,
   Sun, Moon
} from 'lucide-react';

interface LandingPageProps {
   onLaunch: () => void;
   theme: 'light' | 'dark';
   toggleTheme: () => void;
}


const SimulationScroll = ({ theme }: { theme: 'light' | 'dark' }) => {
   const [activeStep, setActiveStep] = useState(0);
   const containerRef = useRef<HTMLDivElement>(null);
   const isDark = theme === 'dark';

   // Scroll detection logic
   useEffect(() => {
      const handleScroll = () => {
         if (!containerRef.current) return;
         const steps = containerRef.current.querySelectorAll('.sim-step');

         steps.forEach((step, index) => {
            const rect = step.getBoundingClientRect();
            // If the step is in the middle of the screen
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
               setActiveStep(index);
            }
         });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const steps = [
      {
         id: 0,
         title: "Write Code",
         desc: "Use the Monaco editor with syntax highlighting for Clarity. Multiple file tabs and workspace management.",
         icon: <Code2 size={24} />
      },
      {
         id: 1,
         title: "Analyze Contract",
         desc: "Analyze your Clarity smart contracts directly in the browser. Get instant feedback on post-conditions and cost estimates.",
         icon: <Cpu size={24} />
      },
      {
         id: 2,
         title: "Test & Debug",
         desc: "View execution results, inspect data maps, and check contract traits in the terminal panel.",
         icon: <Terminal size={24} />
      },
      {
         id: 3,
         title: "Deploy to Stacks",
         desc: "Connect your wallet (Leather or Xverse) and deploy to testnet or mainnet with defined contract names.",
         icon: <Rocket size={24} />
      }
   ];

   return (
      <div ref={containerRef} className={`relative border-y-2 border-[#3b82f6] transition-colors duration-300 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]'
         }`}>
         <div className="max-w-8xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

            {/* Left: Scrollable Triggers */}
            <div className="relative z-10 py-24">
               {steps.map((step, index) => (
                  <div key={step.id} className={`sim-step min-h-[80vh] flex flex-col justify-center border-l-2 pl-8 transition-opacity duration-500 ${isDark ? 'border-[#333]' : 'border-gray-300'
                     }`}
                     style={{ opacity: activeStep === index ? 1 : 0.3 }}>
                     <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-full border-2 
                  ${activeStep === index ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : `bg-transparent border-gray-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}`}>
                        {step.icon}
                     </div>
                     <h3 className={`text-4xl font-display font-black uppercase mb-4 transition-colors ${isDark ? 'text-white' : 'text-[#1a1a1a]'
                        }`}>{step.title}</h3>
                     <p className={`text-xl font-mono leading-relaxed max-w-md transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>{step.desc}</p>
                  </div>
               ))}
            </div>

            {/* Right: Sticky Visual Stage */}
            <div className="hidden lg:block relative">
               <div className="sticky top-24 h-[640px] flex items-center">
                  {/* IDE Frame - Theme Aware */}
                  <div className={`w-full border overflow-hidden relative transition-all duration-500 ${isDark
                     ? 'bg-[#000000] border-[#333333]'
                     : 'bg-white border-gray-300'
                     }`}>

                     {/* IDE Header */}
                     <div className={`h-12 border-b flex items-center px-4 justify-between shrink-0 transition-colors ${isDark
                        ? 'bg-[#000000] border-[#333333]'
                        : 'bg-gray-100 border-gray-300'
                        }`}>
                        <div className="flex items-center gap-3">
                           <span className={`font-bold tracking-wider text-sm transition-colors ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'
                              }`}>LABSTX <span className="text-[#3b82f6] text-xs ml-0.5">v1.2</span></span>
                           <div className={`h-4 w-[1px] transition-colors ${isDark ? 'bg-[#333333]' : 'bg-gray-300'
                              }`}></div>
                           <div className={`text-xs font-bold uppercase transition-colors ${isDark ? 'text-[#808080]' : 'text-gray-600'
                              }`}>stacks_workspace</div>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#3b82f6] to-cyan-400 opacity-80"></div>
                        </div>
                     </div>

                     {/* Main IDE Area */}
                     <div className={`h-[500px] relative flex overflow-hidden transition-colors ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'
                        }`}>

                        {/* Activity Bar (Left Sidebar) */}
                        <div className={`w-12 border-r flex flex-col items-center py-4 gap-6 z-20 flex-shrink-0 transition-colors ${isDark
                           ? 'bg-[#000000] border-[#333333]'
                           : 'bg-gray-50 border-gray-300'
                           }`}>
                           <Box className={`w-6 h-6 ${activeStep >= 0 ? 'text-[#3b82f6]' : isDark ? 'text-[#808080]' : 'text-gray-400'}`} />
                           <Wallet className={`w-6 h-6 ${activeStep >= 3 ? 'text-[#3b82f6]' : isDark ? 'text-[#808080]' : 'text-gray-400'}`} />
                           <div className={`w-6 h-6 flex items-center justify-center ${activeStep >= 1 ? 'text-[#3b82f6]' : isDark ? 'text-[#808080]' : 'text-gray-400'}`}>
                              <Cpu size={24} />
                           </div>
                           <div className={`w-6 h-6 flex items-center justify-center ${activeStep >= 2 ? 'text-[#3b82f6]' : isDark ? 'text-[#808080]' : 'text-gray-400'}`}>
                              <Terminal size={24} />
                           </div>
                        </div>

                        {/* Editor Area */}
                        <div className={`flex-1 flex flex-col min-w-0 relative transition-colors ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'
                           }`}>

                           {/* Editor Tabs */}
                           <div className={`h-8 border-b flex items-center px-2 gap-1 flex-shrink-0 transition-colors ${isDark
                              ? 'bg-[#111111] border-[#333333]'
                              : 'bg-gray-100 border-gray-300'
                              }`}>
                              <div className={`px-3 py-1 border-b-2 border-[#3b82f6] text-xs font-mono transition-colors ${isDark
                                 ? 'bg-[#000000] text-[#e0e0e0]'
                                 : 'bg-white text-gray-900'
                                 }`}>
                                 contract.clar
                              </div>
                           </div>

                           {/* Editor Toolbar */}
                           <div className={`h-9 border-b flex items-center px-4 justify-between flex-shrink-0 transition-colors ${isDark
                              ? 'bg-[#000000] border-[#333333]'
                              : 'bg-gray-50 border-gray-300'
                              }`}>
                              <span className={`text-xs font-mono transition-colors ${isDark ? 'text-[#808080]' : 'text-gray-600'
                                 }`}>contract.clar</span>
                              <div className="flex items-center gap-2">
                                 <div className={`text-[#3b82f6] border border-[#3b82f6] px-2 py-1 text-xs font-bold transition-colors ${isDark ? 'bg-[#000000]' : 'bg-white'
                                    }`}>
                                    Check
                                 </div>
                                 <div className={`text-[#3b82f6] border border-[#3b82f6] px-2 py-1 text-xs font-bold transition-colors ${isDark ? 'bg-[#000000]' : 'bg-white'
                                    }`}>
                                    Deploy
                                 </div>
                              </div>
                           </div>

                           {/* Code Editor Content */}
                           <div className={`flex-1 relative overflow-hidden transition-colors ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'
                              }`}>

                              {/* Editor Background with Line Numbers */}
                              <div className="absolute inset-0 flex">
                                 <div className={`w-12 border-r flex flex-col text-xs font-mono pt-2 transition-colors ${isDark
                                    ? 'bg-[#111111] border-[#333333] text-[#444444]'
                                    : 'bg-gray-50 border-gray-300 text-gray-400'
                                    }`}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                       <div key={i} className="px-2 text-right">{i}</div>
                                    ))}
                                 </div>
                                 <div className={`flex-1 p-4 font-mono text-xs leading-relaxed transition-colors ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'
                                    }`}>
                                    {activeStep === 0 && (
                                       <div className="space-y-1">
                                          <div><span className="text-[#3b82f6] font-bold">(define-public</span> (hello-world)</div>
                                          <div className="pl-4">{'('}<span className="text-purple-400">ok</span> <span className="text-blue-400">"Hello Stacks"</span>{')'}</div>
                                          <div>{')'}</div>
                                          <div className={`mt-2 ${isDark ? 'text-[#608b4e]' : 'text-green-600'}`}>;; LabSTX Clarity Editor</div>
                                          <div><span className="text-[#3b82f6] font-bold">(define-data-var</span> counter uint u0{')'}</div>
                                       </div>
                                    )}
                                    {activeStep >= 1 && (
                                       <div className="space-y-1">
                                          <div className="text-green-500">✓ Clarity Analysis successful!</div>
                                          <div className={isDark ? 'text-[#808080]' : 'text-gray-600'}>Cost: 450 units</div>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              {/* Compiler Status Panel (Step 1+) */}
                              {activeStep >= 1 && (
                                 <div className={`absolute top-4 right-4 border p-3 w-56 animate-fade-in-up z-10 transition-colors ${isDark
                                    ? 'bg-[#111111] border-[#333333]'
                                    : 'bg-gray-100 border-gray-300'
                                    }`}>
                                    <div className="text-xs font-bold uppercase text-[#3b82f6] mb-2">Clarity Check</div>
                                    <div className="space-y-2">
                                       <div className={`h-6 border flex items-center px-2 text-[10px] font-mono text-green-500 transition-colors ${isDark
                                          ? 'bg-[#0a0a0a] border-[#333333]'
                                          : 'bg-white border-gray-300'
                                          }`}>
                                          ✓ Valid Syntax
                                       </div>
                                       <div className={`h-6 border flex items-center px-2 text-[10px] font-mono transition-colors ${isDark
                                          ? 'bg-[#0a0a0a] border-[#333333] text-[#808080]'
                                          : 'bg-white border-gray-300 text-gray-600'
                                          }`}>
                                          Traits: Implemented
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* Terminal Panel (Appears Step 2+) */}
                           <div className={`absolute bottom-0 left-0 right-0 border-t transition-all duration-500 ease-out z-30 transition-colors ${activeStep >= 2 ? 'h-32' : 'h-0 overflow-hidden'
                              } ${isDark
                                 ? 'bg-[#000000] border-[#333333]'
                                 : 'bg-gray-50 border-gray-300'
                              }`}>
                              <div className={`h-6 border-b flex items-center px-2 transition-colors ${isDark
                                 ? 'bg-[#111111] border-[#333333]'
                                 : 'bg-gray-100 border-gray-300'
                                 }`}>
                                 <span className={`font-mono text-[10px] font-bold transition-colors ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'
                                    }`}>TERMINAL</span>
                              </div>
                              <div className="p-2 font-mono text-[10px] text-green-500 space-y-1 overflow-hidden">
                                 {activeStep >= 2 && (
                                    <>
                                       <div className="animate-type-line-1">➜  ~ contract-call? .hello-world</div>
                                       <div className={`animate-type-line-2 opacity-0 transition-colors ${isDark ? 'text-[#808080]' : 'text-gray-600'}`} style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>&gt; (ok "Hello Stacks")</div>
                                       <div className={`animate-type-line-3 opacity-0 transition-colors ${isDark ? 'text-[#808080]' : 'text-gray-600'}`} style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>&gt; Ready for Stacks Blockchain deployment</div>
                                    </>
                                 )}
                              </div>
                           </div>

                           {/* Deploy Success Overlay (Step 3) */}
                           <div className={`absolute inset-0 z-40 flex items-center justify-center transition-all duration-500 ${activeStep === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                              } ${isDark ? 'bg-[#000000]/95' : 'bg-white/95'}`}>
                              <div className="text-center">
                                 <div className="inline-block bg-[#3b82f6] text-white p-4 mb-4">
                                    <Check size={32} strokeWidth={4} />
                                 </div>
                                 <h4 className={`text-xl font-display font-black uppercase transition-colors ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'
                                    }`}>Deployed to Stacks</h4>
                                 <div className={`font-mono text-xs mt-2 transition-colors ${isDark ? 'text-[#808080]' : 'text-gray-600'
                                    }`}>Tx: 0x4f2...a1b3</div>
                              </div>
                           </div>

                        </div>

                     </div>

                     {/* Status Bar */}
                     <div className="h-6 bg-[#3b82f6] text-white flex justify-between items-center px-3 text-xs font-bold flex-shrink-0">
                        <div className="flex gap-4">
                           <span>main*</span>
                           <span>0 problems</span>
                        </div>
                        <div className="flex gap-4">
                           <span>Ln 1, Col 1</span>
                           <span>UTF-8</span>
                           <span>CLARITY</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};


// --- NEW: Animated ASCII Background Component ---
const AsciiBackground: React.FC = () => {
   const characters = ".:|/*#";
   const [frame, setFrame] = useState(0);

   useEffect(() => {
      const timer = setInterval(() => setFrame(f => f + 1), 100);
      return () => clearInterval(timer);
   }, []);

   const grid = useMemo(() => {
      const rows = 30;
      const cols = 60;
      return Array.from({ length: rows }).map((_, y) => (
         <div key={y} className="flex justify-between h-5 overflow-hidden opacity-60 md:opacity-60">
            {Array.from({ length: cols }).map((_, x) => {
               const charIndex = Math.floor(Math.abs(Math.sin((x * 0.4 + y * 0.2 + frame * 0.15)) * characters.length));
               return (
                  <span key={x} className="w-4 inline-block text-center text-[10px] md:text-sm font-mono">
                     {characters[charIndex]}
                  </span>
               );
            })}
         </div>
      ));
   }, [frame]);

   return (
      <div className="absolute inset-0 pointer-events-none select-none font-mono text-blue-600 overflow-hidden leading-none z-0 mt-[-5%]">
         {grid}
      </div>
   );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, theme, toggleTheme }) => {
   const isDark = theme === 'dark';

   return (
      <div className={`min-h-screen font-sans selection:bg-[#2d5bff] selection:text-white flex flex-col transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'
         }`}>

         <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .shadow-neo { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
          .shadow-neo-black { box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); }
        `}</style>

         {/* --- HEADER --- */}
         <header className={`h-20 shadow bg-backdrop-blur flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'
            }`}>
            <div className="flex items-center gap-2 font-mono leading-relaxed font-black">
               <img
                  src={isDark ? `/lab_stx.png` : `/lab_stx_whitee.png`}
                  alt="LabSTX"
                  className={isDark ? `w-5` : `w-5`}
               />
               <span className="font-black text-xl">LabSTX</span>
            </div>
            <div className="flex items-center gap-4">
               <a href="#" className={`font-bold font-display hover:text-[#2d5bff] hidden md:block tracking-widest text-sm transition-colors ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>DOCS</a>
               <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
               <NeoButton variant="primary" theme={theme} onClick={() => window.open('https://lab-stx-ide.vercel.app/', '_blank', 'noopener,noreferrer')}>Launch App</NeoButton>
            </div>
         </header>

         <main className="flex-1">
            {/* --- HERO SECTION (HIRO STYLE) --- */}
            <section className={`relative min-h-[85vh] flex flex-col items-center justify-center px-6 border-b-2 border-[#2d5bff] overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
               <AsciiBackground />
               <div className="max-w-7xl mx-auto text-center relative z-10">
                  <h1 className={`text-6xl md:text-[140px] font-display font-black uppercase leading-[0.8] tracking-tighter mb-8 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>

                     Write Clarity <br /> in Your Browser
                  </h1>
                  <div className="max-w-2xl mx-auto space-y-8">
                     <p className={`text-xl font-medium font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Write, compile, deploy, and test Clarity smart contracts. No local setup required.</p>
                     <div className="flex justify-center">
                        <button onClick={() => window.open('https://lab-stx-ide.vercel.app/', '_blank', 'noopener,noreferrer')} className="bg-[#D1D1CB] hover:bg-[#BDBDB5] text-black font-bold py-5 px-12 rounded-sm text-sm flex items-center gap-2 uppercase tracking-widest transition-all">
                           Start building <ArrowRight size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- TRUSTED BY MARQUEE --- */}
            <section className={`border-b-2 border-[#2d5bff] py-6 overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#0a0a0a]'}`}>
               <div className="whitespace-nowrap flex gap-12 animate-[marquee_25s_linear_infinite] hover:pause">
                  {[...Array(2)].map((_, i) => (
                     <React.Fragment key={i}>
                        <span className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500"><Globe size={20} /> Stacks_Network</span>
                        <span className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500"><Shield size={20} /> Enterprise_Grade</span>
                        <span className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500"><Zap size={20} /> Bitcoin_Layers</span>
                        <span className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500"><Code2 size={20} /> Clarity_SDK</span>
                     </React.Fragment>
                  ))}
               </div>
            </section>

            <SimulationScroll theme={isDark ? `dark` : `light`} />

            {/* --- FEATURES SECTION --- */}
            {/* --- POWERFUL FEATURES --- */}
            <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-black' : 'bg-white'}`}>
               <div className="max-w-7xl mx-auto">
                  <div className="mb-16">
                     <h2 className={`text-5xl font-display font-black uppercase mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Powerful Features</h2>
                     <p className={`text-lg font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Advanced tooling for the Stacks Blockchain ecosystem</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                     <FeatureCard icon={<Code2 size={32} />} title="Clarity Editor" desc="High-performance Monaco editor with real-time syntax highlighting for Clarity smart contracts." theme={theme} />
                     <FeatureCard icon={<Cpu size={32} />} title="Static Analysis" desc="Integrated check command to catch post-condition errors and estimate execution costs before deployment." theme={theme} />
                     <FeatureCard icon={<Bot size={32} />} title="AI Debugger" desc="LabSTX AI (powered by Gemini) helps optimize your Clarity logic and explain contract traits." theme={theme} />
                     <FeatureCard icon={<Wallet size={32} />} title="Stacks Wallets" desc="Full integration with Leather and Xverse. Manage STX balances and SIP-010 tokens natively." theme={theme} />
                     <FeatureCard icon={<FolderTree size={32} />} title="Project Scaffolding" desc="Manage multiple contract files and complex Stacks projects with a virtual file system." theme={theme} />
                     <FeatureCard icon={<Rocket size={32} />} title="Seamless Deploy" desc="One-click deployment to Stacks Mainnet or Testnet with real-time explorer tracking." theme={theme} />
                  </div>
               </div>
            </section>

            {/* --- SUPPORTED LANGUAGES --- */}
            <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]'}`}>
               <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <h2 className={`text-5xl md:text-6xl font-display font-black uppercase leading-[0.9] ${isDark ? 'text-white' : 'text-black'}`}>
                           Built for <span className="text-[#2d5bff]">Clarity</span>
                        </h2>
                        <p className="text-xl font-mono opacity-80 max-w-xl">
                           The decidable language that brings predictable, secure smart contracts to the Bitcoin ecosystem via Stacks.
                        </p>
                     </div>

                     <div className="grid gap-4">
                        <div className={`flex items-center gap-4 p-4 border-2 shadow-neo ${isDark ? 'bg-black border-gray-700' : 'bg-white border-black'}`}>
                           <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACgAKAMBEQACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAAAAwQGBf/EACsQAAAFAQYEBwEAAAAAAAAAAAABAgMRBAUSExUhcTEyQWEiNUJRgqHSFP/EABoBAQADAAMAAAAAAAAAAAAAAAACAwUEBgf/xAAqEQACAQIEBAUFAAAAAAAAAAAAAQIDEQQSE0ExUYLBISNh0fAUMmJjcf/aAAwDAQACEQMRAD8Atjqx6AAAAAAAAAE9C2w7VtN1bqmmVHCnElN3vsJ01FySk7IqrSnGm5U1drYsJsiqO18sMiJ4lQavSSeN7aNRZoT1dLf54lLxlP6fX278itWIYbqnUUrinWUqhC1FBq7iuaipNRd0X0ZTlTTqKz5EIgWAAdewsPCexMo5i8wI5+MdBysPls75eoz8bmzK2fp7mmPMPFJ2BP8ALroucD8/Q0PM/Hh68PYxvI/Zx9Pu9zM27h3GcPKeJzl5HPTmkZ+Iy2VsvSbOCzXlfP1djkDimgABPQuMM1bTlU0bzSDlTZHF72LYTpuMZJyV0VV4znTcabs3uTptaqK1szNUvX5Muhlwu7RoJqvPV1d/ngVPB0/p9Dbvz/pXrFsOVTq6Vo2mVKlLZnN3sITcXJuKsi6jGcaaVR3fMhECwAAAAAAAAP/Z" alt="Stacks" className="w-12 h-12 rounded-md" />
                           <div>
                              <h3 className="font-bold uppercase">Stacks Blockchain</h3>
                              <p className="text-sm font-mono opacity-60">Settling transactions on Bitcoin L1</p>
                           </div>
                        </div>

                        <ul className="space-y-3 font-mono text-sm">
                           <li className="flex items-start gap-2">
                              <span className="text-[#2d5bff] font-bold">//</span>
                              <span>Decidable: Know exactly what your code does before it runs.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#2d5bff] font-bold">//</span>
                              <span>No Compiler: The source code is the bytecode.</span>
                           </li>
                           <li className="flex items-start gap-2">
                              <span className="text-[#2d5bff] font-bold">//</span>
                              <span>Direct Bitcoin Access: Built-in visibility into BTC state.</span>
                           </li>
                        </ul>
                     </div>
                  </div>

                  <div className={`relative border-2 shadow-neo-black p-8 font-mono text-sm leading-relaxed ${isDark ? 'bg-black border-gray-700' : 'bg-[#1a1a1a] text-gray-300'}`}>
                     <div className="absolute top-0 right-0 p-2 text-[10px] uppercase tracking-widest opacity-30">clarity-v2</div>
                     <div className="text-green-400 opacity-50 mb-4">;; Simple Counter Contract</div>

                     <div className="text-blue-400">(define-data-var counter int 0)</div>
                     <br />
                     <div className="text-blue-400">(define-public (increment)</div>
                     <div className="pl-4 text-blue-400">
                        (begin
                        <div className="pl-4">(var-set counter (+ (var-get counter) 1))</div>
                        <div className="pl-4">(ok (var-get counter))</div>
                        )
                     </div>
                     <div className="text-blue-400">)</div>
                     <br />
                     <div className="text-blue-400">(define-read-only (get-counter)</div>
                     <div className="pl-4 text-blue-400">(ok (var-get counter))</div>
                     <div className="text-blue-400">)</div>
                  </div>
               </div>
            </section>

            {/* --- USE CASES --- */}
            <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-black' : 'bg-white'}`}>
               <div className="max-w-7xl mx-auto">
                  <h2 className="text-5xl font-display font-black uppercase mb-12">Tailored For</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                     <UseCaseCard icon={<Zap size={24} />} title="Clarity Mastery" desc="The ultimate environment for learning Stacks development without the overhead of local environments." theme={theme} />
                     <UseCaseCard icon={<Activity size={24} />} title="Rapid Prototyping" desc="Test and iterate on SIP-010 or SIP-009 protocols in a sandbox before moving to production." theme={theme} />
                  </div>
               </div>
            </section>

            {/* --- GETTING STARTED --- */}
            <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]'}`}>
               <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-5xl font-display font-black uppercase mb-12">Start Building on Stacks</h2>
                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                     <StepCard number="1" title="Launch IDE" desc="Open LabSTX and select your workspace." theme={theme} />
                     <StepCard number="2" title="Code Clarity" desc="Use our templates to write your contract." theme={theme} />
                     <StepCard number="3" title="Deploy" desc="Broadcast your contract to the Stacks Blockchain." theme={theme} />
                  </div>
                  <NeoButton variant="primary" className="!text-lg !px-12 !py-5" theme={theme} onClick={() => window.open('https://lab-stx-ide.vercel.app/', '_blank', 'noopener,noreferrer')}>Launch LabSTX IDE</NeoButton>
               </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className={`py-16 px-6 border-t-4 border-[#2d5bff] bg-black text-white`}>
               <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <img src={`/lab_stx.png`} alt="LabSTX" className="w-5" />
                           <p className="font-black text-xl">LabSTX</p>
                        </div>
                        <p className="text-sm font-mono opacity-60">The premier browser-based development environment for Stacks Blockchain developers.</p>
                     </div>
                     <div>
                        <h3 className="font-black uppercase text-[#2d5bff] mb-4">Ecosystem</h3>
                        <ul className="text-sm font-mono space-y-2 opacity-70">
                           <li className="hover:text-[#2d5bff] cursor-pointer">Stacks Docs</li>
                           <li className="hover:text-[#2d5bff] cursor-pointer">Clarity Language</li>
                           <li className="hover:text-[#2d5bff] cursor-pointer">Explorer</li>
                        </ul>
                     </div>
                  </div>
                  <div className="pt-8 border-t border-gray-800 flex justify-between items-center opacity-50 text-xs font-mono">
                     <span>© 2026 LabSTX. Built for the Stacks Community.</span>
                     <div className="flex gap-4"><Github size={18} className="cursor-pointer hover:text-[#2d5bff]" /><Twitter size={18} className="cursor-pointer hover:text-[#2d5bff]" /></div>
                  </div>
               </div>
            </footer>
         </main>
      </div>
   );
};
// --- Helper Components ---



const FeatureCard = ({ icon, title, desc, theme }: { icon: React.ReactNode, title: string, desc: string, theme: 'light' | 'dark' }) => {
   const isDark = theme === 'dark';
   return (
      <div className={`p-6 border-2 hover:shadow-neo transition-all ${isDark
         ? 'bg-[#111111] border-gray-700'
         : 'bg-white border-[#1a1a1a]'
         }`}>
         <div className="mb-4 text-[#2d70ff]">{icon}</div>
         <h3 className={`font-display font-black text-xl uppercase mb-2 transition-colors ${isDark ? 'text-white' : 'text-[#1a1a1a]'
            }`}>{title}</h3>
         <p className={`text-sm font-mono leading-relaxed transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{desc}</p>
      </div>
   );
};

const UseCaseCard = ({ icon, title, desc, theme }: { icon: React.ReactNode, title: string, desc: string, theme: 'light' | 'dark' }) => {
   const isDark = theme === 'dark';
   return (
      <div className={`p-6 border-2 hover:shadow-neo transition-all ${isDark
         ? 'bg-[#111111] border-gray-700'
         : 'bg-white border-[#1a1a1a]'
         }`}>
         <div className="flex items-start gap-4">
            <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 text-[#2d70ff] transition-colors ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]'
               }`}>
               {icon}
            </div>
            <div>
               <h3 className={`font-display font-black text-xl uppercase mb-2 transition-colors ${isDark ? 'text-white' : 'text-[#1a1a1a]'
                  }`}>{title}</h3>
               <p className={`text-sm font-mono leading-relaxed transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{desc}</p>
            </div>
         </div>
      </div>
   );
};

const StepCard = ({ number, title, desc, theme }: { number: string, title: string, desc: string, theme: 'light' | 'dark' }) => {
   const isDark = theme === 'dark';
   return (
      <div className={`p-6 border-2 hover:shadow-neo transition-all text-center ${isDark
         ? 'bg-[#111111] border-gray-700'
         : 'bg-white border-[#1a1a1a]'
         }`}>
         <div className="w-16 h-16 bg-[#2d70ff] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-display font-black text-2xl">
            {number}
         </div>
         <h3 className={`font-display font-black text-xl uppercase mb-2 transition-colors ${isDark ? 'text-white' : 'text-[#1a1a1a]'
            }`}>{title}</h3>
         <p className={`text-sm font-mono leading-relaxed transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{desc}</p>
      </div>
   );
};