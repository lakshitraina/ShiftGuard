import express from 'express';
import { getUsers, getEmployees, updateUserRole, deleteUser, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize as roleAuthorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, roleAuthorize('admin'), getUsers);

router.route('/employees')
    .get(protect, roleAuthorize('admin', 'manager'), getEmployees);

router.route('/profile')
    .put(protect, updateProfile);

router.route('/:id/role')
    .put(protect, roleAuthorize('admin'), updateUserRole);

router.route('/:id')
    .delete(protect, roleAuthorize('admin'), deleteUser);

export default router;
