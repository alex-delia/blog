import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorPage from './components/errors/Error.jsx';
import Login from './components/pages/Login.jsx';
import { ToastContainer, Flip } from "react-toastify";
import NewPostForm from './components/pages/NewPostForm.jsx';
import Posts from './components/pages/Posts.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Post from './components/pages/Post.jsx';
import EditPostForm from './components/pages/EditPostForm.jsx';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/posts" replace /> },
      {
        path: '/posts',
        element: <Posts />
      },
      {
        path: '/posts/new',
        element: <NewPostForm />
      },
      {
        path: '/posts/:postId/edit',
        element: <EditPostForm />
      },
      {
        path: '/posts/:postId',
        element: <Post />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*Provide the client to your App*/}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="bottom-center"
          autoClose={4000}
          limit={5}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="colored"
          transition={Flip}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
