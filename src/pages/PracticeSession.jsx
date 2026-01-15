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
        lives, aiProgress, combo, maxCombo, rank, isLoading
    } = useGameLogic(mode, difficulty);

    // Auto-start
    useEffect(() => {
        if (!isPlaying && !isGameOver && !isLoading) {
            startGame();
        }
    }, [isPlaying, isGameOver, isLoading]);

    const currentWord = words[currentWordIndex] || '';
    const nextCharIndex = inputValue.length;
    const nextChar = currentWord[nextCharIndex] || ' ';

    if (isLoading) {
        return (
            <div className="practice-container premium-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>Fetching Content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="practice-container premium-layout">
            {/* Background Effects */}
            <div className="bg-glow-orb top-left"></div>
            <div className="bg-glow-orb bottom-right"></div>

            {/* Premium HUD */}
            <header className="game-hud">
                <div className="hud-left">
                    <button onClick={() => navigate('/practice')} className="btn-icon back-btn">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="mode-badge">
                        <span className="dot"></span>
                        {config.type.replace('practice-', '').replace('-', ' ').toUpperCase()}
                    </div>
                </div>

                <div className="hud-center">
                    {config.showTimer && (
                        <div className={`timer-display ${time < 10 ? 'danger' : ''}`}>
                            {time}
                        </div>
                    )}
                </div>

                <div className="hud-right">
                    <div className="stat-unit">
                        <span className="label">WPM</span>
                        <span className="value">{stats.wpm}</span>
                    </div>
                    <div className="stat-separator"></div>
                    <div className="stat-unit">
                        <span className="label">Combo</span>
                        <span className="value highlight-combo">{combo}x</span>
                    </div>
                    {mode === 'survival' && (
                        <>
                            <div className="stat-separator"></div>
                            <div className="stat-unit">
                                <span className="label">Lives</span>
                                <span className="value danger">{lives}</span>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Main Arena */}
            <main className="game-arena">
                {isGameOver ? (
                    <ResultPanel stats={stats} rank={rank} maxCombo={maxCombo} onRetry={() => { resetGame(); }} />
                ) : (
                    <>
                        {/* Race Mode Track */}
                        {mode === 'race' && (
                            <div className="race-track-premium">
                                <div className="track-lane">
                                    <div className="racer-avatar user" style={{ left: `${(currentWordIndex / words.length) * 100}%` }}>
                                        YOU
                                    </div>
                                    <div className="progress-line user" style={{ width: `${(currentWordIndex / words.length) * 100}%` }}></div>
                                </div>
                                <div className="track-lane">
                                    <div className="racer-avatar cpu" style={{ left: `${aiProgress}%` }}>
                                        CPU
                                    </div>
                                    <div className="progress-line cpu" style={{ width: `${aiProgress}%` }}></div>
                                </div>
                            </div>
                        )}

                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInput}
                            autoFocus
                            className="hidden-input"
                            onBlur={(e) => e.target.focus()} // Keep focus
                        />

                        {/* Typing Area */}
                        <div className="typing-display-wrapper">
                            {mode === 'word-rain' ? (
                                <div className="word-rain-view placeholder">
                                    <h3>Constructing Atmosphere...</h3>
                                    <p>(Rain Mode Visualization Coming Soon)</p>
                                </div>
                            ) : (
                                <div className="word-stream-premium">
                                    {/* Focus on current word with context */}
                                    <div className="words-track">
                                        {words.slice(Math.max(0, currentWordIndex - 2), currentWordIndex + 10).map((w, i) => {
                                            const realIndex = Math.max(0, currentWordIndex - 2) + i;
                                            const isCurrent = realIndex === currentWordIndex;
                                            const isPast = realIndex < currentWordIndex;

                                            return (
                                                <div key={realIndex} className={`word-unit ${isCurrent ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                                                    {isCurrent ? (
                                                        w.split('').map((char, idx) => {
                                                            let status = 'pending';
                                                            if (idx < inputValue.length) {
                                                                status = inputValue[idx] === char ? 'correct' : 'incorrect';
                                                            } else if (idx === inputValue.length) {
                                                                status = 'caret';
                                                            }
                                                            return <span key={idx} className={`char ${status}`}>{char}</span>
                                                        })
                                                    ) : (
                                                        w
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Keyboard */}
                        <div className="keyboard-footer-wrapper">
                            <InstructionalUI activeChar={nextChar} />
                        </div>
                    </>
                )}
            </main>
        </div>
        
    );
};

export default PracticeSession;
