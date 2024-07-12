import useAuthorData from "../../helpers/useAuthorData";
import Error404 from "../errors/error-404";
import PostPreview from "../common/PostPreview";
import { Link } from "react-router-dom";
import he from 'he';

const Author = () => {
    const { authorData, error, isLoading } = useAuthorData();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <Error404 />;

    const author = authorData.author;

    console.log(authorData);

    return (
        <div className="mt-5">
            <h2 className="text-3xl font-bold">{he.decode(author.fullname)}</h2>
            {author.posts.map((post) => (
                <Link to={`/posts/${post._id}`} key={post._id}>
                    <PostPreview post={post} />
                </Link>
            ))}
        </div>
    );
};

export default Author;