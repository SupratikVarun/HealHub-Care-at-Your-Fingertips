from pathlib import Path

files = {
    'src/components/Navbar.jsx': '''import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <h2 className="logo">HealHub</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/doctors">Doctors</Link>
          {user ? (
            <>
              {user.role === 'patient' ? (
                <Link to="/patient-dashboard">Patient Dashboard</Link>
              ) : (
                <Link to="/doctor-dashboard">Doctor Dashboard</Link>
              )}
              <Link to="/my-appointments">My Appointments</Link>
              <button className="nav-logout" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register-patient">
                <button>Patient Register</button>
              </Link>
              <Link to="/register-doctor">
                <button>Doctor Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
''',
    'src/pages/Login.jsx': '''import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await login(phone.trim());
      navigate(result.user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Login to HealHub</h2>
          <p>Enter your phone number to login.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {error && <p className="form-error">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default Login;
''',
    'src/pages/PatientRegister.jsx': '''import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function PatientRegister() {
  const { registerPatient } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
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
      await registerPatient(formData);
      navigate('/patient-dashboard');
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
          <h2>Create Your HealHub Account</h2>
          <p>Register to book and manage your appointments easily.</p>

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
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              type="number"
              placeholder="Age"
              required
            />

            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              type="text"
              placeholder="City"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {error && <p className="form-error">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default PatientRegister;
''',
    'src/pages/DoctorRegister.jsx': '''import { useState } from "react";
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
''',
    'src/pages/Doctors.jsx': '''import { useEffect, useState } from "react";
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
''',
    'src/pages/Appointment.jsx': '''import { useEffect, useState } from "react";
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
''',
    'src/pages/PatientDashboard.jsx': '''import { useEffect, useState } from "react";
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
''',
    'src/pages/DoctorDashboard.jsx': '''import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function DoctorDashboard() {
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
          <h2>Doctor Dashboard</h2>
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
        <h2>Doctor Dashboard</h2>

        <div className="card">
          <h3>Doctor Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Specialization:</strong> {user.specialization || 'Not provided'}</p>
          <p><strong>Experience:</strong> {user.experience ? `${user.experience} Years` : 'Not provided'}</p>
        </div>

        <br />

        <div className="card">
          <h3>Today's Appointments</h3>
          {error && <p className="form-error">{error}</p>}
          {appointments.length === 0 ? (
            <p>No appointments scheduled. <Link to="/doctors">Share your profile</Link> to attract patients.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <p><strong>Patient:</strong> {appointment.patient?.name || 'Unknown'}</p>
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

export default DoctorDashboard;
''',
    'src/pages/MyAppointments.jsx': '''import { useEffect, useState } from "react";
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
'''
}
for path, content in files.items():
    Path(path).write_text(content, encoding='utf-8')
