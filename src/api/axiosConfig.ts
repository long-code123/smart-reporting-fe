import axios from 'axios';

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;