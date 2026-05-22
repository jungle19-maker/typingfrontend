import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, Crown, Clock } from 'lucide-react';

const SubscriptionBanner = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user || !user.subscription) return null;

    const { status, expiryDate } = user.subscription;

    // Helper to calculate days left
    const getDaysLeft = () => {
        if (!expiryDate) return 0;
        const diff = new Date(expiryDate) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const daysLeft = getDaysLeft();

    // 1. FREE TRIAL ACTIVE
    if (status === 'trial') {
        return (
            <div className="w-full bg-gradient-to-r from-indigo-900 to-primary/20 border-b border-primary/30 px-4 py-1 flex items-center justify-center gap-4 text-xs relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                <div className="flex items-center gap-2 z-10 text-white">
                    <Clock size={16} className="text-primary" />
                    <span className="font-semibold">Free Trial Active</span>
                    <span className="px-2 py-0.5 bg-primary/20 rounded text-primary text-xs font-bold border border-primary/30">
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Ends today'}
                    </span>
                    <span className="hidden sm:inline text-gray-400">- Enjoy full access!</span>
                </div>
                <button
                    onClick={() => navigate('/pricing')}
                    className="z-10 px-3 py-1 bg-primary text-black text-xs font-bold rounded hover:bg-white transition-colors flex items-center gap-1"
                >
                    <Crown size={12} /> Upgrade Now
                </button>
            </div>
        );
    }

    // 2. TRIAL EXPIRED (or Generic Expired)
    if (status === 'expired' || status === 'banned') {
        return (
            <div className="w-full bg-red-900/90 border-b border-red-500/30 px-4 py-2 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-white">
                    <AlertCircle size={16} className="text-red-400" />
                    <span className="font-semibold">Subscription Expired.</span>
                    <span className="hidden sm:inline text-gray-300">Your access to premium features is locked.</span>
                </div>
                <button
                    onClick={() => navigate('/pricing')}
                    className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
                >
                    Renew Access
                </button>
            </div>
        );
    }

    // 3. PAID PLAN (Optional: Small indicator or just nothing)
    // Common pattern is not to annoy paid users, or show "Pro Active" in settings/profile, not global banner.
    // User requested: "Show active plan badge" -> This usually goes in Pricing/Navbar, not a global banner unless expiring soon.

    return null;
};

export default SubscriptionBanner;
