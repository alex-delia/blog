import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import Button from '../common/Button';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import usePost from '../../helpers/usePost';
import he from 'he';
import DOMPurify from 'dompurify';
import useUpdatePostMutation from '../../helpers/useUpdatePostMutation';
import useDeletePostMutation from '../../helpers/useDeletePostMutation';
import ConfirmDeleteModal from '../common/ConfirmDeleteModal';
import { toast } from 'react-toastify';

export default function EditPostForm() {
    const { postId } = useParams();

    const { isAuthenticated, loading } = useContext(AuthContext);
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isPending, isError, data, error: fetchError } = usePost(postId);

    const updateMutation = useUpdatePostMutation(postId);
    const deleteMutation = useDeletePostMutation(postId);

    useEffect(() => {
        if (error && error.response.data.details) {
            toast.error(error.response.data.details[0].msg);
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            const post = data.post;

            // Decode the HTML entities
            const decodedTitle = he.decode(post.title);
            // Sanitize the decoded HTML
            const sanitizedTitle = DOMPurify.sanitize(decodedTitle);
            setTitle(sanitizedTitle);

            if (post.description) {
                // Decode the HTML entities
                const decodedDescription = he.decode(post.description);
                // Sanitize the decoded HTML
                const sanitizedDescription = DOMPurify.sanitize(decodedDescription);
                setDescription(sanitizedDescription);
            }
        }
    }, [data]);

    if (loading || isPending) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='login' replace />;
    }

    if (isError) return <p>Error: {fetchError.message}</p>;

    const post = data.post;
    // Decode the HTML entities
    const decodedText = he.decode(post.text);
    // Sanitize the decoded HTML
    const sanitizedText = DOMPurify.sanitize(decodedText);

    const handleUpdate = async () => {
        if (editorRef.current) {
            try {
                await updateMutation.mutateAsync({ updatedData: { title, description, text: editorRef.current.getContent() } });
                navigate(post.url);
            } catch (err) {
                setError(err);
                console.error(err);
            }
        }
    };

    const handleDelete = async () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            deleteMutation.mutate();
        } catch (err) {
            setError(err);
            console.error(err);
        }
        setIsModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className='my-5'>
                <label htmlFor="title" className="block text-sm font-bold leading-6">
                    Title
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className='my-5'>
                <label htmlFor="description" className="block text-sm leading-6 font-bold">
                    Description
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className='mb-5'>
                <label htmlFor="postText" className="block text-sm font-bold leading-6">
                    Post
                </label>
                <Editor
                    id='postText'
                    apiKey={import.meta.env.VITE_TINY_KEY}
                    onInit={(_evt, editor) => editorRef.current = editor}
                    initialValue={sanitizedText}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
            </div>
            <div className='flex justify-between'>
                <div className='flex gap-1'>
                    <Link to='/posts'>
                        <Button text="Back"
                            bgColor="bg-black"
                            hoverColor="hover:bg-gray-800" />
                    </Link>
                    <Button onClick={handleUpdate} text='Update' bgColor='bg-green-600' hoverColor='hover:bg-green-500' />
                </div>
                <Button text='Delete' onClick={handleDelete} bgColor='bg-red-600' hoverColor='hover:bg-red-500' />
            </div>
            {isModalOpen && (
                <ConfirmDeleteModal
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}