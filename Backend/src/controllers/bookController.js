import * as bookService from "../services/bookService.js";

// Create a new Book
export const createBook = async (req, res) => {
  try {
    const { title, author, description, stock } = req.body;

    // Validate input
    if (!title || !author || !description || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields (title, author, description, stock)' });
    }

    const result = await bookService.createBook({ title, author, description, stock });
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error("Error creating book:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get all Books
export const getAllBooks = async (req, res) => {
  try {
    const result = await bookService.getAllBooks();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get Book by ID
export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book ID is required' });
    }

    const result = await bookService.getBookById(bookId);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Update Book by ID
export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, description, stock } = req.body;

    if (!bookId || !title || !author || !description || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields or invalid bookId' });
    }

    const result = await bookService.updateBook(bookId, { title, author, description, stock });
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Delete Book by ID
export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book ID is required' });
    }

    const result = await bookService.deleteBook(bookId);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
