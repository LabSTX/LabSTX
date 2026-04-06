import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { UnderDevelopment } from './components/UnderDevelopment';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  const location = useLocation();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Dynamic page title and meta description based on route
  useEffect(() => {
    const titles: Record<string, { title: string; description: string }> = {
      '/': {
        title: 'LabSTX IDE - Write Clarity Smart Contracts on Stacks Blockchain',
        description: 'Professional browser-based IDE for Clarity smart contract development. Build Bitcoin-secured dApps on Stacks with zero setup.'
      },
      '/roadmap': {
        title: 'Roadmap - LabSTX IDE Development Timeline',
        description: 'Explore the LabSTX development roadmap. See upcoming features, improvements, and our vision for the future of Clarity development.'
      },
      '/statistics': {
        title: 'Statistics - LabSTX Usage Analytics & Metrics',
        description: 'View real-time statistics and analytics for LabSTX IDE. Track deployments, popular templates, and community engagement.'
      },
      '/statistics/templates': {
        title: 'Templates - Free Clarity Smart Contract Templates | LabSTX',
        description: 'Browse our collection of free Clarity smart contract templates. Start building with pre-configured projects for tokens, NFTs, and more.'
      }
    };

    const pageInfo = titles[location.pathname] || titles['/'];
    document.title = pageInfo.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageInfo.description);
    }
  }, [location]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<LandingPage theme={theme} toggleTheme={toggleTheme} onLaunch={() => navigate('/underdev')} />} 
      />
      <Route 
        path="/statistics/*" 
        element={<LandingPage theme={theme} toggleTheme={toggleTheme} onLaunch={() => navigate('/underdev')} />} 
      />
      <Route path="/builder" element={<WorkflowBuilder />} />
      <Route 
        path="/underdev" 
        element={<UnderDevelopment onBack={() => navigate('/')} theme={theme} />} 
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}