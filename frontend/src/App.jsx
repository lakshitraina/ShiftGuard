import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeReimbursements from './pages/EmployeeReimbursements';
import ManagerReimbursements from './pages/ManagerReimbursements';
import EmployeeAttendance from './pages/EmployeeAttendance';
import EmployeePayslips from './pages/EmployeePayslips';
import ManagerPayslips from './pages/ManagerPayslips';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-slate-950">
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
        </div>
    );
};

const RootRedirect = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (!user) return <Navigate to="/login" replace />;

    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'manager') return <Navigate to="/manager" replace />;
    if (user.role === 'employee') return <Navigate to="/employee" replace />;

    // Fallback for invalid role
    return <Navigate to="/login" replace />;
};

function AppContent() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen relative">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/employee"
                        element={
                            <ProtectedRoute roles={['employee']}>
                                <Layout><EmployeeDashboard /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/employee/reimbursements"
                        element={
                            <ProtectedRoute roles={['employee']}>
                                <Layout><EmployeeReimbursements /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/employee/attendance"
                        element={
                            <ProtectedRoute roles={['employee']}>
                                <Layout><EmployeeAttendance /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/employee/payslips"
                        element={
                            <ProtectedRoute roles={['employee']}>
                                <Layout><EmployeePayslips /></Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manager"
                        element={
                            <ProtectedRoute roles={['manager']}>
                                <Layout><ManagerDashboard /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/reimbursements"
                        element={
                            <ProtectedRoute roles={['manager', 'admin']}>
                                <Layout><ManagerReimbursements /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager/payslips"
                        element={
                            <ProtectedRoute roles={['manager', 'admin']}>
                                <Layout><ManagerPayslips /></Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <Layout><AdminDashboard /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/reimbursements"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <Layout><ManagerReimbursements /></Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Base Route Redirect */}
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
