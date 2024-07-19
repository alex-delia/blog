import useAuthorData from "../../helpers/useAuthorData";
import useAuthorPosts from "../../helpers/useAuthorPosts";
import PostPreview from "../common/PostPreview";
import { Link } from "react-router-dom";
import he from 'he';

const Author = () => {
    const { authorData, error: authorError, isLoading: authorIsLoading } = useAuthorData();
    const { posts, error: postsError, isLoading: postsIsLoading } = useAuthorPosts();

    if (authorIsLoading || postsIsLoading) return <p>Loading...</p>;
    if (authorError) return <p>An error occured</p>;

    const author = authorData.author;

    return (
        <div className="mt-5">
            <h2 className="text-3xl font-bold">{he.decode(author.fullname)}</h2>
            <div className="flex flex-col gap-3">
                {posts && posts.map((post) => (
                    <Link to={`${post.url}`} key={post._id}>
                        <PostPreview post={post} />
                    </Link>
                ))}
            </div>
            {postsError && <p>No posts found</p>}
        </div>
    );
};

export default Author;