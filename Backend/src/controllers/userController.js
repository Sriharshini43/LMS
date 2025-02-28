import { pool } from '../config/db.js';

// Function to get all users with their borrowed books
export const getAllUsers = async (req, res) => {
  try {
    // Step 1: Fetch all users
    const [users] = await pool.query(`
      SELECT id, name, email, mobile
      FROM users
      ORDER BY id
    `);

    // Step 2: Fetch borrowed books for each user
    const usersWithBooks = await Promise.all(users.map(async (user) => {
      try {
        const response = await fetch(`http://localhost:3000/api/borrow/borrowed-books/${user.id}`);
        const borrowedBooks = await response.json();

        return {
          ...user,
          borrowedBooks: borrowedBooks || []
        };
      } catch (err) {
        console.error(`Error fetching borrowed books for user ${user.id}:`, err);
        return { ...user, borrowedBooks: [] }; // Fallback if API call fails
      }
    }));

    // Step 3: Send combined data
    res.json(usersWithBooks);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};

// Function to create a new user
export const createUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const newUser = { email, password }; // Create a new user object
  users.push(newUser); // Add the new user to the array
  
  res.status(201).json({ message: 'User registered successfully', user: newUser });
};
