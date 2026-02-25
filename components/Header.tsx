import React from 'react';
import { Ghost, Menu, Github } from 'lucide-react';
import { NeoButton } from './NeoButton';

export const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b-2 border-casper-red flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="bg-casper-red p-2 border-2 border-casper-red shadow-[3px_3px_0px_0px_#ffffff] hover:rotate-12 transition-transform duration-300">
            <Ghost className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-display font-black tracking-tighter hidden sm:block">CASPER<span className="text-casper-red">NOTE</span></h1>
      </div>

      <nav className="hidden md:flex items-center gap-8 font-display font-bold text-sm tracking-widest">
        <a href="#" className="hover:text-casper-red hover:translate-y-[-1px] transition-transform">DOCS</a>
        <a href="#" className="hover:text-casper-red hover:translate-y-[-1px] transition-transform">TEMPLATES</a>
        <a href="#" className="hover:text-casper-red hover:translate-y-[-1px] transition-transform">COMMUNITY</a>
      </nav>

      <div className="flex items-center gap-4">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 border-2 border-transparent hover:border-casper-red hover:bg-gray-50 transition-all rounded-full">
             <Github size={22} />
        </a>
        <NeoButton variant="primary" className="hidden sm:flex">
            Connect Wallet
        </NeoButton>
        <button className="md:hidden p-2 border-2 border-casper-red shadow-neo-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            <Menu size={24} />
        </button>
      </div>
    </header>
  );
};