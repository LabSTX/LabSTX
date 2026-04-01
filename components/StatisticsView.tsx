import React, { useEffect, useState } from 'react';
import {
    Activity,
    BarChart3,
    Users,
    Code2,
    Zap,
    TrendingUp,
    Clock,
    Globe,
    Terminal,
    ChevronRight,
    ArrowUpRight,
    Database,
    Cpu,
    ShieldCheck,
    Box,
    ExternalLink,
    Search,
    Shield,
    TrendingDown,
    Award,
    RotateCw,
    Play,
    Pause
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    Rectangle
} from 'recharts';
import { NeoButton } from './NeoButton';

interface StatsSummary {
    totalContracts: number;
    totalContractsTrend: number;
    uniqueDevelopers: number;
    uniqueDevelopersTrend: number;
    totalDeployments: number;
    totalDeploymentsTrend: string | number;
    successRate: number;
    successRateTrend: number;
}

interface ActivityData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

interface FeedEvent {
    id: string;
    wallet: string;
    action: string;
    contract: string;
    network: string;
    timestamp: string;
    status: string;
}

interface NetworkDist {
    [key: string]: number;
}

interface QualityMetrics {
    compileSuccess: number;
    deploySuccess: number;
    avgCompileTime: string;
    avgDeployTime: string;
}

interface LeaderboardEntry {
    rank: number;
    wallet: string;
    count: number;
    trend: number;
}

interface TemplateUsage {
    name: string;
    count: number;
}

interface ExplorerContract {
    txId?: string;
    name: string;
    deployer: string;
    network: string;
    date: string;
    gas: string;
    status?: string;
    reason?: string;
}

interface FullStats {
    summary: StatsSummary;
    activity: ActivityData;
    feed: FeedEvent[];
    distribution: {
        networks: NetworkDist;
        quality: QualityMetrics;
    };
    leaderboard: LeaderboardEntry[];
    usage: {
        templates: TemplateUsage[];
    };
    explorer: ExplorerContract[];
}
const API_BASE = 'https://labstx-ide-api.onrender.com/ide-api';

export const StatisticsView: React.FC<{
    theme: 'light' | 'dark',
    onViewChange?: (view: string) => void,
    onWalletClick?: (wallet: string) => void
}> = ({ theme, onViewChange, onWalletClick }) => {
    const isDark = theme === 'dark';
    const [stats, setStats] = useState<FullStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRealtime, setIsRealtime] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [timeframe, setTimeframe] = useState('week');

    // Pagination state for Explorer
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const fetchData = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            // Using a fresh local variable for timeframe if needed, but react state should be fine.
            // Let's use a temporary constant to be absolute.
            const targetTimeframe = timeframe;

            const [summary, activity, feed, distribution, leaderboard, usage, explorer] = await Promise.all([
                fetch(`${API_BASE}/stats/summary`).then(r => r.json()),
                fetch(`${API_BASE}/stats/activity?timeframe=${targetTimeframe}`).then(r => r.json()),
                fetch(`${API_BASE}/stats/feed`).then(r => r.json()),
                fetch(`${API_BASE}/stats/distribution`).then(r => r.json()),
                fetch(`${API_BASE}/stats/leaderboard`).then(r => r.json()),
                fetch(`${API_BASE}/stats/usage`).then(r => r.json()),
                fetch(`${API_BASE}/stats/explorer`).then(r => r.json())
            ]);

            setStats({
                summary,
                activity,
                feed,
                distribution,
                leaderboard,
                usage,
                explorer: explorer.contracts
            });
        } catch (err) {
            console.error('Failed to fetch statistics:', err);
        } finally {
            setLoading(false);
            if (isManual) {
                setTimeout(() => setRefreshing(false), 1000);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [timeframe]);

    useEffect(() => {
        if (!isRealtime) return;
        const interval = setInterval(() => fetchData(), 30000); // Use arrow function to ensure latest fetchData
        return () => clearInterval(interval);
    }, [isRealtime, timeframe, fetchData]);

    const formatWallet = (wallet: string) => `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-[#2d5bff]/20 rounded-full flex items-center justify-center">
                        <Activity className="text-[#2d5bff] animate-spin" />
                    </div>
                    <span className="font-mono text-sm uppercase tracking-widest opacity-50">Synchronizing Global Ledger...</span>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2d5bff]/10 border-2 border-[#2d5bff]/20 rounded-sm">
                    <TrendingUp size={14} className="text-[#2d5bff]" />
                    <span className="text-[10px] font-bold text-[#2d5bff] uppercase tracking-widest">ECOSYSTEM ANALYTICS v1.1.0</span>
                </div>
                <h2 className={`text-6xl font-display font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                    Developer <span className="text-[#2d5bff]">Insights</span>
                </h2>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <p className={`text-lg font-mono max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Real-time intelligence from the LabSTX network. Monitoring contract evolution, deployment patterns, and developer velocity.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 px-4 py-2 border-2 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-sm">
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isRealtime ? 'text-[#2d5bff]' : 'opacity-40'}`}>
                                    {isRealtime ? 'Realtime Active' : 'Realtime Idle'}
                                </span>
                                <button
                                    onClick={() => setIsRealtime(!isRealtime)}
                                    className={`w-10 h-6 border-2 border-black transition-all flex items-center px-0.5 ${isRealtime ? 'bg-[#2d5bff] justify-end' : 'bg-gray-400/20 justify-start'}`}
                                >
                                    <div className={`w-4 h-4 bg-white border border-black flex items-center justify-center transition-all`}>
                                        {isRealtime ? <Play size={8} className="text-[#2d5bff]" /> : <Pause size={8} className="text-gray-400" />}
                                    </div>
                                </button>
                            </div>
                            <div className="w-px h-6 bg-black/10 dark:white/10" />
                            <button
                                onClick={() => fetchData(true)}
                                disabled={refreshing}
                                className={`flex items-center gap-2 group transition-all ${refreshing ? 'opacity-50 cursor-wait' : 'hover:text-[#2d5bff]'}`}
                            >
                                <RotateCw size={14} className={`${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                                    {refreshing ? 'Syncing...' : 'Manual Sync'}
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Contracts"
                    value={stats.summary.totalContracts.toLocaleString()}
                    trend={stats.summary.totalContractsTrend}
                    icon={<Code2 size={20} />}
                    isDark={isDark}
                />
                <StatCard
                    title="Connected Wallets"
                    value={stats.summary.uniqueDevelopers.toLocaleString()}
                    trend={stats.summary.uniqueDevelopersTrend}
                    icon={<Users size={20} />}
                    isDark={isDark}
                />
                <StatCard
                    title="Total Deployments"
                    value={stats.summary.totalDeployments.toLocaleString()}
                    trend={stats.summary.totalDeploymentsTrend}
                    icon={<Zap size={20} />}
                    isDark={isDark}
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats.summary.successRate}%`}
                    trend={stats.summary.successRateTrend}
                    icon={<ShieldCheck size={20} />}
                    isDark={isDark}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Activity Visualizer */}
                <div className={`lg:col-span-2 p-8 border-2 shadow-neo-black relative overflow-hidden ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-display font-black uppercase">
                                {timeframe === 'week' || timeframe === 'last-week' ? 'Weekly' : timeframe === 'month' ? 'Monthly' : 'Yearly'} Velocity
                            </h3>
                            <p className="font-mono text-xs opacity-50 uppercase tracking-widest mt-1">IDE Interactions Pulse</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end gap-1">
                                <p className="font-mono text-[8px] opacity-40 uppercase tracking-widest">Timeframe</p>
                                <select
                                    value={timeframe}
                                    onChange={(e) => setTimeframe(e.target.value)}
                                    className={`bg-transparent border-2 border-black/10 dark:border-white/10 font-mono text-[10px] uppercase font-bold p-1 focus:outline-none focus:border-[#2d5bff] cursor-pointer ${isDark ? 'text-white' : 'text-black'}`}
                                >
                                    <option value="week" className={isDark ? 'bg-[#111]' : 'bg-white'}>THIS WEEK</option>
                                    <option value="last-week" className={isDark ? 'bg-[#111]' : 'bg-white'}>LAST WEEK</option>
                                    <option value="month" className={isDark ? 'bg-[#111]' : 'bg-white'}>THIS MONTH</option>
                                    <option value="year" className={isDark ? 'bg-[#111]' : 'bg-white'}>THIS YEAR</option>
                                </select>
                            </div>
                            <BarChart3 className="text-[#2d5bff] opacity-50" size={24} />
                        </div>
                    </div>

                    <div className="h-[300px] w-full relative z-10" key={timeframe}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.activity.labels.map((l, i) => ({
                                    name: l,
                                    compilations: stats.activity.datasets[0].data[i],
                                    deployments: stats.activity.datasets[1].data[i]
                                }))}
                                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#222' : '#eee'} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: isDark ? '#666' : '#999', fontFamily: 'monospace' }}
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
                                        fontSize: '10px',
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Bar
                                    dataKey="compilations"
                                    fill={isDark ? '#333' : '#eee'}
                                    stroke={isDark ? '#444' : '#ddd'}
                                    strokeWidth={2}
                                    radius={[0, 0, 0, 0]}
                                />
                                <Bar
                                    dataKey="deployments"
                                    fill="#2d5bff"
                                    stroke="black"
                                    strokeWidth={2}
                                    radius={[0, 0, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex gap-6 mt-8 pt-8 border-t border-dashed border-gray-500/20 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-500/10 border-2 border-black/10 dark:border-white/10" />
                            <span className="text-[10px] font-mono uppercase opacity-70">Compilations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#2d5bff] border-2 border-black" />
                            <span className="text-[10px] font-mono uppercase opacity-70">Deployments</span>
                        </div>
                    </div>
                </div>

                {/* Live Feed */}
                <div className={`p-8 border-2 shadow-neo-black overflow-hidden flex flex-col ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-display font-black uppercase">Live Updates</h3>
                            <p className="font-mono text-xs opacity-50 uppercase tracking-widest mt-1">Global Events</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="font-mono text-[10px] uppercase text-emerald-500 font-bold">Realtime</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                        {stats.feed.map((event, i) => (
                            <div key={i} className={`p-3 border-2 transition-all hover:border-[#2d5bff] ${isDark ? 'bg-black border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm ${event.action === 'deployed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#2d5bff]/10 text-[#2d5bff]'
                                        }`}>
                                        {event.action}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-40">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <h4 className="font-display font-black uppercase text-sm truncate">{event.contract || 'Untitled'}</h4>
                                <div className="flex items-center justify-between mt-2 font-mono text-[10px] opacity-60">
                                    <span>{formatWallet(event.wallet)}</span>
                                    <div className="flex items-center gap-1 capitalize">
                                        <Globe size={10} />
                                        {event.network}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className={`mt-6 w-full py-2 border-2 border-black font-mono text-[10px] uppercase font-bold transition-all shadow-neo-sm flex items-center justify-center gap-2 ${refreshing ? 'opacity-50 cursor-wait' : 'hover:bg-[#2d5bff] hover:text-white'
                            }`}
                    >
                        <RotateCw size={12} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Syncing...' : 'Refresh Ledger'}
                    </button>
                </div>
            </div>

            {/* Mid Grid: Distribution & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Network Distribution */}
                <div className={`p-6 border-2 shadow-neo-black ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <h3 className="font-display font-black uppercase text-sm mb-6 border-b border-dashed border-gray-500/20 pb-4">Networks</h3>
                    <div className="flex items-center justify-center p-4 relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                            {Object.entries(stats.distribution.networks).reduce((acc, [name, val], idx) => {
                                const percent = val as number;
                                const radius = 55;
                                const circumference = 2 * Math.PI * radius;
                                const offset = acc.totalOffset;
                                const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
                                const colors = ['#2d5bff', '#10b981', '#f59e0b', '#7c3aed'];
                                const currentColor = colors[idx % colors.length];

                                acc.elements.push(
                                    <circle
                                        key={name}
                                        cx="64" cy="64" r={radius}
                                        fill="transparent"
                                        stroke={currentColor}
                                        strokeWidth="14"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={-offset}
                                        className="transition-all duration-1000"
                                    />
                                );
                                acc.totalOffset += (percent / 100) * circumference;
                                return acc;
                            }, { elements: [] as any[], totalOffset: 0 as number }).elements}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Globe size={16} className="opacity-20 mb-1" />
                            <span className="font-display font-black text-xl leading-none">100%</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        {Object.entries(stats.distribution.networks).map(([name, percent], idx) => (
                            <div key={idx} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 border border-transparent hover:border-[#2d5bff]/20 rounded-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${['bg-[#2d5bff]', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'][idx % 4]}`} />
                                    <span className="font-mono text-[10px] uppercase opacity-70">{name}</span>
                                </div>
                                <span className="font-mono text-[10px] font-bold">{percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quality Metrics */}
                <div className={`p-6 border-2 shadow-neo-black ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <h3 className="font-display font-black uppercase text-sm mb-6 border-b border-dashed border-gray-500/20 pb-4">Quality Guard</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-mono text-[10px] uppercase opacity-50">Compile Health</span>
                                <span className="font-mono text-[10px] font-bold">{stats.distribution.quality.compileSuccess}%</span>
                            </div>
                            <div className="h-4 bg-gray-500/10 border-2 border-black/10 dark:border-white/10 relative">
                                <div className="absolute inset-y-0 left-0 bg-[#2d5bff] border-r-2 border-black" style={{ width: `${stats.distribution.quality.compileSuccess}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-mono text-[10px] uppercase opacity-50">Deploy Stability</span>
                                <span className="font-mono text-[10px] font-bold">{stats.distribution.quality.deploySuccess}%</span>
                            </div>
                            <div className="h-4 bg-gray-500/10 border-2 border-black/10 dark:border-white/10 relative">
                                <div className="absolute inset-y-0 left-0 bg-emerald-500 border-r-2 border-black" style={{ width: `${stats.distribution.quality.deploySuccess}%` }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-black text-white p-3 rounded-sm">
                                <div className="font-mono text-[8px] uppercase opacity-50 mb-1">Avg Compile</div>
                                <div className="font-display font-black text-xs">{stats.distribution.quality.avgCompileTime}</div>
                            </div>
                            <div className="bg-[#2d5bff] text-white p-3 rounded-sm">
                                <div className="font-mono text-[8px] uppercase opacity-50 mb-1">Avg Deploy</div>
                                <div className="font-display font-black text-xs">{stats.distribution.quality.avgDeployTime}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className={`p-6 border-2 shadow-neo-black lg:col-span-1 ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <h3 className="font-display font-black uppercase text-sm mb-6 border-b border-dashed border-gray-500/20 pb-4">Top Deployers</h3>
                    <div className="space-y-3">
                        {stats.leaderboard.map((user, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 border border-transparent hover:border-[#2d5bff] transition-colors">
                                <div className="w-6 h-6 bg-black text-white text-[10px] font-black flex items-center justify-center shrink-0">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <button
                                        onClick={() => onWalletClick?.(user.wallet)}
                                        className="font-mono text-[10px] truncate hover:text-[#2d5bff] transition-colors text-left w-full"
                                    >
                                        {formatWallet(user.wallet)}
                                    </button>
                                </div>
                                <div className="text-right">
                                    <div className="font-display font-black text-xs">{user.count}</div>
                                    <div className={`font-mono text-[8px] flex items-center justify-end gap-0.5 ${user.trend > 0 ? 'text-emerald-500' : user.trend < 0 ? 'text-rose-500' : 'opacity-30'}`}>
                                        {user.trend > 0 ? '+' : ''}{user.trend} <Award size={8} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Templates */}
                <div className={`p-6 border-2 shadow-neo-black ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                    <h3 className="font-display font-black uppercase text-sm mb-6 border-b border-dashed border-gray-500/20 pb-4">Template Usage</h3>
                    <div className="space-y-4">
                        {stats.usage.templates.slice(0, 5).map((template, idx) => {
                            const max = Math.max(...stats.usage.templates.map(t => t.count), 1);
                            const width = (template.count / max) * 100;
                            return (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between font-mono text-[10px] uppercase">
                                        <span className="truncate max-w-[120px]">{template.name}</span>
                                        <span className="font-black">{template.count}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-500/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#2d5bff] rounded-full"
                                            style={{ width: `${width}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => onViewChange?.('templates')}
                        className="mt-8 w-full py-2 border border-dashed border-gray-500/30 font-mono text-[10px] uppercase opacity-50 hover:opacity-100 transition-all hover:bg-[#2d5bff]/10 hover:border-[#2d5bff]/50"
                    >
                        View All Blueprints
                    </button>
                </div>
            </div>

            {/* Recent Deployments Table */}
            <div className={`border-2 shadow-neo-black overflow-hidden ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
                <div className="p-6 border-b-2 border-dashed border-gray-500/20 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-display font-black uppercase">Recent Deployments Explorer</h3>
                        <p className="font-mono text-xs opacity-50 uppercase tracking-widest mt-1">On-chain transaction history</p>
                    </div>
                    <a
                        href="https://explorer.hiro.so?chain=mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                        <NeoButton size="xs" variant="outline" className="gap-2">
                            View Network Explorer <ExternalLink size={14} />
                        </NeoButton>
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${isDark ? 'bg-black/50' : 'bg-gray-50'} font-mono text-[10px] uppercase tracking-wider text-gray-500`}>
                                <th className="px-6 py-4 border-b-2 border-dashed border-gray-500/20">Name</th>
                                <th className="px-6 py-4 border-b-2 border-dashed border-gray-500/20">Status</th>
                                <th className="px-6 py-4 border-b-2 border-dashed border-gray-500/20">Deployer</th>
                                <th className="px-6 py-4 border-b-2 border-dashed border-gray-500/20">Network</th>
                                <th className="px-6 py-4 border-b-2 border-dashed border-gray-500/20">Timestamp</th>
                                <th className="px-6 py-4 border-b-2 border-dashed border-gray-500/20 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dashed divide-gray-500/10">
                            {stats.explorer
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((item, i) => (
                                    <tr key={i} className={`group transition-all hover:bg-[#2d5bff]/5`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#2d5bff]/10 border border-[#2d5bff]/20 flex items-center justify-center text-[#2d5bff]">
                                                    <Box size={14} />
                                                </div>
                                                <span className="font-display font-black uppercase text-sm">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border w-fit text-[9px] font-black uppercase ${item.status === 'success'
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                    }`}>
                                                    {item.status || 'success'}
                                                </div>
                                                {item.reason && item.status !== 'success' && (
                                                    <span className="hidden text-[9px] font-mono opacity-50 truncate max-w-[150px]" title={item.reason}>
                                                        {item.reason}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs opacity-60">
                                            <button
                                                onClick={() => onWalletClick?.(item.deployer)}
                                                className="hover:text-[#2d5bff] transition-colors"
                                            >
                                                {formatWallet(item.deployer)}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${item.network === 'mainnet' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                }`}>
                                                {item.network}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[10px] opacity-60">
                                            {item.date}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={item.txId
                                                    ? `https://explorer.hiro.so/txid/${item.txId.startsWith('0x') ? item.txId : `0x${item.txId}`}?chain=${item.network}`
                                                    : `https://explorer.hiro.so/txid/${item.deployer}.${item.name}?chain=${item.network}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 border border-transparent hover:border-black dark:hover:border-white transition-all opacity-20 hover:opacity-100 inline-block"
                                                title={item.txId ? "View Transaction on Hiro Explorer" : "View Contract on Hiro Explorer"}
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Pagination */}
                <div className="px-6 py-4 border-t-2 border-dashed border-gray-500/10 flex items-center justify-between">
                    <div className="font-mono text-[10px] opacity-40 uppercase">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, stats.explorer.length)} of {stats.explorer.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-1 px-3 border-2 border-black/10 dark:border-white/10 font-mono text-[10px] uppercase font-bold disabled:opacity-20 hover:bg-[#2d5bff] hover:text-white transition-all"
                        >
                            PREV
                        </button>
                        <div className="flex gap-1">
                            {[...Array(Math.ceil(stats.explorer.length / itemsPerPage))].map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`w-6 h-6 border-2 font-mono text-[10px] flex items-center justify-center transition-all ${currentPage === idx + 1
                                        ? 'bg-[#2d5bff] border-[#2d5bff] text-white'
                                        : 'border-black/10 dark:border-white/10 hover:border-[#2d5bff]/50'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage >= Math.ceil(stats.explorer.length / itemsPerPage)}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-1 px-3 border-2 border-black/10 dark:border-white/10 font-mono text-[10px] uppercase font-bold disabled:opacity-20 hover:bg-[#2d5bff] hover:text-white transition-all"
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Marquee Decor */}
            <div className="border-y-2 border-[#2d5bff] py-4 bg-[#2d5bff]/5 overflow-hidden -mx-6">
                <div className="whitespace-nowrap flex gap-12 animate-[marquee_40s_linear_infinite]">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-12 items-center">
                            <span className="font-display font-bold text-xl uppercase opacity-20 italic">Network Uptime: 99.999%</span>
                            <span className="text-[#2d5bff] font-black">•</span>
                            <span className="font-display font-bold text-xl uppercase opacity-20 italic">Total TVL Scraped: 1.4B STX</span>
                            <span className="text-[#2d5bff] font-black">•</span>
                            <span className="font-display font-bold text-xl uppercase opacity-20 italic">Validated Blocks: 842,109</span>
                            <span className="text-[#2d5bff] font-black">•</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; trend: number | string; icon: any; isDark: boolean }> = ({ title, value, trend, icon, isDark }) => {
    const isPositive = typeof trend === 'number' ? trend > 0 : !trend.startsWith('-') && trend !== '0' && trend !== '0%';
    const isNegative = typeof trend === 'number' ? trend < 0 : trend.startsWith('-');
    const hasTrend = trend !== 0 && trend !== '0' && trend !== '0%' && trend !== 0.0;

    return (
        <div className={`p-6 border-2 shadow-neo transition-all hover:-translate-y-1 group ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-black'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#2d5bff]/10 border border-[#2d5bff]/20 text-[#2d5bff] flex items-center justify-center transition-all group-hover:bg-[#2d5bff] group-hover:text-white">
                    {icon}
                </div>
                {hasTrend && (
                    <div className={`flex items-center gap-0.5 text-[10px] font-black font-mono uppercase ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {isPositive ? '+' : ''}{trend}{typeof trend === 'number' ? '%' : ''}
                    </div>
                )}
            </div>
            <h4 className="font-mono text-[10px] uppercase opacity-50 tracking-widest">{title}</h4>
            <div className="text-3xl font-display font-black mt-1 leading-none">{value}</div>
        </div>
    );
};

