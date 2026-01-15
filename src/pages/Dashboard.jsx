import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ games: 0, wpm: 0, acc: 0 });

    useEffect(() => {
        if (!loading && !user) navigate('/login');
        if (user) fetchHistory();
    }, [user, loading, navigate]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/results/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
            calculateStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const calculateStats = (data) => {
        if (data.length === 0) return;
        const totalWpm = data.reduce((acc, cur) => acc + cur.wpm, 0);
        const totalAcc = data.reduce((acc, cur) => acc + cur.accuracy, 0);
        setStats({
            games: data.length,
            wpm: Math.round(totalWpm / data.length),
            acc: Math.round(totalAcc / data.length)
        });
    };

    const startGame = (mode) => navigate(`/game?mode=${mode}`);

    return (
        <div className="dashboard-container">
            <div className="welcome-section">
                <h1>Welcome back, <span className="highlight" style={{ color: 'var(--primary)' }}>{user?.username}</span>!</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Games Played</h3>
                    <div className="stat-value">{stats.games}</div>
                </div>
                <div className="stat-card">
                    <h3>Avg Speed</h3>
                    <div className="stat-value">{stats.wpm} WPM</div>
                </div>
                <div className="stat-card">
                    <h3>Avg Accuracy</h3>
                    <div className="stat-value">{stats.acc}%</div>
                </div>
            </div>

            <h2>Select Game Mode</h2>
            <div className="game-modes-grid">
                {['classic', 'word-rain', 'sentence', 'survival', 'race'].map(mode => (
                    <div key={mode} className="game-mode-card" onClick={() => startGame(mode)}>
                        <h3 style={{ textTransform: 'capitalize' }}>{mode.replace('-', ' ')}</h3>
                        <p>Play now</p>
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: '3rem' }}>Recent History</h2>
            <div style={{ marginTop: '1rem' }}>
                {history.length === 0 ? <p>No games played yet.</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Mode</th>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>WPM</th>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Acc</th>
                                <th style={{ textAlign: 'left', padding: '1rem' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.slice(0, 10).map(game => (
                                <tr key={game._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{game.gameType}</td>
                                    <td style={{ padding: '1rem', color: 'var(--primary)' }}>{game.wpm}</td>
                                    <td style={{ padding: '1rem' }}>{game.accuracy}%</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(game.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
