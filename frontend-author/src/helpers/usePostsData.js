import { useQuery } from '@tanstack/react-query';
import fetchPosts from './fetchPosts';

const usePostsData = (userId) => {
    return useQuery({
        queryKey: ['posts', userId],
        queryFn: () => fetchPosts(userId),
        enabled: !!userId,
    });
};

export default usePostsData;

