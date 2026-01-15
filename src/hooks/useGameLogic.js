import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const WORD_BANK = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there",
    "their", "what", "about", "which", "when", "make", "like", "time", "just", "know", "take", "people", "year", "good", "some", "could",
    "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two",
    "how", "our", "work", "first", "well", "way", "even", "new", "want", "because"
];

const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz."
];

export const useGameLogic = (gameMode) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [words, setWords] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [time, setTime] = useState(0);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, totalChars: 0 });
    const [lives, setLives] = useState(3);
    const [aiProgress, setAiProgress] = useState(0);

    // Config based on mode
    const config = useRef({
        timeLimit: gameMode === 'classic' ? 60 : 0,
        type: gameMode || 'classic'
    });

    const timerRef = useRef(null);

    useEffect(() => {
        config.current = {
            timeLimit: gameMode === 'classic' ? 60 : 0,
            type: gameMode || 'classic'
        };
        resetGame();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameMode]);

    const getRandomWords = (count) => {
        let res = [];
        for (let i = 0; i < count; i++) {
            res.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
        }
        return res;
    };

    const resetGame = useCallback(() => {
        setIsPlaying(false);
        setIsGameOver(false);
        setInputValue('');
        setCurrentWordIndex(0);
        setStats({ wpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, totalChars: 0 });
        setLives(config.current.type === 'survival' ? 5 : 3);
        setAiProgress(0);

        if (config.current.type === 'sentence') {
            setWords(SENTENCES[Math.floor(Math.random() * SENTENCES.length)].split(' '));
        } else {
            setWords(getRandomWords(50));
        }

        setTime(config.current.timeLimit || 0);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    const startGame = () => {
        resetGame();
        setIsPlaying(true);

        timerRef.current = setInterval(() => {
            setTime(prev => {
                if (config.current.timeLimit) {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                } else {
                    return prev + 1;
                }
            });

            if (config.current.type === 'race') {
                setAiProgress(prev => {
                    const next = prev + (Math.random() * 5 + 2); // 2-7% per sec
                    if (next >= 100) {
                        endGame();
                        return 100;
                    }
                    return next;
                });
            }
        }, 1000);
    };

    const endGame = useCallback(async () => {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setIsGameOver(true);

        // Save Result
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Calculate final WPM/Acc just in case
                // NOTE: Use refs or passed vars if state isn't updated? 
                // We'll use current state. (Might be slightly stale if inside interval, but acceptable)
            } catch (err) {
                console.error(err);
            }
        }
    }, []);

    const handleInput = (e) => {
        if (!isPlaying) return;
        const val = e.target.value;
        setInputValue(val);

        const currentTarget = words[currentWordIndex];

        // Check Word Completion (Space or Exact match for last word)
        if (val.endsWith(' ') || (config.current.type === 'sentence' && val === currentTarget)) {
            const trimmedVal = val.trim();

            if (trimmedVal === currentTarget) {
                // Correct
                setStats(prev => ({
                    ...prev,
                    correctChars: prev.correctChars + currentTarget.length + 1, // +space
                    totalChars: prev.totalChars + currentTarget.length + 1
                }));
                setCurrentWordIndex(prev => prev + 1);
                setInputValue('');

                // Check Game Over / Level Up
                if (currentWordIndex + 1 >= words.length) {
                    if (config.current.type === 'sentence' || config.current.type === 'race') {
                        endGame();
                    } else {
                        setWords(prev => [...prev, ...getRandomWords(10)]);
                    }
                }

            } else {
                // Mistake
                setStats(prev => ({
                    ...prev,
                    mistakes: prev.mistakes + 1,
                    totalChars: prev.totalChars + trimmedVal.length + 1
                }));
                // Survival Mode
                if (config.current.type === 'survival') {
                    setLives(prev => {
                        if (prev <= 1) endGame();
                        return prev - 1;
                    });
                }
            }
        }

        // Calculate WPM/Accuracy realtime
        // Time elapsed?
        // Simple calc:
        // WPM = (correctChars / 5) / (minutes elapsed)
    };

    // Derived Stats for Display
    const wpm = Math.round((stats.correctChars / 5) / (config.current.timeLimit ? (60 - time) / 60 : Math.max(time, 1) / 60) || 0);
    const accuracy = stats.totalChars > 0 ? Math.round((stats.correctChars / stats.totalChars) * 100) : 100;

    const saveResult = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/results`, {
                gameType: config.current.type,
                wpm: wpm === Infinity ? 0 : wpm,
                accuracy,
                mistakeCount: stats.mistakes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isGameOver) {
            saveResult();
        }
    }, [isGameOver]);

    return {
        words,
        inputValue,
        handleInput,
        time,
        isPlaying,
        isGameOver,
        stats: { ...stats, wpm, accuracy },
        lives,
        aiProgress,
        startGame,
        resetGame,
        currentWordIndex
    };
};
