import useAuthorsData from "../../helpers/useAuthorsData";
import { Link } from "react-router-dom";

const Authors = () => {
    const { authorsData, error, isLoading } = useAuthorsData();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>No authors were found.</p>;

    return (
        <div className="mt-5">
            <h2 className="text-2xl text-center font-bold underline2">Authors</h2>
            <ul className="list-disc">
                {authorsData.authors.map((author) => (
                    <Link key={author._id} to={`${author.url}`}>
                        <li>
                            <span className="text-blue-600 text-2xl hover:underline">{author.fullname} - {author.postCount} posts</span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div >
    );
};

export default Authors;