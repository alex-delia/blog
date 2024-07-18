import { useMutation, useQueryClient } from "@tanstack/react-query";
import deletePost from "./deletePost";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useDeletePostMutation = (postId) => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => deletePost(postId),
        onMutate: async () => {
            await queryClient.cancelQueries(['posts', user.id]);

            const previousPosts = queryClient.getQueryData(['posts', user.id]);

            queryClient.setQueryData(['posts', user.id], (old) => {
                return old.filter((post) => post.id !== postId);
            });

            return { previousPosts };
        },
        // If the mutation fails, use the context object to roll back
        onError: (err, variables, context) => {
            queryClient.setQueryData(['posts', user.id], context.previousPosts);
            console.error(err);
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', user.id] });
        },
        onSuccess: () => {
            navigate('/posts');
            toast.success('Post deleted successfully');
        }
    });
};

export default useDeletePostMutation;
