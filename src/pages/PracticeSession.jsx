import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameLogic } from '../hooks/useGameLogic';
import InstructionalUI from '../components/InstructionalUI';
import ResultPanel from '../components/ResultPanel';
import '../App.css';

const PracticeSession = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') || 'classic';
    const difficulty = searchParams.get('difficulty') || 'beginner';

    const {
        words, inputValue, handleInput, time, isPlaying, isGameOver,
        stats, startGame, resetGame, currentWordIndex, config,
        lives, aiProgress
    } = useGameLogic(mode, difficulty);

    // Auto-start
    useEffect(() => {
        if (!isPlaying && !isGameOver) {
            startGame();
        }
    }, [isPlaying, isGameOver]);

    const currentWord = words[currentWordIndex] || '';
    const nextCharIndex = inputValue.length;
    const nextChar = currentWord[nextCharIndex] || ' ';

    return (
        <div className="practice-container">
            {/* Header */}
            <div className="session-header">
                <button onClick={() => navigate('/practice')} className="btn-icon">
                    ← Exit
                </button>
                <div className="session-info">
                    <h2 style={{ textTransform: 'capitalize' }}>{mode} · {difficulty}</h2>
                </div>
                <div className="session-stats">
                    {config.showTimer && <span className="stat-pill">{time}s</span>}
                    <span className="stat-pill">{stats.wpm} WPM</span>
                    {mode === 'survival' && <span className="stat-pill lives">Lives: {lives}</span>}
                </div>
            </div>

            {/* Main Content */}
            <main className="session-main">
                {isGameOver ? (
                    <ResultPanel stats={stats} onRetry={() => { resetGame(); startGame(); }} />
                ) : (
                    <>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInput}
                            autoFocus
                            className="hidden-input"
                        />

                        {/* Race Mode UI */}
                        {mode === 'race' && (
                            <div className="race-track">
                                <div className="racer" style={{ width: `${(currentWordIndex / words.length) * 100}%`, background: 'var(--primary)' }}>
                                    You 🚗
                                </div>
                                <div className="racer opponent" style={{ width: `${aiProgress}%`, background: 'var(--secondary)' }}>
                                    CPU 🏎️
                                </div>
                            </div>
                        )}

                        {/* Word Rain UI (Simplified as scrolling list for now, or could vary) */}
                        {mode === 'word-rain' ? (
                            <div className="word-rain-view">
                                {/* Future: Canvas implementation. Current: Vertical Stack */}
                                <div style={{ textAlign: 'center', fontSize: '2rem' }}>
                                    Coming Soon: Rain Animation
                                </div>
                            </div>
                        ) : (
                            /* Standard / Sentence View */
                            <div className="typing-area">
                                {mode === 'sentence' ? (
                                    <div className="sentence-view">
                                        {words.join(' ').split('').map((char, idx) => {
                                            // Mapping whole sentence logic is complex with word-based hook.
                                            // Fallback to word-by-word for now for 'sentence' too in this hook version.
                                            return <span key={idx}>{char}</span>
                                        })}
                                        {/* Actually, the hook is word-based. Let's stick to word display. */}
                                    </div>
                                ) : null}

                                {/* Focused Word Display (Universal) */}
                                <div className="word-stream">
                                    {words.slice(currentWordIndex, currentWordIndex + 15).map((w, i) => {
                                        const isCurrent = i === 0;
                                        return (
                                            <span key={i} className={`word ${isCurrent ? 'active' : ''}`}>
                                                {isCurrent ? (
                                                    w.split('').map((char, idx) => {
                                                        let color = 'var(--text-muted)';
                                                        if (idx < inputValue.length) {
                                                            color = inputValue[idx] === char ? 'var(--success)' : 'var(--error)';
                                                        } else if (idx === inputValue.length) {
                                                            color = 'var(--primary)'; // Cursor char
                                                        }
                                                        return <span key={idx} style={{ color }}>{char}</span>
                                                    })
                                                ) : w}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="instructional-footer">
                            <InstructionalUI activeChar={nextChar} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PracticeSession;
