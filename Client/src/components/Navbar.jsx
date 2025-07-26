import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-gray-950 text-white px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-500 hover:text-indigo-400"
        >
          JobBoard
        </Link>

        <div className="flex gap-4 items-center">
          {!token ? (
            <>
              <Link to="/login" className="hover:text-indigo-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-indigo-400 transition">
                Register
              </Link>
            </>
          ) : (
            <>
              {token && user?.role === "employer" && (
                <Link to="/employer" className="hover:text-indigo-400">
                  Employer Dashboard
                </Link>
              )}
              {token && user?.role === "candidate" && (
                <Link to="/candidate" className="hover:text-indigo-400">
                  Candidate Dashboard
                </Link>
              )}
              {token && (
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm cursor-pointer"
                >
                  Logout
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
