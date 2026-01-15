import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1>
                    Master the Art of <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--primary)', textShadow: '0 0 30px rgba(0, 242, 234, 0.3)' }}>Speed Typing</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    Compete in 5 exciting game modes, track your progress, and race against AI.
                </p>
                <Link to="/practice" className="btn btn-primary">Get Started</Link>
            </div>
        </div>
    );
};

export default Home;
