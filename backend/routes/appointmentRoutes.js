import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').post(createAppointment).get(getAppointments);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
