import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ApplyJob() {
  const [resume, setResume] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', resume);

    try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/apply/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Application submitted successfully ✅');
    navigate('/candidate');

  } catch (err) {
    if (err.response?.status === 409) {
        alert('⚠️ You have already applied to this job.');
      } else {
        console.error(err);
        alert('❌ Failed to submit application. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-full max-w-md border border-gray-700 shadow">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">Apply for this Job</h2>

        <label className="block text-sm text-gray-300 mb-2">
          Upload your resume (.pdf, .doc, or .docx only):
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4 text-white"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default ApplyJob;
