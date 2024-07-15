import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorPage from './components/errors/Error.jsx';
import Login from './components/pages/Login.jsx';
import { ToastContainer, Flip } from "react-toastify";
import NewPostForm from './components/pages/NewPostForm.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: '/posts',
        element: <h1>Posts</h1>
      },
      {
        path: '/posts/new',
        element: <NewPostForm />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
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
    </AuthProvider>
  </React.StrictMode>,
);
