import express from 'express';
const router = express.Router();
import { applyReimbursement, getReimbursements, getMyReimbursements, updateReimbursementStatus } from '../controllers/reimbursementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.post('/', protect, applyReimbursement);
router.get('/my', protect, getMyReimbursements);
router.get('/', protect, authorize('admin', 'manager'), getReimbursements);
router.put('/:id/status', protect, authorize('admin', 'manager'), updateReimbursementStatus);

export default router;
