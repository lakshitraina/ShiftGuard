import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';

const ManagerPayslips = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await api.get('/users/employees');
                setEmployees(res.data);
            } catch (err) {
                console.error('Error fetching employees:', err);
            }
        };

        fetchEmployees();
    }, [token]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                setFile(null);
                return;
            }
            if (selectedFile.size > 5000000) { // 5MB
                setError('File size must be less than 5MB.');
                setFile(null);
                return;
            }
            setError(null);
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedEmployee || !month || !year || !file) {
            setError('Please fill in all fields and select a valid PDF file.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('employeeId', selectedEmployee);
        formData.append('month', month);
        formData.append('year', year);
        formData.append('payslip', file);

        try {
            await axios.post('http://localhost:5000/api/payslips', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccessMessage(`Payslip uploaded successfully for ${month} ${year}.`);
            setFile(null);
            setMonth('');
            // Resetting file input visually might require a ref, skipping for simplicity
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to upload payslip. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Upload Payslips</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Distribute monthly salary slips to employees</p>
                </div>
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

            <div className="bg-white dark:bg-slate-900 shadow-soft dark:shadow-none rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                        <Upload size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Upload</h3>
                </div>

                <div className="p-8">
                    <form onSubmit={handleUpload} className="space-y-6 max-w-2xl">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Users size={14} /> Employee
                            </label>
                            <select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 transition-colors font-medium appearance-none"
                                required
                            >
                                <option value="" disabled>Select an employee</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} /> Month
                                </label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 transition-colors font-medium appearance-none"
                                    required
                                >
                                    <option value="" disabled>Select Month</option>
                                    {months.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} /> Year
                                </label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 transition-colors font-medium appearance-none"
                                    required
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Payslip PDF (Max 5MB)
                            </label>
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer relative text-center">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`p-3 rounded-full transition-colors ${file ? 'bg-green-50 dark:bg-green-900/30 text-accent-green dark:text-green-400' : 'bg-brand-50 dark:bg-brand-900/30 text-brand-500 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50'}`}>
                                        {file ? <CheckCircle size={24} /> : <Upload size={24} />}
                                    </div>
                                    <div>
                                        {file ? (
                                            <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                                        ) : (
                                            <>
                                                <p className="font-bold text-slate-700 dark:text-slate-300">Click to browse or drag and drop</p>
                                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">PDF files only</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center gap-2 bg-brand-500 text-white px-8 py-3 rounded-full font-bold tracking-wide uppercase text-sm shadow-sm transition-all focus:ring-4 focus:ring-brand-500/20 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-600 hover:shadow-md'}`}
                            >
                                {loading ? 'Uploading...' : 'Upload Payslip'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManagerPayslips;
