import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";

const sampleDoctors = [
  {
    _id: 'sample-1',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiologist',
    experience: '10 Years',
    rating: '4.8',
    location: 'Hyderabad',
  },
  {
    _id: 'sample-2',
    name: 'Dr. Priya Sharma',
    specialization: 'Dermatologist',
    experience: '8 Years',
    rating: '4.7',
    location: 'Hyderabad',
  },
  {
    _id: 'sample-3',
    name: 'Dr. Arjun Reddy',
    specialization: 'Neurologist',
    experience: '12 Years',
    rating: '4.9',
    location: 'Secunderabad',
  },
  {
    _id: 'sample-4',
    name: 'Dr. Sneha Patel',
    specialization: 'Orthopedic',
    experience: '7 Years',
    rating: '4.6',
    location: 'Hyderabad',
  },
];

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await api.get('/doctors');
        setDoctors(data || []);
      } catch (err) {
        setError('Unable to load doctors from backend. Showing sample doctors.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const hasBackendDoctors = doctors.length > 0;
  const doctorList = hasBackendDoctors ? doctors : sampleDoctors;

  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Available Doctors</h2>

        {loading && <p>Loading doctors...</p>}
        {error && <p className="form-error">{error}</p>}

        <div className="cards">
          {doctorList.map((doctor) => (
            <div className="card" key={doctor._id}>
              <h3>{doctor.name}</h3>

              <p>
                <strong>Specialization:</strong> {doctor.specialization}
              </p>

              <p>
                <strong>Experience:</strong> {doctor.experience}
              </p>

              <p>
                <strong>Rating:</strong> ⭐ {doctor.rating}
              </p>

              <p>
                <strong>Location:</strong> {doctor.location || doctor.city || 'Unknown'}
              </p>

              {hasBackendDoctors ? (
                <Link to={`/appointment?doctorId=${doctor._id}`}>
                  <button className="doctor-btn">Book Appointment</button>
                </Link>
              ) : (
                <button className="doctor-btn" disabled>
                  Login to book
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Doctors;
