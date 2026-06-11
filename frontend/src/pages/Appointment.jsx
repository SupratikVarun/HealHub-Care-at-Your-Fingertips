import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function Appointment() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await api.get('/doctors');
        setDoctors(data || []);
        const doctorId = searchParams.get('doctorId');
        setSelectedDoctor(doctorId || (data?.[0]?._id) || '');
      } catch (err) {
        setError('Unable to load doctors from backend.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must log in as a patient to book an appointment.');
      return;
    }

    if (user.role !== 'patient') {
      setError('Only patients can book appointments from this page.');
      return;
    }

    if (!selectedDoctor || !date || !time) {
      setError('Please choose a doctor, date, and time.');
      return;
    }

    try {
      await api.post(
        '/appointments',
        {
          doctorId: selectedDoctor,
          date,
          time,
          reason,
        },
        token,
      );

      setSuccess('Appointment booked successfully. Redirecting...');
      setTimeout(() => navigate('/my-appointments'), 1200);
    } catch (err) {
      setError(err.message || 'Unable to book appointment');
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="section">
          <h2>Book Appointment</h2>
          <p>Please login as a patient before booking an appointment.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Book Appointment</h2>
          <p>Fill in your details to schedule your doctor visit.</p>

          <form onSubmit={handleSubmit}>
            <p><strong>Patient:</strong> {user.name} ({user.phone})</p>

            <label>
              Select Doctor
              <select
                value={selectedDoctor}
                onChange={(event) => setSelectedDoctor(event.target.value)}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <select value={time} onChange={(event) => setTime(event.target.value)} required>
              <option value="">Select Time Slot</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="04:30 PM">04:30 PM</option>
            </select>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Reason for visit (optional)"
            />

            <button type="submit">Confirm Appointment</button>
          </form>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}
          {loading && <p>Loading doctors...</p>}
        </div>
      </div>
    </>
  );
}

export default Appointment;
