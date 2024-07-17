import axiosInstance from "../api/axios";

export default async function updatePost(postId, update) {
    const response = await axiosInstance.put(`/posts/${postId}`, update);
    return response.data;
}