import DOMPurify from 'dompurify';
import he from 'he';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import convertUTCToUserTimeZone from '../../helpers/convertUTCtoLocal';
import usePost from '../../helpers/usePost';
import useUpdatePostMutation from '../../helpers/useUpdatePostMutation';
import Button from '../common/Button';
import './Post.css';

const Post = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const { isAuthenticated, loading } = useContext(AuthContext);
    const { isPending, isError, data, error } = usePost(postId);
    const mutation = useUpdatePostMutation(postId);

    if (loading || isPending) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='login' replace />;
    }

    if (isError) return <p>Error: {error.message}</p>;

    const post = data.post;

    // Decode the HTML entities
    const decodedTitle = he.decode(post.title);
    // Sanitize the decoded HTML
    const sanitizedTitle = DOMPurify.sanitize(decodedTitle);
    // Decode the HTML entities
    const decodedText = he.decode(post.text);
    // Sanitize the decoded HTML
    const sanitizedText = DOMPurify.sanitize(decodedText);

    const sanitizedPost = { ...post, title: sanitizedTitle, text: sanitizedText };

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const postDate = convertUTCToUserTimeZone(DateTime.fromISO(sanitizedPost.createdAt), userTimeZone).toLocaleString(DateTime.DATE_MED);

    const handleEditClick = () => {
        navigate(`${post.url}/edit`);
    };

    const handleBackClick = () => {
        navigate('/posts');
    };

    return (
        <div className="mt-5">
            <div className='mb-3 pb-2'>
                <h2 className="text-4xl text-center font-bold mb-4 lg:mb-2">{sanitizedPost.title}</h2>
                <div className='text-xl'>
                    <span>Written by: </span>
                    <h3 className='inline-block text-blue-600 hover:underline'>
                        {he.decode(sanitizedPost.author.fullname)}
                    </h3>
                </div>
                <p>{postDate}</p>
            </div>

            <div className='border-b-2 mb-4 pb-4'>
                <div className="blog-text text-lg mb-3" dangerouslySetInnerHTML={{ __html: sanitizedPost.text }} />
            </div>

            <div className='flex gap-2'>
                <Button text="Back"
                    bgColor="bg-black"
                    hoverColor="hover:bg-gray-800"
                    onClick={handleBackClick} />
                <Button text="Edit"
                    bgColor="bg-fuchsia-500"
                    hoverColor="hover:bg-fuchsia-400"
                    onClick={handleEditClick} />
                <Button
                    text={sanitizedPost.isPublished ? "Unpublish" : "Publish"}
                    bgColor={sanitizedPost.isPublished ? "bg-red-500" : "bg-green-600"}
                    hoverColor={sanitizedPost.isPublished ? "hover:bg-red-400" : "hover:bg-green-500"}
                    onClick={() => {
                        mutation.mutate({ updatedData: { isPublished: !sanitizedPost.isPublished } });
                    }}
                />
            </div>
        </div>
    );
};

export default Post;