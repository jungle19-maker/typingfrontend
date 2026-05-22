import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

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
