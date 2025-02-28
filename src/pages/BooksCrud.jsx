import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Styles
const styles = {
  background: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/books1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: "20px",
    backgroundColor: "#FFE4B5",
    borderRadius: "8px",
    maxWidth: "1000px",
    margin: "0 auto",
    marginTop: '60px',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  searchInput: {
    padding: "10px",
    width: "250px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  booksList: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    border: "1px solid #ccc",
  },
  tableHeader: {
    backgroundColor: "#3498db",
    color: "white",
    textAlign: "center",
    padding: "12px 15px",
    fontSize: "16px",
    fontWeight: "bold",
    borderBottom: "2px solid #2980b9",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableData: {
    padding: "12px 15px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid #ddd",
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  tableRowHover: {
    backgroundColor: "#f1f1f1",
  },
};

const TableRow = ({ book, onEdit, onDelete }) => {
  return (
    <tr
      style={styles.tableRow}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
    >
      <td style={styles.tableData}>{book.title}</td>
      <td style={styles.tableData}>{book.author}</td>
      <td style={styles.tableData}>{book.description}</td>
      <td style={styles.actions}>
        <button onClick={() => onEdit(book.id)} style={styles.editButton}>Edit</button>
        <button onClick={() => onDelete(book.id)} style={styles.deleteButton}>Delete</button>
      </td>
    </tr>
  );
};

function BooksCrud() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/books");
      const booksData = Array.isArray(response.data.books) ? response.data.books : [];
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete the book.");
    }
  };

  const handleEditBook = (id) => {
    navigate(`/editbook/${id}`);
  };

  const handleAddBook = () => {
    navigate("/addbook");
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Books Management</h2>
          <div>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <button onClick={handleAddBook} style={styles.addButton}>Add Book</button>
          </div>
        </div>

        <div style={styles.booksList}>
          {filteredBooks.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Title</th>
                  <th style={styles.tableHeader}>Author</th>
                  <th style={styles.tableHeader}>Description</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <TableRow
                    key={book.id}
                    book={book}
                    onEdit={handleEditBook}
                    onDelete={handleDeleteBook}
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

export default BooksCrud;