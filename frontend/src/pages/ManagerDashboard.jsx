import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import LeaveCard from '../components/LeaveCard';
import { CheckSquare, AlertCircle } from 'lucide-react';

const ManagerDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leave');
            setLeaves(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch leave requests');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/leave/${id}/status`, { status });
            // Update local state to reflect change without refetching immediately
            setLeaves(leaves.map(leave =>
                leave._id === id ? { ...leave, status } : leave
            ));
        } catch (err) {
            alert('Failed to update leave status');
        }
    };

    const pendingLeaves = leaves.filter(l => l.status === 'pending');
    const pastLeaves = leaves.filter(l => l.status !== 'pending');

    if (loading) return <div className="p-8 text-center text-slate-500">Loading leave requests...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Team Leave Requests</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and respond to employee leave applications</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-accent-red p-4 rounded-xl flex items-start shadow-sm">
                    <AlertCircle className="h-5 w-5 text-accent-red mr-2 mt-0.5" />
                    <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
            )}

            {/* Pending Requests */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                            <CheckSquare size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Action Required</h3>
                    </div>
                    <span className="bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-[11px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">{pendingLeaves.length} pending</span>
                </div>

                <div className="p-8">
                    <div className={pendingLeaves.length === 0 ? "" : "hidden"}>
                        <div className="text-center py-12">
                            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[11px]">All caught up! No pending leave requests.</p>
                        </div>
                    </div>

                    <div className={pendingLeaves.length > 0 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "hidden"}>
                        {pendingLeaves.map((leave) => (
                            <LeaveCard
                                key={leave._id}
                                leave={leave}
                                isManager={true}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Past Requests Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden mt-8">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recently Processed</h3>
                </div>
                <div className="p-8">
                    {pastLeaves.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[11px]">No processed leaves to show.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pastLeaves.slice(0, 5).map(leave => (
                                <div key={leave._id} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <p className="font-bold text-slate-800 dark:text-slate-200 w-40 truncate">{leave.employeeId?.name || 'Unknown'}</p>
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            {new Date(leave.startDate).toLocaleDateString()} <span className="text-slate-300 dark:text-slate-600 mx-1">→</span> {new Date(leave.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${leave.status === 'approved'
                                        ? 'bg-green-50 dark:bg-green-900/30 text-accent-green dark:text-green-400 border-green-200 dark:border-green-900/50'
                                        : 'bg-red-50 dark:bg-red-900/30 text-accent-red dark:text-red-400 border-red-200 dark:border-red-900/50'
                                        }`}>
                                        {leave.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
