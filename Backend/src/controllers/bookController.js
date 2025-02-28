import * as bookService from "../services/bookService.js";

// Create a new Book
export const createBook = async (req, res) => {
  try {
    const bookData = req.body;

    // Check if the required fields are provided
    if (!bookData.title || !bookData.author || !bookData.description) {
      return res.status(400).json({ success: false, message: 'Missing required fields (title, author, description)' });
    }

    const result = await bookService.createBook(bookData);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error creating book:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get all Books
export const getAllBooks = async (req, res) => {
  try {
    const result = await bookService.getAllBooks();
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get Book by ID
export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate bookId
    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book ID is required' });
    }

    const result = await bookService.getBookById(bookId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Update Book by ID
export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updatedData = req.body;

    // Validate bookId and updated data
    if (!bookId || !updatedData.title || !updatedData.author || !updatedData.description) {
      return res.status(400).json({ success: false, message: 'Missing required fields (title, author, description) or invalid bookId' });
    }

    const result = await bookService.updateBook(bookId, updatedData);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Delete Book by ID
export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate bookId
    if (!bookId) {
      return res.status(400).json({ success: false, message: 'Book ID is required' });
    }

    const result = await bookService.deleteBook(bookId);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
