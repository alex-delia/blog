import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import Button from '../common/Button';
import { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function NewPostForm() {
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const queryClient = useQueryClient();

    useEffect(() => {
        if (error && error.response.data.details) {
            toast.error(error.response.data.details[0].msg);
        }
    }, [error]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='login' replace />;
    }

    const handleSubmit = async () => {
        if (editorRef.current) {
            try {
                await axiosInstance.post('/posts',
                    { title, description, text: editorRef.current.getContent() },
                );
                queryClient.invalidateQueries(['posts', user.id]);
                navigate('/posts');
            } catch (err) {
                setError(err);
                console.error(err);
            }
        }
    };

    return (
        <>
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
            <Button onClick={handleSubmit} text='Submit' bgColor='bg-green-600' hoverColor='hover:bg-green-500' />
        </>
    );
}