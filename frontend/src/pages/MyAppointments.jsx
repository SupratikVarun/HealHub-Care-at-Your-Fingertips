import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function MyAppointments() {
  const { user, token, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadAppointments = async () => {
      try {
        const data = await api.get('/appointments', token);
        setAppointments(data || []);
      } catch (err) {
        setError('Unable to load your appointments.');
      }
    };

    loadAppointments();
  }, [user, token]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="section">
          <p>Loading appointments...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section">
          <h2>My Appointments</h2>
          <p>
            Please <Link to="/login">login</Link> to view your appointments.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="section">
        <h2>My Appointments</h2>
        {error && <p className="form-error">{error}</p>}

        {appointments.length === 0 ? (
          <p>No appointments found. <Link to="/doctors">Book a doctor</Link> to get started.</p>
        ) : (
          <div className="cards">
            {appointments.map((appointment) => (
              <div className="card" key={appointment._id}>
                <h3>{user.role === 'doctor' ? appointment.patient?.name : appointment.doctor?.name}</h3>
                <p><strong>Specialization:</strong> {appointment.doctor?.specialization || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyAppointments;
