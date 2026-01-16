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
                        <div className="feature-icon text-primary">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h3>Typing Games</h3>
                        <p>Engage with Word Rain, Scrolling Sentences, and Survival modes to make practice addictive.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon text-cyan-400">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3>Practice Modules</h3>
                        <p>Structured lessons for 2-letter words, trigrams, capital letters, and full paragraphs.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon text-emerald-400">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3>Live Tracking</h3>
                        <p>Get real-time feedback on your WPM, accuracy, and detailed mistake analysis.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon text-purple-400">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
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
