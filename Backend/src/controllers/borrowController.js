import BorrowService from "../services/borrowService.js"; 

export const borrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ message: "Missing or invalid userId, bookId" });
    }

    // Check if the user has already borrowed the book
    const isBorrowedByUser = await BorrowService.isBookBorrowedByUser(userId, bookId);
    if (isBorrowedByUser) {
      return res.status(400).json({ message: "You have already borrowed this book." });
    }

    // Check if the book is available for borrowing
    const availableStock = await BorrowService.getBookStock(bookId);
    if (availableStock < 1) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    // Request borrow
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

    // Get the borrow request details
    const borrowRequest = await BorrowService.getBorrowRequestById(requestId);
    if (!borrowRequest) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    // Get the book's current stock
    const bookStock = await BorrowService.getBookStock(borrowRequest.book_id);
    
    // Ensure there's enough stock to approve the request
    if (bookStock <= 0) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    // Approve the borrow request (this also updates the stock)
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

    // Get the return request details
    const returnRequest = await BorrowService.getBorrowRequestById(requestId);
    if (!returnRequest) {
      return res.status(404).json({ message: "Return request not found" });
    }

    // Approve the return request (this also updates the stock)
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
    const { userId, bookId } = req.params;

    if (!userId || !bookId) {
      return res.status(400).json({ message: "Missing userId or bookId" });
    }

    const borrowStatus = await BorrowService.getBorrowStatus(userId, bookId);

    res.status(200).json(borrowStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
