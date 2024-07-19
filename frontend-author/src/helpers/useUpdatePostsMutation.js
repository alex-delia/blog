import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import updatePost from "./updatePost";
import { toast } from "react-toastify";

const useUpdatePostsMutation = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, updatedData }) => updatePost(postId, updatedData),
        onMutate: async ({ postId, updatedData }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['posts', user.id] });
            await queryClient.cancelQueries({ queryKey: ['post', postId] });

            // Snapshot the previous value
            const previousPosts = queryClient.getQueryData(['posts', user.id]);
            const previousPost = queryClient.getQueryData(['post', postId]);

            // Optimistically update the post
            const updatedPosts = previousPosts.map(post => {
                if (post.id === postId) {
                    const updatedPost = { ...post, ...updatedData };
                    queryClient.setQueryData(['post', postId], { post: updatedPost });
                    return updatedPost;
                } else {
                    return post;
                }
            }
            );

            // Optimistically update to the new value
            queryClient.setQueryData(['posts', user.id], updatedPosts);

            if (previousPost) {
                queryClient.setQueryData(['post', postId], {
                    ...previousPost,
                    post: {
                        ...previousPost.post,
                        ...updatedData,
                    }
                });
            }

            // Return a context object with the snapshotted value
            return { previousPosts, previousPost };
        },
        // If the mutation fails, use the context object to roll back
        onError: (err, variables, context) => {
            console.error(err);
            if (err.response && err.response.status === 500) {
                toast.error(err.response.data.message);
            }
            // Roll back to the previous posts and individual post data
            queryClient.setQueryData(['posts', user.id], context.previousPosts);
            queryClient.setQueryData(['post', variables.postId], context.previousPost);
        },
        // Always refetch after error or success
        onSettled: ({ id: postId }) => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] }); // Invalidate individual post query after update
            queryClient.invalidateQueries({ queryKey: ['posts', user.id] });
        },
        onSuccess: () => {
            toast.success('Post updated successfully');
        }
    });
};

export default useUpdatePostsMutation;