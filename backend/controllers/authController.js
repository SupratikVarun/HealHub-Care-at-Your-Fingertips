import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const registerPatient = async (req, res) => {
  const { name, phone, age, gender, city } = req.body;
  if (!name || !phone || !age || !gender || !city) {
    return res.status(400).json({ message: 'All fields are required for patient registration' });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ message: 'Phone number is already registered' });
  }

  const user = await User.create({
    name,
    phone,
    role: 'patient',
    age,
    gender,
    city,
  });

  return res.status(201).json({
    token: generateToken(user._id),
    user,
  });
};

export const registerDoctor = async (req, res) => {
  const { name, phone, specialization, experience, clinic, licenseNumber, city } = req.body;
  if (!name || !phone || !specialization || !experience || !clinic || !licenseNumber) {
    return res.status(400).json({ message: 'All doctor registration fields are required' });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ message: 'Phone number is already registered' });
  }

  const user = await User.create({
    name,
    phone,
    role: 'doctor',
    specialization,
    experience,
    clinic,
    licenseNumber,
    city,
  });

  return res.status(201).json({
    token: generateToken(user._id),
    user,
  });
};

export const login = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required to login' });
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ message: 'User not found. Please register first' });
  }

  return res.json({
    token: generateToken(user._id),
    user,
  });
};

export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json(req.user);
};
