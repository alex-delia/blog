import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const usePostData = () => {
    let { postId } = useParams();
    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setPostData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [postId]);

    return { postData, error, loading };
};

const Post = () => {
    const { postData, error, loading } = usePostData();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>A network error was encountered</p>;

    return (
        <div className="mt-5">
            <h2 className="text-2xl text-center font-bold">{postData.data.title}</h2>
            <p className="text-lg">{postData.data.text}</p>
        </div>
    );
};

export default Post;