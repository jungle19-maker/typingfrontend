import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchWords = async (lengthOrDifficulty, count = 50) => {
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
        ? { length: lengthOrDifficulty, count }
        : { difficulty: lengthOrDifficulty, count };

    const response = await axios.get(`${API_URL}/api/typing/words`, { params });
    return response.data.data;
};

export const fetchCapitals = async (difficulty = 'basic') => {
    const response = await axios.get(`${API_URL}/api/typing/capitals`, { params: { difficulty } });
    return response.data.data;
};

export const fetchParagraphs = async (difficulty = 'basic') => {
    const response = await axios.get(`${API_URL}/api/typing/paragraphs`, { params: { difficulty } });
    return response.data.data;
};
