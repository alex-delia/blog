import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateAuthorizationHeader } from '../api/axios';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
            updateAuthorizationHeader(token);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/login', { email, password });
            const { token, user } = response.data;

            // Check if user has 'author' accountType
            if (user.accountType !== 'author') {
                throw new Error('Access denied: You do not have the required account type.');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setIsAuthenticated(true);
            setUser(user);
            updateAuthorizationHeader(token);

            toast.success('Log In Success');
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const logout = (noToast) => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateAuthorizationHeader(null);
        if (noToast === true) {
            console.log("Test");
            return;
        }
        toast.success('Log Out Success');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;