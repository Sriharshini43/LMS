import { pool } from "../config/db.js"; 

// Create a new Book 
export const createBook = async (bookData) => {
  const { title, author, description} = bookData;
  const query = `INSERT INTO books (title, author, description) VALUES (?, ?, ?)`;

  try {
    const [result] = await pool.query(query, [title, author, description]);
    return { success: true, message: 'Book created successfully', book: { title, author, description, id: result.insertId } };
  } catch (error) {
    console.error("Create book error:", error);
    return { success: false, message: 'Failed to create book. Please try again later.' };
  }
};

// Get all Books 
export const getAllBooks = async () => {
  const query = `SELECT * FROM books`;

  try {
    const [books] = await pool.query(query);

    return { success: true, books: books };
  } catch (error) {
    console.error("Get all books error:", error);
    return { success: false, message: 'Failed to fetch books. Please try again later.' };
  }
};

// Get Book by ID 
export const getBookById = async (bookId) => {
  const query = `SELECT * FROM books WHERE id = ?`;

  try {
    const [book] = await pool.query(query, [bookId]);
    if (book.length === 0) {
      return { success: false, message: 'Book not found' };
    }

    return { success: true, book: book };
  } catch (error) {
    console.error("Get book by ID error:", error);
    return { success: false, message: 'Failed to fetch book. Please try again later.' };
  }
};

export const updateBook = async (bookId, updatedData) => {
  const { title, author, description} = updatedData;
  const query = `UPDATE books SET title = ?, author = ?, description = ? WHERE id = ?`;

  try {
    const [result] = await pool.query(query, [title, author, description, bookId]);
    if (result.affectedRows === 0) {
      return { success: false, message: 'Book not found' };
    }
    return { success: true, message: 'Book updated successfully', book: { id: bookId, title, author, description } };
  } catch (error) {
    console.error("Update book error:", error);
    return { success: false, message: 'Failed to update book. Please try again later.' };
  }
};

// Delete Book by ID
export const deleteBook = async (bookId) => {
  const query = `DELETE FROM books WHERE id = ?`;

  try {
    const [result] = await pool.query(query, [bookId]);
    if (result.affectedRows === 0) {
      return { success: false, message: 'Book not found' };
    }
    return { success: true, message: 'Book deleted successfully' };
  } catch (error) {
    console.error("Delete book error:", error);
    return { success: false, message: 'Failed to delete book. Please try again later.' };
  }
};
