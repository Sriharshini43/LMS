import express from 'express';
import * as bookController from "../controllers/bookController.js";

const router = express.Router();

router.post('/', bookController.createBook); // Corrected to handle POST at /api/books
router.get('/', bookController.getAllBooks); // Get all books
router.get('/:bookId', bookController.getBookById); // Get book by ID
router.put('/:bookId', bookController.updateBook); // Update book by ID
router.delete('/:bookId', bookController.deleteBook); // Delete book by ID

export default router;

