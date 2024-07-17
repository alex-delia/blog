import axiosInstance from '../api/axios';

const getPostById = async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
};

export default getPostById;