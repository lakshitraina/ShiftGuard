import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, User as UserIcon, Calendar, Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#f8f9fa] dark:bg-slate-950 top-0 z-50 py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center relative">

                {/* Brand */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 tracking-tight flex items-center">
                        Shift<span className="text-slate-900 dark:text-white font-bold">Guard</span>
                    </span>
                </div>

                {/* Navigation - Centered Pill (Only if logged in) */}
                {user && (
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 shadow-soft dark:shadow-none rounded-full px-6 py-2.5 items-center gap-6 border border-slate-100 dark:border-slate-800">
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">Users</Link>
                                <Link to="/admin/reimbursements" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">Reimbursements</Link>
                            </>
                        )}
                        {user.role === 'manager' && (
                            <>
                                <Link to="/manager" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors"><Calendar size={16} /> Team Leaves</Link>
                                <Link to="/manager/reimbursements" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">Reimbursements</Link>
                                <Link to="/manager/payslips" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">Payslips</Link>
                            </>
                        )}
                        {user.role === 'employee' && (
                            <>
                                <Link to="/employee" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors"><Calendar size={16} /> My Leaves</Link>
                                <Link to="/employee/reimbursements" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">Reimbursements</Link>
                                <Link to="/employee/attendance" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">Attendance</Link>
                                <Link to="/employee/payslips" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center gap-2 transition-colors">Payslips</Link>
                            </>
                        )}
                    </div>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">

                    {/* Theme Toggle & Notifications - Light mode focus, keeping toggle for functionality if needed but styling it light */}
                    <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                        {user && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                                aria-label="Toggle mobile menu"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}
                        <button className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hidden sm:block">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hidden sm:block"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Profile Dropdown logic (Only if logged in) */}
                    {user ? (
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 shadow-soft dark:shadow-none rounded-full pl-2 pr-4 py-1.5 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=f1f5f9&color=0f172a`} alt="Avatar" className="w-full h-full object-cover dark:opacity-80" />
                                </div>
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">{user.role}</span>
                                </div>
                            </div>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                title="Logout"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 transition-colors">Log in</Link>
                            <Link to="/register" className="text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full transition-colors shadow-sm dark:shadow-none">Sign up</Link>
                        </div>
                    )}
                </div>

            </div>

            {/* Mobile Navigation Menu */}
            {user && isMobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    {user.role === 'admin' && (
                        <div className="flex flex-col gap-4 px-2">
                            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Users</Link>
                            <Link to="/admin/reimbursements" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Reimbursements</Link>
                        </div>
                    )}
                    {user.role === 'manager' && (
                        <div className="flex flex-col gap-4 px-2">
                            <Link to="/manager" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium flex items-center gap-2"><Calendar size={18} /> Team Leaves</Link>
                            <Link to="/manager/reimbursements" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Reimbursements</Link>
                            <Link to="/manager/payslips" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Payslips</Link>
                        </div>
                    )}
                    {user.role === 'employee' && (
                        <div className="flex flex-col gap-4 px-2">
                            <Link to="/employee" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium flex items-center gap-2"><Calendar size={18} /> My Leaves</Link>
                            <Link to="/employee/reimbursements" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Reimbursements</Link>
                            <Link to="/employee/attendance" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Attendance</Link>
                            <Link to="/employee/payslips" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium">Payslips</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
