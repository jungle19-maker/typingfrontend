import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout, reset, setUser } from '../store/slices/authSlice';
import { useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const login = async (email, password) => {
        return dispatch(loginUser({ email, password }));
    };

    const register = async (username, email, password) => {
        return dispatch(registerUser({ username, email, password }));
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    const hasFeature = (featureName) => {
        if (!user || !user.allowedFeatures) return false;
        return user.allowedFeatures.includes(featureName);
    };

    // Need to handle token expiration/interceptor logic similar to old context
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    dispatch(logout());
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [dispatch]);


    return {
        user,
        isLoading,
        isError,
        isSuccess,
        message,
        login,
        register,
        logout: logoutUser,
        reset,
        setUser: (userData) => dispatch(setUser(userData)),
        hasFeature,
        // Maintains compatibility with components expecting 'loading' instead of 'isLoading'
        loading: isLoading
    };
};
