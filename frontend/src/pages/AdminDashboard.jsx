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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500 mt-1">Manage system users and their access roles</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-medium border-b border-slate-200">
                            <tr>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4">Current Role</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 border-l-2 border-transparent hover:border-blue-500">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {editingUserId === user._id ? (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={editingRole}
                                                    onChange={(e) => setEditingRole(e.target.value)}
                                                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                                                >
                                                    <option value="employee">Employee</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button onClick={() => saveRole(user._id)} className="text-green-600 font-semibold px-2 hover:underline">Save</button>
                                                <button onClick={cancelEdit} className="text-slate-500 px-2 hover:underline">Cancel</button>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                    user.role === 'manager' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                        'bg-slate-100 text-slate-800 border-slate-200'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                                                {user.role === 'manager' && <Users size={12} className="mr-1" />}
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-center gap-3">
                                        {editingUserId !== user._id && (
                                            <>
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-colors focus:ring-2 focus:outline-none focus:ring-blue-300"
                                                    title="Edit Role"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors focus:ring-2 focus:outline-none focus:ring-red-300"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No users found in the system.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
