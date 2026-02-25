import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { markAttendance, getMyAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', protect, markAttendance);
router.get('/', protect, getMyAttendance);

export default router;
