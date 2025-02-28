import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email";
    if (!newPassword) errors.newPassword = "New Password is required";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";
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
      const response = await axios.post("http://localhost:3000/api/auth/forgot-password", {
        email,
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        toast.success("Password updated successfully!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Forgot Password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
            />
            {errors.email && <span style={styles.errorMessage}>{errors.email}</span>}
          </div>

          {/* New Password Field with Show/Hide */}
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
              <span style={styles.eyeIcon} onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? "🐵" : "🙈"}
              </span>
            </div>
            {errors.newPassword && <span style={styles.errorMessage}>{errors.newPassword}</span>}
          </div>

          {/* Confirm Password Field with Show/Hide */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
              <span style={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "🐵" : "🙈"}
              </span>
            </div>
            {errors.confirmPassword && <span style={styles.errorMessage}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" style={styles.button}>Reset Password</button>
        </form>

        <p style={styles.signupText}>
          Back to <Link to="/login" style={styles.signupLink}>Login</Link>
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
  formContainer: {
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
  passwordContainer: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  eyeIcon: {
    marginLeft: "-30px",
    cursor: "pointer",
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

export default ForgotPassword;
