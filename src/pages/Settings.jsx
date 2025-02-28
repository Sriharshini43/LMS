import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [userData, setUserData] = useState({ id: "", name: "", email: "" });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/get-userDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUserData({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } else {
        setError("Failed to fetch user details.");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:3000/api/auth/update-user/${userData.id}`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("User details updated successfully.");
        setIsEditing(false);
        fetchUserDetails(); // Refresh user details after update
      } else {
        setError("Failed to update user details.");
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      setError("Failed to update user details. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete your account?");
      if (!confirmDelete) return;

      const token = sessionStorage.getItem("authToken");
      await axios.delete(`http://localhost:3000/api/auth/delete-user/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      sessionStorage.clear();
      alert("Account deleted successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>User Settings</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>

          <div style={styles.iconRow}>
            {isEditing ? (
              <button type="button" onClick={handleSave} style={styles.saveButton}>
                Save
              </button>
            ) : (
              <AiOutlineEdit size={28} style={styles.icon} onClick={handleEditToggle} title="Edit Account" />
            )}
            <AiOutlineDelete size={28} style={styles.iconDelete} onClick={handleDelete} title="Delete Account" />
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/pic3.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFE4E1",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  input: {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "white",
  },
  error: {
    color: "#D9534F",
    fontSize: "14px",
    marginBottom: "10px",
  },
  iconRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  icon: {
    cursor: "pointer",
    color: "#007BFF",
    transition: "color 0.3s",
  },
  iconDelete: {
    cursor: "pointer",
    color: "#D9534F",
    transition: "color 0.3s",
  },
  saveButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
  },
};

export default Settings;
