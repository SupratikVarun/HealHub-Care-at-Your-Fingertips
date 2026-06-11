import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      default: 'patient',
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    city: String,
    specialization: String,
    experience: Number,
    clinic: String,
    licenseNumber: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
