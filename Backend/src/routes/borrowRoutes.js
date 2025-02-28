import express from "express";
import { 
  borrowBook, 
  approveRequest, 
  getBorrowRequests, 
  getUserBorrowedBooks,
  checkBorrowStatus,
  requestReturn,
  approveReturnRequest,
} from "../controllers/borrowController.js";

const router = express.Router();

// ✅ Borrow Book Routes
router.post("/", borrowBook); // Request to borrow a book
router.get("/status/:bookId", checkBorrowStatus); // Check if a book is borrowed
router.put("/approve/:requestId", approveRequest); // Approve borrow request

// ✅ Return Book Routes
router.post("/return", requestReturn); // User requests a book return
router.put("/return-approve/:requestId", approveReturnRequest); // Admin approves the return request

// ✅ Fetch Borrow Requests
router.get("/requests", getBorrowRequests); // Admin - View borrow requests
router.get("/borrowed-books/:userId", getUserBorrowedBooks); // User - View borrowed books

export default router;
