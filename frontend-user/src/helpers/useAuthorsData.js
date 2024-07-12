import useSWR from 'swr';
import { axiosFetch } from './fetch';

const useAuthorsData = () => {
    const { data, error, isLoading } = useSWR(`http://localhost:3000/authors`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { authorsData: data, error, isLoading };
};

export default useAuthorsData;