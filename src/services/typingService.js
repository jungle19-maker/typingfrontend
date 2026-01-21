import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const cache = new Map();

export const fetchWords = async (lengthOrDifficulty, count = 50) => {
    const key = `words-${lengthOrDifficulty}-${count}`;
    if (cache.has(key)) return [...cache.get(key)]; // Return copy to prevent mutation

    // If it's a number, treat as length. If string, treat as difficulty (mapped to backend logic if exists, or handled here)
    // Actually backend only supports length currently. Let's send length if number.
    // If we want mixed, we might need a new endpoint or multiple calls.
    // For now, let's just pass the param and handle query on backend or just use length.
    // Wait, the user wants "Basic" = 2-3 letters.
    // Let's update backend or service to handle this.
    // Let's assume we update the backend controller later or now.
    // For now, let's keep it simple: pass 'difficulty' param to words endpoint?
    // The previous turn showed backend supports `getWords(length)`.
    // I should probably update backend to support `getWords(difficulty)`.

    // Changing strategy: Update backend to support difficulty for words too.
    const params = typeof lengthOrDifficulty === 'number'
        ? { length: lengthOrDifficulty, limit: count }
        : { difficulty: lengthOrDifficulty, limit: count };

    try {
        const response = await axios.get(`${API_URL}/api/typing/words`, { params });
        const data = response.data.data;
        if (data && data.length > 0) cache.set(key, data);
        return data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
};

export const fetchCapitals = async (difficulty = 'basic') => {
    const key = `capitals-${difficulty}`;
    if (cache.has(key)) return [...cache.get(key)];

    const response = await axios.get(`${API_URL}/api/typing/capitals`, { params: { difficulty } });
    const data = response.data.data;
    if (data) cache.set(key, data);
    return data;
};

export const fetchParagraphs = async (difficulty = 'basic') => {
    const key = `paragraphs-${difficulty}`;
    if (cache.has(key)) return JSON.parse(JSON.stringify(cache.get(key)));

    const response = await axios.get(`${API_URL}/api/typing/paragraphs`, { params: { difficulty } });
    const data = response.data.data;
    if (data) cache.set(key, data);
    return data;
};

export const fetchHindiWords = async (count = 50) => {
    const key = `hindi-words-${count}`;
    if (cache.has(key)) return [...cache.get(key)];

    try {
        const response = await axios.get(`${API_URL}/api/typing/hindi/words`, { params: { limit: count } });
        const data = response.data.data;
        if (data && data.length > 0) cache.set(key, data);
        return data;
    } catch (error) {
        console.error("Fetch Hindi Words Error:", error);
        return [];
    }
};

export const fetchHindiSentences = async (count = 10) => {
    try {
        const response = await axios.get(`${API_URL}/api/typing/hindi/sentences`, { params: { limit: count } });
        return response.data.data;
    } catch (error) {
        console.error("Fetch Hindi Sentences Error:", error);
        return [];
    }
};

export const fetchHindiParagraphs = async (difficulty = 'basic') => {
    try {
        const response = await axios.get(`${API_URL}/api/typing/hindi/paragraphs`, { params: { difficulty } });
        return response.data.data;
    } catch (error) {
        console.error("Fetch Hindi Paragraphs Error:", error);
        return [];
    }
};
