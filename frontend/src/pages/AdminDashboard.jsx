import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Shield, Trash2, Edit2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingRole, setEditingRole] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const startEdit = (user) => {
        setEditingUserId(user._id);
        setEditingRole(user.role);
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        setEditingRole('');
    };

    const saveRole = async (id) => {
        try {
            const res = await api.put(`/users/${id}/role`, { role: editingRole });
            setUsers(users.map(u => u._id === id ? res.data : u));
            setEditingUserId(null);
        } catch (err) {
            alert('Failed to update role');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage system users and their access roles</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-accent-red p-4 rounded-xl flex items-start shadow-sm">
                    <AlertCircle className="h-5 w-5 text-accent-red mr-2 mt-0.5" />
                    <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-5 rounded-tl-3xl whitespace-nowrap">Name</th>
                                <th scope="col" className="px-6 py-5 whitespace-nowrap">Email</th>
                                <th scope="col" className="px-6 py-5 whitespace-nowrap">Current Role</th>
                                <th scope="col" className="px-6 py-5 text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=f1f5f9&color=0f172a`} alt="Avatar" className="w-full h-full object-cover dark:opacity-80" />
                                            </div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingUserId === user._id ? (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={editingRole}
                                                    onChange={(e) => setEditingRole(e.target.value)}
                                                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-2"
                                                >
                                                    <option value="employee">Employee</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button onClick={() => saveRole(user._id)} className="text-accent-green dark:text-green-500 font-bold text-[11px] uppercase tracking-widest px-2 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg py-1 transition-colors">Save</button>
                                                <button onClick={cancelEdit} className="text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-widest px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg py-1 transition-colors">Cancel</button>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' :
                                                user.role === 'manager' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-900/50' :
                                                    'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={12} className="mr-1.5" />}
                                                {user.role === 'manager' && <Users size={12} className="mr-1.5" />}
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-center gap-3 whitespace-nowrap">
                                        {editingUserId !== user._id && (
                                            <>
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="text-brand-500 hover:text-white hover:bg-brand-500 p-2 rounded-xl transition-colors shrink-0"
                                                    title="Edit Role"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-accent-red hover:text-white hover:bg-accent-red p-2 rounded-xl transition-colors shrink-0"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[11px]">No users found in the system.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
