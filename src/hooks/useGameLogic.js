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

    // New State for Premium Features
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [rank, setRank] = useState(null); // 'Bronze', 'Silver', etc.

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
            case 'word-rain':
                return {
                    ...baseConfig,
                    type: 'word-rain',
                    wordList: isBeginner ? BEGINNER_WORDS : (isAdvanced ? EXPERT_WORDS : INTERMEDIATE_WORDS),
                    fallSpeed: isBeginner ? 1 : (isAdvanced ? 3 : 2)
                };
            case 'sentence':
                return {
                    ...baseConfig,
                    type: 'sentence',
                    wordList: [],
                    timeLimit: 0,
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
        setCombo(0);
        setMaxCombo(0);
        setRank(null);
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

        // Calculate final rank
        // Note: WPM is calculated dynamically in render usually, so we recalculate here or rely on state update
        // We'll calculate it based on stats state since `wpm` derived constant isn't available inside this callback closure easily without dependence
        // Ideally pass it in, but for now let's do a quick calc:
        // Or wait for effect? Let's just calculate logic here.
    }, []);

    const handleInput = (e) => {
        if (!isPlaying) return;
        const val = e.target.value;
        const prevVal = inputValue;
        const isDelete = val.length < prevVal.length;
        setInputValue(val);

        const currentTarget = words[currentWordIndex];

        // Combo Logic:
        // If typing correctly character by character
        if (!isDelete && val.length > prevVal.length) {
            const charIndex = val.length - 1;
            const expectedChar = currentTarget[charIndex] !== undefined ? currentTarget[charIndex] : ' ';

            // Check if the newly typed char is correct (basic check, complex for mid-word)
            // Actually, simplified: if the whole input currently matches prefix of word
            if (currentTarget.startsWith(val.trim())) {
                setCombo(prev => {
                    const next = prev + 1;
                    if (next > maxCombo) setMaxCombo(next);
                    return next;
                });
            } else {
                // Mistake made
                setCombo(0);
            }
        } else if (isDelete) {
            // Deleting doesn't reset combo necessarily, but let's say it effectively pauses or resets if they corrected a mistake
            // Simpler arcade rule: Backspace breaks combo? Or just mistake?
            // Let's stick to: Mistake breaks combo above. Backspace is neutral but combo broken on the error itself.
        }

        // Word Completion
        if (val.endsWith(' ') || (config.current.type === 'sentence' && val === currentTarget)) {
            const trimmedVal = val.trim();

            const advanceWord = () => {
                setCurrentWordIndex(prev => prev + 1);
                setInputValue('');

                if (currentWordIndex + 1 >= words.length) {
                    if (config.current.type === 'sentence' || config.current.type === 'race') {
                        endGame();
                    } else {
                        setWords(prev => [...prev, ...getRandomWords(10, config.current.wordList)]);
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
                // Combo Bonus for Word Completion?
                setCombo(prev => prev + 5);
                advanceWord();

            } else {
                // Mistake
                setCombo(0); // Break combo
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

    // Determine Rank when game over
    useEffect(() => {
        if (isGameOver) {
            setRank(calculateRank(wpm));
        }
    }, [isGameOver, wpm]);

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
        combo,
        maxCombo,
        rank,
        lives,
        aiProgress,
        startGame,
        resetGame,
        currentWordIndex,
        config: config.current
    };
};
