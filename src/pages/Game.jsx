import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameLogic } from '../hooks/useGameLogic';

const Game = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') || 'classic';
    const {
        words, inputValue, handleInput, time, isPlaying, isGameOver,
        stats, lives, aiProgress, startGame, resetGame, currentWordIndex
    } = useGameLogic(mode);

    // Format time mm:ss
    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Calculate player progress for Race
    const playerProgress = (currentWordIndex / words.length) * 100;

    return (
        <div className="game-container">
            <div className="game-header">
                <span style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>
                    {mode.replace('-', ' ')}
                </span>
                <div id="gameStatsDisplay">
                    Time: <span className="timer">{formatTime(time)}</span> |
                    WPM: <span>{stats.wpm}</span> |
                    Acc: <span>{stats.accuracy}%</span>
                    {mode === 'survival' && (
                        <span style={{ marginLeft: '10px' }}>| Lives: <span style={{ color: 'var(--error)' }}>{lives}</span></span>
                    )}
                </div>
            </div>

            {mode === 'race' && (
                <div style={{ width: '100%', marginBottom: '1rem', background: '#333', height: '10px', borderRadius: '5px', position: 'relative' }}>
                    <div style={{ height: '100%', background: 'var(--primary)', width: `${playerProgress}%`, borderRadius: '5px', transition: 'width 0.2s' }}></div>
                    <div style={{ height: '100%', background: 'var(--error)', width: `${aiProgress}%`, borderRadius: '5px', opacity: 0.7, position: 'absolute', top: 0, left: 0, transition: 'width 0.2s' }}></div>
                </div>
            )}

            <div className="game-area">
                {!isPlaying && !isGameOver && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Ready?</h2>
                        <button onClick={startGame} className="btn btn-primary">Start Game</button>
                    </div>
                )}

                {isPlaying && (
                    <>
                        <div className="word-display">
                            {mode === 'sentence' ? (
                                words.map((w, i) => (
                                    <span key={i} className={
                                        i === currentWordIndex ? 'current' :
                                            i < currentWordIndex ? 'correct' : ''
                                    } style={{
                                        color: i === currentWordIndex ? 'var(--primary)' :
                                            i < currentWordIndex ? 'var(--text-muted)' : 'inherit',
                                        borderBottom: i === currentWordIndex ? '2px solid var(--primary)' : 'none',
                                        marginRight: '5px'
                                    }}>
                                        {w}{' '}
                                    </span>
                                ))
                            ) : (
                                // For other modes just show current word big
                                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{words[currentWordIndex]}</span>
                            )}
                        </div>

                        <input
                            type="text"
                            className="game-input"
                            value={inputValue}
                            onChange={handleInput}
                            ref={input => input && input.focus()}
                            placeholder="Type here..."
                            style={{ marginTop: '2rem' }}
                        />
                    </>
                )}

                {isGameOver && (
                    <div className="auth-box" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--primary)' }}>Game Over!</h2>
                        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
                            You typed at <b>{stats.wpm} WPM</b> with <b>{stats.accuracy}%</b> accuracy.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => { resetGame(); startGame(); }} className="btn btn-primary">Play Again</button>
                            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Dashboard</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
