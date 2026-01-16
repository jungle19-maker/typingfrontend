import { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const StatCard = ({ title, value, subtext, icon, color }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:translate-y-[-2px] transition-transform">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
                <div className="text-3xl font-bold mt-1 text-white">{value}</div>
            </div>
            <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
                {icon}
            </div>
        </div>
        {subtext && <div className="text-xs text-gray-400 flex items-center gap-1">
            {subtext}
        </div>}
    </div>
);

const Report = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('all'); // 'all' for now, filtering logic can be added later

    // Real Data States
    const [stats, setStats] = useState({ wpm: 0, acc: 0, games: 0, mistakes: 0 });
    const [trendData, setTrendData] = useState([]);
    const [modeData, setModeData] = useState([]);
    const [recentHistory, setRecentHistory] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const processData = useCallback((data) => {
        if (!data || data.length === 0) return;

        // 1. Global Stats
        const totalWpm = data.reduce((acc, curr) => acc + curr.wpm, 0);
        const totalAcc = data.reduce((acc, curr) => acc + curr.accuracy, 0);
        const totalMistakes = data.reduce((acc, curr) => acc + (curr.mistakeCount || 0), 0);

        setStats({
            wpm: Math.round(totalWpm / data.length),
            acc: Math.round(totalAcc / data.length),
            games: data.length,
            mistakes: totalMistakes
        });

        setRecentHistory(data.slice(0, 10)); // Top 10 recent

        // 2. Trend Data (Group by Date)
        const groupedByDate = data.reduce((acc, curr) => {
            const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = { date: dateStr, wpmSum: 0, accSum: 0, count: 0 };
            acc[dateStr].wpmSum += curr.wpm;
            acc[dateStr].accSum += curr.accuracy;
            acc[dateStr].count += 1;
            return acc;
        }, {});

        const trends = Object.values(groupedByDate).map(item => ({
            date: item.date,
            wpm: Math.round(item.wpmSum / item.count),
            acc: Math.round(item.accSum / item.count)
        })).reverse();

        setTrendData(trends.slice(-7)); // Last 7 days/sessions

        // 3. Mode Data
        const groupedByMode = data.reduce((acc, curr) => {
            const mode = curr.gameType || 'Unknown';
            if (!acc[mode]) acc[mode] = { name: mode, wpmSum: 0, accSum: 0, count: 0 };
            acc[mode].wpmSum += curr.wpm;
            acc[mode].accSum += curr.accuracy;
            acc[mode].count += 1;
            return acc;
        }, {});

        setModeData(Object.values(groupedByMode).map(item => ({
            name: item.name,
            wpm: Math.round(item.wpmSum / item.count),
            acc: Math.round(item.accSum / item.count),
            plays: item.count
        })));
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/results/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            processData(res.data);
            setIsLoadingData(false);
        } catch (err) {
            console.error("Error fetching report data:", err);
            setIsLoadingData(false);
        }
    }, [processData]);

    useEffect(() => {
        if (!loading && !user) navigate('/login');
        if (user) fetchData();
    }, [user, loading, navigate, fetchData]);

    if (isLoadingData) {
        return <div className="min-h-screen flex items-center justify-center text-primary">Loading Report...</div>;
    }

    return (
        <div className="app-container p-6 md:p-10 max-w-7xl mx-auto space-y-8">

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white">Typing <span className="text-primary">Report</span></h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.username || 'Guest'}. Here is your progress.</p>
                </div>
                {/* Time Range Selector (Visual Only for now as logic processes all data initially) */}
                <div className="flex bg-black/30 p-1 rounded-lg border border-white/5">
                    {['All Time'].map((range) => (
                        <button
                            key={range}
                            className={`px-4 py-2 text-sm font-medium rounded-md bg-primary text-black shadow-lg shadow-primary/20`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </header>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Average Speed"
                    value={`${stats.wpm} WPM`}
                    subtext="Keep practicing to improve!"
                    color="cyan"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                />
                <StatCard
                    title="Average Accuracy"
                    value={`${stats.acc}%`}
                    subtext="Consistency is key."
                    color="emerald"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    title="Games Played"
                    value={stats.games}
                    subtext="Total sessions completed."
                    color="purple"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    title="Total Mistakes"
                    value={stats.mistakes}
                    subtext="Errors made across all games."
                    color="orange"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                />
            </div>

            {/* MAIN CHART SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* WPM Trend Chart */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">Performance Trend (Recent)</h3>
                    {trendData.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="date" stroke="#888899" tick={{ fill: '#888899' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#888899" tick={{ fill: '#888899' }} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#131318', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="wpm" stroke="#00f2ea" strokeWidth={3} dot={{ r: 4, fill: '#00f2ea' }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="acc" stroke="#ff0055" strokeWidth={3} dot={{ r: 4, fill: '#ff0055' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            Play more games to see trends!
                        </div>
                    )}
                </div>

                {/* Suggestion / Tip Card (Simplified Weakness Analysis) */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Coach's Analysis</h3>
                        <p className="text-gray-400 mb-6">
                            {stats.acc > 95
                                ? "Great accuracy! Work on increasing your speed by practicing bursts."
                                : "Focus on accuracy first. Speed will follow naturally once your muscle memory is solid."}
                        </p>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Consistency</div>
                                <div className={`text-xl font-bold ${stats.acc > 90 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                    {stats.acc > 90 ? 'High' : 'Needs Improvement'}
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Est. Words Typed</div>
                                <div className="text-xl font-bold text-white">
                                    ~{stats.games * 20 /* Rough estimate */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => navigate('/practice')} className="w-full mt-6 py-4 bg-primary text-black font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all">
                        Start Practice Session
                    </button>
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Mode Performance */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">Mode Performance</h3>
                    {modeData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-white/10">
                                        <th className="pb-3 font-medium">Mode</th>
                                        <th className="pb-3 font-medium">Avg WPM</th>
                                        <th className="pb-3 font-medium">Accuracy</th>
                                        <th className="pb-3 font-medium">Sessions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {modeData.map((mode, idx) => (
                                        <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 text-white font-medium capitalize">{mode.name}</td>
                                            <td className="py-4 text-primary font-bold">{mode.wpm}</td>
                                            <td className="py-4 text-gray-300">
                                                {mode.acc}%
                                            </td>
                                            <td className="py-4 text-gray-400">{mode.plays}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-gray-500 py-10 text-center">No mode data available.</div>
                    )}
                </div>

                {/* Session History */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
                    </div>
                    {recentHistory.length > 0 ? (
                        <div className="space-y-3">
                            {recentHistory.map((game, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-black/20 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">📝</div>
                                        <div>
                                            <div className="text-white font-medium capitalize">{game.gameType}</div>
                                            <div className="text-xs text-gray-500">{new Date(game.date).toLocaleDateString()} • {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">{game.wpm} WPM</div>
                                        <div className={`text-xs ${game.accuracy >= 90 ? 'text-emerald-400' : 'text-yellow-400'}`}>{game.accuracy}% Acc</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 py-10 text-center">No recent games found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Report;
