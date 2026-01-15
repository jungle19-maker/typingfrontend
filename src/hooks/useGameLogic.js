import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { fetchWords, fetchCapitals, fetchParagraphs } from '../services/typingService';
import { BEGINNER_WORDS, ELEMENTARY_WORDS, INTERMEDIATE_WORDS, ADVANCED_WORDS, EXPERT_WORDS } from '../utils/wordLists';

export const useGameLogic = (gameMode, difficulty = 'beginner') => {
    // --- Common State ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [words, setWords] = useState([]); // Used as "queue" for classic, or "pool" for rain
    const [inputValue, setInputValue] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Classic pointer
    const [time, setTime] = useState(0);
    const [stats, setStats] = useState({ wpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, totalChars: 0, missedKeys: {} });
    const [lives, setLives] = useState(3);
    const [aiProgress, setAiProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [rank, setRank] = useState(null);

    // --- Word Rain State ---
    const [fallingWords, setFallingWords] = useState([]); // { id, text, x, y, speed, typed }
    const [activeWordId, setActiveWordId] = useState(null); // The word currently being typed

    // Refs
    const config = useRef({
        timeLimit: 60,
        type: 'classic',
        wordList: [],
        allowErrors: false,
        showTimer: true,
        penalty: false,
        spawnRate: 2000,
        fallSpeedBase: 1
    });

    const timerRef = useRef(null);
    const rainLoopRef = useRef(null);
    const lastSpawnTime = useRef(0);
    const wordIdCounter = useRef(0);

    // Loop State Refs (to avoid stale closures)
    const isPlayingRef = useRef(isPlaying);
    const isGameOverRef = useRef(isGameOver);
    const wordsRef = useRef(words);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
        isGameOverRef.current = isGameOver;
        wordsRef.current = words;
    }, [isPlaying, isGameOver, words]);

    // --- Setup Config ---
    const setupConfig = (mode, diff) => {
        const difficulty = diff || 'beginner';
        const isBeginner = difficulty === 'beginner' || difficulty === 'basic';
        const isIntermediate = difficulty === 'intermediate';
        const isAdvanced = difficulty === 'advanced';

        const baseConfig = {
            timeLimit: isBeginner ? 0 : 60,
            allowErrors: isBeginner,
            showTimer: mode !== 'word-rain', // Hide timer for rain, use lives/score focus
        };

        switch (mode) {
            case 'word-rain':
                return {
                    ...baseConfig,
                    type: 'word-rain',
                    timeLimit: 0, // Infinite/Survival style
                    showTimer: true,
                    spawnRate: isBeginner ? 2500 : (isAdvanced ? 1000 : 1800),
                    fallSpeedBase: isBeginner ? 0.3 : (isAdvanced ? 1.5 : 0.8), // % of height per tick
                    lives: isBeginner ? 10 : 5
                };
            case 'practice-2-letter':
                return { ...baseConfig, type: 'practice-2-letter', timeLimit: 0, showTimer: true };
            case 'practice-3-letter':
                return { ...baseConfig, type: 'practice-3-letter', timeLimit: 0, showTimer: true };
            case 'practice-capital':
                return { ...baseConfig, type: 'practice-capital', timeLimit: 0, showTimer: true };
            case 'practice-paragraph':
                return { ...baseConfig, type: 'practice-paragraph', timeLimit: 0, showTimer: true };
            case 'sentence':
                return { ...baseConfig, type: 'sentence', timeLimit: 0, showTimer: true };
            case 'survival':
                return { ...baseConfig, type: 'survival', lives: isBeginner ? 10 : 3, penalty: true };
            case 'race':
                return { ...baseConfig, type: 'race', aiSpeed: isBeginner ? 2 : (isAdvanced ? 8 : 5) };
            case 'classic':
            default:
                return { ...baseConfig, type: 'classic' };
        }
    };

    // --- Content Loading ---
    const loadContent = useCallback(async () => {
        setIsLoading(true);
        try {
            let data = [];
            const type = config.current.type;

            if (type === 'word-rain') {
                // Fetch pool based on difficulty
                data = await fetchWords(difficulty, 100); // Fetch 100 words
            } else if (type === 'practice-2-letter') {
                data = await fetchWords(2);
            } else if (type === 'practice-3-letter') {
                data = await fetchWords(3);
            } else if (type === 'practice-capital') {
                data = await fetchCapitals(difficulty);
            } else if (type === 'practice-paragraph') {
                const paragraphs = await fetchParagraphs(difficulty);
                if (paragraphs && paragraphs.length > 0) data = paragraphs[0].text.split(' ');
            } else {
                data = await fetchWords(difficulty);
            }

            if (!data || data.length === 0) data = ['loading', 'failed'];

            setWords(data); // For Rain, this is our "Pool"
        } catch (error) {
            console.error(error);
            setWords(['error']);
        } finally {
            setIsLoading(false);
        }
    }, [difficulty]); // Depend on difficulty

    // --- Game Reset ---
    const resetGame = useCallback(async () => {
        setIsPlaying(false);
        setIsGameOver(false);
        setInputValue('');
        setCurrentWordIndex(0);
        setStats({ wpm: 0, accuracy: 100, mistakes: 0, correctChars: 0, totalChars: 0, missedKeys: {} });
        setCombo(0);
        setMaxCombo(0);
        setRank(null);
        setLives(config.current.lives || 3);
        setAiProgress(0);

        // Rain Reset
        setFallingWords([]);
        setActiveWordId(null);
        wordIdCounter.current = 0;

        setTime(config.current.timeLimit || 0);

        if (timerRef.current) clearInterval(timerRef.current);
        if (rainLoopRef.current) cancelAnimationFrame(rainLoopRef.current);

        await loadContent();
    }, [loadContent]);

    // --- Input Handlers ---

    // 1. Classic Input Handler
    const handleClassicInput = (e) => {
        const val = e.target.value;
        const prevVal = inputValue;
        const isDelete = val.length < prevVal.length;
        setInputValue(val);

        const currentTarget = words[currentWordIndex];
        if (!currentTarget) return;

        // Combo & Stats logic same as before...
        if (!isDelete && val.length > prevVal.length) {
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

        if (val.endsWith(' ') || (config.current.type === 'sentence' && val === currentTarget)) {
            const trimmedVal = val.trim();
            if (trimmedVal === currentTarget) {
                setStats(prev => ({
                    ...prev,
                    correctChars: prev.correctChars + currentTarget.length + 1,
                    totalChars: prev.totalChars + currentTarget.length + 1
                }));
                setCurrentWordIndex(prev => prev + 1);
                setInputValue('');

                // End / Loop logic
                if (currentWordIndex + 1 >= words.length) {
                    if (['practice-2-letter', 'practice-3-letter', 'practice-capital'].includes(config.current.type)) {
                        setWords(prev => [...prev, ...prev]);
                    } else {
                        endGame();
                    }
                }
            } else {
                setCombo(0);
                setStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
                if (!config.current.allowErrors) setInputValue(prev => prev.trim());
            }
        }
    };

    // 2. Rain Input Handler
    const handleRainInput = (e) => {
        const char = e.target.value.slice(-1); // Get last char (assuming hidden input is cleared or we diff)
        // Actually, let's just clear input value after processing to keep it simple
        // Or maintain buffer. Let's maintain 'typed' string for active word.

        // Better: e.target.value contains the accumulated input for the current word if we locked it?
        // No, simplest is to read the key press directly, but React onChange gives us the new value.
        // Let's assume input is controlled and we append char.

        if (!char) return; // Backspace or empty

        // Find Target
        let targetId = activeWordId;

        if (targetId === null) {
            // Try to find a word starting with this char
            // Prioritize words closer to bottom (lowest Y aka highest Y value? CSS top: Y%)
            // Let's say top: 0% is top, 100% is bottom. Highest Y is most urgent.
            const candidates = fallingWords.filter(w => w.text.startsWith(char));
            if (candidates.length > 0) {
                // Pick the one furthest down (highest y)
                const best = candidates.reduce((prev, curr) => (prev.y > curr.y ? prev : curr));
                targetId = best.id;
                setActiveWordId(best.id);
            } else {
                // Mistake (no word starts with this)
                setStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
                setCombo(0);
                return;
            }
        }

        // We have a target (either existing or just found)
        const targetWord = fallingWords.find(w => w.id === targetId);

        if (!targetWord) {
            setActiveWordId(null); // Lost it (maybe fell off)
            return;
        }

        const nextCharInfo = targetWord.text[targetWord.typed.length];

        if (char === nextCharInfo) {
            // Correct
            const newTyped = targetWord.typed + char;

            if (newTyped === targetWord.text) {
                // Word Complete
                setFallingWords(prev => prev.filter(w => w.id !== targetId));
                setActiveWordId(null);
                setStats(prev => ({
                    ...prev,
                    correctChars: prev.correctChars + targetWord.text.length,
                    totalChars: prev.totalChars + targetWord.text.length
                }));
                setCombo(prev => prev + 1);
            } else {
                // Update progress
                setFallingWords(prev => prev.map(w => w.id === targetId ? { ...w, typed: newTyped } : w));
            }
        } else {
            // Wrong char for active word
            setStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
            setCombo(0);
            // Optional: Visual feedback on word?
        }
    };

    const handleInput = (e) => {
        if (!isPlaying || isLoading) return;
        if (config.current.type === 'word-rain') {
            // Input logic for rain
            // We need to differentiate whole value vs new char.
            // Since we reset input only on word finish?
            // Let's just pass the event and reset input manually if needed.
            // Actually, for rain, let's treat input as a stream of chars.
            // We need to detect the new char.
            const val = e.target.value;
            if (val.length < inputValue.length) {
                // Backspace? Ignore in rain usually.
                setInputValue(val);
                return;
            }
            const newChar = val.slice(inputValue.length);
            // Mock event for internal handler
            handleRainInput({ target: { value: newChar } });
            setInputValue(val); // Keep buffer so next char is detected correctly? 
            // Actually, clearing buffer is easier for locking logic.
            setInputValue(''); // Always clear for rain to process char by char
        } else {
            handleClassicInput(e);
        }
    };

    // --- Rain Engine Loop ---
    const updateRain = (timestamp) => {
        if (!isPlayingRef.current || isGameOverRef.current) return;

        // 1. Spawning
        if (timestamp - lastSpawnTime.current > config.current.spawnRate) {
            const currentWords = wordsRef.current;
            if (currentWords.length > 0) {
                const wordText = currentWords[Math.floor(Math.random() * currentWords.length)];
                const newWord = {
                    id: wordIdCounter.current++,
                    text: wordText,
                    x: Math.random() * 80 + 5, // 5% to 85% width
                    y: -10, // Start above
                    speed: config.current.fallSpeedBase * (Math.random() * 0.5 + 0.8), // Variance
                    typed: ''
                };
                setFallingWords(prev => [...prev, newWord]);
                lastSpawnTime.current = timestamp;
            }
        }

        // 2. Movement & Collision
        setFallingWords(prev => {
            const nextWords = [];
            let lifeLost = false;

            prev.forEach(w => {
                const nextY = w.y + w.speed;
                if (nextY > 95) { // Hit bottom
                    lifeLost = true;
                    // Reset active if this was it
                    if (activeWordId === w.id) setActiveWordId(null);
                } else {
                    nextWords.push({ ...w, y: nextY });
                }
            });

            if (lifeLost) {
                setLives(l => {
                    const newLives = l - 1;
                    if (newLives <= 0) endGame();
                    return newLives;
                });
                setCombo(0);
            }

            return nextWords;
        });

        rainLoopRef.current = requestAnimationFrame(updateRain);
    };

    // --- Init & Start ---
    useEffect(() => {
        config.current = setupConfig(gameMode, difficulty);
        resetGame();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (rainLoopRef.current) cancelAnimationFrame(rainLoopRef.current);
        };
    }, [gameMode, difficulty, resetGame]);

    const startGame = () => {
        if (isLoading) return;
        setIsPlaying(true);

        // Classic Timer
        timerRef.current = setInterval(() => {
            setTime(prev => {
                if (config.current.type === 'word-rain') return prev + 1; // Count up
                if (config.current.timeLimit > 0) {
                    if (prev <= 1) { endGame(); return 0; }
                    return prev - 1;
                }
                return prev + 1;
            });

            // Race Logic
            if (config.current.type === 'race') {
                setAiProgress(prev => {
                    const next = prev + (Math.random() * (config.current.aiSpeed || 3) / 10);
                    if (next >= 100) { endGame(); return 100; }
                    return next;
                });
            }
        }, 1000);

        // Rain Loop
        if (config.current.type === 'word-rain') {
            // Force immediate spawn
            lastSpawnTime.current = performance.now() - config.current.spawnRate;
            rainLoopRef.current = requestAnimationFrame(updateRain);
        }
    };

    const endGame = useCallback(() => {
        setIsPlaying(false);
        setIsGameOver(true);
        if (timerRef.current) clearInterval(timerRef.current);
        if (rainLoopRef.current) cancelAnimationFrame(rainLoopRef.current);
    }, []);

    // Save Results
    useEffect(() => {
        if (isGameOver) {
            setRank(calculateRank(stats.wpm));
            // Async save
            const save = async () => {
                const token = localStorage.getItem('token');
                if (!token) return;
                try {
                    // Calculate WPM for Rain: (chars / 5) / (minutes)
                    const wpm = Math.round((stats.correctChars / 5) / (Math.max(time, 1) / 60) || 0);
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/results`, {
                        gameType: config.current.type,
                        wpm,
                        accuracy: stats.totalChars > 0 ? Math.round((stats.correctChars / stats.totalChars) * 100) : 100,
                        mistakeCount: stats.mistakes
                    }, { headers: { Authorization: `Bearer ${token}` } });
                } catch (e) { console.error(e); }
            };
            save();
        }
    }, [isGameOver]);

    // Helpers
    const calculateRank = (wpm) => {
        if (wpm >= 90) return 'Diamond';
        if (wpm >= 70) return 'Platinum';
        if (wpm >= 50) return 'Gold';
        if (wpm >= 30) return 'Silver';
        return 'Bronze';
    };

    return {
        words,
        fallingWords, // New export
        inputValue,
        handleInput,
        time,
        isPlaying,
        isGameOver,
        stats: {
            ...stats,
            wpm: Math.round((stats.correctChars / 5) / (Math.max(time, 1) / 60) || 0),
            accuracy: stats.totalChars > 0 ? Math.round((stats.correctChars / stats.totalChars) * 100) : 100
        },
        combo,
        maxCombo,
        rank,
        lives,
        aiProgress,
        startGame,
        resetGame,
        currentWordIndex, // Classic
        config: config.current,
        isLoading
    };
};
