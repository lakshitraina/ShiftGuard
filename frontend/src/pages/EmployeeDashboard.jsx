import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import LeaveCard from '../components/LeaveCard';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newLeave, setNewLeave] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leave/my');
            setLeaves(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch leave history');
            setLoading(false);
        }
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            const res = await api.post('/leave', newLeave);
            setLeaves([res.data, ...leaves]);
            setNewLeave({ startDate: '', endDate: '', reason: '' });
        } catch (err) {
            alert('Failed to apply for leave. ' + (err.response?.data?.message || ''));
        } finally {
            setApplying(false);
        }
    };

    const getStatusCount = (status) => leaves.filter(l => l.status === status).length;

    if (loading) return <div className="p-8 text-center text-slate-500">Loading your dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Welcome back, <span className="text-slate-700 dark:text-slate-200">{user?.name}</span> ✨</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<CalendarIcon size={18} className="text-slate-700" />}
                    title="TOTAL LEAVES"
                    value={leaves.length}
                    bg="bg-slate-100 dark:bg-slate-800"
                    accentText="OVERALL DATA"
                    accentColor="text-slate-400 dark:text-slate-500"
                />
                <StatCard
                    icon={<Clock size={18} className="text-brand-600 dark:text-brand-400" />}
                    title="PENDING"
                    value={getStatusCount('pending')}
                    bg="bg-brand-50 dark:bg-brand-900/30"
                    accentText="AWAITING ACTION"
                    accentColor="text-brand-500 dark:text-brand-400"
                />
                <StatCard
                    icon={<CheckCircle size={18} className="text-accent-green dark:text-green-400" />}
                    title="APPROVED"
                    value={getStatusCount('approved')}
                    bg="bg-green-50 dark:bg-green-900/30"
                    accentText="SUCCESSFUL"
                    accentColor="text-accent-green dark:text-green-400"
                />
                <StatCard
                    icon={<XCircle size={18} className="text-accent-red dark:text-red-400" />}
                    title="REJECTED"
                    value={getStatusCount('rejected')}
                    bg="bg-red-50 dark:bg-red-900/30"
                    accentText="DENIED"
                    accentColor="text-accent-red dark:text-red-400"
                />
            </div>

            {/* Apply Leave Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden p-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="bg-brand-50 dark:bg-brand-900/30 p-2 rounded-xl text-brand-600 dark:text-brand-400"><CalendarIcon size={20} /></div> New Leave Application
                </h3>
                <form onSubmit={handleApplyLeave} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Start Date</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={newLeave.startDate}
                                onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                                className="w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 p-3 border transition-all dark:color-scheme-dark"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">End Date</label>
                            <input
                                type="date"
                                required
                                min={newLeave.startDate || new Date().toISOString().split('T')[0]}
                                value={newLeave.endDate}
                                onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                                className="w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 p-3 border transition-all dark:color-scheme-dark"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Reason for Leave</label>
                        <textarea
                            required
                            rows={3}
                            value={newLeave.reason}
                            onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                            className="w-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 p-3 border resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Please describe the reason for your leave request..."
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={applying}
                            className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            {applying ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Leave History */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Leave History</h3>
                </div>
                <div className="p-6">
                    {leaves.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon size={24} className="text-slate-400 dark:text-slate-500" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No leave requests found</p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">You haven't applied for any leaves yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {leaves.map((leave) => (
                                <LeaveCard key={leave._id} leave={leave} isManager={false} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, bg, accentText, accentColor }) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start w-full">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                {icon}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${accentColor}`}>{accentText}</span>
        </div>
        <div className="mt-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
    </div>
);

export default EmployeeDashboard;
