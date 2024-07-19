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

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://b147175f145a1e40e27a56347b4a991b@o4507626512580608.ingest.us.sentry.io/4507626540236800",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
