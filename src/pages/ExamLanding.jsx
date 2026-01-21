import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, FileText, Play, CheckCircle, Lock } from 'lucide-react';
import SEOHelmet from '../components/SEOHelmet';
import { AuthContext } from '../context/AuthContext';

const ExamLanding = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                // Fetch by slug
                const { data } = await axios.get(`http://localhost:5000/api/exams/slug/${slug}`);
                setExam(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [slug]);

    if (loading) return <div className="text-white text-center mt-20">Loading Exam Details...</div>;
    if (error || !exam) return <div className="text-white text-center mt-20">Exam Not Found</div>;

    const isLocked = () => {
        if (exam.accessLevel === 'free') return false;
        if (!user) return true;
        const userPlan = user.subscription?.planName || 'free';
        const plans = ['booster', 'monthly_pro', 'yearly_pro'];
        return !plans.includes(userPlan);
    }

    const locked = isLocked();

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-secondary font-mono">
            <SEOHelmet
                title={exam.metaTitle || exam.title}
                description={exam.metaDescription || `Practice ${exam.title} online. Improve typing speed for this exam.`}
                url={window.location.href}
            />

            <div className="container mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${exam.language === 'hindi' ? 'bg-orange-900/50 text-orange-400' : 'bg-blue-900/50 text-blue-400'}`}>
                        {exam.language} Typing Test
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {exam.title}
                    </h1>

                    <div className="flex justify-center items-center gap-6 text-gray-400 mb-8">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-primary" />
                            <span>{Math.floor(exam.duration / 60)} Minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-primary" />
                            <span>{exam.totalWords} Words</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${exam.difficulty === 'hard' ? 'bg-red-500' : exam.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                            <span className="capitalize">{exam.difficulty}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => locked ? navigate('/pricing') : navigate(`/exams/${exam._id}`)}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${locked
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                            : 'bg-primary text-black hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                            }`}
                    >
                        {locked ? <Lock size={20} /> : <Play size={20} />}
                        {locked ? 'Unlock Full Exam' : 'Start Free Practice'}
                    </button>
                    {locked && <p className="mt-3 text-sm text-gray-500">Premium Plan Required</p>}
                </div>

                {/* Content Split: English & Hindi Descriptions */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-800 pt-12">
                    {/* English Content */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-primary pl-4">About This Exam</h2>
                        {exam.descriptionEnglish ? (
                            <div className="prose prose-invert text-gray-300 whitespace-pre-line">
                                {exam.descriptionEnglish}
                            </div>
                        ) : (
                            <div className="text-gray-400">
                                <p className="mb-4">Prepare for the <strong>{exam.title}</strong> with our realistic typing test environment. This exam is designed to match the actual difficulty level and format of the official test.</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-1" /> Simulate real exam pressure</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-1" /> Strict backspace and error rules</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-1" /> Instant result analysis</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Hindi Content */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-orange-500 pl-4">परीक्षा के बारे में जानकारी</h2>
                        {exam.descriptionHindi ? (
                            <div className="prose prose-invert text-gray-300 whitespace-pre-line">
                                {exam.descriptionHindi}
                            </div>
                        ) : (
                            <div className="text-gray-400">
                                <p className="mb-4"><strong>{exam.title}</strong> की तैयारी करें हमारे रियल टाइपिंग टेस्ट के साथ। यह टेस्ट असली परीक्षा के पैटर्न और कठिनाई स्तर को ध्यान में रखकर बनाया गया है।</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="text-orange-500 mt-1" /> परीक्षा जैसा माहौल</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="text-orange-500 mt-1" /> सही स्पीड और एक्यूरेसी चेक करें</li>
                                    <li className="flex items-start gap-2"><CheckCircle size={16} className="text-orange-500 mt-1" /> तुरंत परिणाम देखें</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExamLanding;
