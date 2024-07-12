import useSWR from 'swr';
import { axiosFetch } from './fetch';
import { useParams } from 'react-router-dom';

const usePostData = () => {
    const { postId } = useParams();

    const { data, error, isLoading } = useSWR(`http://localhost:3000/posts/${postId}`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { postData: data, error, isLoading };
};

export default usePostData;