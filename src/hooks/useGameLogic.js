import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { fetchWords, fetchCapitals, fetchParagraphs } from '../services/typingService';
import { BEGINNER_WORDS, ELEMENTARY_WORDS, INTERMEDIATE_WORDS, ADVANCED_WORDS, EXPERT_WORDS } from '../utils/wordLists';

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
    const [isLoading, setIsLoading] = useState(true);

    // New State for Premium Features
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [rank, setRank] = useState(null); // 'Bronze', 'Silver', etc.

    // Config based on mode with defaults
    const config = useRef({
        timeLimit: 60,
        type: 'classic',
        wordList: [],
        allowErrors: false,
        showTimer: true,
        penalty: false,
    });

    const timerRef = useRef(null);

    // Setup configuration based on mode
    const setupConfig = (mode, diff) => {
        const difficulty = diff || 'beginner';
        const isBeginner = difficulty === 'beginner';
        const isAdvanced = difficulty === 'advanced';

        const baseConfig = {
            timeLimit: isBeginner ? 0 : 60,
            allowErrors: isBeginner,
            showTimer: !isBeginner,
        };

        switch (mode) {
            case 'practice-2-letter':
                return {
                    ...baseConfig,
                    type: 'practice-2-letter',
                    timeLimit: 0,
                    showTimer: true
                };
            case 'practice-3-letter':
                return {
                    ...baseConfig,
                    type: 'practice-3-letter',
                    timeLimit: 0,
                    showTimer: true
                };
            case 'practice-capital':
                return {
                    ...baseConfig,
                    type: 'practice-capital',
                    timeLimit: 0,
                    showTimer: true
                };
            case 'practice-paragraph':
                return {
                    ...baseConfig,
                    type: 'practice-paragraph',
                    timeLimit: 0,
                    showTimer: true
                };
            case 'word-rain':
                return {
                    ...baseConfig,
                    type: 'word-rain',
                    // Fallback wordlist if needed strictly for fallback, but we should aim to fetch
                    wordList: isBeginner ? BEGINNER_WORDS : (isAdvanced ? EXPERT_WORDS : INTERMEDIATE_WORDS),
                    fallSpeed: isBeginner ? 1 : (isAdvanced ? 3 : 2)
                };
            case 'sentence':
                return {
                    ...baseConfig,
                    type: 'sentence',
                    timeLimit: 0,
                    showTimer: true
                };
            case 'survival':
                return {
                    ...baseConfig,
                    type: 'survival',
                    wordList: BEGINNER_WORDS, // Simplified for now
                    lives: isBeginner ? 10 : 3,
                    penalty: true
                };
            case 'race':
                return {
                    ...baseConfig,
                    type: 'race',
                    wordList: BEGINNER_WORDS,
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

    const loadContent = async () => {
        setIsLoading(true);
        try {
            let data = [];
            const type = config.current.type;

            if (type === 'practice-2-letter') {
                data = await fetchWords(2);
            } else if (type === 'practice-3-letter') {
                data = await fetchWords(3);
            } else if (type === 'practice-capital') {
                data = await fetchCapitals(difficulty);
            } else if (type === 'practice-paragraph') {
                const paragraphs = await fetchParagraphs(difficulty);
                // Paragraphs need to be split into words for the engine, or handled as a single block
                // Engine expects array of words. Let's send the first paragraph split by spaces.
                if (paragraphs && paragraphs.length > 0) {
                    data = paragraphs[0].text.split(' ');
                }
            } else {
                // Fallback for other modes not explicitly backend-driven yet or mixed
                // For now, if wordList is empty in config, we might want to fetch general words
                if (config.current.wordList && config.current.wordList.length === 0) {
                    // data = await fetchWords(4); // Default length? No, rely on fallback lists if any
                } else if (config.current.wordList) {
                    data = getRandomWords(50, config.current.wordList);
                }
            }

            if (!data || data.length === 0) {
                // Emergency fallback
                data = ['loading', 'failed', 'please', 'retry'];
            }

            setWords(data);

        } catch (error) {
            console.error("Failed to fetch content", error);
            setWords(['error', 'fetching', 'data']);
        } finally {
            setIsLoading(false);
        }
    };

    const getRandomWords = (count, sourceList) => {
        if (!sourceList || sourceList.length === 0) return ['no', 'words'];
        let res = [];
        for (let i = 0; i < count; i++) {
            res.push(sourceList[Math.floor(Math.random() * sourceList.length)]);
        }
        return res;
    };

    const resetGame = useCallback(async () => {
        setIsPlaying(false);
        setIsGameOver(false);
        setInputValue('');
        setCurrentWordIndex(0);
        setStats({ wpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, totalChars: 0, missedKeys: {} });
        setCombo(0);
        setMaxCombo(0);
        setRank(null);
        setLives(config.current.type === 'survival' ? (config.current.lives || 3) : 3);
        setAiProgress(0);

        setTime(config.current.timeLimit || 0);
        if (timerRef.current) clearInterval(timerRef.current);

        await loadContent();

    }, []);

    useEffect(() => {
        config.current = setupConfig(gameMode, difficulty);
        resetGame();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameMode, difficulty]);

    const startGame = () => {
        if (isLoading) return;
        setIsPlaying(true);

        timerRef.current = setInterval(() => {
            setTime(prev => {
                if (config.current.timeLimit > 0) {
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

    const calculateRank = (wpm) => {
        if (wpm >= 90) return 'Diamond';
        if (wpm >= 70) return 'Platinum';
        if (wpm >= 50) return 'Gold';
        if (wpm >= 30) return 'Silver';
        return 'Bronze';
    };

    const endGame = useCallback(async () => {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setIsGameOver(true);
    }, []);

    const handleInput = (e) => {
        if (!isPlaying || isLoading) return;
        const val = e.target.value;
        const prevVal = inputValue;
        const isDelete = val.length < prevVal.length;
        setInputValue(val);

        const currentTarget = words[currentWordIndex];
        if (!currentTarget) return; // Guard

        // Combo Logic:
        if (!isDelete && val.length > prevVal.length) {
            // Check prefix
            if (currentTarget.startsWith(val.trim())) {
                setCombo(prev => {
                    const next = prev + 1;
                    if (next > maxCombo) setMaxCombo(next);
                    return next;
                });
            } else {
                setCombo(0);
            }
        }

        // Word Completion
        if (val.endsWith(' ') || (config.current.type === 'sentence' && val === currentTarget)) {
            const trimmedVal = val.trim();

            const advanceWord = () => {
                setCurrentWordIndex(prev => prev + 1);
                setInputValue('');

                if (currentWordIndex + 1 >= words.length) {
                    if (config.current.type === 'sentence' || config.current.type === 'race' || config.current.type === 'practice-paragraph') {
                        endGame();
                    } else {
                        // Resupply words if continuous mode
                        // For API modes, do we refetch? Or loop?
                        // Let's loop the content or just end it for practice modes
                        if (['practice-2-letter', 'practice-3-letter', 'practice-capital'].includes(config.current.type)) {
                            setWords(prev => [...prev, ...prev]); // Duplicate list or refetch? Duplicating is safer for keeping flow
                        } else {
                            // Classic behavior
                            endGame();
                        }
                    }
                }
            };

            if (trimmedVal === currentTarget) {
                // Correct Word
                setStats(prev => ({
                    ...prev,
                    correctChars: prev.correctChars + currentTarget.length + 1,
                    totalChars: prev.totalChars + currentTarget.length + 1
                }));
                // Combo Bonus
                setCombo(prev => prev + 5);
                advanceWord();

            } else {
                // Mistake
                setCombo(0);
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

                if (config.current.allowErrors) {
                    advanceWord();
                } else {
                    setInputValue(prev => prev.trim());
                }

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

    // Derived Stats
    const timeElapsed = config.current.timeLimit > 0 ? (config.current.timeLimit - time) : time;
    const wpm = Math.round((stats.correctChars / 5) / (Math.max(timeElapsed, 1) / 60) || 0);
    const accuracy = stats.totalChars > 0 ? Math.round((stats.correctChars / stats.totalChars) * 100) : 100;

    useEffect(() => {
        if (isGameOver) {
            setRank(calculateRank(wpm));
        }
    }, [isGameOver, wpm]);

    const saveResult = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
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
        combo,
        maxCombo,
        rank,
        lives,
        aiProgress,
        startGame,
        resetGame,
        currentWordIndex,
        config: config.current,
        isLoading
    };
};
