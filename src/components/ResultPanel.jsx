import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResultPanel = ({ stats, rank, maxCombo, onRetry }) => {
    const navigate = useNavigate();

    // Rank Colors
    const rankColors = {
        'Bronze': '#cd7f32',
        'Silver': '#c0c0c0',
        'Gold': '#ffd700',
        'Platinum': '#e5e4e2',
        'Diamond': '#b9f2ff'
    };

    const rankColor = rankColors[rank] || '#fff';

    return (
        <div style={{
            background: 'rgba(23, 23, 28, 0.95)',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(0,0,0,0.5)',
            maxWidth: '500px',
            margin: '0 auto',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <h2 style={{ color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '1rem' }}>Session Complete</h2>

            {/* Rank Badget */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    display: 'inline-block',
                    background: `linear-gradient(45deg, ${rankColor}20, transparent)`,
                    border: `2px solid ${rankColor}`,
                    padding: '1rem 3rem',
                    borderRadius: '50px',
                    boxShadow: `0 0 30px ${rankColor}40`
                }}>
                    <h1 style={{ margin: 0, color: rankColor, fontSize: '3rem', textShadow: `0 0 20px ${rankColor}` }}>{rank}</h1>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{stats.wpm}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginTop: '5px' }}>WPM</div>
                </div>
                <div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{stats.accuracy}%</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginTop: '5px' }}>Accuracy</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{maxCombo}x</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Max Combo</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--error)' }}>{stats.mistakes}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Mistakes</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={onRetry}
                    className="btn btn-primary"
                    style={{
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        boxShadow: '0 10px 30px var(--primary-glow)'
                    }}
                >
                    Play Again
                </button>
                <button
                    onClick={() => navigate('/game')}
                    className="btn"
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'var(--text-muted)',
                        padding: '1rem 2rem'
                    }}
                >
                    Menu
                </button>
            </div>
        </div>
    );
};

export default ResultPanel;
