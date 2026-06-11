import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function DoctorRegister() {
  const { registerDoctor } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    experience: "",
    clinic: "",
    licenseNumber: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerDoctor(formData);
      navigate('/doctor-dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Doctor Registration</h2>
          <p>Join HealHub and connect with patients.</p>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Phone Number"
              required
            />

            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>

            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              type="number"
              placeholder="Years of Experience"
              required
            />
            <input
              name="clinic"
              value={formData.clinic}
              onChange={handleChange}
              type="text"
              placeholder="Hospital / Clinic Name"
              required
            />
            <input
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              type="text"
              placeholder="Medical License Number"
              required
            />
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              type="text"
              placeholder="City"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register as Doctor'}
            </button>
          </form>

          {error && <p className="form-error">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default DoctorRegister;
