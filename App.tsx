import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { UnderDevelopment } from './components/UnderDevelopment';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();

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