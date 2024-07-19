import { useMutation, useQueryClient } from "@tanstack/react-query";
import updatePost from "./updatePost";
import { toast } from "react-toastify";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const useUpdatePostMutation = (postId) => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ updatedData }) => updatePost(postId, updatedData),
        onMutate: async ({ updatedData }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['post', postId] });
            await queryClient.cancelQueries({ queryKey: ['posts', user.id] });

            // Snapshot the previous value
            const previousPost = queryClient.getQueryData(['post', postId]);
            const previousPosts = queryClient.getQueryData(['posts', user.id]);

            // Optimistically update to the new value
            queryClient.setQueryData(['post', postId], {
                ...previousPost,
                post: {
                    ...previousPost.post,
                    ...updatedData,
                }
            });

            if (previousPosts) {
                // Optimistically update to the new value for the posts list
                const updatedPostsList = previousPosts.map(post =>
                    post.id === postId ? { ...post, ...updatedData } : post
                );

                queryClient.setQueryData(['posts', user.id], updatedPostsList);
            }

            // Return a context object with the snapshotted value
            return { previousPost, previousPosts };
        },
        // If the mutation fails, use the context object to roll back
        onError: (err, variables, context) => {
            if (err.response && err.response.status === 500) {
                toast.error(err.response.data.message);
            }
            queryClient.setQueryData(['post', postId], context.previousPost);
            queryClient.setQueryData(['poss', user.id], context.previousPosts);
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts', user.id] });
        }, onSuccess: () => {
            toast.success('Post updated successfully');
        }
    });
};

export default useUpdatePostMutation;