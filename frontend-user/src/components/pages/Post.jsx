import Error404 from '../errors/error-404';
import usePostData from '../../helpers/usePostData';
import useComments from '../../helpers/useCommentsData';
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';
import Comment from '../common/Comment';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { DateTime } from "luxon";
import convertUTCToUserTimeZone from '../../helpers/convertUTCtoLocal';
import he from 'he';

const Post = () => {
    const { postData, error: postError, isLoading: postLoading } = usePostData();
    const { commentsData, error: commentsError } = useComments();
    const { isAuthenticated } = useContext(AuthContext);
    const [newComment, setNewComment] = useState('');
    const { postId } = useParams();
    const { mutate } = useSWRConfig();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`http://localhost:3000/posts/${postId}/comments`,
                { text: newComment },
                config
            );
            mutate(`http://localhost:3000/posts/${postId}/comments`);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    if (postLoading) return <p>Loading...</p>;
    if (postError) return <Error404 />;

    const post = postData.post;

    const postDate = convertUTCToUserTimeZone(DateTime.fromISO(post.createdAt), userTimeZone).toLocaleString(DateTime.DATE_MED);

    return (
        <div className="mt-5">
            <div className='mb-3 pb-2'>
                <h2 className="text-2xl text-center font-bold mb-3">{post.title}</h2>
                <div className='text-xl'>
                    <span>Written by: </span>
                    <Link to={`/authors/${post.author._id}`}>
                        <h3 className='inline-block text-blue-600 hover:underline'>
                            {he.decode(post.author.fullname)}
                        </h3>
                    </Link>
                </div>
                <p>{postDate}</p>
            </div>

            <div className='border-b-2'>
                <p className="text-lg mb-3">{post.text}</p>
            </div>

            <div className='mt-3'>
                <h2 className='font-bold text-2xl mb-2'>Comments {commentsData ? `(${commentsData.comments.length})` : ''}</h2>
                {isAuthenticated ?
                    <form className="mb-6" onSubmit={handleSubmit}>
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                            <label htmlFor="comment" className="sr-only">Your comment</label>
                            <textarea id="comment" rows="6" value={newComment} onChange={e => setNewComment(e.target.value)}
                                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                                placeholder="Write a comment..." required></textarea>
                        </div>
                        <button type='Submit' className='text-lg bg-indigo-600 py-2 px-4 text-white rounded-2xl hover:bg-indigo-500'>
                            Post Comment
                        </button>
                    </form>
                    :
                    <div className='mb-5'>
                        <Link to={'/login'} className='text-blue-600 hover:underline'>Login</Link>
                        {' or '}
                        <Link to={'/register'} className='text-blue-600 hover:underline'>Register</Link>
                        {' to leave a comment.'}
                    </div>
                }
                {commentsError ? <p className='text-zinc-700 italic text-sm text-center'>Be The First To Comment...</p> :
                    commentsData && commentsData.comments.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                    ))}
            </div>
        </div>
    );
};

export default Post;