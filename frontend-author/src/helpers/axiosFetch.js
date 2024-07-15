import axios from 'axios';

export const axiosFetch = async (url, config) => {
    const response = await axios.get(url, config);
    return response.data;
}; 