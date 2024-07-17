import { useMutation, useQueryClient } from "@tanstack/react-query";
import updatePost from "./updatePost";

const useUpdatePostMutation = (postId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ updatedData }) => updatePost(postId, updatedData),
        onMutate: async ({ updatedData }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['post', postId] });

            // Snapshot the previous value
            const previousPost = queryClient.getQueryData(['post', postId]);

            // Optimistically update to the new value
            queryClient.setQueryData(['post', postId], {
                ...previousPost,
                post: {
                    ...previousPost.post,
                    ...updatedData,
                }
            });

            // Return a context object with the snapshotted value
            return { previousPost };
        },
        // If the mutation fails, use the context object to roll back
        onError: (err, context) => {
            queryClient.setQueryData(['post', postId], context.previousPost);
            console.error(err);
        },
        // Always refetch after error or success
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export default useUpdatePostMutation;