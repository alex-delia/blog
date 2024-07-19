import useSWR from 'swr';
import { axiosFetch } from './fetch';
import { useParams } from 'react-router-dom';

const useComments = () => {
    const { postId } = useParams();

    const { data, error } = useSWR(`/posts/${postId}/comments`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { commentsData: data, error };
};

export default useComments;