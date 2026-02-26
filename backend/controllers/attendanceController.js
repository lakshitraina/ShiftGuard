import Attendance from '../models/Attendance.js';

// @desc    Mark attendance for the current day
// @route   POST /api/attendance
// @access  Private
export const markAttendance = async (req, res) => {
    try {
        // Get current hour in IST timezone (Asia/Kolkata)
        const currentHour = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }));

        // Check window (9 AM to 5 PM)
        if (currentHour < 9 || currentHour >= 17) {
            return res.status(400).json({ message: 'Attendance can only be marked between 09:00 AM and 05:00 PM.' });
        }

        // Get date string in YYYY-MM-DD format for IST timezone
        const dateString = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        // Check if already marked for today
        const existingAttendance = await Attendance.findOne({
            employeeId: req.user._id,
            date: dateString
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for today.' });
        }

        const attendance = await Attendance.create({
            employeeId: req.user._id,
            date: dateString,
            status: 'Present'
        });

        res.status(201).json(attendance);

    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user attendances
// @route   GET /api/attendance
// @access  Private
export const getMyAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ employeeId: req.user._id }).sort({ date: -1 });
        res.json(attendanceRecords);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
