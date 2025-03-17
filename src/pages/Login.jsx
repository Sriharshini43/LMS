import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const storedUserType = sessionStorage.getItem("userType");
      navigate(storedUserType === "admin" ? "/AdminScreen" : "/homeScreen");
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", { email, password, userType });

      if (response.data.success) {
        toast.success("Login successful!");
        sessionStorage.setItem("authToken", response.data.token);
        sessionStorage.setItem("userType", response.data.userType);
        sessionStorage.setItem("userId", response.data.userId);

        navigate(response.data.userType === "admin" ? "/AdminScreen" : "/homeScreen");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.loginContainer}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            {errors.email && <span style={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🐵" : "🙈"}
              </span>
            </div>
            {errors.password && <span style={styles.errorMessage}>{errors.password}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={styles.select}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.signupText}>
          Don't have an account? <Link to="/signUp" style={styles.signupLink}>Sign Up</Link>
        </p>
        <p style={styles.signupText}>
          <Link to="/forgot-password" style={styles.signupLink}>Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  background: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/libraryBooks.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    width: "350px",
    padding: "40px",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    textAlign: "left",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    cursor: "pointer",
    fontSize: "20px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
  },
  signupText: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
  },
  signupLink: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default Login;
