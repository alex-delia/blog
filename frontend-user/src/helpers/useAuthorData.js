import useSWR from 'swr';
import { axiosFetch } from './fetch';
import { useParams } from 'react-router-dom';

const useAuthorData = () => {
    const { authorId } = useParams();

    const { data, error, isLoading } = useSWR(`http://localhost:3000/authors/${authorId}`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { authorData: data, error, isLoading };
};

export default useAuthorData;