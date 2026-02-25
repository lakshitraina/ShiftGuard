import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download } from 'lucide-react';

const EmployeePayslips = () => {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    useEffect(() => {
        const fetchPayslips = async () => {
            try {
                const res = await api.get('/payslips');
                setPayslips(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching payslips:', err);
                setError('Failed to load payslips.');
                setLoading(false);
            }
        };

        fetchPayslips();
    }, [token]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Payslips</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">View and download your monthly salary slips</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-accent-red dark:text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-900/50">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-8 text-center text-slate-500 dark:text-slate-400 font-medium">Loading payslips...</div>
                ) : payslips.length === 0 ? (
                    <div className="col-span-full p-12 bg-white dark:bg-slate-900 shadow-soft dark:shadow-none rounded-3xl border border-slate-100 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                        <FileText size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
                        <p className="font-medium text-lg text-slate-600 dark:text-slate-300">No payslips found</p>
                        <p className="text-sm mt-1">Your payslips will appear here once uploaded by the manager.</p>
                    </div>
                ) : (
                    payslips.map(payslip => (
                        <div key={payslip._id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="p-3 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                                    {payslip.year}
                                </span>
                            </div>

                            <div className="space-y-1 relative z-10">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{payslip.month}&apos;s Salary</h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    Uploaded: {formatDate(payslip.uploadedAt)}
                                </p>
                            </div>

                            <a
                                href={`http://localhost:5000${payslip.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors border border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-900/50"
                            >
                                <Download size={16} />
                                Download PDF
                            </a>

                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-50 dark:bg-brand-900/10 rounded-full blur-2xl group-hover:bg-brand-100 dark:group-hover:bg-brand-900/20 transition-colors pointer-events-none"></div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmployeePayslips;
