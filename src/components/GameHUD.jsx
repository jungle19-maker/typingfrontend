import React, { memo } from 'react';

const GameHUD = memo(({ mode, config, time, stats, combo, lives, onBack }) => {
    return (
        <header className="game-hud">
            <div className="hud-left">
                <button onClick={onBack} className="btn-icon back-btn">
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
    );
});

export default GameHUD;
