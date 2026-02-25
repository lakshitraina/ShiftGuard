import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, User as UserIcon, Calendar, Moon, Sun, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Calendar size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            ShiftGuard
                        </span>
                    </div>

                    {/* Navigation - Desktop (Only if logged in) */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-8">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Users</Link>
                            )}
                            {user.role === 'manager' && (
                                <Link to="/manager" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Team Leaves</Link>
                            )}
                            {user.role === 'employee' && (
                                <Link to="/employee" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">My Leaves</Link>
                            )}
                        </div>
                    )}

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Profile Dropdown logic (Only if logged in) */}
                        {user ? (
                            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4 ml-2">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</span>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                    <UserIcon size={18} />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4 ml-2">
                                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg transition-colors">Log in</Link>
                                <Link to="/register" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">Sign up</Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
