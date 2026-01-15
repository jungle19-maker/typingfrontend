import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameLogic } from '../hooks/useGameLogic';
import InstructionalUI from '../components/InstructionalUI';
import ResultPanel from '../components/ResultPanel';
import '../App.css'; // Ensure styles

const PracticeSession = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') || 'beginner';
    const {
        words, inputValue, handleInput, time, isPlaying, isGameOver,
        stats, startGame, resetGame, currentWordIndex, config
    } = useGameLogic(mode);

    // Auto-start for practice modes
    useEffect(() => {
        if (!isPlaying && !isGameOver) {
            startGame();
        }
    }, [isPlaying, isGameOver]);

    // Calculate progress through current word for highlighting
    const currentWord = words[currentWordIndex] || '';
    const nextCharIndex = inputValue.length;
    const nextChar = currentWord[nextCharIndex] || ' '; // Default to space if at end of word

    return (
        <div className="practice-container" style={{
            background: '#f8f9fa',
            minHeight: '100vh',
            color: '#333',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem'
        }}>
            {/* Header Removed - Exit Button Floating */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                <button onClick={() => navigate('/practice')} style={{ background: 'none', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '4px', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}>
                    ← Exit
                </button>
            </div>
            {/* Stats Summary Floating */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '0.9rem', color: '#666' }}>
                {config.showTimer && <span>{time}s</span>}
                {config.type === 'advanced' && <span style={{ marginLeft: '1rem' }}>{stats.wpm} WPM</span>}
            </div>

            {/* Main Content Area */}
            <main style={{ width: '100%', maxWidth: '800px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Result View */}
                {isGameOver ? (
                    <ResultPanel stats={stats} onRetry={() => { resetGame(); startGame(); }} />
                ) : (
                    <>
                        {/* Word Display Area - Dynamic Layouts */}
                        <div style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>

                            {/* Input - Hidden/Transparent overlay to capture focus */}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInput}
                                autoFocus
                                style={{
                                    opacity: 0,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'default'
                                }}
                            />

                            {/* Beginner: Single Large Word */}
                            {mode === 'beginner' && (
                                <div style={{ fontSize: '4rem', fontWeight: '500', letterSpacing: '2px', color: '#aaa' }}>
                                    {currentWord.split('').map((char, idx) => {
                                        let color = '#ccc';
                                        if (idx < inputValue.length) {
                                            color = inputValue[idx] === char ? '#2ecc71' : '#e74c3c';
                                        } else if (idx === inputValue.length) {
                                            color = '#333'; // Highlight current char
                                        }
                                        return <span key={idx} style={{ color, borderBottom: idx === inputValue.length ? '3px solid #3498db' : 'none' }}>{char}</span>;
                                    })}
                                </div>
                            )}

                            {/* Elementary: Horizontal Line Focus */}
                            {mode === 'elementary' && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '2rem',
                                    fontSize: '2rem',
                                    color: '#bbb',
                                    justifyContent: 'center',
                                    alignItems: 'baseline'
                                }}>
                                    {/* Show previous, current, next words context */}
                                    {words.slice(Math.max(0, currentWordIndex - 1), currentWordIndex + 3).map((w, i) => {
                                        const actualIndex = Math.max(0, currentWordIndex - 1) + i;
                                        const isCurrent = actualIndex === currentWordIndex;
                                        return (
                                            <div key={actualIndex} style={{
                                                color: isCurrent ? '#333' : '#eee',
                                                fontWeight: isCurrent ? 'bold' : 'normal',
                                                transform: isCurrent ? 'scale(1.1)' : 'none',
                                                transition: 'all 0.3s'
                                            }}>
                                                {isCurrent ? (
                                                    /* Detailed char rendering for current word */
                                                    w.split('').map((char, idx) => {
                                                        let color = '#333';
                                                        if (idx < inputValue.length) {
                                                            color = inputValue[idx] === char ? '#2ecc71' : '#e74c3c';
                                                        }
                                                        return <span key={idx} style={{ color, borderBottom: (idx === inputValue.length && isCurrent) ? '2px solid #3498db' : 'none' }}>{char}</span>
                                                    })
                                                ) : w}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Intermediate/Advanced: Stream */}
                            {['intermediate', 'advanced', 'expert'].includes(mode) && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    width: '100%',
                                    maxWidth: '700px',
                                    fontSize: '1.5rem',
                                    lineHeight: '3rem',
                                    color: '#bbb',
                                    textAlign: 'left',
                                    background: '#fff',
                                    padding: '2rem',
                                    borderRadius: '10px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                                }}>
                                    {words.slice(currentWordIndex, currentWordIndex + 15).map((w, i) => {
                                        const isCurrent = i === 0;
                                        return (
                                            <span key={i} style={{ marginRight: '15px', color: isCurrent ? '#333' : '#ddd', position: 'relative' }}>
                                                {isCurrent ? (
                                                    w.split('').map((char, idx) => {
                                                        let color = '#333';
                                                        if (idx < inputValue.length) {
                                                            color = inputValue[idx] === char ? '#2ecc71' : '#e74c3c';
                                                        }
                                                        return <span key={idx} style={{ color, borderBottom: idx === inputValue.length ? '2px solid #3498db' : 'none' }}>{char}</span>
                                                    })
                                                ) : w}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Instructional Guide - Positioned below input */}
                        <div style={{ marginTop: 'auto', width: '100%' }}>
                            <InstructionalUI activeChar={nextChar} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default PracticeSession;
