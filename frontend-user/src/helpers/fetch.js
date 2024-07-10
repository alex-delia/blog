import axios from 'axios';

export const axiosFetch = async (url) => {
    const response = await axios.get(url);
    return response.data;
}; 