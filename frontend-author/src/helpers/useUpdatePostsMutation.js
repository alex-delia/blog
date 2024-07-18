import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import updatePost from "./updatePost";

const useUpdatePostsMutation = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    return useMutation({
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
            queryClient.setQueryData(['posts', user.id], (old) =>
                old ?
                    {
                        ...old,
                        posts: newPosts
                    }
                    : old
            );

            // Return a context object with the snapshotted value
            return { previousPosts };
        },
        // If the mutation fails, use the context object to roll back
        onError: (err, context) => {
            queryClient.setQueryData(['posts', user.id], context.previousPosts);
            console.error(err);
        },
        // Always refetch after error or success
        onSettled: ({ postId }) => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] }); // Invalidate individual post query after update
            queryClient.invalidateQueries({ queryKey: ['posts', user.id] });
        },
    });
};

export default useUpdatePostsMutation;