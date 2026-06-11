import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
  const { doctorId, date, time, reason } = req.body;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: 'Doctor, date, and time are required to book an appointment' });
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    date,
    time,
    reason,
  });

  return res.status(201).json(appointment);
};

export const getAppointments = async (req, res) => {
  const filter = {};

  if (req.user.role === 'patient') {
    filter.patient = req.user._id;
  } else if (req.user.role === 'doctor') {
    filter.doctor = req.user._id;
  }

  const appointments = await Appointment.find(filter)
    .populate('patient', 'name phone city')
    .populate('doctor', 'name specialization clinic');

  return res.json(appointments);
};

export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  if (req.user.role !== 'doctor' || appointment.doctor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only the assigned doctor can update the appointment status' });
  }

  appointment.status = status || appointment.status;
  await appointment.save();

  return res.json(appointment);
};
