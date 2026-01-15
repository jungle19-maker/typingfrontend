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

export const useGameLogic = (gameMode, difficulty = 'beginner') => {
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
        allowErrors: false,
        showTimer: true,
        penalty: false,
    });

    const timerRef = useRef(null);

    // Setup configuration based on gameMode and difficulty
    const setupConfig = (mode, diff) => {
        const difficulty = diff || 'beginner';
        const isBeginner = difficulty === 'beginner';
        const isAdvanced = difficulty === 'advanced';

        const baseConfig = {
            timeLimit: isBeginner ? 0 : 60,
            allowErrors: isBeginner, // Beginner allows errors, advanced blocks or penalizes
            showTimer: !isBeginner,
        };

        switch (mode) {
            case 'word-rain':
                return {
                    ...baseConfig,
                    type: 'word-rain',
                    wordList: isBeginner ? BEGINNER_WORDS : (isAdvanced ? EXPERT_WORDS : INTERMEDIATE_WORDS),
                    fallSpeed: isBeginner ? 1 : (isAdvanced ? 3 : 2) // Added for UI
                };
            case 'sentence':
                return {
                    ...baseConfig,
                    type: 'sentence',
                    wordList: [],
                    timeLimit: 0, // Sentences usually measured by completion time
                    showTimer: true
                };
            case 'survival':
                return {
                    ...baseConfig,
                    type: 'survival',
                    wordList: WORD_BANK,
                    lives: isBeginner ? 10 : 3,
                    penalty: true
                };
            case 'race':
                return {
                    ...baseConfig,
                    type: 'race',
                    wordList: WORD_BANK,
                    aiSpeed: isBeginner ? 2 : (isAdvanced ? 8 : 5)
                };
            case 'classic':
            default:
                return {
                    ...baseConfig,
                    type: 'classic',
                    wordList: isBeginner ? BEGINNER_WORDS : (isAdvanced ? ADVANCED_WORDS : INTERMEDIATE_WORDS)
                };
        }
    };

    useEffect(() => {
        config.current = setupConfig(gameMode, difficulty);
        resetGame();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameMode, difficulty]);

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
        setLives(config.current.type === 'survival' ? (config.current.lives || 3) : 3);
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
                    const speedFactor = config.current.aiSpeed || 3;
                    const next = prev + (Math.random() * (speedFactor / 2) + (speedFactor / 4));
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
        if (token && ['classic', 'survival', 'race', 'sentence'].includes(config.current.type)) {
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
                    mistakes: prev.mistakes + 1,
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
                    setInputValue(prev => prev.trim());
                }

                // Survival Check
                if (config.current.type === 'survival') {
                    setLives(prev => {
                        const newLives = prev - 1;
                        if (newLives <= 0) endGame();
                        return newLives;
                    });
                }
            }
        }
    };

    // Derived Stats for Display
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
        config: config.current
    };
};
