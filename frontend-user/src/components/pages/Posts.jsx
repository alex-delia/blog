import usePostsData from "../../helpers/usePostsData";
import { Link } from "react-router-dom";
import PostPreview from '../common/PostPreview';

const Posts = () => {
    const { postsData, error, isLoading } = usePostsData();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>No posts were found.</p>;

    return (
        <div className="my-5">
            <h2 className="text-2xl font-bold mb-3">All Posts</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {postsData.posts.map((post) => (
                    <Link key={post._id} to={`/posts/${post._id}`}>
                        <PostPreview post={post} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Posts;