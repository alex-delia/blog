import DOMPurify from "dompurify";
import he from 'he';
import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import useAuthorPosts from "../../helpers/useAuthorPosts";
import useUpdatePostsMutation from "../../helpers/useUpdatePostsMutation";
import Button from "../common/Button";

export default function Posts() {
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const { isPending, isError, data, error } = useAuthorPosts(user.id);

    const mutation = useUpdatePostsMutation();

    if (loading || isPending) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='login' replace />;
    }

    if (isError) return <p>Error: {error.message}</p>;

    const sanitizedPosts = data.posts.map(post => {
        // Decode the HTML entities
        const decodedTitle = he.decode(post.title);
        // Sanitize the decoded HTML
        const sanitizedTitle = DOMPurify.sanitize(decodedTitle);

        return { ...post, title: sanitizedTitle };
    });

    return (
        <div className="mt-5">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>
            {sanitizedPosts.map((post) => (
                < div key={post.id} className="flex justify-between gap-5 p-4 border-b hover:bg-slate-200 sm:items-center" >
                    <div className="flex-1">
                        <h2 className="font-bold">{post.title}</h2>
                        <p>{post.description}</p>
                    </div>
                    <div className="flex items-center flex-col gap-1 sm:flex-row sm:w-72 sm:justify-evenly">
                        <Link to={`${post.url}/edit`}>
                            <Button text="Edit"
                                bgColor="bg-orange-600"
                                hoverColor="hover:bg-orange-500" />
                        </Link>
                        <Link to={post.url}>
                            <Button text="Preview" />
                        </Link>
                        <div>
                            <Button
                                text={post.isPublished ? "Unpublish" : "Publish"}
                                bgColor={post.isPublished ? "bg-red-500" : "bg-green-600"}
                                hoverColor={post.isPublished ? "hover:bg-red-400" : "hover:bg-green-500"}
                                onClick={() => {
                                    mutation.mutate({ postId: post.id, updatedData: { isPublished: !post.isPublished } });
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))
            }
        </div >
    );
}