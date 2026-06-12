import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [nameQuery, setNameQuery] = useState(searchParams.get('name') || '');
  const [specializationQuery, setSpecializationQuery] = useState(searchParams.get('specialization') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async (queryString = '') => {
    setLoading(true);
    setError('');

    try {
      const data = await api.get(`/doctors${queryString}`);
      setBackendAvailable(true);
      setDoctors(data || []);
    } catch (err) {
      setError('Unable to load doctors from backend. Showing sample doctors.');
      setBackendAvailable(false);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (nameQuery.trim()) params.set('name', nameQuery.trim());
    if (specializationQuery.trim()) params.set('specialization', specializationQuery.trim());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    setSearchParams(params);
    loadDoctors(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (nameQuery.trim()) {
      params.set('name', nameQuery.trim());
    }
    if (specializationQuery.trim()) {
      params.set('specialization', specializationQuery.trim());
    }

    setSearchParams(params);
    await loadDoctors(params.toString() ? `?${params.toString()}` : '');
  };

  const handleClear = async () => {
    setNameQuery('');
    setSpecializationQuery('');
    setSearchParams({});
    await loadDoctors();
  };

  const isUsingBackend = backendAvailable && doctors.length > 0;
  const filteredSampleDoctors = sampleDoctors.filter((doctor) => {
    const matchesName = nameQuery
      ? doctor.name.toLowerCase().includes(nameQuery.toLowerCase())
      : true;
    const matchesSpecialization = specializationQuery
      ? doctor.specialization.toLowerCase().includes(specializationQuery.toLowerCase())
      : true;
    return matchesName && matchesSpecialization;
  });
  const doctorList = isUsingBackend ? doctors : filteredSampleDoctors;

  return (
    <>
      <Navbar />

      <div className="section">
        <h2>Available Doctors</h2>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-row">
            <input
              type="text"
              value={nameQuery}
              onChange={(event) => setNameQuery(event.target.value)}
              placeholder="Search by doctor name"
            />
            <input
              type="text"
              value={specializationQuery}
              onChange={(event) => setSpecializationQuery(event.target.value)}
              placeholder="Search by specialization"
            />
            <button type="submit" className="doctor-btn">
              Search
            </button>
            <button type="button" className="doctor-btn secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        {loading && <p>Loading doctors...</p>}
        {error && <p className="form-error">{error}</p>}
        {!backendAvailable && (
          <p className="form-error">Backend unavailable — showing sample doctors.</p>
        )}
        {!loading && backendAvailable && doctorList.length === 0 && (
          <p className="form-error">No doctors found matching your search.</p>
        )}

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

              {isUsingBackend ? (
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
