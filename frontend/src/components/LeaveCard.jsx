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
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusIcon = {
        pending: <Clock size={14} className="mr-1" />,
        approved: <Calendar size={14} className="mr-1" />,
        rejected: <Calendar size={14} className="mr-1" />,
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md dark:hover:shadow-slate-800/50 transition-shadow">
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        {isManager && leave.employeeId && (
                            <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-medium">
                                <UserIcon size={16} className="text-blue-500" />
                                <span>{leave.employeeId.name}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">({leave.employeeId.email})</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span
                                className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${statusColors[leave.status]
                                    }`}
                            >
                                {statusIcon[leave.status]}
                                {leave.status}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                                Applied {formatDate(leave.createdAt)}
                            </span>
                        </div>

                    </div>

                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {formatDate(leave.startDate)} <span className="text-slate-400 dark:text-slate-500 mx-1">→</span> {formatDate(leave.endDate)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Reason</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                            {leave.reason}
                        </p>
                    </div>
                </div>

                {isManager && leave.status === 'pending' && (
                    <div className="mt-6 flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <button
                            onClick={() => onUpdateStatus(leave._id, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => onUpdateStatus(leave._id, 'rejected')}
                            className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
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
