import axios from "axios";

const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
};

export default async function updatePost(post, update) {
    await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${post.id}`,
        update,
        config
    );

}