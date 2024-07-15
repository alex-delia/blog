import useAuthorData from "../../helpers/useAuthorData";
import useAuthorPosts from "../../helpers/useAuthorPosts";
import PostPreview from "../common/PostPreview";
import { Link } from "react-router-dom";
import he from 'he';

const Author = () => {
    const { authorData, error: authorError, isLoading: authorIsLoading } = useAuthorData();
    const { postsData, error: postsError, isLoading: postsIsLoading } = useAuthorPosts();

    if (authorIsLoading || postsIsLoading) return <p>Loading...</p>;
    if (authorError || postsError) return <p>An error occured</p>;

    const author = authorData.author;
    const posts = postsData.posts;

    return (
        <div className="mt-5">
            <h2 className="text-3xl font-bold">{he.decode(author.fullname)}</h2>
            {posts.map((post) => (
                <Link to={`${post.url}`} key={post._id}>
                    <PostPreview post={post} />
                </Link>
            ))}
        </div>
    );
};

export default Author;