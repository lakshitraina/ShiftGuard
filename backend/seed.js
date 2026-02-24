import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const seedUsers = async () => {
    try {
        await User.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@company.com',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'Manager User',
                email: 'manager@company.com',
                password: 'password123',
                role: 'manager',
            },
            {
                name: 'Employee One',
                email: 'employee1@company.com',
                password: 'password123',
                role: 'employee',
            },
            {
                name: 'Employee Two',
                email: 'employee2@company.com',
                password: 'password123',
                role: 'employee',
            }
        ];

        for (const user of users) {
            await User.create(user);
        }

        console.log('Database Seeded!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
