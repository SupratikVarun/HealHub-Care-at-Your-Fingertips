import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function PatientDashboard() {
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
          <p>Loading your dashboard...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section">
          <h2>Patient Dashboard</h2>
          <p>
            Please <Link to="/login">login</Link> to view your dashboard.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Patient Dashboard</h2>

        <div className="card">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>City:</strong> {user.city || 'Not provided'}</p>
        </div>

        <br />

        <div className="card">
          <h3>My Appointments</h3>
          {error && <p className="form-error">{error}</p>}
          {appointments.length === 0 ? (
            <p>No appointments yet. <Link to="/doctors">Find a doctor</Link> to book one.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <p><strong>Doctor:</strong> {appointment.doctor?.name || 'Unknown'}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default PatientDashboard;
