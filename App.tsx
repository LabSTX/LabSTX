import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { UnderDevelopment } from './components/UnderDevelopment';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'builder' | 'underdev'>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (currentPage === 'builder') {
    return <WorkflowBuilder />;
  }

  if (currentPage === 'underdev') {
    return <UnderDevelopment onBack={() => setCurrentPage('landing')} theme={theme} />;
  }

  return <LandingPage onLaunch={() => setCurrentPage('underdev')} theme={theme} toggleTheme={toggleTheme} />;
}