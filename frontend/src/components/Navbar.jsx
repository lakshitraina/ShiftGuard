import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo/Title could go here if not in Sidebar */}
                        <h1 className="text-xl font-bold text-blue-600 sm:hidden">LMS</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline-block font-medium">{user.name}</span>
                                    <span className="hidden sm:inline-block px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 capitalize">
                                        {user.role}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:inline-block text-sm font-medium">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
