import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize as roleAuthorize } from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadPayslip, getMyPayslips, getAllPayslips } from '../controllers/payslipController.js';

const router = express.Router();

router.post('/', protect, roleAuthorize('manager', 'admin'), upload.single('payslip'), uploadPayslip);
router.get('/', protect, getMyPayslips);
router.get('/all', protect, roleAuthorize('manager', 'admin'), getAllPayslips);

export default router;
