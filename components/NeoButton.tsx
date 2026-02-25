import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  theme?: 'light' | 'dark';
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'secondary', 
  fullWidth = false,
  className = '',
  theme = 'light',
  ...props 
}) => {
  const isDark = theme === 'dark';
  const baseStyles = "font-display font-bold border-2 border-casper-red px-6 py-3 transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase tracking-wide";
  
  const variants = {
    primary: "bg-casper-red text-white shadow-neo-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-black-hover active:translate-x-[0px] active:translate-y-[0px] active:shadow-none",
    secondary: isDark 
      ? "bg-[#1a1a1a] text-white shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-hover active:translate-x-[0px] active:translate-y-[0px] active:shadow-none"
      : "bg-white text-casper-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-hover active:translate-x-[0px] active:translate-y-[0px] active:shadow-none",
    ghost: isDark
      ? "bg-transparent border-transparent shadow-none hover:bg-[#ff2d2e]/10"
      : "bg-transparent border-transparent shadow-none hover:bg-casper-red/5"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};