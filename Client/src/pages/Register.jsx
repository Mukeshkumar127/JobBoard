import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/', { replace: true });
  }
}, [navigate]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('❌ Invalid email format.');
      return;
    }

    if (formData.password.length < 4) {
      setError('❌ Password must be at least 4 characters.');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      alert('Registration successful ✅');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError('❌ Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <p className="bg-red-600 text-white text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 bg-gray-700 border border-gray-600 rounded text-white"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 bg-gray-700 border border-gray-600 rounded text-white"
          required
        />

        <input
          type="password"
          placeholder="Password (min 4 characters)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 bg-gray-700 border border-gray-600 rounded text-white"
          required
        />

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full mb-4 p-2 bg-gray-700 border border-gray-600 rounded text-white"
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
