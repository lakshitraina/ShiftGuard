import Reimbursement from '../models/Reimbursement.js';

// @desc    Apply for reimbursement
// @route   POST /api/reimbursements
// @access  Private
const applyReimbursement = async (req, res) => {
    try {
        const { amount, description } = req.body;

        if (!amount || !description) {
            return res.status(400).json({ message: 'Please provide amount and description' });
        }

        const reimbursement = await Reimbursement.create({
            employeeId: req.user._id,
            amount,
            description,
        });

        res.status(201).json(reimbursement);
    } catch (error) {
        res.status(500).json({ message: 'Error applying for reimbursement', error: error.message });
    }
};

// @desc    Get user's own reimbursements
// @route   GET /api/reimbursements/my
// @access  Private
const getMyReimbursements = async (req, res) => {
    try {
        const reimbursements = await Reimbursement.find({ employeeId: req.user._id })
            .populate('employeeId', 'name email')
            .populate('approvedBy', 'name');

        res.status(200).json(reimbursements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching my reimbursements', error: error.message });
    }
};

// @desc    Get all reimbursements (managers/admins)
// @route   GET /api/reimbursements
// @access  Private
const getReimbursements = async (req, res) => {
    try {
        // Managers and Admins see all reimbursements
        reimbursements = await Reimbursement.find({})
            .populate('employeeId', 'name email role')
            .populate('approvedBy', 'name');

        res.status(200).json(reimbursements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reimbursements', error: error.message });
    }
};

// @desc    Update reimbursement status
// @route   PUT /api/reimbursements/:id/status
// @access  Private (Manager/Admin only)
const updateReimbursementStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const reimbursementId = req.params.id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        const reimbursement = await Reimbursement.findById(reimbursementId);

        if (!reimbursement) {
            return res.status(404).json({ message: 'Reimbursement not found' });
        }

        reimbursement.status = status;
        reimbursement.approvedBy = req.user._id;

        if (status === 'rejected' && rejectionReason) {
            reimbursement.rejectionReason = rejectionReason;
        }

        const updatedReimbursement = await reimbursement.save();
        res.status(200).json(updatedReimbursement);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reimbursement status', error: error.message });
    }
};

export {
    applyReimbursement,
    getMyReimbursements,
    getReimbursements,
    updateReimbursementStatus
};
