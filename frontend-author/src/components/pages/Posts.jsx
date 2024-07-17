import usePostsData from "../../helpers/usePostsData";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import DOMPurify from "dompurify";
import he from 'he';
import Button from "../common/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updatePost from "../../helpers/updatePost";

export default function Posts() {
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const { isPending, isError, data, error } = usePostsData(user.id);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ postId, updatedData }) => updatePost(postId, updatedData),
        onMutate: async ({ postId, updatedData }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['posts', user.id] });

            // Snapshot the previous value
            const previousPosts = queryClient.getQueryData(['posts', user.id]);

            const newPosts = previousPosts.posts.map(post => {
                if (post.id === postId) {
                    return { ...post, ...updatedData };
                }
                return post;
            });
            // Optimistically update to the new value
            queryClient.setQueryData(['posts', user.id], { ...previousPosts, posts: newPosts });


            // Return a context object with the snapshotted value
            return { previousPosts };
        },
        // If the mutation fails, use the context object to roll back
        onError: (err, context) => {
            queryClient.setQueryData(['posts'], context.previousPosts);
            console.error(err);
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', user.id] });
        },
    });

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
                <div key={post.id} className="flex items-center justify-between py-4 border-b">
                    <div>
                        <h2 className="font-bold">{post.title}</h2>
                        <p>{post.description}</p>
                    </div>
                    <Button
                        text={post.isPublished ? "Unpublish" : "Publish"}
                        bgColor={post.isPublished ? "bg-red-500" : "bg-green-600"}
                        hoverColor={post.isPublished ? "hover:bg-red-400" : "hover:bg-green-500"}
                        onClick={() => {
                            mutation.mutate({ postId: post.id, updatedData: { isPublished: !post.isPublished } });
                        }}
                    />
                </div>
            ))}
        </div>
    );
}