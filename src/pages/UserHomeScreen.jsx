import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineBook } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings } from "react-icons/fi"; // ✅ Imported Settings Icon
import { useNavigate } from "react-router-dom";

function UserHomeScreen() {
  const [userData, setUserData] = useState({});
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchBorrowedBooks();
    }
  }, [userData]);

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
        const newUserData = response.data.user;
        setUserData(newUserData);

        const storedUserData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        if (!storedUserData.userData || storedUserData.userData.id !== newUserData.id) {
          sessionStorage.setItem("userData", JSON.stringify({ isLoggedIn: true, userData: newUserData }));
        }
      } else {
        setError("Failed to fetch user details.");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details. Please try again.");
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`http://localhost:3000/api/borrow/borrowed-books/${userData.id}`);

      if (response.data.success) {
        setBorrowedBooks(response.data.borrowedBooks);
      } else {
        setError("No borrowed books found.");
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      setError("Failed to load borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      const userId = userData?.id;
      if (!userId) {
        alert("User ID is missing.");
        return;
      }

      await axios.post("http://localhost:3000/api/borrow/return", { userId, bookId });
      alert("Return request sent successfully!");

      fetchBorrowedBooks();
    } catch (error) {
      console.error("Failed to send return request:", error);
      alert("Failed to send return request.");
    }
  };

  const hasReturnableBooks = borrowedBooks.some(
    (book) => !book.return_date && book.status !== "return_requested" && book.status !== "return_successful"
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <AiOutlineBook
          size={32}
          color="white"
          style={styles.icon}
          onClick={() => navigate("/books")}
          title="Books"
        />
        <FaUserCircle
          size={32}
          color="white"
          style={styles.icon}
          onClick={() => navigate("/homeScreen")}
          title="Profile"
        />
        <FiSettings
          size={32}
          color="white"
          style={styles.icon}
          onClick={() => navigate("/settings")} 
          title="Settings"
        />
      </div>

      <div style={styles.content}>
        <h2 style={styles.heading}>Welcome, {userData.name || "User"}!</h2>
        <h2 style={styles.subHeading}>Borrowed & Returned Books</h2>

        {loading && <p style={styles.loading}>Loading borrowed books...</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={{ backgroundColor: '#3CB371' }}>
                <th style={styles.thTd}>Title</th>
                <th style={styles.thTd}>Author</th>
                <th style={styles.thTd}>Borrowed Date</th>
                <th style={styles.thTd}>Return Date</th>
                {borrowedBooks.some((book) => !book.return_date) && <th style={styles.thTd}>Status</th>}
                {hasReturnableBooks && <th style={styles.thTd}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book, index) => (
                <tr key={book.book_id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.thTd}>{book.title}</td>
                  <td style={styles.thTd}>{book.author}</td>
                  <td style={styles.thTd}>{new Date(book.borrowed_date).toLocaleDateString()}</td>
                  <td style={styles.thTd}>
                    {book.return_date ? new Date(book.return_date).toLocaleDateString() : "Not Returned"}
                  </td>
                  {!book.return_date && (
                    <td style={styles.thTd}>
                      {book.status === "approved" ? "Borrowed" : book.status === "return_requested"
                        ? "Return Requested" : book.status}
                    </td>
                  )}
                  {hasReturnableBooks && (
                    <td style={styles.thTd}>
                      {!book.return_date && book.status !== "return_requested" && book.status !== "returned" ? (
                        <button
                          style={styles.returnButton}
                          onClick={() => handleReturnBook(book.book_id)}
                        >
                          Return
                        </button>
                      ) : (
                        <span style={{ color: "#888" }}>
                          {book.status === "return_requested"
                            ? "Return Requested"
                            : book.status === "returned"
                            ? "Returned"
                            : ""}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {borrowedBooks.length === 0 && !loading && (
                <tr>
                  <td colSpan={hasReturnableBooks ? 6 : 5} style={styles.noData}>No borrowed books found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  sidebar: {
    width: "80px",
    backgroundColor: "#333",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px",
    height: "100vh",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
  },
  icon: {
    marginBottom: "20px",
    cursor: "pointer",
    transition: "transform 0.3s, color 0.3s",
  },
  content: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    height: "100vh",
    backgroundImage: "url('/pic2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  heading: { color: "#333", fontSize: "28px", marginBottom: "10px", fontWeight: "bold" },
  subHeading: { color: "#555", fontSize: "22px", marginBottom: "15px", textDecoration: "underline" },
  loading: { color: "#007BFF", fontSize: "16px", fontStyle: "italic" },
  error: { color: "#D9534F", fontSize: "16px", fontStyle: "italic" },
  tableContainer: { display: "flex", justifyContent: "center", marginTop: "20px" },
  table: {
    width: "85%",
    borderCollapse: "collapse",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  thTd: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontSize: "14px",
  },
  trEven: { backgroundColor: "#f9f9f9" },
  trOdd: { backgroundColor: "white" },
  noData: { textAlign: "center", padding: "15px", color: "#888", fontStyle: "italic" },
  returnButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
};

export default UserHomeScreen;
