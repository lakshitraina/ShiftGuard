import express from 'express';
import { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize as roleAuthorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, roleAuthorize('employee'), applyLeave);
router.get('/my', protect, roleAuthorize('employee'), getMyLeaves);
router.get('/', protect, roleAuthorize('admin', 'manager'), getAllLeaves);
router.put('/:id/status', protect, roleAuthorize('admin', 'manager'), updateLeaveStatus);

export default router;
