import axiosInstance from "../api/axios";

export default async function deletePost(postId) {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
}