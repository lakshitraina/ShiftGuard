import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Present'],
        required: true
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent duplicate attendance for the same day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
