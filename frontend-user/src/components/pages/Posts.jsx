import { useState, useEffect } from "react";

const usePostsData = () => {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts/`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setPosts(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { posts, error, loading };
};

const Posts = () => {
    const { posts, error, loading } = usePostsData();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;

    console.log(posts);

    return (
        <div className="mt-5">
            <h2 className="text-2xl text-center font-bold underline2">Posts</h2>
            <ul>
                {posts.data.map((post) => (
                    <li key={post._id}>

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Posts;