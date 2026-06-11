import User from '../models/User.js';

export const getDoctors = async (req, res) => {
  const { specialization, city } = req.query;
  const filter = { role: 'doctor' };

  if (specialization) {
    filter.specialization = specialization;
  }
  if (city) {
    filter.city = city;
  }

  const doctors = await User.find(filter).select('-__v -createdAt -updatedAt');
  return res.json(doctors);
};
