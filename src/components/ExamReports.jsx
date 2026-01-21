import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ExamReports = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/exams/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const downloadPDF = (result) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Exam Result Certificate', 105, 20, null, null, 'center');

        doc.setFontSize(12);
        doc.text(`Exam: ${result.exam?.title || 'Unknown Exam'}`, 20, 40);
        doc.text(`Date: ${new Date(result.completedAt).toLocaleDateString()}`, 20, 50);

        doc.autoTable({
            startY: 60,
            head: [['Metric', 'Score']],
            body: [
                ['WPM', result.wpm],
                ['Accuracy', `${result.accuracy}%`],
                ['Errors', result.errorCount || result.errors || 0],
                ['Key Strokes', result.keyStrokes]
            ],
        });

        doc.save(`exam-result-${result._id}.pdf`);
    };

    if (loading) return <div>Loading Exam History...</div>;

    return (
        <div className="mt-8 bg-[#151518] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Exam History</h2>
            {results.length === 0 ? (
                <p className="text-gray-500">No exams taken yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs uppercase bg-gray-800 text-gray-200">
                            <tr>
                                <th className="px-4 py-3">Exam</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">WPM</th>
                                <th className="px-4 py-3">Accuracy</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((res) => (
                                <tr key={res._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-4 py-3 font-medium text-white">{res.exam?.title}</td>
                                    <td className="px-4 py-3">{new Date(res.completedAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-primary font-bold">{res.wpm}</td>
                                    <td className="px-4 py-3 text-green-400">{res.accuracy}%</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${res.wpm > 30 && res.accuracy > 90 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                            {res.wpm > 30 && res.accuracy > 90 ? 'PASS' : 'FAIL'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => downloadPDF(res)} className="text-primary hover:text-white" title="Download Certificate">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExamReports;
