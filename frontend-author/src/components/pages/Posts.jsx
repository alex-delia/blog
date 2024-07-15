import usePostsData from "../../helpers/usePostsData";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import DOMPurify from "dompurify";
import he from 'he';

export default function Posts() {
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
        const decodedHTML = he.decode(post.text);

        // Sanitize the decoded HTML
        const sanitizedContent = DOMPurify.sanitize(decodedHTML);

        post.text = sanitizedContent;
    });

    return (
        <div className="mt-5">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>
            {postsData.posts.map((post) => (
                <div key={post.id} className="mb-4">
                    <h2 className="font-bold">{post.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: post.text.substring(0, 100) }}></div>
                </div>
            ))}
        </div>
    );
}