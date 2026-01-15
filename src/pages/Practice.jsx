import React from 'react';
import { useNavigate } from 'react-router-dom';
import InstructionalUI from '../components/InstructionalUI';

const MODULES = [
    {
        id: 'practice-2-letter',
        title: '1. Two-Letter Words',
        description: 'Master short words like "it", "at", "to" for rhythm.',
        color: '#00f2ea', // Cyan
        icon: 'ab'
    },
    {
        id: 'practice-3-letter',
        title: '2. Three-Letter Words',
        description: 'Practice common trigrams like "the", "and", "for".',
        color: '#00c2ff', // Blue-Cyan
        icon: 'abc'
    },
    {
        id: 'practice-capital',
        title: '3. Capital Letters',
        description: 'Train your Shift key timing and precision.',
        color: '#ff0055', // Pink
        icon: '⇧'
    },
    {
        id: 'practice-paragraph',
        title: '4. Paragraph Practice',
        description: 'Build endurance with real context and sentences.',
        color: '#00ff66', // Green
        icon: '¶'
    }
];

const Practice = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    top: '0rem', /* Adjusted to align better with heading or top left */
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
                    Structured <span style={{ color: 'var(--primary)' }}>Practice</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Follow the modules in order to build a solid foundation.
                </p>
            </div>

            {/* Modules Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {MODULES.map(module => (
                    <div key={module.id} className="module-card" style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '1rem',
                            background: `linear-gradient(135deg, ${module.color} 20%, transparent)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            {module.icon}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{module.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', height: '3rem' }}>{module.description}</p>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate(`/practice-session?mode=${module.id}&difficulty=basic`)}
                                className="btn"
                                style={{ flex: 1, border: `1px solid ${module.color}`, color: module.color, background: 'transparent', padding: '0.5rem', fontSize: '0.9rem' }}
                            >
                                Basic
                            </button>
                            <button
                                onClick={() => navigate(`/practice-session?mode=${module.id}&difficulty=intermediate`)}
                                className="btn"
                                style={{ flex: 1, border: `1px solid ${module.color}`, color: module.color, background: 'transparent', padding: '0.5rem', fontSize: '0.9rem' }}
                            >
                                Intermediate
                            </button>
                            <button
                                onClick={() => navigate(`/practice-session?mode=${module.id}&difficulty=advanced`)}
                                className="btn"
                                style={{ flex: 1, background: module.color, color: '#000', fontWeight: 'bold', padding: '0.5rem', fontSize: '0.9rem' }}
                            >
                                Advanced
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hand Guide Preview */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '20px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Interactive Hand Guide</h3>
                <InstructionalUI activeChar="F" difficulty="beginner" />
            </div>
        </div>
    );
};

export default Practice;
