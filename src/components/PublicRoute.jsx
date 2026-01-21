import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
                <div className="spinner-ring" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/practice" replace />;
    }

    return children;
};

export default PublicRoute;
