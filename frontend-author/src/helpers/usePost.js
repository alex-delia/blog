import { useQuery } from '@tanstack/react-query';
import getPostById from './getPostById';

const usePost = (postId) => {
    return useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
    });
};

export default usePost;

