import { pool } from "../config/db.js";

class BorrowService {
  static async isBookAvailable(bookId) {
    const query = `SELECT stock FROM books WHERE id = ?`;
    const [[book]] = await pool.query(query, [bookId]);
    return book ? book.stock > 0 : false;
  }

  static async getBookStock(bookId) {
    const query = `SELECT stock FROM books WHERE id = ?`;
    const [[result]] = await pool.query(query, [bookId]);

    console.log("Book ID:", bookId, "Available Stock:", result ? result.stock : "Not Found");
    return result ? result.stock : 0;
  }

  static async updateBookStock(bookId, newStock) {
    const query = `UPDATE books SET stock = ? WHERE id = ?`;
    const [result] = await pool.query(query, [newStock, bookId]);
    return result.affectedRows > 0;
  }

  static async isBookBorrowedByUser(userId, bookId) {
    const query = `
    SELECT COUNT(*) AS count 
    FROM borrow_requests 
    WHERE user_id = ? AND book_id = ? AND status IN ('approved', 'return_requested', 'pending')`;

    const [[result]] = await pool.query(query, [userId, bookId]);
    return result.count > 0;
}

static async getBorrowStatus(userId, bookId) {
  const query = `
  SELECT status 
  FROM borrow_requests 
  WHERE user_id = ? AND book_id = ?`;

  const [results] = await pool.query(query, [userId, bookId]);

  if (results.length === 0) {
      return { isBorrowed: false, isPending: false };
  }

  const statuses = results.map(row => row.status);
  return {
      isBorrowed: statuses.includes('approved') || statuses.includes('return_requested'),
      isPending: statuses.includes('pending')
  };
}

static async requestBorrow(userId, bookId) {
  const query = `INSERT INTO borrow_requests (user_id, book_id, status) VALUES (?, ?, 'pending')`;
  const [result] = await pool.query(query, [userId, bookId]);
  return { id: result.insertId, userId, bookId, status: "pending" };
}

  static async requestReturn(userId, bookId) {
    const activeRequest = await this.getActiveBorrowRequest(userId, bookId);
    if (!activeRequest) {
      throw new Error("No active borrow request found for this book.");
    }

    const query = `UPDATE borrow_requests SET status = 'return_requested' WHERE id = ? AND status = 'approved'`;
    const [result] = await pool.query(query, [activeRequest.id]);

    if (result.affectedRows === 0) {
      throw new Error("Book is not borrowed or already in return process");
    }

    return { requestId: activeRequest.id, status: "return_requested" };
  }

  static async approveBorrow(requestId) {
    console.log("Request ID received:", requestId);
    const getRequestQuery = `SELECT book_id FROM borrow_requests WHERE id = ? AND status = 'pending'`;
    const [[borrowRequest]] = await pool.query(getRequestQuery, [requestId]);

    if (!borrowRequest) throw new Error("Request not found or already processed");

    const { book_id } = borrowRequest;
    const availableStock = await this.getBookStock(book_id);

    if (availableStock <= 0) {
        throw new Error("Not enough stock available.");
    }

    const updateRequestQuery = `UPDATE borrow_requests SET status = 'approved' WHERE id = ?`;
    const updateStockQuery = `UPDATE books SET stock = stock - 1 WHERE id = ?`;  // Decrement by 1

    const [requestResult] = await pool.query(updateRequestQuery, [requestId]);
    const [stockResult] = await pool.query(updateStockQuery, [book_id]);

    if (requestResult.affectedRows === 0 || stockResult.affectedRows === 0) {
        throw new Error("Approval failed, possibly due to insufficient stock.");
    }

    return { requestId, status: "approved" };
}

static async approveReturn(requestId) {
  const getRequestQuery = `SELECT book_id FROM borrow_requests WHERE id = ? AND status = 'return_requested'`;
  const [[borrowRequest]] = await pool.query(getRequestQuery, [requestId]);

  if (!borrowRequest) throw new Error("Return request not found or already processed");

  const { book_id } = borrowRequest;

  const updateRequestQuery = `UPDATE borrow_requests SET status = 'returned', return_date = NOW() WHERE id = ?`;
  const updateStockQuery = `UPDATE books SET stock = stock + 1 WHERE id = ?`; // Increment by 1

  const [requestResult] = await pool.query(updateRequestQuery, [requestId]);
  const [stockResult] = await pool.query(updateStockQuery, [book_id]);

  if (requestResult.affectedRows === 0 || stockResult.affectedRows === 0) {
      throw new Error("Return processing failed.");
  }

  return { requestId, status: "returned" };
}


  static async fetchBorrowRequests() {
    const query = `
      SELECT br.id, u.name AS user_name, b.title AS book_name, br.status
      FROM borrow_requests br
      JOIN users u ON br.user_id = u.id
      JOIN books b ON br.book_id = b.id`;
    
    const [requests] = await pool.query(query);
    return requests;
  }

  static async fetchUserBorrowedBooks(userId) {
    const query = `
      SELECT b.id AS book_id, b.title, b.author, br.status, br.request_date AS borrowed_date, br.return_date
      FROM borrow_requests br
      JOIN books b ON br.book_id = b.id
      WHERE br.user_id = ? AND br.status IN ('approved', 'return_requested', 'returned')`;
    
    const [books] = await pool.query(query, [userId]);
    return books;
  }

  static async getActiveBorrowRequest(userId, bookId) {
    const query = `
      SELECT id, user_id, book_id, status, request_date
      FROM borrow_requests
      WHERE user_id = ? AND book_id = ? AND status IN ('approved', 'return_requested', 'pending')
      ORDER BY request_date DESC
      LIMIT 1`;
    
    const [rows] = await pool.query(query, [userId, bookId]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async getBorrowRequestById(requestId) {
    const query = `SELECT id, user_id, book_id, status FROM borrow_requests WHERE id = ?`;
    const [[request]] = await pool.query(query, [requestId]);
    return request;
  }
}

export default BorrowService;
