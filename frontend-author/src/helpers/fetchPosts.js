import axiosInstance from '../api/axios';

const fetchPosts = async (authorId) => {
    const response = await axiosInstance.get(`/authors/${authorId}/posts`);
    return response.data;
};

export default fetchPosts;