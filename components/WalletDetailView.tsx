import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Wallet,
    Activity,
    Zap,
    Code2,
    CheckCircle2,
    Globe,
    ExternalLink,
    Box,
    Award,
    TrendingUp,
    ShieldCheck,
    Cpu,
    Bot,
    RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface WalletStats {
    totalTransactions: number;
    aiInteractions: number;
    aiQuotaLimit: number;
    successfulDeployments: number;
    failedDeployments: number;
    recentDeployments: {
        id: string;
        name: string;
        timestamp: string;
        network: string;
        status: string;
    }[];
}

interface ActivityItem {
    date: string;
    count: number;
}

interface WalletDetailViewProps {
    wallet: string;
    theme: 'light' | 'dark';
    onBack: () => void;
}

const API_BASE = 'https://labstx-ide-api.onrender.com/ide-api';

export const WalletDetailView: React.FC<WalletDetailViewProps> = ({ wallet, theme, onBack }) => {
    const isDark = theme === 'dark';
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    fetch(`${API_BASE}/stats/user/${wallet}`).then(r => r.json()),
                    fetch(`${API_BASE}/stats/user/${wallet}/activity`).then(r => r.json())
                ]);
                setStats(statsRes);
                setActivity(activityRes);
            } catch (err) {
                console.error('Failed to fetch wallet stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [wallet]);

    const formatWallet = (w: string) => `${w.slice(0, 12)}...${w.slice(-8)}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <RefreshCw className="text-[#2d5bff] animate-spin" size={48} />
                    <span className="font-mono text-sm uppercase tracking-widest opacity-50">Indexing Wallet Data...</span>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    // Robust Reputation Calculation
    const calculateReputation = () => {
        const base = stats.totalTransactions * 25;
        const successBonus = stats.successfulDeployments * 100;
        const aiBonus = stats.aiInteractions * 50;

        const totalAttempts = stats.successfulDeployments + stats.failedDeployments;
        const successRate = totalAttempts > 0 ? stats.successfulDeployments / totalAttempts : 1;
        const qualityBonus = Math.round(successRate * 500);

        const totalScore = base + successBonus + aiBonus + qualityBonus;
        const level = Math.floor(Math.sqrt(totalScore / 500)) + 1;

        // Calculate progress to next level
        const currentLevelStartScore = Math.pow(level - 1, 2) * 500;
        const nextLevelStartScore = Math.pow(level, 2) * 500;
        const progress = ((totalScore - currentLevelStartScore) / (nextLevelStartScore - currentLevelStartScore)) * 100;

        return { level, totalScore, progress, nextLevelStartScore };
    };

    const rep = calculateReputation();

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-fade-in">
            {/* Header */}
            <div className="space-y-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 font-mono text-xs uppercase opacity-50 hover:opacity-100 transition-all group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Ecosystem
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2d5bff]/10 border-2 border-[#2d5bff]/20 rounded-sm">
                            <Wallet size={14} className="text-[#2d5bff]" />
                            <span className="text-[10px] font-bold text-[#2d5bff] uppercase tracking-widest">Operator Identity v1.1.0</span>
                        </div>
                        <h2 className={`text-5xl font-display font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                            {formatWallet(wallet)}
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-sm opacity-50 break-all">{wallet}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(wallet)}
                                className="p-1 hover:text-[#2d5bff] transition-colors"
                            >
                                <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`p-4 border-2 shadow-neo-sm relative overflow-hidden ${isDark ? 'bg-black border-gray-800' : 'bg-white border-black'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="space-y-0.5">
                                    <div className="font-mono text-[8px] uppercase opacity-40">Dev Reputation</div>
                                    <div className="flex items-center gap-2">
                                        <Award className="text-amber-500" size={16} />
                                        <span className="font-display font-black text-xl">Lvl {rep.level}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-[8px] uppercase opacity-40">EXP</div>
                                    <div className="font-display font-black text-xs text-[#2d5bff]">{rep.totalScore}</div>
                                </div>
                            </div>

                            {/* Progress bar to next level */}
                            <div className="w-48 h-1.5 bg-gray-500/10 rounded-full overflow-hidden border border-black/5">
                                <div
                                    className="h-full bg-gradient-to-r from-[#2d5bff] to-violet-500 transition-all duration-1000"
                                    style={{ width: `${rep.progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="font-mono text-[7px] uppercase opacity-30">Novice</span>
                                <span className="font-mono text-[7px] uppercase opacity-30 text-right">To Lvl {rep.level + 1}: {Math.round(rep.nextLevelStartScore - rep.totalScore)} XP</span>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 p-1 opacity-[0.03] pointer-events-none">
                                <TrendingUp size={48} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DetailStatCard
                    title="Total Actions"
                    value={stats.totalTransactions}
                    icon={<Activity size={20} />}
                    isDark={isDark}
                />
                <DetailStatCard
                    title="AI Assistance"
                    value={stats.aiInteractions}
                    icon={<Bot size={20} />}
                    isDark={isDark}
                />
                <DetailStatCard
                    title="Quota Remaining"
                    value={`${stats.aiQuotaLimit - stats.aiInteractions}/${stats.aiQuotaLimit}`}
                    icon={<ShieldCheck size={20} />}
                    isDark={isDark}
                />
                <DetailStatCard
                    title="Active Deployments"
                    value={stats.recentDeployments.length}
                    icon={<Zap size={20} />}
                    isDark={isDark}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Activity Heatmap Area */}
                <div className={`lg:col-span-2 p-8 border-2 shadow-neo-black overflow-hidden ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-display font-black uppercase">Contribution History</h3>
                            <p className="font-mono text-xs opacity-50 uppercase tracking-widest mt-1">On-chain Presence</p>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activity.slice(-30)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#222' : '#eee'} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 8, fill: isDark ? '#666' : '#999', fontFamily: 'monospace' }}
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: isDark ? '#666' : '#999', fontFamily: 'monospace' }}
                                />
                                <Tooltip
                                    cursor={{ fill: isDark ? '#222' : '#f5f5f5' }}
                                    contentStyle={{
                                        backgroundColor: isDark ? '#111' : '#fff',
                                        border: '2px solid black',
                                        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                                        fontFamily: 'monospace',
                                        fontSize: '10px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#2d5bff" stroke="black" strokeWidth={1} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status List */}
                <div className={`p-8 border-2 shadow-neo-black flex flex-col overflow-y-auto max-h-[500px] ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <h3 className="text-2xl font-display font-black uppercase mb-6">Recent Work</h3>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {stats.recentDeployments.length > 0 ? stats.recentDeployments.map((d, i) => (
                            <div key={i} className={`p-4 border-2 transition-all hover:border-[#2d5bff]  ${isDark ? 'bg-black border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-1.5 bg-[#2d5bff]/10 text-[#2d5bff] rounded-sm">
                                        {d.network}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-40">{new Date(d.timestamp).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-display font-black uppercase text-sm">{d.name}</h4>
                                <div className="flex items-center justify-between mt-3">
                                    <span className={`text-[10px] font-mono flex items-center gap-1 ${d.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        <CheckCircle2 size={10} /> {d.status}
                                    </span>
                                    <a
                                        href={`https://explorer.hiro.so/txid/${wallet}.${d.name}?chain=${d.network}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#2d5bff] hover:underline font-mono text-[10px] flex items-center gap-1"
                                    >
                                        EXPLORER <ArrowLeft size={8} className="rotate-180" />
                                    </a>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                                <Box size={48} />
                                <p className="font-mono text-xs italic uppercase">No recent deployments recorded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailStatCard: React.FC<{ title: string; value: string | number; icon: any; isDark: boolean }> = ({ title, value, icon, isDark }) => (
    <div className={`p-6 border-2 shadow-neo transition-all hover:-translate-y-1 group ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
        <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#2d5bff]/10 border border-[#2d5bff]/20 text-[#2d5bff] flex items-center justify-center transition-all group-hover:bg-[#2d5bff] group-hover:text-white">
                {icon}
            </div>
        </div>
        <h4 className="font-mono text-[10px] uppercase opacity-50 tracking-widest">{title}</h4>
        <div className="text-3xl font-display font-black mt-1 leading-none truncate">{value}</div>
    </div>
);
