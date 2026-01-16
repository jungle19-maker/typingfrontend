import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

// --- MOCK DATA FOR UI DEMONSTRATION ---
const MOCK_TREND_DATA = [
    { date: 'Mon', wpm: 45, acc: 92 },
    { date: 'Tue', wpm: 48, acc: 94 },
    { date: 'Wed', wpm: 47, acc: 93 },
    { date: 'Thu', wpm: 52, acc: 95 },
    { date: 'Fri', wpm: 55, acc: 96 },
    { date: 'Sat', wpm: 58, acc: 94 },
    { date: 'Sun', wpm: 60, acc: 97 },
];

const MOCK_MODE_DATA = [
    { name: 'Classic', wpm: 62, acc: 96, plays: 45 },
    { name: 'Word Rain', wpm: 55, acc: 92, plays: 23 },
    { name: 'Sentence', wpm: 48, acc: 94, plays: 12 },
    { name: 'Survival', wpm: 50, acc: 90, plays: 8 },
];

const MOCK_WEAKNESS_DATA = [
    { char: 'z', errorRate: 15 },
    { char: 'q', errorRate: 12 },
    { char: 'x', errorRate: 8 },
    { char: 'p', errorRate: 6 },
    { char: 'b', errorRate: 5 },
];

const Report = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('weekly');

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    // Stats Generators
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
            {subtext && <div className="text-xs text-green-400 flex items-center gap-1">
                <span>↑</span> {subtext}
            </div>}
        </div>
    );

    return (
        <div className="app-container p-6 md:p-10 max-w-7xl mx-auto space-y-8">

            {/* HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white">Typing <span className="text-primary">Report</span></h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.username || 'Guest'}. Here is your progress.</p>
                </div>
                <div className="flex bg-black/30 p-1 rounded-lg border border-white/5">
                    {['Today', 'Weekly', 'Monthly', 'All Time'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range.toLowerCase())}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeRange === range.toLowerCase()
                                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:text-white'
                                }`}
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
                    value="58 WPM"
                    subtext="12% vs last week"
                    color="cyan"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                />
                <StatCard
                    title="Accuracy"
                    value="96%"
                    subtext="Top 5% of users"
                    color="emerald"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    title="Practice Time"
                    value="4h 12m"
                    subtext="Keep it up!"
                    color="purple"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    title="Total Words"
                    value="12,450"
                    subtext="+500 today"
                    color="orange"
                    icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                />
            </div>

            {/* MAIN CHART SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* WPM Trend Chart */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">Performance Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_TREND_DATA}>
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
                </div>

                {/* Weakness Analysis */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">Trouble Keys</h3>
                    <div className="space-y-4">
                        {MOCK_WEAKNESS_DATA.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white font-mono text-lg bg-white/10 w-8 h-8 flex items-center justify-center rounded uppercase">{item.char}</span>
                                    <span className="text-red-400 font-medium">{item.errorRate}% Errors</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className="bg-red-500 h-2 rounded-full"
                                        style={{ width: `${item.errorRate * 5}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20">
                        <h4 className="text-primary font-bold mb-1">Coach Tip</h4>
                        <p className="text-sm text-gray-300">You seem to struggle with bottom-row keys. Try the "Bottom Row" practice module.</p>
                        <button onClick={() => navigate('/practice')} className="mt-3 text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors">Start Practice →</button>
                    </div>
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Mode Performance */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">Mode Performance</h3>
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
                                {MOCK_MODE_DATA.map((mode, idx) => (
                                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-white font-medium">{mode.name}</td>
                                        <td className="py-4 text-primary font-bold">{mode.wpm}</td>
                                        <td className="py-4 text-gray-300">
                                            <div className="w-16 bg-white/10 rounded-full h-1.5 inline-block mr-2 align-middle">
                                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${mode.acc}%` }}></div>
                                            </div>
                                            {mode.acc}%
                                        </td>
                                        <td className="py-4 text-gray-400">{mode.plays}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Session History */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
                        <button className="text-sm text-primary hover:text-white transition-colors">View All</button>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-black/20 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">📝</div>
                                    <div>
                                        <div className="text-white font-medium">Sentence Practice</div>
                                        <div className="text-xs text-gray-500">Today, 2:30 PM</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-bold">64 WPM</div>
                                    <div className="text-xs text-emerald-400">98% Acc</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => navigate('/practice')} className="flex-1 py-4 bg-primary text-black font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all">
                    Start New Practice
                </button>
                <div className="flex-1 flex gap-4">
                    <button className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                        Download PDF
                    </button>
                    <button className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                        Share Stats
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Report;
