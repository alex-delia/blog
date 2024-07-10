import useSWR from 'swr';
import { axiosFetch } from '../../helpers/fetch';
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

const usePostsData = () => {
    const { data: posts, error, isLoading } = useSWR('http://localhost:3000/posts', axiosFetch, {
        dedupingInterval: 1000 * 60 * 10, // cache for 10 minutes});
    });

    return { posts, error, isLoading };
};

const Posts = () => {
    const { posts, error, isLoading } = usePostsData();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;

    return (
        <div className="mt-5">
            <h2 className="text-2xl font-bold mb-3">All Posts</h2>
            <ul>
                {posts.data.map((post) => (
                    <Link key={post._id} to={`/posts/${post._id}`}>
                        <li className='border mb-2 p-3 rounded hover:bg-slate-200'>
                            <h3 className='inline-block text-lg font-bold'>{post.title}&nbsp;</h3>
                            <h3 className='inline-block text-md text-zinc-400'>- {post.author.fullname}</h3>
                            <p>{post.text}</p>
                            <p className='text-xs italic inline-block'>{DateTime.now().toUTC().plus(DateTime.fromISO(post.createdAt).diffNow()).toRelative()}</p>
                            {post.updatedAt !== post.createdAt && (
                                <p className='text-xs italic inline-block pl-5'>Modified: {DateTime.now().toUTC().plus(DateTime.fromISO(post.updatedAt).diffNow()).toRelative()}</p>
                            )}
                        </li>
                    </Link>

                ))}
            </ul>
        </div>
    );
};

export default Posts;