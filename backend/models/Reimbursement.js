import mongoose from 'mongoose';

const reimbursementSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rejectionReason: {
        type: String,
    }
}, {
    timestamps: true,
});

const Reimbursement = mongoose.model('Reimbursement', reimbursementSchema);
export default Reimbursement;
