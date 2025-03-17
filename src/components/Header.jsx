import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";

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

  const getData = async () => {
    const data = await JSON.parse(sessionStorage.getItem('userData'));
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn && data) {
      setUserData(data.userData);
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

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">LIBRARY-MANAGEMENT-SYSTEM</span>
      </div>
      <ul className="navbar-links">
        {userData ? (
          <>
            <li className="navbar-profile">
              <Link to="/homeScreen" className={location.pathname === "/homeScreen" ? "active" : ""}>
                <span className="username">{userData.name}</span>
              </Link>
            </li>
            <li>
              <i className="fas fa-sign-out-alt logo-icon" style={{ cursor: "pointer" }} onClick={logout}></i>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === "/signup" ? "active" : ""}>
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
