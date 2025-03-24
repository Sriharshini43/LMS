import express from "express";
import {
  borrowBook,
  approveRequest,
  requestReturn,
  approveReturnRequest,
  getBorrowRequests,
  getUserBorrowedBooks,
  checkBorrowStatus,
} from "../controllers/borrowController.js";

const router = express.Router();

// Route to borrow a book
router.post("/", borrowBook);

// Route to approve a borrow request
router.put("/approve/:requestId", approveRequest);

// Route to request a book return
router.post("/return", requestReturn);

// Route to approve a return request
router.put("/return-approve/:requestId", approveReturnRequest);

// Route to get all borrow requests
router.get("/requests", getBorrowRequests);

// Route to get all books borrowed by a specific user
router.get("/user/:userId", getUserBorrowedBooks);

// Route to check if a user has borrowed a specific book
router.get("/status/:userId/:bookId", checkBorrowStatus);

export default router;
