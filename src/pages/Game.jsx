
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameLogic } from '../hooks/useGameLogic';

const Game = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') || 'classic';
    const {
        words, inputValue, handleInput, time, isPlaying, isGameOver,
        stats, lives, aiProgress, startGame, resetGame, currentWordIndex, config
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
                    {config.showTimer && (
                        <>Time: <span className="timer">{formatTime(time)}</span> | </>
                    )}
                    WPM: <span>{stats.wpm}</span> |
                    Acc: <span>{stats.accuracy}%</span>
                    {(mode === 'survival' || config.type === 'survival') && (
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
                        <div className="word-display" style={{
                            maxHeight: '150px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: config.type === 'beginner' ? 'center' : 'flex-start'
                        }}>
                            {['sentence', 'intermediate', 'advanced', 'expert', 'elementary', 'classic'].includes(config.type) ? (
                                // Render stream of words
                                words.slice(currentWordIndex, currentWordIndex + 20).map((w, i) => (
                                    <span key={i} className={i === 0 ? 'current' : ''} style={{
                                        color: i === 0 ? 'var(--primary)' : 'var(--text-muted)',
                                        borderBottom: i === 0 ? '2px solid var(--primary)' : 'none',
                                        marginRight: '10px',
                                        fontSize: i === 0 ? '1.5rem' : '1.2rem',
                                        opacity: i === 0 ? 1 : 0.6
                                    }}>
                                        {w}
                                    </span>
                                ))
                            ) : (
                                // Beginner / Single word focus
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
                            <button onClick={() => navigate('/practice')} className="btn btn-secondary">Back to Practice</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;
