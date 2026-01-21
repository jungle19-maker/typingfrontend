import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Pricing = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);

    const planName = user?.subscription?.planName || 'free';
    const subStatus = user?.subscription?.status || 'inactive';
    const isTrial = subStatus === 'trial';
    const isExpired = subStatus === 'expired' || subStatus === 'banned';

    // Fetch Plans from Backend
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Public endpoint
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://typingbackend-kfoz.onrender.com'}/api/auth/plans`);
                if (res.data.status === 'success') {
                    // Enrich plans with some UI specific properties if needed, 
                    // though backend should send mostly what we need.
                    // We might need to map 'name' to 'id' for consistency if backend uses capitalized names.
                    const mappedPlans = res.data.data.map(p => ({
                        id: p.name.toLowerCase(),
                        name: p.name,
                        price: `₹${p.price}`,
                        features: p.displayFeatures || [], // Use displayFeatures from DB
                        // Auto-recommend Pro plan or based on logic
                        recommended: p.name.toLowerCase() === 'pro',
                        color: getPlanColor(p.name.toLowerCase())
                    }));
                    setPlans(mappedPlans);
                }
            } catch (error) {
                console.error("Failed to fetch plans:", error);
                // Fallback to empty or error state
            } finally {
                setLoadingPlans(false);
            }
        };

        fetchPlans();
    }, []);

    const getPlanColor = (planId) => {
        switch (planId) {
            case 'starter': return '#00f2ea';
            case 'pro': return '#00c2ff';
            case 'premium': return '#ff0055';
            default: return '#a3a3a3'; // free
        }
    };

    const handleUpgrade = async (planId) => {
        setProcessing(planId);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://typingbackend-kfoz.onrender.com'}/api/auth/upgrade`,
                { plan: planId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.status === 'success') {
                const updatedUser = res.data.data.user; // This is now enriched with allowedFeatures

                // Update local storage and context
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (setUser) setUser(updatedUser);

                alert(`Successfully upgraded to ${planId.toUpperCase()}!`);
                navigate('/');
            }
        } catch (error) {
            console.error("Upgrade failed:", error);
            alert("Upgrade failed. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="page-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }}>
                    Unlock Your <span style={{ color: 'var(--primary)' }}>Potential</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    {isTrial
                        ? "Your free trial is active. Upgrade to keep full access!"
                        : isExpired
                            ? "Your subscription has expired. Renew now to continue."
                            : "Choose the plan that fits your learning journey."}
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {loadingPlans ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading Plans...
                    </div>
                ) : plans.map(plan => {
                    const isCurrentPlan = planName === plan.id && !isExpired;

                    const showCurrentBadge = isCurrentPlan && !isTrial;

                    return (
                        <div key={plan.id} style={{
                            background: isCurrentPlan ? 'rgba(0, 242, 234, 0.05)' : 'rgba(255,255,255,0.03)',
                            border: isCurrentPlan ? `2px solid ${plan.color}` : plan.recommended ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            padding: '2rem',
                            position: 'relative',
                            transform: plan.recommended || isCurrentPlan ? 'scale(1.05)' : 'none',
                            boxShadow: plan.recommended || isCurrentPlan ? `0 0 30px ${plan.color}33` : 'none'
                        }}>
                            {plan.recommended && !isCurrentPlan && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: plan.color,
                                    color: '#000',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    MOST POPULAR
                                </div>
                            )}

                            {showCurrentBadge && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#10b981',
                                    color: '#fff',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    CURRENT PLAN
                                </div>
                            )}

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: plan.color }}>{plan.name}</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                                {plan.price}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/mo</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', textAlign: 'left' }}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={plan.color}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={processing === plan.id || isCurrentPlan}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: isCurrentPlan ? '#1a1a1a' : processing === plan.id ? 'var(--text-muted)' : plan.color,
                                    color: isCurrentPlan ? '#888' : '#000',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    cursor: (processing === plan.id || isCurrentPlan) ? 'not-allowed' : 'pointer',
                                    transition: 'transform 0.2s',
                                    opacity: isCurrentPlan ? 0.7 : 1
                                }}
                            >
                                {processing === plan.id ? 'Processing...' : isCurrentPlan ? 'Active Plan' : 'Choose Plan'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Pricing;
