import { useQuery } from '@tanstack/react-query';
import getPostsByAuthor from './getPostsByAuthor';

const useAuthorPosts = (authorId) => {
    return useQuery({
        queryKey: ['posts', authorId],
        queryFn: () => getPostsByAuthor(authorId),
        enabled: !!authorId,
    });
};

export default useAuthorPosts;

