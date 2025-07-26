import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Briefcase, MapPin } from "lucide-react";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/jobs`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-indigo-400 mb-10">
          Explore Exciting Opportunities
        </h1>

        <div className="max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search jobs by title, company or location..."
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-indigo-600/40 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-indigo-300">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <Briefcase className="w-4 h-4" /> {job.company}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {job.location}
                </p>
                <p className="text-gray-300 mt-3 text-sm line-clamp-3">
                  {job.description}
                </p>
                <Link
                  to={`/job/${job._id}`}
                  className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition text-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-16 text-lg">
            No jobs found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
