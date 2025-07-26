import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmployerDashboard() {
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: ''
  });
  const [jobs, setJobs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.filter(job => job.postedBy === getUserIdFromToken()));
    } catch (err) {
      console.error(err);
    }
  };

  const getUserIdFromToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', company: '', location: '', description: '' });
      fetchMyJobs();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage('❌ Only the admin can post jobs.');
      } else {
        setErrorMessage('❌ Something went wrong while posting the job.');
      }
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-indigo-400 text-center">Employer Dashboard</h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4 border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-white">Post a Job</h2>
          <input name="title" type="text" placeholder="Job Title" required
            value={formData.title} onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <input name="company" type="text" placeholder="Company" required
            value={formData.company} onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <input name="location" type="text" placeholder="Location" required
            value={formData.location} onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          <textarea name="description" rows="4" placeholder="Job Description" required
            value={formData.description} onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
          
          {errorMessage && (
            <div className="text-red-400 font-medium">{errorMessage}</div>
          )}

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Post Job</button>
        </form>

        <div>
          <h2 className="text-2xl font-semibold text-indigo-300 mb-4">Your Posted Jobs</h2>
          <div className="grid gap-6">
            {jobs.length === 0 ? (
              <p className="text-gray-400">You haven't posted any jobs yet.</p>
            ) : (
              jobs.map(job => (
                <div key={job._id} className="bg-white/5 border border-white/10 p-5 rounded-lg backdrop-blur shadow-md">
                  <h3 className="text-xl font-semibold text-indigo-200">{job.title}</h3>
                  <p className="text-gray-400 text-sm mb-1">{job.company} — {job.location}</p>
                  <p className="text-gray-300 text-sm mb-2">{job.description}</p>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Delete Job
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
