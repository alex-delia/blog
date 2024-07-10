import useSWR from 'swr';
import { axiosFetch } from './fetch';

const usePostsData = (limit = null) => {
    const { data: posts, error, isLoading } = useSWR(`http://localhost:3000/posts?limit=${limit}`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { posts, error, isLoading };
};

export default usePostsData;