import React from 'react';
import { useNavigate } from 'react-router-dom';
import InstructionalUI from '../components/InstructionalUI';

const MODULES = [
    {
        id: 'beginner',
        title: 'Module 1: Beginner',
        description: 'Learn basic 2-3 letter words. No timer, stress-free.',
        color: '#4CAF50'
    },
    {
        id: 'elementary',
        title: 'Module 2: Elementary',
        description: 'Practice 3-5 letter words. Light feedback.',
        color: '#8BC34A'
    },
    {
        id: 'intermediate',
        title: 'Module 3: Intermediate',
        description: 'Medium words with soft timer. Improve rhythm.',
        color: '#FFC107'
    },
    {
        id: 'advanced',
        title: 'Module 4: Advanced',
        description: 'Long, complex words. Strict timer & WPM tracking.',
        color: '#FF9800'
    },
    {
        id: 'expert',
        title: 'Module 5: Expert',
        description: 'Mixed difficulty. Pro level accuracy required.',
        color: '#F44336'
    }
];

const Practice = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: '2.5rem' }}>Typing Curriculum</h1>
                <p style={{ color: '#7f8c8d', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Master touch typing through structured modules designed to build muscle memory and accuracy.
                </p>
            </div>

            {/* Learning Guide Section */}
            <section style={{ marginBottom: '4rem', background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#34495e', marginBottom: '1rem', textAlign: 'center' }}>Finger Placement Guide</h3>
                <InstructionalUI />
            </section>

            <h2 style={{ marginBottom: '2rem', color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem' }}>Modules</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {MODULES.map(module => (
                    <div key={module.id} className="module-card" style={{
                        background: '#fff',
                        padding: '1.5rem 2rem',
                        borderRadius: '8px',
                        borderLeft: `6px solid ${module.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }} onClick={() => navigate(`/practice-session?mode=${module.id}`)}>
                        <div>
                            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{module.title}</h3>
                            <p style={{ color: '#95a5a6', fontSize: '0.95rem', margin: 0 }}>{module.description}</p>
                        </div>
                        <button
                            className="btn"
                            style={{
                                background: 'transparent',
                                color: module.color,
                                border: `1px solid ${module.color}`,
                                padding: '8px 20px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Start
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Practice;
