import React, { memo } from 'react';
import '../App.css'; // Ensure styles are available

const TypingArea = memo(({ mode, words, currentWordIndex, inputValue, fallingWords, scrollPos }) => {

    // Memoized sub-renders could be here if needed, but the whole component is memoized
    // which serves the main purpose of isolating it from Timer updates in parent.

    return (
        <div className="typing-display-wrapper">
            {mode === 'word-rain' ? (
                <div className="word-rain-view">
                    {fallingWords.map(w => (
                        <div
                            key={w.id}
                            className="falling-word"
                            style={{ left: `${w.x}%`, top: `${w.y}%` }}
                        >
                            <span className="rain-text matched">{w.typed}</span>
                            <span className="rain-text remaining">{w.text.slice(w.typed.length)}</span>
                        </div>
                    ))}
                    <div className="danger-zone-line"></div>
                </div>
            ) : mode === 'sentence' ? (
                <div className="ticker-container">
                    <div className="ticker-track" style={{ left: '100%', transform: `translateX(-${scrollPos}px)` }}>
                        <div className="ticker-sentence">
                            {(words[currentWordIndex] || '').split('').map((char, idx) => {
                                let status = 'pending';
                                if (idx < inputValue.length) {
                                    status = inputValue[idx] === char ? 'correct' : 'incorrect';
                                } else if (idx === inputValue.length) {
                                    status = 'caret-block';
                                }
                                return <span key={idx} className={`char ${status}`}>{char}</span>
                            })}
                        </div>
                    </div>
                    <div className="ticker-fade-left"></div>
                    <div className="ticker-fade-right"></div>
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
    );
});

export default TypingArea;
