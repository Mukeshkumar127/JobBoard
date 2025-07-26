import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">Candidate Dashboard</h1>
        {applications.length === 0 ? (
          <p className="text-gray-400 text-center">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="grid gap-5">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-md shadow"
              >
                <h2 className="text-xl font-semibold text-indigo-300">{app.job?.title}</h2>
                <p className="text-gray-400 text-sm mb-1">
                  {app.job?.company} — {app.job?.location}
                </p>
                <p className="text-sm text-gray-300">Status: {app.status || 'Pending'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;
