import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [location]);

  const getData = async () => {
    const data = await JSON.parse(sessionStorage.getItem('userData'));
    console.log('useEffect run');

    if (data && data.isLoggedIn) {
      setUserData(data.userData);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUserData(null);
    navigate('/');
  };

  // Define admin and user routes
  const adminRoutes = ['/AdminScreen', '/bookscrud', '/addbook', '/editbook', '/users'];
  const userRoutes = ['/books', '/settings']; // Removed '/homeScreen' from userRoutes

  // Check if it's an admin or user subpage (excluding main home pages)
  const isAdminSubPage = adminRoutes.some(route => location.pathname.startsWith(route)) && location.pathname !== '/AdminScreen';
  const isUserSubPage = userRoutes.some(route => location.pathname.startsWith(route)); // No need to exclude '/homeScreen'

  const goToAdminHome = () => {
    navigate('/AdminScreen');
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

        {/* Conditional Rendering based on user login status */}
        {userData ? (
          <>
            <li className="navbar-profile">
              <Link
                to="/homeScreen"
                className={location.pathname === '/homeScreen' ? 'active' : ''}
                style={{ display: 'flex' }}
              >
                <span className="username">{userData.name}</span>
              </Link>
            </li>
            <li>
              <i
                className="fas fa-sign-out-alt logo-icon"
                style={{ cursor: 'pointer' }}
                onClick={logout}
              ></i>
            </li>
          </>
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
