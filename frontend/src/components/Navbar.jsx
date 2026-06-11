import { Link, useNavigate } from "react-router-dom";
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
