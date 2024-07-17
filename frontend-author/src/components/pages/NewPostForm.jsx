import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import Button from '../common/Button';
import { useSWRConfig } from 'swr';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

export default function NewPostForm() {
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='login' replace />;
    }

    const handleSubmit = async () => {
        if (editorRef.current) {
            try {
                const response = await axiosInstance.post('/posts',
                    { title, description, text: editorRef.current.getContent() },
                );
                mutate(`http://localhost:3000/authors/${user.id}/posts`);
                navigate('/posts');
                console.log(response.data);
            } catch (err) {
                setError(err);
                console.error(err);
            }
        }
    };

    return (
        <>
            <div className='my-5'>
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
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
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
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
                <label htmlFor="postText" className="block text-sm font-medium leading-6 text-gray-900">
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
            {(error && error.response.data.details) && <p className='text-red-500 mb-4'>{error.response.data.details[0].msg}</p>}
            <Button onClick={handleSubmit} text='Submit' bgColor='bg-green-600' hoverColor='hover:bg-green-500' />
        </>
    );
}