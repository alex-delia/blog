import useSWR from 'swr';
import { axiosFetch } from './fetch';

const usePostsData = (limit = null) => {
    const { data, error, isLoading } = useSWR(`/posts?limit=${limit}`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { postsData: data, error, isLoading };
};

export default usePostsData;