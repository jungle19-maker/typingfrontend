import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import InstructionalUI from '../components/InstructionalUI';

const MODULES = [
    {
        id: 'practice-2-letter',
        title: '1. Two-Letter Words',
        description: 'Master short words like "it", "at", "to" for rhythm.',
        color: '#00f2ea', // Cyan
        icon: 'ab',
        minPlan: 'free'
    },
    {
        id: 'practice-3-letter',
        title: '2. Three-Letter Words',
        description: 'Practice common trigrams like "the", "and", "for".',
        color: '#00c2ff', // Blue-Cyan
        icon: 'abc',
        minPlan: 'free'
    },
    {
        id: 'practice-capital',
        title: '3. Capital Letters',
        description: 'Train your Shift key timing and precision.',
        color: '#ff0055', // Pink
        icon: '⇧',
        minPlan: 'starter'
    },
    {
        id: 'practice-paragraph',
        title: '4. Paragraph Practice',
        description: 'Build endurance with real context and sentences.',
        color: '#00ff66', // Green
        icon: '¶',
        minPlan: 'pro'
    }
];

const Practice = () => {
    const navigate = useNavigate();
    const { user, hasFeature } = useContext(AuthContext);
    const { language } = useLanguage();

    const checkAccess = (module, difficulty) => {
        // Feature Mapping
        const featureMap = {
            'practice-2-letter': 'englishPractice',
            'practice-3-letter': 'englishPractice',
            'practice-capital': 'capitalLetterPractice',
            'practice-paragraph': 'englishPractice' // Paragraph is tricky, usually Pro?
        };

        // Specific overrides for the prompt's source of truth
        if (module.id === 'practice-capital') return hasFeature('capitalLetterPractice');
        if (module.id === 'practice-paragraph') {
            return language === 'hindi' ? hasFeature('hindiParagraphPractice') : hasFeature('sentenceTyping');
        }

        // Hindi logic
        if (language === 'hindi') {
            if (module.id.includes('letter')) return hasFeature('hindiWordPractice');
            if (module.id.includes('paragraph')) return hasFeature('hindiParagraphPractice');
        }

        return hasFeature('englishPractice');
    };

    const handleStart = (moduleId, diff) => {
        const module = MODULES.find(m => m.id === moduleId);
        if (checkAccess(module, diff)) {
            navigate(`/practice-session?mode=${moduleId}&difficulty=${diff}`);
        } else {
            // Show lock / upgrade prompt
            if (confirm("This feature requires an upgrade. Go to pricing?")) {
                navigate('/pricing');
            }
        }
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
                    {language === 'hindi' ? 'अभ्यास' : 'Structured'} <span style={{ color: 'var(--primary)' }}>{language === 'hindi' ? 'Modules' : 'Practice'}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    {language === 'hindi' ? 'अपनी हिंदी टाइपिंग क्षमता बढ़ाएं।' : 'Follow the modules in order to build a solid foundation.'}
                </p>
                {language === 'hindi' && (
                    <div className="mt-4 p-2 bg-yellow-500/10 text-yellow-500 rounded inline-block">
                        Note: Use your system's Hindi Keyboard (Mac/Windows) to type.
                    </div>
                )}
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
                            {['basic', 'intermediate', 'advanced'].map(diff => {
                                const locked = !checkAccess(module, diff);
                                return (
                                    <button
                                        key={diff}
                                        onClick={() => handleStart(module.id, diff)}
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            border: `1px solid ${locked ? '#444' : module.color}`,
                                            color: locked ? '#666' : (diff === 'advanced' ? '#000' : module.color),
                                            background: diff === 'advanced' && !locked ? module.color : 'transparent',
                                            padding: '0.5rem',
                                            fontSize: '0.8rem',
                                            cursor: locked ? 'not-allowed' : 'pointer',
                                            opacity: locked ? 0.5 : 1
                                        }}
                                    >
                                        {locked && <span style={{ marginRight: '4px' }}>🔒</span>}
                                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hand Guide Preview */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '20px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Interactive Hand Guide</h3>
                <InstructionalUI activeChar="F" difficulty="beginner" language={language} />
            </div>
        </div>
    );
};

export default Practice;
