import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddBook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/books", book);
      if (response.data.success) {
        alert("Book added successfully");
        navigate("/bookscrud");
      } else {
        alert("Failed to add book: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2>Add New Book</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            placeholder="Title"
            style={styles.input}
            required
          />
          <input
            type="text"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            placeholder="Author"
            style={styles.input}
            required
          />
          <textarea
            value={book.description}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
            placeholder="Description"
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.button}>
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
}

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
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#F5FFFA",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginTop: "60px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    height: "100px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AddBook;