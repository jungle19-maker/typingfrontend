import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FeatureGuard = ({ feature, children, fallback = null, showUpgrade = false }) => {
    const { user, hasFeature } = useContext(AuthContext);

    if (hasFeature(feature)) {
        return <>{children}</>;
    }

    if (showUpgrade) {
        return (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/50 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="text-xl font-bold text-white mb-2">Premium Feature</h3>
                <p className="text-gray-400 mb-4">Upgrade your plan to unlock this feature.</p>
                <Link
                    to="/pricing"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                    Upgrade Now
                </Link>
            </div>
        );
    }

    return fallback;
};

export default FeatureGuard;
