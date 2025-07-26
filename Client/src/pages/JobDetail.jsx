import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function JobDetail() {
  const [job, setJob] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs/${id}`
        );
        setJob(res.data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      alert("Please login first to apply");
      navigate("/login");
    } else if (user?.role === "candidate") {
      navigate(`/apply/${job._id}`);
    } else {
      alert("Only candidates can apply for jobs");
    }
  };

  if (!job) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md">
        <h1 className="text-3xl font-bold text-indigo-400 mb-3">{job.title}</h1>
        <p className="text-gray-400 mb-1">
          {job.company} — {job.location}
        </p>
        <p className="text-gray-300 mb-4">{job.description}</p>

        <button
          onClick={handleApplyClick}
          className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobDetail;
