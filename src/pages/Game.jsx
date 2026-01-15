import React from 'react';
import { useNavigate } from 'react-router-dom';

const GAME_MODES = [
    {
        id: 'classic',
        title: 'Classic',
        description: 'Standard typing practice. Focus on accuracy and speed.',
        color: 'linear-gradient(135deg, #00f2ea 0%, #00c6be 100%)',
        levels: ['beginner', 'intermediate', 'advanced']
    },
    {
        id: 'word-rain',
        title: 'Word Rain',
        description: 'Type falling words before they hit the bottom!',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        levels: ['beginner', 'intermediate', 'advanced']
    },
    {
        id: 'sentence',
        title: 'Sentence',
        description: 'Practice with full sentences and punctuation.',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        levels: ['beginner', 'intermediate', 'advanced']
    },
    {
        id: 'survival',
        title: 'Survival',
        description: 'Don\'t make mistakes! Lives are limited.',
        color: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
        levels: ['beginner', 'intermediate', 'advanced']
    },
    {
        id: 'race',
        title: 'Race',
        description: 'Compete against an AI opponent to the finish line.',
        color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        levels: ['beginner', 'intermediate', 'advanced']
    }
];

const Game = () => {
    const navigate = useNavigate();

    const handlePlayValue = (modeId, level) => {
        navigate(`/practice-session?mode=${modeId}&difficulty=${level}`);
    };

    return (
        <div className="dashboard-container">
            <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
                <h1 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '3rem', fontWeight: 800 }}>Game Modes</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Select a game mode to test your speed and accuracy.
                </p>
            </div>

            <div className="game-modes-grid">
                {GAME_MODES.map(mode => (
                    <div key={mode.id} className="game-mode-card" style={{
                        background: 'var(--bg-card)',
                        borderRadius: '20px',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '280px',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: mode.color
                        }} />

                        <div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{mode.title}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>{mode.description}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                            {mode.levels.map(level => (
                                <button
                                    key={level}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayValue(mode.id, level);
                                    }}
                                    className="btn"
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        fontSize: '0.8rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'var(--text-muted)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        textTransform: 'capitalize',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = mode.color;
                                        e.target.style.color = '#000';
                                        e.target.style.border = '1px solid transparent';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.05)';
                                        e.target.style.color = 'var(--text-muted)';
                                        e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Game;
