// controllers/borrowController.js
import BorrowService from "../services/borrowService.js";

export const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ message: "Missing userId or bookId" });
    }

    const isBorrowed = await BorrowService.isBookBorrowed(bookId);
    if (isBorrowed) {
      return res.status(400).json({ message: "Book is currently borrowed or under return process." });
    }

    const borrowRequest = await BorrowService.requestBorrow(userId, bookId);

    res.status(201).json({ message: "Book borrow request is now pending!", borrowRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    if (!requestId) {
      return res.status(400).json({ message: "Missing requestId" });
    }

    const approvedRequest = await BorrowService.approveBorrow(requestId);
    res.json({ message: "Request approved successfully!", approvedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ message: "Missing userId or bookId" });
    }

    // Update return_status to "return_requested"
    const returnRequest = await BorrowService.requestReturn(userId, bookId);

    if (!returnRequest) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    res.status(201).json({ message: "Return request sent successfully!", returnRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveReturnRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ message: "Missing requestId" });
    }

    const approvedReturn = await BorrowService.approveReturn(requestId);
    res.json({ message: "Return approved successfully!", approvedReturn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBorrowRequests = async (req, res) => {
  try {
    const borrowRequests = await BorrowService.fetchBorrowRequests();
    res.status(200).json({ success: true, borrowRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBorrowedBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const borrowedBooks = await BorrowService.fetchUserBorrowedBooks(userId);
    res.status(200).json({ success: true, borrowedBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkBorrowStatus = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ message: "Missing bookId" });
    }

    const isBorrowed = await BorrowService.isBookBorrowed(bookId);
    res.status(200).json({ isBorrowed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
