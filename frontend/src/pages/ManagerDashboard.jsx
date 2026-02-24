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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Team Leave Requests</h2>
                    <p className="text-slate-500 mt-1">Manage and respond to employee leave applications</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Pending Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="text-blue-500" size={20} />
                        <h3 className="text-lg font-semibold text-slate-800">Action Required</h3>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{pendingLeaves.length} pending</span>
                </div>

                <div className="p-6">
                    {pendingLeaves.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-500 font-medium tracking-wide">All caught up! No pending leave requests.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {pendingLeaves.map((leave) => (
                                <LeaveCard
                                    key={leave._id}
                                    leave={leave}
                                    isManager={true}
                                    onUpdateStatus={handleUpdateStatus}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Past Requests Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
                <div className="px-6 py-5 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Recently Processed</h3>
                </div>
                <div className="p-6">
                    {pastLeaves.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No processed leaves to show.</div>
                    ) : (
                        <div className="space-y-3">
                            {pastLeaves.slice(0, 5).map(leave => (
                                <div key={leave._id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <p className="font-medium text-slate-800 w-40 truncate">{leave.employeeId?.name || 'Unknown'}</p>
                                        <p className="text-sm text-slate-500">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${leave.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
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
