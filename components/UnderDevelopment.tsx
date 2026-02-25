import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Code2, Wrench, Rocket, Github, Twitter } from 'lucide-react';
import { NeoButton } from './NeoButton';

interface UnderDevelopmentProps {
   onBack: () => void;
   theme: 'light' | 'dark';
}

// --- Animated ASCII Background Component ---
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

export const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ onBack, theme }) => {
   const isDark = theme === 'dark';
   
   return (
      <div className={`min-h-screen font-sans selection:bg-[#2d5bff] selection:text-white flex flex-col transition-colors duration-300 ${
         isDark ? 'bg-black text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'
      }`}>

         <style>{`
          @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
          .shadow-neo { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
        `}</style>

         {/* --- HEADER --- */}
         <header className={`h-20 shadow bg-backdrop-blur flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300 ${
            isDark ? 'bg-black' : 'bg-white'
         }`}>
            <div className="flex items-center gap-4 font-mono leading-relaxed font-black">
  <img 
    src={isDark ? `/lab_stx.png` : `/lab_stx_whitee.png`} 
    alt="LabSTX" 
    className={ isDark ? `w-[18px]` : `w-[25px]`} 
  /> 
  <span className="font-black text-xl">LabSTX</span>
</div>    
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="flex items-center gap-2 font-bold font-display hover:text-[#2d5bff] tracking-widest text-sm transition-colors">
                  <ArrowLeft size={20} /> BACK
               </button>
            </div>
         </header>

         <main className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
            <AsciiBackground />
            
            <div className="max-w-4xl mx-auto text-center relative z-10 py-24">
               {/* Animated Icon */}
               <div className="mb-12 flex justify-center">
                  <div className={`relative w-32 h-32 border-4 border-[#2d5bff] flex items-center justify-center ${
                     isDark ? 'bg-black' : 'bg-white'
                  }`} style={{ animation: 'float 3s ease-in-out infinite' }}>
                     <Wrench size={64} className="text-[#2d5bff]" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                     <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#2d5bff] rounded-full animate-ping"></div>
                  </div>
               </div>

               {/* Main Heading */}
               <h1 className={`text-5xl md:text-[100px] font-display font-black uppercase leading-[0.85] tracking-tighter mb-8 ${
                  isDark ? 'text-white' : 'text-[#1a1a1a]'
               }`}>
                  Under <br/>
                  <span className="text-[#2d5bff]">Development</span>
               </h1>

               {/* Description */}
               <div className="max-w-2xl mx-auto space-y-6 mb-12">
                  <p className={`text-xl font-mono leading-relaxed ${
                     isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                     We're building something amazing for the Stacks ecosystem. The LabSTX IDE is currently in active development.
                  </p>
                  
                  <div className={`border-2 p-6 ${
                     isDark ? 'bg-[#111111] border-gray-700' : 'bg-white border-[#1a1a1a]'
                  }`}>
                     <h3 className={`font-display font-black text-xl uppercase mb-4 ${
                        isDark ? 'text-white' : 'text-[#1a1a1a]'
                     }`}>Coming Soon</h3>
                     <ul className="space-y-3 text-left font-mono text-sm">
                        <li className="flex items-start gap-3">
                           <Code2 size={20} className="text-[#2d5bff] flex-shrink-0 mt-0.5" />
                           <span>Full-featured Clarity editor with Monaco integration</span>
                        </li>
                        <li className="flex items-start gap-3">
                           <Wrench size={20} className="text-[#2d5bff] flex-shrink-0 mt-0.5" />
                           <span>Real-time contract analysis and debugging tools</span>
                        </li>
                        <li className="flex items-start gap-3">
                           <Rocket size={20} className="text-[#2d5bff] flex-shrink-0 mt-0.5" />
                           <span>One-click deployment to Stacks Mainnet & Testnet</span>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* CTA Buttons */}
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <NeoButton variant="primary" onClick={onBack} theme={theme}>
                     Back to Home
                  </NeoButton>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                     <button className={`px-8 py-4 border-2 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all hover:shadow-neo ${
                        isDark 
                           ? 'bg-transparent border-gray-700 text-white hover:bg-[#111111]' 
                           : 'bg-transparent border-[#1a1a1a] text-[#1a1a1a] hover:bg-white'
                     }`}>
                        <Github size={18} /> Follow Progress
                     </button>
                  </a>
               </div>

               {/* Status Badge */}
               <div className="mt-16 inline-flex items-center gap-2 px-6 py-3 bg-[#2d5bff] text-white font-mono text-sm font-bold uppercase tracking-wider">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Active Development
               </div>
            </div>
         </main>

         {/* --- FOOTER --- */}
         <footer className={`py-8 px-6 border-t-4 border-[#2d5bff] bg-black text-white`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
               <span className="text-xs font-mono opacity-50">© 2026 LabSTX. Built for the Stacks Community.</span>
               <div className="flex gap-4">
                  <Github size={18} className="cursor-pointer hover:text-[#2d5bff] transition-colors" />
                  <Twitter size={18} className="cursor-pointer hover:text-[#2d5bff] transition-colors" />
               </div>
            </div>
         </footer>
      </div>
   );
};
