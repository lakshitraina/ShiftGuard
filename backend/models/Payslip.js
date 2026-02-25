import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent duplicate payslips for the same month and year
payslipSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

const Payslip = mongoose.model('Payslip', payslipSchema);

export default Payslip;
