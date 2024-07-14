import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorPage from './components/errors/Error.jsx';
import Login from './components/pages/Login.jsx';
import { ToastContainer, Flip } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: 'login',
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
