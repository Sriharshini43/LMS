import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  background: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/user.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: "20px",
    backgroundColor: "#ADD8E6",
    borderRadius: "8px",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
    marginTop: "60px",
  },
  header: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "10px",
    width: "80%",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  userCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    marginBottom: "10px",
  },
  info: {
    margin: "10px 0",
    fontSize: "16px",
  },
  bookDetail: {
    margin: "5px 0",
    fontSize: "14px",
  },
  bookTitle: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  borrowedHeading: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  returnHeading: {
    color: "#F44336",
    fontWeight: "bold",
  },
};

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:3000/api/users/get-user");
      if (response.data) {
        const usersWithBorrowedBooks = await Promise.all(
          response.data.map(async (user) => {
            try {
              const borrowedBooksResponse = await axios.get(
                `http://localhost:3000/api/borrow/borrowed-books/${user.id}`
              );
              return {
                ...user,
                borrowedBooks: borrowedBooksResponse.data,
              };
            } catch (borrowError) {
              console.error(`Error fetching borrowed books for user ${user.id}:`, borrowError);
              return {
                ...user,
                borrowedBooks: { success: false, borrowedBooks: [] },
              };
            }
          })
        );
        setUsers(usersWithBorrowedBooks);
      } else {
        setError("Failed to fetch users.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users.");
    }

    setLoading(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <div style={styles.header}>Users</div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={index} style={styles.userCard}>
              <p style={styles.info}><strong>Name:</strong> {user.name}</p>
              <p style={styles.info}><strong>Email:</strong> {user.email}</p>
              <p style={styles.info}><strong>Mobile:</strong> {user.mobile}</p>

              {user.borrowedBooks && user.borrowedBooks.success && user.borrowedBooks.borrowedBooks.length > 0 ? (
                user.borrowedBooks.borrowedBooks.map((book, idx) => (
                  <p key={idx} style={styles.bookDetail}>
                    <span style={styles.bookTitle}>{book.title}</span>,
                    <span style={styles.borrowedHeading}> Borrowed: {new Date(book.borrowed_date).toLocaleDateString()}</span>,
                    <span style={styles.returnHeading}> Return: {book.return_date ? new Date(book.return_date).toLocaleDateString() : "Not Returned"}</span>
                  </p>
                ))
              ) : (
                <p style={styles.info}>No borrowed books.</p>
              )}
            </div>
          ))
        ) : (
          !loading && <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
