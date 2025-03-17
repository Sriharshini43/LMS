import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getData();

    const handleStorageChange = () => {
      getData();
    };

    window.addEventListener("storageChange", handleStorageChange);
    return () => {
      window.removeEventListener("storageChange", handleStorageChange);
    };
  }, [location]);

  const getData = () => {
    const name = sessionStorage.getItem("name");
    const email = sessionStorage.getItem("email");
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn && name && email) {
      setUserData({ name, email });
    } else {
      setUserData(null);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUserData(null);
    navigate("/");
    window.dispatchEvent(new Event("storageChange")); // Trigger update
  };

  // Define admin and user routes
  const adminRoutes = ['/AdminScreen', '/bookscrud', '/addbook', '/editbook', '/users'];
  const userRoutes = ['/books', '/settings'];

  // Check if it's an admin or user subpage (excluding main home pages)
  const isAdminSubPage = adminRoutes.some(route => location.pathname.startsWith(route)) && location.pathname !== '/AdminScreen';
  const isUserSubPage = userRoutes.some(route => location.pathname.startsWith(route));

  const goToAdminHome = () => {
    navigate('/AdminScreen');
  };

  const goToUserHome = () => {
    navigate('/homeScreen');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">LIBRARY-MANAGEMENT-SYSTEM</span>
      </div>
      <ul className="navbar-links">
        {/* Show "Admin Home" button only on admin subpages */}
        {isAdminSubPage && (
          <li>
            <button className="admin-home-btn" onClick={goToAdminHome}>
              Admin Home
            </button>
          </li>
        )}

        {/* Show "User Home" button only on user subpages */}
        {isUserSubPage && (
          <li>
            <button className="user-home-btn" onClick={goToUserHome}>
              User Home
            </button>
          </li>
        )}

        {/* Conditional Rendering based on user login status */}
        {userData ? (
          <li>
            <i
              className="fas fa-sign-out-alt logo-icon"
              style={{ cursor: 'pointer' }}
              onClick={logout}
            ></i>
          </li>
        ) : adminRoutes.some(route => location.pathname.startsWith(route)) ? (
          <li>
            <i
              className="fas fa-sign-out-alt logo-icon"
              style={{ cursor: 'pointer' }}
              onClick={logout}
            ></i>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className={location.pathname === '/login' ? 'active' : ''}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={location.pathname === '/signup' ? 'active' : ''}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
