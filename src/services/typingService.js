import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchWords = async (length) => {
    const response = await axios.get(`${API_URL}/api/typing/words`, { params: { length } });
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
