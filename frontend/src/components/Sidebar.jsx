import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, CheckSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    LMS <span className="text-blue-500">Pro</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {user.role === 'employee' && (
                    <>
                        <NavItem to="/employee" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        <NavItem to="/employee/apply" icon={<CalendarDays size={20} />} label="Apply Leave" />
                    </>
                )}

                {user.role === 'manager' && (
                    <>
                        <NavItem to="/manager" icon={<CheckSquare size={20} />} label="Leave Requests" />
                    </>
                )}

                {user.role === 'admin' && (
                    <>
                        <NavItem to="/admin" icon={<Users size={20} />} label="User Management" />
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 text-center">
                    &copy; 2026 LMS Pro
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
            }
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};

export default Sidebar;
