import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowExpired = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
                <div className="spinner-ring" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check Subscription Status
    const subStatus = user.subscription?.status || 'inactive';
    const isExpired = subStatus === 'expired' || subStatus === 'banned';

    // If user is expired, but route does NOT allow expired users, redirect to pricing
    if (isExpired && !allowExpired) {
        return <Navigate to="/pricing" replace />;
    }

    return children;
};

export default ProtectedRoute;
