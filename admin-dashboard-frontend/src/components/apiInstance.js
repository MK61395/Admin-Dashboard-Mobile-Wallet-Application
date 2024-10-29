// apiInstance.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://bigbuffalowings.com' : 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

export default api;
