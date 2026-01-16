import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-container">
            {/* HER SECTOIN */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Improve Your <span className="highlight-text">Typing Speed</span> <br />
                        with Fun Practice Games
                    </h1>
                    <p className="hero-subtitle">
                        Master the keyboard with classic drills, falling words, scrolling sentences, and survival challenges.
                        Seamlessly track your progress and compete for the top rank.
                    </p>
                    <div className="hero-cta">
                        {user ? (
                            <>
                                <Link to="/practice" className="btn btn-primary btn-lg">Start Practicing</Link>
                                <Link to="/game" className="btn btn-outline btn-lg">Play Games</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">Sign Up Free</Link>
                                <Link to="/login" className="btn btn-outline btn-lg">Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Game Modes & Features</h2>
                    <p>Everything you need to become a typing master.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎮</div>
                        <h3>Typing Games</h3>
                        <p>Engage with Word Rain, Scrolling Sentences, and Survival modes to make practice addictive.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Practice Modules</h3>
                        <p>Structured lessons for 2-letter words, trigrams, capital letters, and full paragraphs.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Live Tracking</h3>
                        <p>Get real-time feedback on your WPM, accuracy, and detailed mistake analysis.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Progression</h3>
                        <p>Start as a Beginner and work your way up to Advanced difficulty levels.</p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="how-it-works-section">
                <div className="section-header">
                    <h2>How It Works</h2>
                </div>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <h3>Create Account</h3>
                        <p>Sign up in seconds to save your progress and access all game modes.</p>
                    </div>
                    <div className="step-divider">→</div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <h3>Choose Mode</h3>
                        <p>Select a practice module or jump into an arcade-style typing game.</p>
                    </div>
                    <div className="step-divider">→</div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <h3>Level Up</h3>
                        <p>Watch your WPM soar as you master difficulty tiers.</p>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section">
                <h2>Ready to Type Faster?</h2>
                <p>Join thousands of users improving their skills today.</p>
                <div className="cta-buttons">
                    {user ? (
                        <Link to="/practice" className="btn btn-primary btn-lg">Resume Practice</Link>
                    ) : (
                        <Link to="/register" className="btn btn-primary btn-xl">Start Typing Practice Today</Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
