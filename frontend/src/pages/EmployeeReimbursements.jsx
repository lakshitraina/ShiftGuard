import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Check, X, Clock, DollarSign } from 'lucide-react';

const EmployeeReimbursements = () => {
    const { user } = useContext(AuthContext);
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ amount: '', description: '' });

    useEffect(() => {
        fetchReimbursements();
    }, []);

    const fetchReimbursements = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/reimbursements', config);
            setReimbursements(data);
        } catch (error) {
            console.error('Error fetching reimbursements', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/reimbursements', formData, config);
            setShowModal(false);
            setFormData({ amount: '', description: '' });
            fetchReimbursements();
        } catch (error) {
            console.error('Error submitting reimbursement', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <Check className="text-green-500" size={20} />;
            case 'rejected': return <X className="text-red-500" size={20} />;
            default: return <Clock className="text-amber-500" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reimbursement Claims</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your expense requests</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-sm active:scale-95"
                >
                    <Plus size={18} />
                    New Claim
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 shadow-soft dark:shadow-none rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-200">
                    <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Claim History</h3>
                    </div>
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {reimbursements.length === 0 ? (
                            <li className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">No reimbursement claims found.</li>
                        ) : (
                            reimbursements.map((reimb) => (
                                <li key={reimb._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex items-center justify-between gap-6 flex-wrap">
                                        <div className="flex items-center gap-5 flex-1 w-full sm:w-auto">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm transition-all text-slate-600 dark:text-slate-400">
                                                <DollarSign size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">${reimb.amount.toFixed(2)}</h3>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">{reimb.description}</p>
                                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-2 tracking-widest uppercase">Submitted: {new Date(reimb.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start sm:items-end shrink-0 gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border ${getStatusColor(reimb.status)}`}>
                                                {getStatusIcon(reimb.status)}
                                                {reimb.status}
                                            </span>
                                            {reimb.status !== 'pending' && reimb.approvedBy && (
                                                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    Processed by {reimb.approvedBy.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {reimb.status === 'rejected' && reimb.rejectionReason && (
                                        <div className="mt-5 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-2xl text-sm font-medium text-red-700 dark:text-red-400">
                                            <span className="font-bold uppercase text-[11px] tracking-widest block mb-1">Reason:</span> {reimb.rejectionReason}
                                        </div>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 p-2 rounded-xl"><Plus size={20} /></div> New Claim
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Amount ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none font-bold text-lg transition-all dark:placeholder:text-slate-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 border focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none font-medium transition-all dark:placeholder:text-slate-500"
                                        placeholder="Travel expenses, office supplies, etc."
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex gap-3 justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full transition-all active:scale-95 shadow-sm uppercase tracking-widest text-xs"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeReimbursements;
