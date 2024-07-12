import PostPreview from "../common/PostPreview";
import usePostsData from "../../helpers/usePostsData";
import { Link } from "react-router-dom";

const Home = () => {
    const { postsData, error, isLoading } = usePostsData(5);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;

    return (
        <div className="mt-5">
            <h2 className="text-2xl font-bold mb-3">Recent Posts</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {postsData.posts.map((post) => (
                    <Link key={post._id} to={`${post.url}`}>
                        <PostPreview post={post} />
                    </Link>

                ))}
            </div>
        </div>
    );
};

export default Home;