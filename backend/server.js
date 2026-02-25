import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reimbursementRoutes from './routes/reimbursementRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import payslipRoutes from './routes/payslipRoutes.js';
import path from 'path';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reimbursements', reimbursementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payslips', payslipRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
