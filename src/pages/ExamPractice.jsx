import { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Timer, AlertTriangle, ChevronRight, Clock, Type, Minus, Plus } from 'lucide-react';

const ExamPractice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Game State
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [stats, setStats] = useState({ wpm: 0, accuracy: 100, errorCount: 0 });
    const [fontSize, setFontSize] = useState(18); // Default font size

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    // const [wordArray, setWordArray] = useState([]); // Removed unused state

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'https://typingbackend-kfoz.onrender.com'}/api/exams/${id}`, config);

                setExam(data);
                // setWordArray(data.content.split(' '));
                setTimeLeft(data.duration);
                setLoading(false);
                if (data.language === 'hindi') setFontSize(22);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load exam');
                setLoading(false);
            }
        };
        fetchExam();
    }, [id, navigate]);

    useEffect(() => {
        if (started && timeLeft > 0 && !finished) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [started, timeLeft, finished]);

    const startExam = () => {
        setStarted(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const endExam = async () => {
        setFinished(true);
        clearInterval(timerRef.current);
        await submitResults();
    };

    const calculateStats = (input) => {
        const correctChars = input.split('').filter((char, i) => char === exam.content[i]).length;
        const totalChars = input.length;

        // Calculate WPM
        const timeElapsed = (exam.duration - timeLeft) / 60;
        const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;

        // Calculate Accuracy
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

        // Calculate Errors (Simple diff)
        let errorCount = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== exam.content[i]) errorCount++;
        }

        return { wpm, accuracy, errorCount };
    };

    const handleInput = (e) => {
        if (finished) return;
        const val = e.target.value;
        setUserInput(val);
        setStats(calculateStats(val));

        // Auto-finish if content matches perfectly
        if (val === exam.content) {
            endExam();
        }
    };

    const submitResults = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const resultData = {
                wpm: stats.wpm,
                accuracy: stats.accuracy,
                errorCount: stats.errorCount,
                keyStrokes: userInput.length,
                backspaceCount: 0 // Not tracked in simple version
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'https://typingbackend-kfoz.onrender.com'}/api/exams/${id}/submit`, resultData, config);
        } catch (err) {
            console.error('Failed to submit results', err);
        }
    };

    // Prevent Paste
    const preventPaste = (e) => {
        e.preventDefault();
        return false;
    };

    const changeFontSize = (delta) => {
        setFontSize(prev => Math.max(12, Math.min(32, prev + delta)));
    };

    if (loading) return <div className="text-white text-center mt-20">Loading Exam Environment...</div>;
    if (error) return <div className="text-red-500 text-center mt-20"><AlertTriangle className="mx-auto mb-2" />{error}</div>;

    if (finished) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center font-mono">
                <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 max-w-lg w-full text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Exam Completed</h2>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="text-2xl font-bold text-blue-600">{stats.wpm}</div>
                            <div className="text-xs text-gray-500">WPM</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
                            <div className="text-xs text-gray-500">Accuracy</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="text-2xl font-bold text-red-600">{stats.errorCount}</div>
                            <div className="text-xs text-gray-500">Errors</div>
                        </div>
                    </div>

                    <button onClick={() => navigate('/typing-exams')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold w-full hover:bg-blue-700 transition-colors">
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    const isHindi = exam.language === 'hindi';

    return (
        <div className="min-h-screen bg-[#f0f9ff] text-gray-800 font-sans selection:bg-blue-200 selection:text-black flex flex-col">
            {/* Top Header */}
            <div className="bg-white border-b border-gray-300 px-6 py-3 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="font-bold text-lg text-gray-800">{exam.title}</h1>
                    <div className="text-xs text-gray-500">Government Exam Mode</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 py-1 border border-gray-300">
                        <span className="text-xs font-bold text-gray-500 mr-1">Font:</span>
                        <button onClick={() => changeFontSize(-2)} className="p-1 hover:bg-gray-200 rounded" title="Decrease Font">
                            <Minus size={16} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{fontSize}</span>
                        <button onClick={() => changeFontSize(2)} className="p-1 hover:bg-gray-200 rounded" title="Increase Font">
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="text-sm font-bold text-gray-600">
                        {user?.username || 'Candidate'}
                    </div>
                </div>
            </div>

            {/* Split Screen Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Content & Input (75%) */}
                <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">

                    {/* Passage Area */}
                    <div className="bg-white border border-gray-300 rounded-lg shadow-sm flex-1 flex flex-col min-h-[40vh]">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
                            {isHindi ? 'गद्यांश सामग्री' : 'Passage Content'}
                        </div>
                        <div
                            className="p-6 overflow-y-auto flex-1 leading-relaxed text-gray-800 select-none"
                            style={{ fontSize: `${fontSize}px`, fontFamily: isHindi ? '"Nirmala UI", "Mangal", "Poppins", sans-serif' : '"Courier New", Courier, monospace', lineHeight: '2' }}
                        >
                            {exam.content}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border border-gray-300 rounded-lg shadow-sm flex-1 flex flex-col min-h-[40vh]">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide flex justify-between">
                            <span>{isHindi ? 'यहाँ टाइप करें' : 'Type Here'}</span>
                            {!started && <span className="text-blue-600 animate-pulse">{isHindi ? 'शुरू करने की प्रतीक्षा...' : 'Waiting to start...'}</span>}
                        </div>
                        <div className="relative flex-1">
                            {!started ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10">
                                    <button
                                        onClick={startExam}
                                        className="bg-blue-600 text-white px-8 py-3 rounded shadow-lg font-bold text-lg hover:bg-blue-700 transition-transform hover:scale-105 flex items-center gap-2"
                                    >
                                        {isHindi ? 'परीक्षा शुरू करें' : 'Start Test'} <ChevronRight />
                                    </button>
                                </div>
                            ) : null}
                            <textarea
                                ref={inputRef}
                                value={userInput}
                                onChange={handleInput}
                                onPaste={preventPaste}
                                disabled={!started}
                                className="w-full h-full p-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-none bg-white text-gray-800 placeholder-gray-400"
                                placeholder={started ? (isHindi ? "ऊपर दिया गया गद्यांश यहाँ टाइप करें..." : "Start typing the passage above...") : ""}
                                spellCheck="false"
                                autoComplete="off"
                                style={{ fontSize: `${fontSize}px`, fontFamily: isHindi ? '"Nirmala UI", "Mangal", "Poppins", sans-serif' : '"Courier New", Courier, monospace', lineHeight: '2' }}
                            ></textarea>
                        </div>
                    </div>

                </div>

                {/* Right Panel: Timer & Info (25%) */}
                <div className="w-1/4 bg-white border-l border-gray-300 p-6 flex flex-col gap-6">

                    {/* Timer Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center shadow-sm">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-2">Time Remaining</div>
                        <div className={`text-4xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-800'}`}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-600">
                        <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Instructions</h3>
                        <ul className="list-disc pl-4 space-y-2">
                            <li>Type the text exactly as shown.</li>
                            <li>Font size can be adjusted from the top bar.</li>
                            <li>Backspace is allowed.</li>
                            <li>Do not use Copy/Paste.</li>
                            <li>Test auto-submits when time ends.</li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={endExam}
                        disabled={!started || finished}
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${!started ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        Submit Exam
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ExamPractice;
