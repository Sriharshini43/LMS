import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    userType: "user", // Default userType
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Form Validation
  const validateForm = () => {
    const errors = {};

    if (!formValues.username) {
      errors.username = "Username is required";
    } else if (!/^[A-Za-z0-9_]{3,15}$/.test(formValues.username)) {
      errors.username =
        "Username should be 3-15 characters long and can only contain letters, numbers, and underscores.";
    }

    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formValues.mobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formValues.mobile)) {
      errors.mobile = "Mobile number should be exactly 10 digits";
    }

    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password = "Password should be at least 6 characters";
    }

    return errors;
  };

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/register-user", // Adjust API endpoint
          formValues
        );

        if (response.data.success) {
          toast.success(response.data.message || "Registration successful!");
          setFormValues({
            username: "",
            email: "",
            mobile: "",
            password: "",
            userType: "user",
          });
        } else {
          toast.error(response.data.message || "Registration failed!");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        toast.error(
          error.response?.data?.message || "Something went wrong. Please try again later."
        );
      }
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formValues.username}
              onChange={handleInputChange}
              style={styles.input}
            />
            {formErrors.username && <span style={styles.error}>{formErrors.username}</span>}
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleInputChange}
              style={styles.input}
            />
            {formErrors.email && <span style={styles.error}>{formErrors.email}</span>}
          </div>

          {/* Mobile */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Mobile No</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formValues.mobile}
              onChange={handleInputChange}
              style={styles.input}
            />
            {formErrors.mobile && <span style={styles.error}>{formErrors.mobile}</span>}
          </div>

          <div style={styles.formGroup}>
  <label style={styles.label}>Password</label>
  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter your password"
      value={formValues.password}
      onChange={handleInputChange}
      style={{ ...styles.input, paddingRight: "40px" }}
    />
    <span
      style={styles.eyeIcon}
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "🐵" : "🙈"}
    </span>
  </div>
  {formErrors.password && <span style={styles.error}>{formErrors.password}</span>}
</div>

          {/* User Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>User Type</label>
            <select
              name="userType"
              value={formValues.userType}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.textCenter}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// ✅ Inline Styles
const styles = {
  background: {
    width: "100vw",
    height: "120vh",
    backgroundImage: "url('/Books.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "20px",
    color: "#888", // Optional for better visibility
  },  
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  textCenter: {
    textAlign: "center",
    marginTop: "15px",
  },
  link: {
    color: "#007BFF",
    textDecoration: "underline",
  },
};

export default SignUp;
