import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData();

    // Listen for custom storage change event
    const handleStorageChange = () => {
      getData();
    };

    window.addEventListener('storageChange', handleStorageChange);
    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, [location]);

  const getData = async () => {
    const data = await JSON.parse(sessionStorage.getItem('userData'));

    if (data && data.isLoggedIn) {
      setUserData(data.userData);
    } else {
      setUserData(null);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUserData(null);
    navigate('/');
    window.dispatchEvent(new Event('storageChange')); // Trigger update
  };

  const adminRoutes = ['/AdminScreen', '/bookscrud', '/addbook', '/editbook', '/users'];
  const userRoutes = ['/books', '/settings'];

  const isAdminSubPage = adminRoutes.some(route => location.pathname.startsWith(route)) && location.pathname !== '/AdminScreen';
  const isUserSubPage = userRoutes.some(route => location.pathname.startsWith(route));

  const goToAdminHome = () => {
    navigate('/AdminScreen');
  };

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

        {userData ? (
          <>
            <li className="navbar-profile">
              <Link to="/homeScreen" className={location.pathname === '/homeScreen' ? 'active' : ''} style={{ display: 'flex' }}>
                <span className="username">{userData.name}</span>
              </Link>
            </li>
            <li>
              <i className="fas fa-sign-out-alt logo-icon" style={{ cursor: 'pointer' }} onClick={logout}></i>
            </li>
          </>
        ) : adminRoutes.some(route => location.pathname.startsWith(route)) ? (
          <li>
            <i className="fas fa-sign-out-alt logo-icon" style={{ cursor: 'pointer' }} onClick={logout}></i>
          </li>
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
