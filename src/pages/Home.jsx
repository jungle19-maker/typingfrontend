import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="w-full min-h-screen bg-dark text-textMain">
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-10">
                {/* Background Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-tight">
                        Improve Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-neon-blue">
                            Typing Speed
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-textMuted mb-6 max-w-2xl mx-auto leading-relaxed">
                        Master the keyboard with classic drills, falling words, and survival challenges.
                        Track your progress and compete for the global top rank.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {user ? (
                            <>
                                <Link to="/practice" className="px-6 py-2.5 bg-primary text-black text-sm font-bold rounded-lg shadow-neon-blue hover:brightness-110 hover:-translate-y-0.5 transition-all">
                                    Start Practicing
                                </Link>
                                <Link to="/game" className="px-6 py-2.5 border border-white/20 bg-white/5 text-white text-sm font-bold rounded-lg hover:bg-white/10 transition-all">
                                    Play Games
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="px-6 py-2.5 bg-primary text-black text-sm font-bold rounded-lg shadow-neon-blue hover:brightness-110 hover:-translate-y-0.5 transition-all">
                                    Sign Up Free
                                </Link>
                                <Link to="/login" className="px-6 py-2.5 border border-white/20 bg-white/5 text-white text-sm font-bold rounded-lg hover:bg-white/10 transition-all">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-12 px-4 bg-surface/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Game Modes & Features</h2>
                        <p className="text-textMuted text-sm">Everything you need to become a typing master.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: "Typing Games",
                                desc: "Engage with Word Rain, scrolling sentences, and survival modes.",
                                icon: (
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                                    </svg>
                                )
                            },
                            {
                                title: "Practice Modules",
                                desc: "Structured lessons for 2-letter words, trigrams, and full paragraphs.",
                                icon: (
                                    <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                )
                            },
                            {
                                title: "Live Tracking",
                                desc: "Get real-time feedback on your WPM, accuracy, and detailed mistake analysis.",
                                icon: (
                                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                )
                            },
                            {
                                title: "Progression",
                                desc: "Start as a Beginner and work your way up to Advanced difficulty levels.",
                                icon: (
                                    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-lg hover:border-primary/50 hover:bg-white/10 transition-all group">
                                <div className="mb-3 p-2 bg-black/20 rounded-lg inline-block group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-sm font-bold mb-1 text-white">{feature.title}</h3>
                                <p className="text-textMuted text-xs leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-10 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="p-8 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/20">
                        <h2 className="text-2xl font-bold mb-4">Ready to Type Faster?</h2>
                        <p className="text-sm text-textMuted mb-6">Join thousands of users improving their skills today.</p>
                        <div className="inline-block">
                            {user ? (
                                <Link to="/practice" className="px-8 py-3 bg-primary text-black text-base font-bold rounded-lg shadow-lg hover:shadow-neon-blue hover:-translate-y-0.5 transition-all">
                                    Resume Practice
                                </Link>
                            ) : (
                                <Link to="/register" className="px-8 py-3 bg-primary text-black text-base font-bold rounded-lg shadow-lg hover:shadow-neon-blue hover:-translate-y-0.5 transition-all">
                                    Start Typing Practice Today
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
