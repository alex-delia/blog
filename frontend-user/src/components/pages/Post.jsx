import useSWR from 'swr';
import { axiosFetch } from '../../helpers/fetch';
import { useParams } from 'react-router-dom';
import Error404 from '../errors/error-404';

const usePostData = () => {
    const { postId } = useParams();

    const { data: post, error, isLoading } = useSWR(`http://localhost:3000/posts/${postId}`, axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { post, error, isLoading };
};

const Post = () => {
    const { post, error, isLoading } = usePostData();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <Error404 />;

    return (
        <div className="mt-5">
            <h2 className="text-2xl text-center font-bold mb-3">{post.data.title}</h2>
            <p className="text-lg">{post.data.text}</p>
        </div>
    );
};

export default Post;