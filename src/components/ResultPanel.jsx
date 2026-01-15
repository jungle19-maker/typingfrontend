import React from 'react';

// Maps fingers to their keys
const FINGERS = {
    'Left Pinky': ['q', 'a', 'z', '1'],
    'Left Ring': ['w', 's', 'x', '2'],
    'Left Middle': ['e', 'd', 'c', '3'],
    'Left Index': ['r', 'f', 'v', 't', 'g', '4', '5'],
    'Right Index': ['y', 'h', 'n', 'u', 'j', 'm', '6', '7'],
    'Right Middle': ['i', 'k', ',', '8'],
    'Right Ring': ['o', 'l', '.', '9'],
    'Right Pinky': ['p', ';', '/', '0', '-', '=', '[', ']', '\\', "'"]
};

const ResultPanel = ({ stats, onRetry }) => {
    // Analyze weak finger
    const getWeakFinger = () => {
        const fingerErrors = {};
        const missed = stats.missedKeys || {};

        Object.keys(missed).forEach(key => {
            const lowerKey = key.toLowerCase();
            let found = false;
            for (const [finger, keys] of Object.entries(FINGERS)) {
                if (keys.includes(lowerKey)) {
                    fingerErrors[finger] = (fingerErrors[finger] || 0) + missed[key];
                    found = true;
                    break;
                }
            }
            if (!found) {
                // Symbols might be tricky, default to generic if not mapped
                // or just ignore
            }
        });

        const sorted = Object.entries(fingerErrors).sort((a, b) => b[1] - a[1]);
        if (sorted.length > 0) {
            return `${sorted[0][0]} (${sorted[0][1]} mistakes)`;
        }
        return "None! Perfect typing.";
    };

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            maxWidth: '600px',
            margin: '0 auto',
            border: '1px solid #eee'
        }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '2rem', fontWeight: '600' }}>Session Results</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="stat-item">
                    <p style={{ color: '#7f8c8d', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>WPM</p>
                    <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#2ecc71' }}>{stats.wpm}</h3>
                </div>
                <div className="stat-item">
                    <p style={{ color: '#7f8c8d', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Accuracy</p>
                    <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#3498db' }}>{stats.accuracy}%</h3>
                </div>
                <div className="stat-item">
                    <p style={{ color: '#7f8c8d', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Correct Keys</p>
                    <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#555' }}>{stats.correctChars}</h3>
                </div>
                <div className="stat-item">
                    <p style={{ color: '#7f8c8d', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Mistakes</p>
                    <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#e74c3c' }}>{stats.mistakes}</h3>
                </div>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '2rem' }}>
                <p style={{ margin: 0, color: '#95a5a6', fontSize: '0.9rem' }}>Weakest Finger Analysis</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e67e22', marginTop: '0.5rem' }}>
                    {getWeakFinger()}
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                    onClick={onRetry}
                    className="btn"
                    style={{
                        background: '#34495e',
                        color: '#fff',
                        padding: '12px 30px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    Practice Again
                </button>
            </div>
        </div>
    );
};

export default ResultPanel;
