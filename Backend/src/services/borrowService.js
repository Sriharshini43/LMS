// services/borrowService.js
import { pool } from "../config/db.js";

class BorrowService {
  static async isBookBorrowed(bookId) {
    const query = `SELECT COUNT(*) AS count FROM borrow_requests WHERE book_id = ? AND status IN ('approved', 'return_requested', 'pending')`;
    const [[{ count }]] = await pool.query(query, [bookId]);
    return count > 0;
  }

  static async requestBorrow(userId, bookId) {
    const isBorrowed = await this.isBookBorrowed(bookId);
    if (isBorrowed) {
      throw new Error("Book is currently borrowed or under return process.");
    }

    const query = `INSERT INTO borrow_requests (user_id, book_id, status) VALUES (?, ?, 'pending')`;
    const [result] = await pool.query(query, [userId, bookId]);
    return { id: result.insertId, userId, bookId, status: "pending" };
  }

  static async approveBorrow(requestId) {
    const query = `UPDATE borrow_requests SET status = 'approved' WHERE id = ?`;
    const [result] = await pool.query(query, [requestId]);
    if (result.affectedRows === 0) throw new Error("Request not found or already processed");
    return { requestId, status: "approved" };
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
    
    console.log(`✅ Return request processed. Updated Status: return_requested for Request ID: ${activeRequest.id}`);
    return { requestId: activeRequest.id, status: "return_requested" };
  }  

  static async approveReturn(requestId) {
    const query = `UPDATE borrow_requests SET status = 'returned', return_date = NOW() WHERE id = ? AND status = 'return_requested'`;
    const [result] = await pool.query(query, [requestId]);
    if (result.affectedRows === 0) throw new Error("Return request not found or already processed");
    return { requestId, status: "returned" };
  }

  static async fetchBorrowRequests() {
    const query = `
      SELECT br.id, u.name AS user_name, b.title AS book_name, br.status
      FROM borrow_requests br
      JOIN users u ON br.user_id = u.id
      JOIN books b ON br.book_id = b.id
    `;
    const [requests] = await pool.query(query);
    return requests;
  }

  static async fetchUserBorrowedBooks(userId) {
    const query = `
      SELECT b.id AS book_id, b.title, b.author,br.status, br.request_date AS borrowed_date, br.return_date
      FROM borrow_requests br
      JOIN books b ON br.book_id = b.id
      WHERE br.user_id = ? AND br.status IN ('approved', 'return_requested', 'returned')
    `;
    const [books] = await pool.query(query, [userId]);
    return books;
  }

  static async getActiveBorrowRequest(userId, bookId) {
    const query = `
      SELECT id, user_id, book_id, status, request_date
      FROM borrow_requests
      WHERE user_id = ? AND book_id = ? AND status IN ('approved', 'return_requested', 'pending')
      ORDER BY request_date DESC
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [userId, bookId]);
    return rows.length > 0 ? rows[0] : null;
  }
}

export default BorrowService;
