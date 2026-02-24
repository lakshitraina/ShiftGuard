import Leave from '../models/Leave.js';

// @desc    Apply for a new leave
// @route   POST /api/leave
// @access  Private (Employee)
export const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;

        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const leave = await Leave.create({
            employeeId: req.user._id,
            startDate,
            endDate,
            reason,
            status: 'pending',
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user leaves
// @route   GET /api/leave/my
// @access  Private (Employee)
export const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending leaves or all leaves based on role
// @route   GET /api/leave
// @access  Private (Admin, Manager)
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({}).populate('employeeId', 'name email').sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update leave status
// @route   PUT /api/leave/:id/status
// @access  Private (Admin, Manager)
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        leave.status = status;
        leave.approvedBy = req.user._id;

        const updatedLeave = await leave.save();
        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
