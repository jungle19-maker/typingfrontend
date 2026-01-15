import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="hero" style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="hero-content">
                <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                    Master the Art of <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--primary)', textShadow: '0 0 20px rgba(0, 242, 234, 0.5)' }}>Speed Typing</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                    Compete in 5 exciting game modes, track your progress, and race against AI.
                </p>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
        </div>
    );
};

export default Home;
