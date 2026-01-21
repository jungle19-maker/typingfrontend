import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Lock, Unlock, Clock, AlertCircle } from 'lucide-react';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, hasFeature } = useContext(AuthContext);
    const { language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                // Determine if we need auth headers? The route seems public or protected?
                // backend/routes/examRoutes.js: router.route('/').get(getExams) -> It DOES NOT have 'protect' middleware.
                // It is public.
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'https://typingbackend-kfoz.onrender.com'}/api/exams`);
                setExams(data);
            } catch (err) {
                console.error("Failed to fetch exams", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    // Mapping Exam categories/types to Feature Flags
    const getFeatureForExam = (exam) => {
        // Example mapping logic - customize based on actual exam data properties
        if (exam.accessLevel === 'free') return null; // Always open

        // If the exam is a "game", check game modes
        if (exam.type === 'survival') return 'survivalGameMode';
        if (exam.type === 'race') return 'typingRaceMode';

        // Default fallback for general "paid" exams if no specific type
        return 'adFree'; // Or any feature that implies "Starter" or above
    };

    const isLocked = (exam) => {
        if (!user) return true; // Not logged in
        if (exam.accessLevel === 'free') return false;

        // Use feature flag verification
        const requiredFeature = getFeatureForExam(exam);
        if (!requiredFeature) return false;

        return !hasFeature(requiredFeature);
    }

    if (loading) return <div className="text-white text-center mt-20">Loading Exams...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-secondary font-mono">
            <div className="container mx-auto px-6 py-10">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary neon-text mb-4">
                        Typing Exams Practice Online – India
                    </h1>
                    <div className="max-w-2xl mx-auto space-y-2 text-gray-400">
                        <p className="text-sm md:text-base">
                            Practice real typing exams for Indian government and court jobs. Improve speed and accuracy with exam-pattern typing tests.
                        </p>
                        <p className="text-sm md:text-base text-gray-500 font-hindi">
                            भारत के सरकारी और कोर्ट टाइपिंग एग्ज़ाम की ऑनलाइन प्रैक्टिस करें। रियल एग्ज़ाम पैटर्न पर अपनी टाइपिंग स्पीड और एक्युरेसी बढ़ाएं।
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.filter(exam => exam.language === language).map((exam) => {
                        const locked = isLocked(exam);
                        return (
                            <div key={exam._id} className={`p-6 rounded-xl border ${locked ? 'border-gray-800 bg-gray-900 opacity-70' : 'border-gray-700 bg-[#151518] hover:border-primary'} transition-all relative group`}>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${exam.language === 'hindi' ? 'bg-orange-900 text-orange-400' : 'bg-blue-900 text-blue-400'}`}>
                                        {exam.language}
                                    </span>
                                    {locked && <Lock className="text-gray-500" size={20} />}
                                    {!locked && <Unlock className="text-green-500" size={20} />}
                                </div>

                                <h2 className="text-xl font-bold text-white mb-2">{exam.title}</h2>
                                <div className="text-xs text-primary mb-3">{exam.examCategory || 'Government Exam'}</div>

                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{Math.floor(exam.duration / 60)} min</span>
                                    </div>
                                    <div>{exam.totalWords} Words</div>
                                </div>

                                <button
                                    onClick={() => navigate(`/typing-exams/${exam.slug || exam._id}`)}
                                    className={`w-full py-2 rounded-lg font-bold border transition-colors ${locked
                                        ? 'border-gray-700 text-gray-500 hover:bg-gray-800'
                                        : 'bg-primary text-black border-primary hover:bg-opacity-90'
                                        }`}
                                >
                                    {locked ? 'View Details' : 'Practice Now'}
                                </button>

                                {locked && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                        <div className="bg-gray-800 p-4 rounded-lg shadow-xl text-center">
                                            <Lock className="mx-auto text-primary mb-2" />
                                            <p className="text-white font-bold mb-2">Pro Feature</p>
                                            <button onClick={() => navigate('/pricing')} className="text-xs bg-primary text-black px-3 py-1 rounded">Upgrade</button>
                                            <button onClick={() => navigate(`/typing-exams/${exam.slug || exam._id}`)} className="text-xs text-gray-400 block mt-2 hover:text-white underline">View Details</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {exams.filter(exam => exam.language === language).length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <AlertCircle className="mx-auto mb-2" size={40} />
                        <p>No active exams found for {language}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exams;
