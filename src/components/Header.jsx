import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize userData directly from sessionStorage
  const [userData, setUserData] = useState(() => {
    const storedData = JSON.parse(sessionStorage.getItem('userData'));
    return storedData?.isLoggedIn ? storedData.userData : null;
  });

  useEffect(() => {
    getData();
  }, [location]);

  const getData = async () => {
    const data = JSON.parse(sessionStorage.getItem('userData'));
    console.log('useEffect run', data);

    if (data?.isLoggedIn) {
      setUserData(data.userData);
    } else {
      setUserData(null);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUserData(null);
    navigate('/');
  };

  // Define admin and user routes
  const adminRoutes = ['/AdminScreen', '/bookscrud', '/addbook', '/editbook', '/users'];
  const userSubPages = ['/books', '/settings'];

  const isAdminSubPage = adminRoutes.some(route => location.pathname.startsWith(route)) && location.pathname !== '/AdminScreen';
  const isUserSubPage = userSubPages.some(route => location.pathname.startsWith(route));

  const goToAdminHome = () => navigate('/AdminScreen');
  const goToUserHome = () => navigate('/homeScreen');

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">LIBRARY-MANAGEMENT-SYSTEM</span>
      </div>
      <ul className="navbar-links">
        {isAdminSubPage && (
          <li>
            <button className="admin-home-btn" onClick={goToAdminHome}>
              Admin Home
            </button>
          </li>
        )}

        {isUserSubPage && location.pathname !== '/homeScreen' && (
          <li>
            <button className="user-home-btn" onClick={goToUserHome}>
              Home
            </button>
          </li>
        )}

        {/* Correct conditional rendering for login/logout */}
        {userData ? (
          <>
            <li className="navbar-profile">
              <Link to="/homeScreen" className={location.pathname === '/homeScreen' ? 'active' : ''}>
                <span className="username">{userData.name}</span>
              </Link>
            </li>
            <li>
              <i className="fas fa-sign-out-alt logo-icon" style={{ cursor: 'pointer' }} onClick={logout}></i>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
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
