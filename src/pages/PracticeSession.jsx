import React, { useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGameLogic } from '../hooks/useGameLogic';
import { useLanguage } from '../context/LanguageContext';
import InstructionalUI from '../components/InstructionalUI';
import ResultPanel from '../components/ResultPanel';
import GameHUD from '../components/GameHUD';
import TypingArea from '../components/TypingArea';
import '../App.css';

const PracticeSession = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { hasFeature, loading: authLoading } = useAuth(); // Get auth context

    const mode = searchParams.get('mode') || 'classic';
    const difficulty = searchParams.get('difficulty') || 'beginner';

    // Access Control Logic
    useEffect(() => {
        if (authLoading) return;

        // Define required features for modes
        const requiredFeatures = {
            'survival': 'survivalGameMode',
            'race': 'typingRaceMode',
            'rain': 'wordRainMode',
            'sentence': 'sentenceTyping'
        };

        // Check specific Hindi modes if needed, simplified for now
        if (language === 'hindi' && mode === 'paragraph' && !hasFeature('hindiParagraphPractice')) {
            navigate('/pricing?reason=upgrade_required');
            return;
        }

        const feature = requiredFeatures[mode];
        if (feature && !hasFeature(feature)) {
            navigate('/pricing?reason=upgrade_required');
        }
    }, [mode, language, hasFeature, navigate, authLoading]);

    const {
        words, inputValue, handleInput, time, isPlaying, isGameOver,
        stats, startGame, resetGame, currentWordIndex, config,
        lives, aiProgress, combo, maxCombo, rank, isLoading, fallingWords, scrollPos
    } = useGameLogic(mode, difficulty, language);

    // Auto-start
    useEffect(() => {
        if (!isPlaying && !isGameOver && !isLoading) {
            startGame();
        }
    }, [isPlaying, isGameOver, isLoading, startGame]);

    const inputRef = React.useRef(null);

    const handleContainerClick = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    const handleBack = useCallback(() => {
        if (mode.startsWith('practice-')) {
            navigate('/practice');
        } else {
            navigate('/game');
        }
    }, [mode, navigate]);

    if (isLoading) {
        return (
            <div className="practice-container premium-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <p className="mt-4 text-primary animate-pulse">Initializing System...</p>
                </div>
            </div>
        );
    }

    const nextCharIndex = inputValue.length;
    const currentWord = words[currentWordIndex] || '';
    const nextChar = currentWord[nextCharIndex] || ' ';

    return (
        <div className="practice-container premium-layout" onClick={handleContainerClick}>
            {/* Background Effects */}
            <div className="bg-glow-orb top-left"></div>
            <div className="bg-glow-orb bottom-right"></div>

            {/* Premium HUD - Memoized */}
            <GameHUD
                mode={mode}
                config={config}
                time={time}
                stats={stats}
                combo={combo}
                lives={lives}
                onBack={handleBack}
            />

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
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInput}
                            autoFocus
                            className="hidden-input"
                            onBlur={(e) => { e.target.focus(); }} // Aggressive focus keep
                        />

                        <TypingArea
                            mode={mode}
                            words={words}
                            currentWordIndex={currentWordIndex}
                            inputValue={inputValue}
                            fallingWords={fallingWords}
                            scrollPos={scrollPos}
                        />

                        {/* Keyboard - Memoized */}
                        {mode !== 'sentence' && (
                            <div className="keyboard-footer-wrapper">
                                <InstructionalUI activeChar={nextChar} difficulty={difficulty} language={language} />
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default PracticeSession;
