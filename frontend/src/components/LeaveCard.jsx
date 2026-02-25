import React from 'react';
import { Calendar, Clock, User as UserIcon } from 'lucide-react';

const LeaveCard = ({ leave, isManager, onUpdateStatus }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const statusColors = {
        pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50',
        approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-900/50',
        rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900/50',
    };

    const statusIcon = {
        pending: <Clock size={14} className="mr-1" />,
        approved: <Calendar size={14} className="mr-1" />,
        rejected: <Calendar size={14} className="mr-1" />,
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow relative group">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-3">
                        {isManager && leave.employeeId && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                                    <img src={`https://ui-avatars.com/api/?name=${leave.employeeId.name}&background=f1f5f9&color=0f172a`} alt="Avatar" className="w-full h-full object-cover dark:opacity-80" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{leave.employeeId.name}</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">{leave.employeeId.email}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <span
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border ${statusColors[leave.status]}`}
                            >
                                {statusIcon[leave.status]}
                                {leave.status}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                APP: {formatDate(leave.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Duration</p>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {formatDate(leave.startDate)} <span className="text-brand-400 dark:text-brand-500 mx-2">→</span> {formatDate(leave.endDate)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Reason</p>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                {leave.reason}
                            </p>
                        </div>
                    </div>
                </div>

                {isManager && leave.status === 'pending' && (
                    <div className="mt-6 flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => onUpdateStatus(leave._id, 'approved')}
                            className="flex-1 bg-accent-green hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500 text-white font-bold tracking-wide uppercase text-xs py-3 px-4 rounded-full transition-all active:scale-95 shadow-sm"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => onUpdateStatus(leave._id, 'rejected')}
                            className="flex-1 bg-red-50 dark:bg-red-900/30 text-accent-red dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 font-bold tracking-wide uppercase text-xs py-3 px-4 rounded-full transition-all active:scale-95"
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveCard;
