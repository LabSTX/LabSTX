import React, { useEffect, useState, useRef, useMemo } from 'react';
import InteractiveMatrixSphere from './InteractiveMatrixSphere';
import { NeoButton } from './NeoButton';
import {
   Ghost, ArrowRight, Box, RefreshCcw, Wallet, Activity,
   Zap, CheckCircle, Terminal, Cpu, Globe, Shield, Code2,
   Copy, Check, Play, Database, Server, Bot, FolderTree, Rocket,
   Github, Twitter, ExternalLink, FileText, BookOpen, Calendar, MapPin,
   Sun, Moon,
   X, CheckCircle2, Circle, DollarSign, Target, ListChecks, History,
   LineChart, PieChart, Activity as ActivityIcon
} from 'lucide-react';
import { StatisticsView } from './StatisticsView';

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
   const [currentView, setCurrentView] = useState<'landing' | 'roadmap' | 'statistics'>('landing');

   const RoadmapView = () => (
      <div className="max-w-4xl mx-auto py-24 px-6 animate-fade-in">
         <div className="mb-20 text-center">
            <h2 className="text-6xl md:text-8xl font-display font-black uppercase mb-6 tracking-tighter">Roadmap</h2>
            <p className="text-xl font-mono opacity-60">Building the most powerful Clarity environment on the web.</p>
         </div>

         {/* Stepper Logic */}
         <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#2d5bff] before:opacity-20">
            {/* Phase 1 */}
            <div className="relative pl-16 group">
               <div className="absolute left-0 top-0 w-10 h-10 bg-black border-2 border-[#2d5bff] rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="text-[#2d5bff]" size={20} />
               </div>
               <div className={`p-8 border-2 shadow-neo transition-all ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-black'}`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                     <div>
                        <span className="text-xs font-mono font-bold text-[#2d5bff] uppercase tracking-widest bg-[#2d5bff]/10 px-2 py-1">Phase 1 (Week 3)</span>
                        <h3 className="text-3xl font-display font-black uppercase mt-2">Core Stabilization</h3>
                     </div>
                  </div>
                  <p className="font-mono text-sm opacity-80 mb-6 italic underline decoration-[#2d5bff]/30">Objective: Improve reliability and stability of the core IDE workflow.</p>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4 text-[#2d5bff]"><ListChecks size={18} /> Deliverables</h4>
                        <ul className="text-sm font-mono space-y-2 opacity-70">
                           <li>• Refined Clarity compilation pipeline</li>
                           <li>• Improved deployment flow</li>
                           <li>• Structured error handling</li>
                           <li>• Better transaction feedback UI</li>
                           <li>• Internal refactoring</li>
                        </ul>
                     </div>
                     <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4 text-[#2d5bff]"><Target size={18} /> Acceptance Criteria</h4>
                        <ul className="text-sm font-mono space-y-2 opacity-70">
                           <li>• Consistent compilation</li>
                           <li>• Successful deployments</li>
                           <li>• Readable error output</li>
                           <li>• Clear transaction status</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-16 group">
               <div className="absolute left-0 top-0 w-10 h-10 bg-black border-2 border-gray-600 rounded-full flex items-center justify-center z-10 group-hover:border-[#2d5bff] transition-all">
                  <div className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-[#2d5bff]" />
               </div>
               <div className={`p-8 border-2 shadow-neo-black opacity-90 transition-all ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-black'}`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                     <div>
                        <span className="text-xs font-mono font-bold opacity-60 uppercase tracking-widest bg-gray-500/10 px-2 py-1">Phase 2 (Week 6)</span>
                        <h3 className="text-3xl font-display font-black uppercase mt-2">ABI & Debugging</h3>
                     </div>
                  </div>
                  <p className="font-mono text-sm opacity-80 mb-6 italic underline decoration-gray-500/30">Objective: Enable seamless smart contract interaction and improve debugging visibility.</p>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4"><ListChecks size={18} /> Deliverables</h4>
                        <ul className="text-sm font-mono space-y-2 opacity-70">
                           <li>• Full ABI inspector panel</li>
                           <li>• Read/write interaction UI</li>
                           <li>• Transaction execution logs</li>
                           <li>• Enhanced debugging output</li>
                           <li>• Improved state visibility</li>
                        </ul>
                     </div>
                     <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4"><Target size={18} /> Acceptance Criteria</h4>
                        <ul className="text-sm font-mono space-y-2 opacity-70">
                           <li>• Direct function calls in IDE</li>
                           <li>• Submit write transactions</li>
                           <li>• Results clearly displayed</li>
                           <li>• Debug logs operational</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-16 group">
               <div className="absolute left-0 top-0 w-10 h-10 bg-black border-2 border-gray-600 rounded-full flex items-center justify-center z-10 group-hover:border-[#2d5bff] transition-all">
                  <div className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-[#2d5bff]" />
               </div>
               <div className={`p-8 border-2 shadow-neo-black opacity-90 transition-all ${isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-black'}`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                     <div>
                        <span className="text-xs font-mono font-bold opacity-60 uppercase tracking-widest bg-gray-500/10 px-2 py-1">Phase 3 (Week 9-10)</span>
                        <h3 className="text-3xl font-display font-black uppercase mt-2">Education & Docs</h3>
                     </div>
                  </div>
                  <p className="font-mono text-sm opacity-80 mb-6 italic underline decoration-gray-500/30">Objective: Provide comprehensive developer documentation and onboarding materials.</p>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4"><ListChecks size={18} /> Deliverables</h4>
                        <ul className="text-sm font-mono space-y-2 opacity-70">
                           <li>• Documentation site</li>
                           <li>• Step-by-step tutorials</li>
                           <li>• Onboarding guide</li>
                           <li>• Public roadmap page</li>
                        </ul>
                     </div>
                     <div>
                        <h4 className="font-bold flex items-center gap-2 mb-4"><Target size={18} /> Acceptance Criteria</h4>
                        <ul className="text-sm font-mono space-y-2 opacity-70">
                           <li>• Site publicly accessible</li>
                           <li>• Full workflow tutorials</li>
                           <li>• Clear roadmap direction</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Implemented Features */}
         <div className="mt-32 p-12 border-2 border-dashed border-[#2d5bff] bg-[#2d5bff]/5 text-center">
            <h3 className="text-4xl font-display font-black uppercase mb-8 flex items-center justify-center gap-4"><History className="text-[#2d5bff]" /> Currently Implemented</h3>
            <div className="flex flex-wrap justify-center gap-4">
               {['Browser IDE', 'Clarity Editor', 'Syntax Highlighting', 'Compilation', 'Deployment', 'Interaction Panel', 'Live Version'].map(feature => (
                  <span key={feature} className={`px-4 py-2 border-2 font-mono text-xs font-bold uppercase transition-all hover:bg-[#2d5bff] hover:text-white ${isDark ? 'border-gray-700' : 'border-black'}`}>
                     {feature}
                  </span>
               ))}
            </div>
         </div>

         <div className="mt-20 text-center">
            <NeoButton variant="primary" onClick={() => setCurrentView('landing')}>Back to Home</NeoButton>
         </div>
      </div>
   );
   const EARLY_ACCESS_URL = "https://docs.google.com/forms/d/e/1FAIpQLSegIYqoTgB6U9s-cQDsx_Csf2b8Jfa3JJ8jz8EcrJg1oGssIg/viewform";
   return (
      <div className={`min-h-screen font-sans selection:bg-[#2d5bff] selection:text-white flex flex-col transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'
         }`}>

         <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .shadow-neo { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
          .shadow-neo-black { box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); }
        `}</style>

         <header className={`h-20 shadow bg-backdrop-blur flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'
            }`}>
            <div
               className="flex items-center gap-2 font-mono leading-relaxed font-black cursor-pointer group"
               onClick={() => setCurrentView('landing')}
            >
               <img
                  src={isDark ? `/lab_stx.png` : `/lab_stx_whitee.png`}
                  alt="LabSTX"
                  className={isDark ? `w-5 group-hover:rotate-12 transition-transform` : `w-7 group-hover:rotate-12 transition-transform`}
               />
               <span className="font-black text-xl tracking-tighter">LabSTX</span>
            </div>
            <div className="flex items-center gap-6">
               <button
                  onClick={() => setCurrentView('roadmap')}
                  className={`font-bold font-display uppercase tracking-widest text-sm transition-all hover:text-[#2d5bff] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#2d5bff] after:transition-all ${currentView === 'roadmap' ? 'text-[#2d5bff] after:w-full' : 'after:w-0'}`}
               >
                  Roadmap
               </button>
               <button
                  onClick={() => setCurrentView('statistics')}
                  className={`font-bold font-display uppercase tracking-widest text-sm transition-all hover:text-[#2d5bff] relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[#2d5bff] after:transition-all ${currentView === 'statistics' ? 'text-[#2d5bff] after:w-full' : 'after:w-0'}`}
               >
                  Statistics
               </button>
               <a href="https://github.com/LabSTX" target="_blank" rel="noopener noreferrer" className={`font-bold font-display hover:text-[#2d5bff] hidden md:block tracking-widest text-sm transition-colors ${isDark ? 'text-gray-300' : 'text-gray-900'}`}><Github /></a>
               <a href="https://x.com/Stackslaborg" target="_blank" rel="noopener noreferrer" className={`font-bold font-display hover:text-[#2d5bff] hidden md:block tracking-widest text-sm transition-colors ${isDark ? 'text-gray-300' : 'text-gray-900'}`}><Twitter /></a>

               <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
               <NeoButton variant="primary" theme={theme} onClick={() => window.open('https://lab-stx-ide.vercel.app', '_blank', 'noopener,noreferrer')}>Get Started</NeoButton>
            </div>
         </header>

         <main className="flex-1">
            {currentView === 'roadmap' ? (
               <RoadmapView />
            ) : currentView === 'statistics' ? (
               <StatisticsView theme={theme} />
            ) : (
               <>
                  {/* --- HERO SECTION (HIRO STYLE) --- */}
                  <section className={`relative min-h-[85vh] flex flex-col items-center justify-center px-6 border-b-2 border-[#2d5bff] overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
                     <AsciiBackground />
                     <div className="max-w-7xl mx-auto text-center relative z-10">
                        <h1 className={`text-6xl md:text-[140px] font-display font-black uppercase leading-[0.8] tracking-tighter mb-8 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                           Write Clarity <br /> in Your Browser
                        </h1>
                        <div className="max-w-2xl mx-auto space-y-8">
                           <p className={`text-xl font-medium font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              Write, compile, deploy, and test <a href="https://clarity-lang.org/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Clarity</a> smart contracts on <a href="https://stacks.co" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Stacks</a>. No local setup required.
                           </p>

                           {/* Added explicit Early Access link in Hero */}
                           <div className="flex flex-col items-center gap-6">
                              <div className="flex justify-center gap-4">
                                 <button onClick={() => window.open('https://lab-stx-ide.vercel.app', '_blank', 'noopener,noreferrer')} className="bg-[#D1D1CB] hover:bg-[#BDBDB5] text-black font-bold py-5 px-12 rounded-sm text-sm flex items-center gap-2 uppercase tracking-widest transition-all">
                                    Start building <ArrowRight size={18} />
                                 </button>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                 <p className={`text-sm font-mono opacity-80 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Public beta is live. Join Early Access for priority updates and influence features.
                                 </p>
                                 <a
                                    href={EARLY_ACCESS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-sm font-mono font-bold uppercase tracking-tighter border-b-2 border-[#2d5bff] pb-1 hover:font-bold transition-all`}
                                 >
                                    Join Early Access →
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* --- TRUSTED BY MARQUEE --- */}
                  <section className={`border-b-2 border-[#2d5bff] py-6 overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#0a0a0a]'}`}>
                     <div className="whitespace-nowrap flex gap-12 animate-[marquee_25s_linear_infinite] hover:pause">
                        {[...Array(2)].map((_, i) => (
                           <React.Fragment key={i}>
                              <a href="https://www.stacks.co/" target="_blank" rel="noopener noreferrer" className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500 hover:text-[#2d5bff] transition-colors"><Globe size={20} /> Stacks_Network</a>
                              <span className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500"><Shield size={20} /> Enterprise_Grade</span>
                              <a href="https://www.stacks.co/bitcoin-layers" target="_blank" rel="noopener noreferrer" className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500 hover:text-[#2d5bff] transition-colors"><Zap size={20} /> Bitcoin_Layers</a>
                              <a href="https://docs.stacks.co/docs/clarity" target="_blank" rel="noopener noreferrer" className="font-display font-bold text-2xl uppercase mx-6 flex items-center gap-2 text-gray-500 hover:text-[#2d5bff] transition-colors"><Code2 size={20} /> Clarity_SDK</a>
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
                           <FeatureCard icon={<Code2 size={32} />} title="Clarity Editor" desc={<span>High-performance <a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Monaco editor</a> with real-time syntax highlighting for <a href="https://clarity-lang.org/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Clarity</a> smart contracts.</span>} theme={theme} />
                           <FeatureCard icon={<Cpu size={32} />} title="Static Analysis" desc={<span>Integrated <a href="https://docs.stacks.co/docs/clarity/language-overview#clarity-check" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">check command</a> to catch post-condition errors and estimate execution costs before deployment.</span>} theme={theme} />
                           <FeatureCard icon={<Bot size={32} />} title="AI Debugger" desc={<span>LabSTX AI (powered by <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Gemini</a>) helps optimize your Clarity logic and explain contract traits.</span>} theme={theme} />
                           <FeatureCard icon={<Wallet size={32} />} title="Stacks Wallets" desc={<span>Full integration with <a href="https://leather.io/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Leather</a> and <a href="https://xverse.app/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Xverse</a>. Manage STX balances and <a href="https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">SIP-010</a> tokens natively.</span>} theme={theme} />
                           <FeatureCard icon={<FolderTree size={32} />} title="Project Scaffolding" desc={<span>Manage multiple contract files and complex Stacks projects with a virtual file system and <a href="https://github.com/hirosystems/clarinet" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">Clarinet</a>-style logic.</span>} theme={theme} />
                           <FeatureCard icon={<Rocket size={32} />} title="Seamless Deploy" desc={<span>One-click deployment to Stacks Mainnet or Testnet with real-time <a href="https://explorer.hiro.so/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">explorer</a> tracking.</span>} theme={theme} />
                        </div>
                     </div>
                  </section>

                  {/* --- TRY IT NOW (DEEP LINKS) --- */}
                  <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
                     <div className="max-w-7xl mx-auto text-center">
                        <div className="mb-16">
                           <h2 className={`text-5xl font-display font-black uppercase mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Try it Now</h2>
                           <p className={`text-lg font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Launch the IDE instantly with a pre-configured template now</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                           <div className={`p-8 border-2 shadow-neo text-left transition-all hover:-translate-y-1 ${isDark ? 'bg-black border-gray-700' : 'bg-white border-black'}`}>
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center">
                                    <Box size={24} />
                                 </div>
                                 <h3 className="text-2xl font-display font-black uppercase">Hello World</h3>
                              </div>
                              <p className="font-mono text-sm mb-8 opacity-70">Start with a basic Clarity contract structure and build your first Stacks app in seconds.</p>
                              <NeoButton
                                 variant="primary"
                                 theme={theme}
                                 onClick={() => window.open('https://lab-stx-ide.vercel.app?template_id=hello-world', '_blank')}
                                 className="w-full justify-center gap-2"
                              >
                                 <Rocket size={18} />
                                 Open Template
                              </NeoButton>
                           </div>

                           <div className={`p-8 border-2 shadow-neo text-left transition-all hover:-translate-y-1 ${isDark ? 'bg-black border-gray-700' : 'bg-white border-black'}`}>
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center">
                                    <Code2 size={24} />
                                 </div>
                                 <h3 className="text-2xl font-display font-black uppercase">Fungible Token</h3>
                              </div>
                              <p className="font-mono text-sm mb-8 opacity-70">Start with a basic fungible token implementation (SIP-010-like)</p>
                              <NeoButton
                                 variant="primary"
                                 theme={theme}
                                 onClick={() => window.open('https://lab-stx-ide.vercel.app/?template_id=fungible-token', '_blank')}
                                 className="w-full justify-center gap-2"
                              >
                                 <Rocket size={18} />
                                 Open Template
                              </NeoButton>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* --- SUPPORTED LANGUAGES --- */}
                  <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]'}`}>
                     <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <h2 className={`text-5xl md:text-6xl font-display font-black uppercase leading-[0.9] ${isDark ? 'text-white' : 'text-black'}`}>
                                 Built for <a href="https://clarity-lang.org/" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline transition-all">Clarity</a>
                              </h2>
                              <p className="text-xl font-mono opacity-80 max-w-xl">
                                 The decidable language that brings predictable, secure smart contracts to the <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#2d5bff] underline decoration-dotted">Bitcoin ecosystem</a> via <a href="https://stacks.co" target="_blank" rel="noopener noreferrer" className="hover:text-[#2d5bff] underline decoration-dotted">Stacks</a>.
                              </p>
                           </div>

                           <div className="grid gap-4">
                              <div className={`flex items-center gap-4 p-4 border-2 shadow-neo ${isDark ? 'bg-black border-gray-700' : 'bg-white border-black'}`}>
                                 <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACgAKAMBEQACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAAAAwQGBf/EACsQAAAFAQYEBwEAAAAAAAAAAAABAgMRBAUSExUhcTEyQWEiNUJRgqHSFP/EABoBAQADAAMAAAAAAAAAAAAAAAACAwUEBgf/xAAqEQACAQIEBAUFAAAAAAAAAAAAAQIDEQQSE0ExUYLBISNh0fAUMmJjcf/aAAwDAQACEQMRAD8Atjqx6AAAAAAAAAE9C2w7VtN1bqmmVHCnElN3vsJ01FySk7IqrSnGm5U1drYsJsiqO18sMiJ4lQavSSeN7aNRZoT1dLf54lLxlP6fX278itWIYbqnUUrinWUqhC1FBq7iuaipNRd0X0ZTlTTqKz5EIgWAAdewsPCexMo5i8wI5+MdBysPls75eoz8bmzK2fp7mmPMPFJ2BP8ALroucD8/Q0PM/Hh68PYxvI/Zx9Pu9zM27h3GcPKeJzl5HPTmkZ+Iy2VsvSbOCzXlfP1djkDimgABPQuMM1bTlU0bzSDlTZHF72LYTpuMZJyV0VV4znTcabs3uTptaqK1szNUvX5Muhlwu7RoJqvPV1d/ngVPB0/p9Dbvz/pXrFsOVTq6Vo2mVKlLZnN3sITcXJuKsi6jGcaaVR3fMhECwAAAAAAAAP/Z" alt="Stacks" className="w-12 h-12 rounded-md" />
                                 <div>
                                    <a href="https://stacks.co" target="_blank" rel="noopener noreferrer" className="font-bold uppercase flex items-center gap-2 hover:text-[#2d5bff] transition-colors">Stacks Blockchain <ExternalLink size={14} className="opacity-40" /></a>
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
                           <div className="absolute top-0 right-0 p-2 text-[10px] uppercase tracking-widest">   <NeoButton
                              variant="primary"
                              theme={theme}
                              onClick={() => window.open('https://lab-stx-ide.vercel.app/?template_id=counter', '_blank')}
                              className="w-full justify-center gap-2"
                           >
                              <Rocket size={18} />
                              Open in IDE
                           </NeoButton>
                           </div>
                           <div className="font-mono text-sm p-4 rounded-lg">
                              {/* Header Comment */}
                              <div className="text-green-400 opacity-50 mb-4">;; Counter Contract</div>

                              {/* Data Variable */}
                              <div className="text-blue-400">(define-data-var counter uint u0)</div>
                              <br />

                              {/* Increment Function */}
                              <div className="text-blue-400">(define-public (increment)</div>
                              <div className="pl-4 text-blue-400">
                                 (begin
                                 <div className="pl-4 text-blue-300">(var-set counter (+ (var-get counter) u1))</div>
                                 <div className="pl-4 text-blue-300">(ok (var-get counter))</div>
                                 )
                              </div>
                              <div className="text-blue-400">)</div>
                              <br />

                              {/* Decrement Function */}
                              <div className="text-blue-400">(define-public (decrement)</div>
                              <div className="pl-4 text-blue-400">
                                 (begin
                                 <div className="pl-4 text-blue-300">(var-set counter (- (var-get counter) u1))</div>
                                 <div className="pl-4 text-blue-300">(ok (var-get counter))</div>
                                 )
                              </div>
                              <div className="text-blue-400">)</div>
                              <br />

                              {/* Read-Only Function */}
                              <div className="text-blue-400">(define-read-only (get-counter)</div>
                              <div className="pl-4 text-blue-400">(ok (var-get counter))</div>
                              <div className="text-blue-400">)</div>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* --- USE CASES --- */}
                  <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-black' : 'bg-white'}`}>
                     <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl font-display font-black uppercase mb-12">Tailored For</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                           <UseCaseCard icon={<Zap size={24} />} title="Clarity Mastery" desc="The ultimate environment for learning Stacks development without the overhead of local environments." theme={theme} />
                           <UseCaseCard icon={<Activity size={24} />} title="Rapid Prototyping" desc={<span>Test and iterate on <a href="https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">SIP-010</a> or <a href="https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md" target="_blank" rel="noopener noreferrer" className="text-[#2d5bff] hover:underline">SIP-009</a> protocols in a sandbox before moving to production.</span>} theme={theme} />
                        </div>
                     </div>
                  </section>

                  {/* --- GETTING STARTED --- */}
                  <section className={`py-24 px-6 border-b-2 border-[#2d5bff] ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f3f4f6]'}`}>
                     <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-5xl font-display font-black uppercase mb-12">Start Building on Stacks</h2>
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                           <a href="https://lab-stx-ide.vercel.app" className="block group transition-transform hover:-translate-y-1"><StepCard number="1" title="Launch IDE" desc="Open LabSTX and select your workspace." theme={theme} /></a>
                           <a href="https://docs.stacks.co/docs/clarity" target="_blank" rel="noopener noreferrer" className="block group transition-transform hover:-translate-y-1"><StepCard number="2" title="Code Clarity" desc="Use our templates to write your contract." theme={theme} /></a>
                           <a href="https://explorer.hiro.so/" target="_blank" rel="noopener noreferrer" className="block group transition-transform hover:-translate-y-1"><StepCard number="3" title="Deploy" desc="Broadcast your contract to the Stacks Blockchain." theme={theme} /></a>
                        </div>
                        <NeoButton variant="primary" className="!text-lg !px-12 !py-5" theme={theme} onClick={() => window.open('https://lab-stx-ide.vercel.app', '_blank', 'noopener,noreferrer')}>Launch LabSTX IDE</NeoButton>
                     </div>
                  </section>

                  {/* --- FOOTER --- */}
                  <footer className={`py-16 px-6 border-t-4 border-[#2d5bff] bg-black text-white`}>
                     <div className="max-w-7xl mx-auto">
                        {/* Main Footer Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                           <div className="space-y-6">
                              <div className="flex items-center gap-2">
                                 <img src={`/lab_stx.png`} alt="LabSTX" className="w-5" />
                                 <p className="font-black text-2xl tracking-tighter">LabSTX</p>
                              </div>
                              <p className="text-sm font-mono opacity-60 leading-relaxed max-w-xs">
                                 The premier browser-based development environment for Stacks Blockchain developers. Write, test, and deploy Clarity contracts with zero setup.
                              </p>
                           </div>

                           <div>
                              <h3 className="font-black uppercase text-[#2d5bff] mb-6 tracking-widest text-sm">Product</h3>
                              <ul className="text-sm font-mono space-y-4">
                                 <li><a href="https://lab-stx-ide.vercel.app" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all flex items-center gap-2">Launch IDE <ArrowRight size={14} /></a></li>
                                 <li><a href="https://github.com/LabSTX" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">Contract Templates</a></li>
                                 <li><a href="https://lab-stx-ide.vercel.app" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">AI Debugger</a></li>
                                 <li><a href="https://github.com/LabSTX" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">Open Source</a></li>
                              </ul>
                           </div>

                           <div>
                              <h3 className="font-black uppercase text-[#2d5bff] mb-6 tracking-widest text-sm">Ecosystem</h3>
                              <ul className="text-sm font-mono space-y-4">
                                 <li><a href="https://docs.stacks.co/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all flex items-center gap-2">Stacks Docs <ExternalLink size={14} /></a></li>
                                 <li><a href="https://clarity-lang.org/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">Clarity Language</a></li>
                                 <li><a href="https://explorer.hiro.so/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all flex items-center gap-2">Hiro Explorer <ExternalLink size={14} /></a></li>
                                 <li><a href="https://www.stacks.co/" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">Stacks Foundation</a></li>
                              </ul>
                           </div>

                           <div>
                              <h3 className="font-black uppercase text-[#2d5bff] mb-6 tracking-widest text-sm">Community</h3>
                              <ul className="text-sm font-mono space-y-4">
                                 <li><a href="https://x.com/Stackslaborg" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">Twitter / X</a></li>
                                 <li><a href="https://discord.com/invite/stacks" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">Discord</a></li>
                                 <li><a href="https://github.com/LabSTX" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">GitHub</a></li>
                                 <li><a href="mailto:hello@labstx.io" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-all">Contact Us</a></li>
                              </ul>
                           </div>
                        </div>

                        {/* Bottom Footer */}
                        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-mono">
                           <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                              <span className="opacity-40">© 2026 LabSTX. Built for the <a href="https://stacks.co" target="_blank" rel="noopener noreferrer" className="hover:text-[#2d5bff] hover:opacity-100 transition-all">Stacks Community</a>.</span>
                              <div className="flex gap-6 opacity-60">
                                 <a href="#" className="hover:text-[#2d5bff] transition-colors">Privacy Policy</a>
                                 <a href="#" className="hover:text-[#2d5bff] transition-colors">Terms of Service</a>
                              </div>
                           </div>
                           <div className="flex gap-6">
                              <a href="https://github.com/LabSTX" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-transform hover:scale-110"><Github size={20} /></a>
                              <a href="https://x.com/Stackslaborg" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-transform hover:scale-110"><Twitter size={20} /></a>
                              <a href="https://discord.com/invite/stacks" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[#2d5bff] transition-transform hover:scale-110"><ExternalLink size={20} /></a>
                           </div>
                        </div>
                     </div>
                  </footer>
               </>
            )}
         </main>
      </div>
   );
};
// --- Helper Components ---



const FeatureCard = ({ icon, title, desc, theme }: { icon: React.ReactNode, title: string, desc: React.ReactNode, theme: 'light' | 'dark' }) => {
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

const UseCaseCard = ({ icon, title, desc, theme }: { icon: React.ReactNode, title: string, desc: React.ReactNode, theme: 'light' | 'dark' }) => {
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

const StepCard = ({ number, title, desc, theme }: { number: string, title: string, desc: React.ReactNode, theme: 'light' | 'dark' }) => {
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