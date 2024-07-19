import useSWR from 'swr';
import { axiosFetch } from './fetch';
import { useParams } from 'react-router-dom';

const useAuthorPosts = () => {
    const { authorId } = useParams();

    const { data, error, isLoading } = useSWR(`/authors/${authorId}/posts`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { posts: data, error, isLoading };
};

export default useAuthorPosts;