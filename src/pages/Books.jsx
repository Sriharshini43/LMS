import React, { useState, useEffect } from "react";
import axios from "axios";

// Styles
const styles = {
  background: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/Sparks.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: "20px",
    background: "linear-gradient(135deg, #e0f7fa, #80deea)",
    borderRadius: "8px",
    maxWidth: "1000px",
    margin: "0 auto",
    marginTop: "60px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  alert: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  booksList: {
    background: "linear-gradient(135deg, #ffffff, #e3f2fd)",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  searchInput: {
    padding: "8px",
    width: "200px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#3498db",
    color: "white",
    textAlign: "center",
    padding: "12px 15px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableData: {
    padding: "12px 15px",
    fontSize: "14px",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  borrowButton: (isDisabled) => ({
    backgroundColor: isDisabled ? "#ccc" : "#f39c12",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    transition: "background-color 0.3s",
  }),
};

// TableRow Component
const TableRow = ({ book, onBorrow, disableAllBorrow }) => {
  const isDisabled =
    disableAllBorrow || book.isBorrowed || !book.isAvailable || book.isPending;

  return (
    <tr style={styles.tableRow}>
      <td style={styles.tableData}>{book.title}</td>
      <td style={styles.tableData}>{book.author}</td>
      <td style={styles.tableData}>{book.description}</td>
      <td style={styles.tableData}> {book.stock === 0 ? "Out of Stock" : book.stock}</td>
      <td style={styles.actions}>
        <button
          onClick={() => !isDisabled && onBorrow(book.id)}
          style={styles.borrowButton(isDisabled)}
          disabled={isDisabled}
        >
          {disableAllBorrow
    ? "Limit Reached"
    : book.isBorrowed
    ? "Unavailable"
    : book.isPending
    ? "Pending"
    : !book.isAvailable
    ? "Unavailable"
    : "Borrow"}
        </button>
      </td>
    </tr>
  );
};

function Books() {
  const [books, setBooks] = useState([]);
  const [disableAllBorrow, setDisableAllBorrow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBooks();
    checkBorrowLimit();
  }, []);

  const fetchBooks = async () => {
    let userId = sessionStorage.getItem("userId");
    try {
      const response = await axios.get("https://lms-w6u8.onrender.com/api/books");
      let booksData = Array.isArray(response.data.books) ? response.data.books : [];

      const borrowStatusPromises = booksData.map(async (book) => {
        const borrowResponse = await axios.get(`https://lms-w6u8.onrender.com/api/borrow/status/${userId}/${book.id}`);
        return {
          ...book,
          isBorrowed: borrowResponse.data.isBorrowed,
          isAvailable: book.stock > 0 && !borrowResponse.data.isPending, // Mark unavailable if pending
          isPending: borrowResponse.data.isPending, // Preserve pending state  
          stock: book.stock,
        };
      });

      const updatedBooks = await Promise.all(borrowStatusPromises);
      setBooks(updatedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const checkBorrowLimit = async () => {
    let userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const borrowedResponse = await axios.get(`https://lms-w6u8.onrender.com/api/borrow/user/${userId}`);
      const borrowedBooksCount = borrowedResponse.data.borrowedBooks.filter(
        (book) => book.status !== "returned" && book.return_date === null
      ).length;

      const token = sessionStorage.getItem("authToken");
      const response = await axios.get("${process.env.BACKEND_URL}/api/auth/get-userDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userName = response.data.user.name;

      const pendingResponse = await axios.get("https://lms-w6u8.onrender.com/api/borrow/requests");
      const pendingBooksCount = pendingResponse.data.borrowRequests.filter(
        (request) => request.user_name === userName && request.status === "pending"
      ).length;

      const totalBorrowedCount = borrowedBooksCount + pendingBooksCount;
      setDisableAllBorrow(totalBorrowedCount >= 2);
      setAlertMessage(
        totalBorrowedCount >= 2
          ? "Books borrowed and not returned including books requested to borrow count is greater than or equal 2. Return or wait."
          : ""
      );
    } catch (error) {
      console.error("Error checking borrow limit:", error);
    }
  };

  const handleBorrowBook = async (id, stock) => {
    const userId = sessionStorage.getItem("userId");
    console.log("UserId:", userId);
    if (!userId) {
      alert("Please log in to borrow a book.");
      return;
    }

    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, isPending: true, isAvailable: false } : book
      )
    );

    try {
      const response = await axios.post("https://lms-production-5bae.up.railway.app/api/borrow", {
        userId,
        bookId: id,
      });

      if (response.status === 201) {
        alert("Borrow request sent for approval!");
        checkBorrowLimit();
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === id ? { ...book, isBorrowedByUser: true, isPending: false } : book
          )
        );
      } else {
        alert(response.data.message || "Failed to send borrow request.");
      }
    } catch (error) {
      console.error("Error borrowing book:", error.response || error);
      alert(`An error occurred: ${error.response?.data?.message || error.message}`);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Books</h2>
          <input
            type="text"
            placeholder="Search by Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        {alertMessage && <div style={styles.alert}>{alertMessage}</div>}
        <div style={styles.booksList}>
          {filteredBooks.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Description</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <TableRow
                    key={book.id}
                    book={book}
                    onBorrow={(id) => handleBorrowBook(id)}
                    disableAllBorrow={disableAllBorrow}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Books;
