import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const EmployeeAttendance = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;

    // Create configured axios instance
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/attendance');
            setAttendanceList(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load attendance history.');
            setLoading(false);
        }
    };

    const handleMarkAttendance = async () => {
        setError(null);
        setSuccessMessage('');
        try {
            await api.post('/attendance');
            setSuccessMessage('Attendance marked successfully for today!');
            fetchAttendance(); // Refresh the list
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to mark attendance. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daily Attendance</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Mark your presence and view history</p>
                </div>
                <button
                    onClick={handleMarkAttendance}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-sm active:scale-95"
                >
                    <CheckCircle size={18} />
                    Mark Present
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-accent-red dark:text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-900/50">
                    <XCircle size={20} />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/30 text-accent-green dark:text-green-400 p-4 rounded-xl flex items-center gap-3 border border-green-100 dark:border-green-900/50">
                    <CheckCircle size={20} />
                    <p className="font-medium">{successMessage}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 shadow-soft dark:shadow-none rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-200">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                        <Calendar size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Attendance History</h3>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading history...</div>
                ) : attendanceList.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                        <Calendar size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
                        <p className="font-medium text-lg text-slate-600 dark:text-slate-300">No attendance records found</p>
                        <p className="text-sm mt-1">Mark your attendance to start building history.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {attendanceList.map((record) => (
                            <li key={record._id} className="p-6 sm:px-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-900 dark:text-white font-bold">{formatDate(record.markedAt)}</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                            Marked at: {formatTime(record.markedAt)}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border bg-green-50 dark:bg-green-900/30 text-accent-green dark:text-green-400 border-green-200 dark:border-green-900/50">
                                        <CheckCircle size={14} />
                                        {record.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EmployeeAttendance;
