import React, { useState } from 'react';
import { 
    Search, 
    ArrowLeft, 
    Rocket, 
    Github, 
    ExternalLink, 
    Box, 
    Code2, 
    Zap,
    Layout,
    Globe
} from 'lucide-react';
import { HIRO_TEMPLATES } from '../../IDE/services/hiroTemplates';
import { NeoButton } from './NeoButton';

interface TemplatesViewProps {
    theme: 'light' | 'dark';
    onBack: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ theme, onBack }) => {
    const isDark = theme === 'dark';
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTemplates = HIRO_TEMPLATES.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-fade-in">
            {/* Header */}
            <div className="space-y-6">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 font-mono text-xs uppercase opacity-50 hover:opacity-100 transition-all group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Insights
                </button>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2d5bff]/10 border-2 border-[#2d5bff]/20 rounded-sm">
                            <Layout size={14} className="text-[#2d5bff]" />
                            <span className="text-[10px] font-bold text-[#2d5bff] uppercase tracking-widest">Template Explorer v1.0</span>
                        </div>
                        <h2 className={`text-6xl font-display font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                            Blueprint <span className="text-[#2d5bff]">Library</span>
                        </h2>
                        <p className={`text-lg font-mono max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Industrial-grade Clarity scaffolds. Start from verified architecture patterns instead of a blank file.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="SEARCH BLUEPRINTS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 border-2 font-mono text-sm focus:outline-none transition-all shadow-neo-sm focus:shadow-neo ${
                                isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-black text-black'
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => (
                    <div 
                        key={template.id}
                        className={`p-8 border-2 shadow-neo transition-all hover:-translate-y-1 group flex flex-col ${
                            isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 bg-[#2d5bff]/10 border border-[#2d5bff]/20 text-[#2d5bff] flex items-center justify-center transition-all group-hover:bg-[#2d5bff] group-hover:text-white">
                                {template.id.includes('nft') ? <Zap size={24} /> : 
                                 template.id.includes('ft') ? <Box size={24} /> : 
                                 template.id.includes('dapp') ? <Globe size={24} /> : 
                                 <Code2 size={24} />}
                            </div>
                            <div className="flex gap-2">
                                <a 
                                    href={template.repoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 border border-transparent hover:border-black dark:hover:border-white transition-all opacity-20 hover:opacity-100"
                                    title="View Source on GitHub"
                                >
                                    <Github size={16} />
                                </a>
                            </div>
                        </div>

                        <h3 className="text-2xl font-display font-black uppercase mb-4 leading-tight">{template.name}</h3>
                        <p className={`font-mono text-xs mb-8 opacity-60 leading-relaxed flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {template.description}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 py-3 border-y border-dashed border-gray-500/20">
                                <div className="text-center flex-1 border-r border-dashed border-gray-500/20">
                                    <div className="text-[8px] font-mono uppercase opacity-40">Language</div>
                                    <div className="text-[10px] font-bold uppercase text-[#2d5bff]">Clarity</div>
                                </div>
                                <div className="text-center flex-1">
                                    <div className="text-[8px] font-mono uppercase opacity-40">Standard</div>
                                    <div className="text-[10px] font-bold uppercase">{template.id.includes('nft') ? 'SIP-009' : template.id.includes('ft') ? 'SIP-010' : 'Core'}</div>
                                </div>
                            </div>

                            <NeoButton 
                                variant="primary" 
                                className="w-full justify-center gap-2 py-4"
                                onClick={() => window.open(`https://lab-stx-ide.vercel.app?template_id=${template.id}`, '_blank')}
                            >
                                <Rocket size={16} />
                                START BUILDING
                            </NeoButton>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="py-32 text-center space-y-4">
                    <div className="inline-block p-6 bg-red-500/10 border-2 border-red-500/20 text-red-500">
                        <Box size={48} className="opacity-50" />
                    </div>
                    <h4 className="text-3xl font-display font-black uppercase">No Scaffolds Found</h4>
                    <p className="font-mono text-sm opacity-50">Your search did not yield any matching blueprints in our library.</p>
                </div>
            )}
        </div>
    );
};
