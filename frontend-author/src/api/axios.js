import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
});

// Function to update authorization header
export const updateAuthorizationHeader = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export default axiosInstance;