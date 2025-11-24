import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// API functions
export const healthApi = {
    getOverview: async () => {
        const { data } = await api.get('/health/overview');
        return data;
    },

    generateActions: async (focus?: string) => {
        const { data } = await api.post('/health/actions', { focus });
        return data;
    },

    getHistory: async (days: number = 30) => {
        const { data } = await api.get('/health/history', { params: { days } });
        return data;
    },
};

export const chatApi = {
    sendMessage: async (message: string, history: any[] = []) => {
        const { data } = await api.post('/chat/message', { message, history });
        return data;
    },

    getStatus: async () => {
        const { data } = await api.get('/chat/status');
        return data;
    },
};

export default api;
