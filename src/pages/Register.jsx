import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/'); // Navigate to home
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '3rem',
                width: '100%',
                maxWidth: '450px',
                position: 'relative',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                        Join <span style={{ color: 'var(--primary)' }}>Us</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create an account to track your progress.</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(255, 0, 85, 0.1)',
                        border: '1px solid var(--error)',
                        color: 'var(--error)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '1rem',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '1rem',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    paddingRight: '3rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0.2rem',
                                    transition: 'color 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{
                            background: 'var(--primary)',
                            color: '#000',
                            fontWeight: 'bold',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginTop: '1rem',
                            border: 'none',
                            fontSize: '1.1rem'
                        }}
                    >
                        Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
