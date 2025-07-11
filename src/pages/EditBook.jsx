import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditBook() {
  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    stock: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`, book);
      navigate("/bookscrud");
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook((prevState) => ({
      ...prevState,
      [name]: name === "stock" ? Math.max(0, Number(value)) : value,
    }));
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2>Edit Book</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit();
          }}
        >
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleInputChange}
            placeholder="Title"
            style={styles.input}
          />
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleInputChange}
            placeholder="Author"
            style={styles.input}
          />
          <textarea
            name="description"
            value={book.description}
            onChange={handleInputChange}
            placeholder="Description"
            style={styles.textarea}
          />
          <input
            type="number"
            name="stock"
            value={book.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            style={styles.input}
            min="0"
          />
          <button type="submit" style={styles.button}>
            Update Book
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
    maxWidth: "500px",
    margin: "0 auto",
    backgroundColor: "#E6E6FA",
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

export default EditBook;
