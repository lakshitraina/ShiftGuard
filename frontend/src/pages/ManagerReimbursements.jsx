import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Check, X, Clock, DollarSign, Search } from 'lucide-react';

const ManagerReimbursements = () => {
    const { user } = useContext(AuthContext);
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [processingId, setProcessingId] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedReimbId, setSelectedReimbId] = useState(null);

    useEffect(() => {
        fetchReimbursements();
    }, []);

    const fetchReimbursements = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('https://shiftguard.onrender.com/api/reimbursements', config);
            setReimbursements(data);
        } catch (error) {
            console.error('Error fetching reimbursements', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, reason = '') => {
        try {
            setProcessingId(id);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(`https://shiftguard.onrender.com/api/reimbursements/${id}/status`, {
                status,
                rejectionReason: reason
            }, config);

            if (status === 'rejected') {
                setShowRejectModal(false);
                setRejectReason('');
                setSelectedReimbId(null);
            }
            fetchReimbursements();
        } catch (error) {
            console.error(`Error ${status} reimbursement`, error);
        } finally {
            setProcessingId(null);
        }
    };

    const confirmReject = (id) => {
        setSelectedReimbId(id);
        setShowRejectModal(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <Check className="text-green-500" size={16} />;
            case 'rejected': return <X className="text-red-500" size={16} />;
            default: return <Clock className="text-amber-500" size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-50 dark:bg-green-900/30 text-accent-green dark:text-green-400 border-green-200 dark:border-green-800';
            case 'rejected': return 'bg-red-50 dark:bg-red-900/30 text-accent-red dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        }
    };

    const filteredReimbursements = reimbursements.filter(reimb => {
        const matchesStatus = filterStatus === 'all' || reimb.status === filterStatus;
        const matchesSearch = reimb.employeeId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reimb.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Team Reimbursements</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Review and process employee claims</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by employee or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white font-medium transition-all dark:placeholder:text-slate-500"
                    />
                </div>
                <div className="flex gap-2 shrink-0 overflow-x-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 px-5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none font-bold text-sm tracking-wide transition-all uppercase"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 shadow-soft dark:shadow-none rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 w-full min-w-0">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-5 rounded-tl-3xl">Employee</th>
                                    <th scope="col" className="px-6 py-5">Description</th>
                                    <th scope="col" className="px-6 py-5">Amount</th>
                                    <th scope="col" className="px-6 py-5">Date</th>
                                    <th scope="col" className="px-6 py-5">Status</th>
                                    <th scope="col" className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredReimbursements.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                                            No claims found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReimbursements.map((reimb) => (
                                        <tr key={reimb._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                                                        <img src={`https://ui-avatars.com/api/?name=${reimb.employeeId?.name}&background=f1f5f9&color=0f172a`} alt="Avatar" className="w-full h-full object-cover dark:opacity-80" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{reimb.employeeId?.name}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{reimb.employeeId?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 max-w-xs truncate" title={reimb.description}>
                                                    {reimb.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                    ${reimb.amount.toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                {new Date(reimb.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${getStatusColor(reimb.status)}`}>
                                                    {getStatusIcon(reimb.status)}
                                                    {reimb.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                {reimb.status === 'pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(reimb._id, 'approved')}
                                                            disabled={processingId === reimb._id}
                                                            className="text-accent-green hover:text-white bg-green-50 dark:bg-green-900/30 hover:bg-accent-green dark:hover:bg-green-600 font-bold text-[11px] uppercase tracking-widest px-4 py-2 rounded-xl transition-all disabled:opacity-50 shadow-sm active:scale-95"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => confirmReject(reimb._id)}
                                                            disabled={processingId === reimb._id}
                                                            className="text-accent-red hover:text-white bg-red-50 dark:bg-red-900/30 hover:bg-accent-red dark:hover:bg-red-600 font-bold text-[11px] uppercase tracking-widest px-4 py-2 rounded-xl transition-all disabled:opacity-50 shadow-sm active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                                        Processed by {reimb.approvedBy?.name}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="bg-red-50 dark:bg-red-900/30 text-accent-red p-2 rounded-xl"><X size={20} /></div> Reject Claim
                            </h3>
                            <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Reason for Rejection <span className="text-accent-red">*</span></label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 border focus:ring-2 focus:ring-accent-red focus:border-accent-red outline-none resize-none font-medium transition-all dark:placeholder:text-slate-500"
                                        placeholder="Please provide a reason..."
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3 justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate(selectedReimbId, 'rejected', rejectReason)}
                                    disabled={!rejectReason.trim() || processingId === selectedReimbId}
                                    className="px-8 py-2.5 bg-accent-red hover:bg-red-600 text-white font-bold rounded-full transition-all active:scale-95 shadow-sm uppercase tracking-widest text-xs disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerReimbursements;
