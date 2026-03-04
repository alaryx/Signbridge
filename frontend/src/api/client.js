import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
};

export const startSession = async () => {
    const response = await apiClient.post('/session/start');
    return response.data;
};

export const translate = async (direction, content) => {
    const response = await apiClient.post('/translate', { direction, content });
    return response.data;
};

export const getLessons = async () => {
    const response = await apiClient.get('/learning/lessons');
    return response.data;
};

export default apiClient;
