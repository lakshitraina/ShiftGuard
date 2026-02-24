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
    const [showApplyForm, setShowApplyForm] = useState(false);
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
            setShowApplyForm(false);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Leave Dashboard</h2>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
                </div>
                <button
                    onClick={() => setShowApplyForm(!showApplyForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    {showApplyForm ? <XCircle size={20} /> : <Plus size={20} />}
                    {showApplyForm ? 'Cancel' : 'Apply Leave'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<CalendarIcon className="text-blue-500" />} title="Total Leaves" value={leaves.length} bg="bg-blue-50" />
                <StatCard icon={<Clock className="text-yellow-500" />} title="Pending" value={getStatusCount('pending')} bg="bg-yellow-50" />
                <StatCard icon={<CheckCircle className="text-green-500" />} title="Approved" value={getStatusCount('approved')} bg="bg-green-50" />
                <StatCard icon={<XCircle className="text-red-500" />} title="Rejected" value={getStatusCount('rejected')} bg="bg-red-50" />
            </div>

            {/* Apply Leave Form */}
            {showApplyForm && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <CalendarIcon className="text-blue-500" size={20} /> New Leave Application
                    </h3>
                    <form onSubmit={handleApplyLeave} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={newLeave.startDate}
                                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    required
                                    min={newLeave.startDate || new Date().toISOString().split('T')[0]}
                                    value={newLeave.endDate}
                                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Leave</label>
                            <textarea
                                required
                                rows={3}
                                value={newLeave.reason}
                                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                placeholder="Please describe the reason for your leave request..."
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={applying}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Leave History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Leave History</h3>
                </div>
                <div className="p-6">
                    {leaves.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon size={24} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-medium">No leave requests found</p>
                            <p className="text-slate-400 text-sm mt-1">You haven't applied for any leaves yet.</p>
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

const StatCard = ({ icon, title, value, bg }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default EmployeeDashboard;
