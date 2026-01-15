import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { BEGINNER_WORDS, ELEMENTARY_WORDS, INTERMEDIATE_WORDS, ADVANCED_WORDS, EXPERT_WORDS } from '../utils/wordLists';

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
    const [stats, setStats] = useState({ wpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, totalChars: 0, missedKeys: {} });
    const [lives, setLives] = useState(3);
    const [aiProgress, setAiProgress] = useState(0);

    // Config based on mode with defaults
    const config = useRef({
        timeLimit: 60,
        type: 'classic',
        wordList: WORD_BANK,
        allowErrors: false, // if false, can't proceed until corrected (strict) vs leniency
        showTimer: true,
        penalty: false,
    });

    const timerRef = useRef(null);

    // Setup configuration based on gameMode
    const setupConfig = (mode) => {
        switch (mode) {
            case 'beginner':
                return { timeLimit: 0, type: 'beginner', wordList: BEGINNER_WORDS, allowErrors: true, showTimer: false, penalty: false };
            case 'elementary':
                return { timeLimit: 0, type: 'elementary', wordList: ELEMENTARY_WORDS, allowErrors: true, showTimer: false, penalty: false };
            case 'intermediate':
                return { timeLimit: 60, type: 'intermediate', wordList: INTERMEDIATE_WORDS, allowErrors: true, showTimer: true, penalty: false };
            case 'advanced':
                return { timeLimit: 60, type: 'advanced', wordList: ADVANCED_WORDS, allowErrors: true, showTimer: true, penalty: false };
            case 'expert':
                return { timeLimit: 0, type: 'expert', wordList: EXPERT_WORDS, allowErrors: true, showTimer: true, penalty: false };
            case 'survival':
                return { timeLimit: 0, type: 'survival', wordList: WORD_BANK, allowErrors: false, showTimer: true, penalty: true };
            case 'sentence':
                return { timeLimit: 0, type: 'sentence', wordList: [], allowErrors: false, showTimer: true, penalty: false };
            case 'race':
                return { timeLimit: 0, type: 'race', wordList: WORD_BANK, allowErrors: true, showTimer: true, penalty: false };
            default: // classic
                return { timeLimit: 60, type: 'classic', wordList: WORD_BANK, allowErrors: true, showTimer: true, penalty: false };
        }
    };

    useEffect(() => {
        config.current = setupConfig(gameMode);
        resetGame();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameMode]);

    const getRandomWords = (count, sourceList = WORD_BANK) => {
        let res = [];
        for (let i = 0; i < count; i++) {
            res.push(sourceList[Math.floor(Math.random() * sourceList.length)]);
        }
        return res;
    };

    const resetGame = useCallback(() => {
        setIsPlaying(false);
        setIsGameOver(false);
        setInputValue('');
        setCurrentWordIndex(0);
        setStats({ wpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, totalChars: 0, missedKeys: {} });
        setLives(config.current.type === 'survival' ? 5 : 3);
        setAiProgress(0);

        if (config.current.type === 'sentence') {
            setWords(SENTENCES[Math.floor(Math.random() * SENTENCES.length)].split(' '));
        } else {
            setWords(getRandomWords(50, config.current.wordList));
        }

        setTime(config.current.timeLimit || 0);
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    const startGame = () => {
        resetGame();
        setIsPlaying(true);

        timerRef.current = setInterval(() => {
            setTime(prev => {
                if (config.current.timeLimit > 0) {
                    // Countdown
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                } else {
                    // Countup
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

        // Save Result (skip for now or implement logic for modules)
        const token = localStorage.getItem('token');
        if (token && ['classic', 'survival', 'race', 'sentence'].includes(config.current.type)) { // Only save for main games for now
            // ... save logic ...
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

            const advanceWord = () => {
                setCurrentWordIndex(prev => prev + 1);
                setInputValue('');

                // Word Refill Logic
                if (currentWordIndex + 1 >= words.length) {
                    if (config.current.type === 'sentence' || config.current.type === 'race') {
                        endGame();
                    } else {
                        setWords(prev => [...prev, ...getRandomWords(10, config.current.wordList)]);
                    }
                }
            };

            if (trimmedVal === currentTarget) {
                // Correct
                setStats(prev => ({
                    ...prev,
                    correctChars: prev.correctChars + currentTarget.length + 1, // +space
                    totalChars: prev.totalChars + currentTarget.length + 1
                }));
                advanceWord();

            } else {
                // Mistake logic
                const targetChar = currentTarget[inputValue.length] || ' ';
                setStats(prev => ({
                    ...prev,
                    mistakes: prev.mistakes + 1, // Count 1 mistake for the word submission error
                    totalChars: prev.totalChars + trimmedVal.length + 1,
                    missedKeys: {
                        ...prev.missedKeys,
                        [targetChar]: (prev.missedKeys?.[targetChar] || 0) + 1
                    }
                }));

                // If allowErrors is TRUE, we mark mistake and move on
                if (config.current.allowErrors) {
                    advanceWord();
                } else {
                    // Strict Mode: Block the Space input
                    // Remove the trailing space so user feels "blocked" at the end of the word
                    setInputValue(prev => prev.trim());
                    // Optionally visual feedback could be triggered here
                }

                // Survival Check
                if (config.current.type === 'survival') {
                    setLives(prev => {
                        if (prev <= 1) endGame();
                        return prev - 1;
                    });
                }
            }
        }
    };

    // Derived Stats for Display
    // Avoid division by zero
    const timeElapsed = config.current.timeLimit > 0 ? (config.current.timeLimit - time) : time;
    const wpm = Math.round((stats.correctChars / 5) / (Math.max(timeElapsed, 1) / 60) || 0);
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
        currentWordIndex,
        config: config.current // Export config for UI adjustments
    };
};
