import useSWR from 'swr';
import { axiosFetch } from './axiosFetch';

const usePostsData = (authorId) => {
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const { data, error, isLoading } = useSWR(`http://localhost:3000/authors/${authorId}/posts`,
        (url) => axiosFetch(url, config),
        {
            dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
        });

    return { postsData: data, error, isLoading };
};

export default usePostsData;

