import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import About from './components/pages/About.jsx';
import Home from './components/pages/Home.jsx';
import Authors from './components/pages/Authors.jsx';
import Posts from './components/pages/Posts.jsx';
import Post from './components/pages/Post.jsx';
import Login from './components/pages/Login.jsx';
import Register from './components/pages/Register.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from "./components/errors/error-page.jsx";
import Error404 from './components/errors/404.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/authors',
        element: <Authors />
      },
      {
        path: '/posts',
        element: <Posts />
      },
      {
        path: '/posts/:postId',
        element: <Post />,
        errorElement: <ErrorPage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '*',
        element: <Error404 />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
