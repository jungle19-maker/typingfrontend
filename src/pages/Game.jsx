import React from 'react';
import { useNavigate } from 'react-router-dom';

const GAME_MODES = [
    {
        id: 'classic',
        title: 'Classic',
        description: 'Standard typing practice. Focus on accuracy and speed.',
        color: '#00f2ea',
        levels: ['basic', 'intermediate', 'advanced']
    },
    {
        id: 'word-rain',
        title: 'Word Rain',
        description: 'Type falling words before they hit the bottom!',
        color: '#4facfe',
        levels: ['basic', 'intermediate', 'advanced']
    },
    {
        id: 'sentence',
        title: 'Sentence',
        description: 'Practice with full sentences and punctuation.',
        color: '#43e97b',
        levels: ['basic', 'intermediate', 'advanced']
    },
    {
        id: 'survival',
        title: 'Survival',
        description: 'Don\'t make mistakes! Lives are limited.',
        color: '#ff0844',
        levels: ['basic', 'intermediate', 'advanced']
    },
    {
        id: 'race',
        title: 'Race',
        description: 'Compete against an AI opponent to the finish line.',
        color: '#fa709a',
        levels: ['basic', 'intermediate', 'advanced']
    }
];

const Game = () => {
    const navigate = useNavigate();

    const handlePlayValue = (modeId, level) => {
        navigate(`/practice-session?mode=${modeId}&difficulty=${level}`);
    };

    return (
        <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    top: '0rem',
                    left: '0',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                title="Back to Home"
                
            >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }}>
                    Game <span style={{ color: 'var(--primary)' }}>Modes</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Select a game mode to test your speed and accuracy.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {GAME_MODES.map(mode => (
                    <div key={mode.id} className="module-card" style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s'
                    }}>
                        <div style={{
                            height: '6px',
                            width: '40px',
                            background: mode.color,
                            borderRadius: '3px',
                            marginBottom: '1.5rem'
                        }} />

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>{mode.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', minHeight: '3rem' }}>{mode.description}</p>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
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
                                        fontSize: '0.85rem',
                                        background: 'transparent',
                                        color: mode.color,
                                        border: `1px solid ${mode.color}`,
                                        borderRadius: '8px',
                                        textTransform: 'capitalize',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        opacity: 0.8,
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = mode.color;
                                        e.target.style.color = '#000';
                                        e.target.style.opacity = '1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = mode.color;
                                        e.target.style.opacity = '0.8';
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
