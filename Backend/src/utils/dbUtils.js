import { pool } from "../config/db.js";

// Users table query
const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile VARCHAR(15),
  password VARCHAR(255) NOT NULL, 
  userType ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

// Books table query
const bookTableQuery = `CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const borrowRequestTableQuery = `CREATE TABLE IF NOT EXISTS borrow_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  status ENUM('pending', 'approved','return_requested', 'returned') DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  return_date TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);`;

// Function to create each table
const createTable = async (tableName, query) => {
  try {
    await pool.query(query);
    console.log(`${tableName} table created or already exists`);
  } catch (error) {
    console.log(`Error creating ${tableName}`, error);
  }
};

// Function to create all required tables
const createAllTables = async () => {
  try {
    // Create the users table
    await createTable("Users", userTableQuery);
    // Create the books table
    await createTable("Books", bookTableQuery);
    await createTable("BorrowRequests", borrowRequestTableQuery);
    console.log("All tables created successfully!");
  } catch (error) {
    console.log("Error creating tables", error);
    throw error;
  }
};

export default createAllTables;
