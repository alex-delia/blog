import usePostsData from "../../helpers/usePostsData";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import he from 'he';
import Button from "../common/Button";
import axios from "axios";
import { useSWRConfig } from "swr";


export default function Posts() {
    const { mutate } = useSWRConfig();
    const navigate = useNavigate();

    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const { postsData, error, isLoading } = usePostsData(user.id);

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='login' replace />;
    }

    if (error) return <p>No posts were found.</p>;

    postsData.posts.forEach((post) => {
        // Decode the HTML entities
        const decodedTitle = he.decode(post.title);
        // Sanitize the decoded HTML
        const sanitizedTitle = DOMPurify.sanitize(decodedTitle);
        post.title = sanitizedTitle;
    });

    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const togglePublish = async (post) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/posts/${post.id}`,
                { isPublished: !post.isPublished },
                config
            );
            mutate(`http://localhost:3000/authors/${user.id}/posts`);
            navigate('/posts');
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="mt-5">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>
            {postsData.posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between py-4 border-b">
                    <div>
                        <h2 className="font-bold">{post.title}</h2>
                        <p>{post.description}</p>
                    </div>
                    {post.isPublished ?
                        <Button text="Unpublish" bgColor="bg-red-500" hoverColor="hover:bg-red-400" onClick={() => togglePublish(post)} />
                        : <Button text="Publish" bgColor="bg-green-600" hoverColor="hover:bg-green-500" onClick={() => togglePublish(post)} />
                    }
                </div>
            ))}
        </div>
    );
}