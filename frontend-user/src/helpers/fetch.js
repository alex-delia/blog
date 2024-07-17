import axios from 'axios';

export const axiosFetch = async (url) => {
    const token = localStorage.getItem('token');
    let config;

    if (token) {
        config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        };
    }

    const response = await axios.get(url, config);
    return response.data;
}; 