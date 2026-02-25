import Payslip from '../models/Payslip.js';
import User from '../models/User.js';

// @desc    Upload a new payslip
// @route   POST /api/payslips
// @access  Private/Manager or Admin
export const uploadPayslip = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        const { employeeId, month, year } = req.body;

        if (!employeeId || !month || !year) {
            return res.status(400).json({ message: 'Employee ID, month, and year are required' });
        }

        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if payslip already exists for this month and year
        const existingPayslip = await Payslip.findOne({
            employeeId,
            month,
            year: Number(year)
        });

        if (existingPayslip) {
            return res.status(400).json({ message: `Payslip already exists for ${month} ${year}` });
        }

        const payslip = await Payslip.create({
            employeeId,
            month,
            year: Number(year),
            fileUrl: `/uploads/${req.file.filename}`
        });

        res.status(201).json(payslip);

    } catch (error) {
        console.error('Error uploading payslip:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user payslips
// @route   GET /api/payslips
// @access  Private
export const getMyPayslips = async (req, res) => {
    try {
        // Find payslips and populate employee info
        const payslips = await Payslip.find({ employeeId: req.user._id })
            .sort({ year: -1, month: -1 })
            .populate('employeeId', 'name email');

        res.json(payslips);
    } catch (error) {
        console.error('Error fetching payslips:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all payslips (Manager/Admin view)
// @route   GET /api/payslips/all
// @access  Private/Manager or Admin
export const getAllPayslips = async (req, res) => {
    try {
        const payslips = await Payslip.find({})
            .sort({ year: -1, month: -1, createdAt: -1 })
            .populate('employeeId', 'name email department role');

        res.json(payslips);
    } catch (error) {
        console.error('Error fetching all payslips:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
