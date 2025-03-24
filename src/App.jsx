import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import UserHomeScreen from "./pages/UserHomeScreen";
import AdminHomeScreen from "./pages/AdminHomeScreen";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import BooksCRUD from "./pages/BooksCrud";
import Users from "./pages/users";
import Books from "./pages/Books";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const App = () => {
  return (
    <Router>
      <GlobalNavigationControl />
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homeScreen" element={<UserHomeScreen />} />
          <Route path="/AdminScreen" element={<AdminHomeScreen />} />
          <Route path="/bookscrud" element={<BooksCRUD />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/editbook/:id" element={<EditBook />} />
          <Route path="/users" element={<Users />} />
          <Route path="/books" element={<Books />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
      <ToastContainer 
        position="top-center" 
        autoClose={1000} 
        hideProgressBar={true} 
        closeOnClick 
        theme="colored" 
      />
    </Router>
  );
};

const GlobalNavigationControl = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const disableNavigation = (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.history.pushState(null, "", window.location.href);
    };

    const disableBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Initially push a state and override back/forward buttons
    disableBackButton();
    window.addEventListener("popstate", disableNavigation);

    const handleKeyDown = (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        alert("Page refresh is disabled.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      sessionStorage.removeItem("userSession");
      fetch("/api/logout", { method: "POST", credentials: "include" });
      navigate("/login");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", disableNavigation);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return null;
};

export default App;
