// controllers/authController.js
import UserModel from '../models/userModel.js';
import { registerUser, loginUser, getUserFromToken, updateUser, deleteUser, forgotPassword } from '../services/authService.js';

export const register = async (req, res) => {
    const { username, email, mobile, password, userType } = req.body;

    // Validate required fields
    if (!username || !email || !mobile || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create user instance
    const user = new UserModel({ username, email, mobile, password, userType });

    try {
        // Register user using auth service
        const response = await registerUser(user);
        if (response.success) {
            return res.status(201).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error('Error in user registration:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Registration failed. Please try again later.' 
        });
    }
};

export const login = async (req, res) => {
  const { email, password, userType } = req.body;

  // Validate required fields
  if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
      // If userType is "admin", check against the specific admin credentials
      if (userType === 'admin') {
          if (email === 'admin@gmail.com' && password === 'admin8') {
              // Admin login credentials
              const response = {
                  success: true,
                  message: 'Admin login successful',
                  userType: 'admin',
                  email: email,
              };
              return res.status(200).json(response); // Admin login successful
          } else {
              return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
          }
      }

      // Regular user login
      const response = await loginUser(email, password);

      if (response.success) {
          return res.status(200).json({
              ...response,
              userId: response.user.id,
              userType: 'user', // Add userType for regular users
          });
      } else {
          return res.status(401).json(response); // Unauthorized for invalid user
      }
  } catch (error) {
      console.error('Error in user login:', error);
      return res.status(500).json({
          success: false,
          message: 'Login failed. Please try again later.',
      });
  }
};

export const getUserDetails = async (req, res) => {
    
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    console.log(token);

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    try {
        const response = await getUserFromToken(token);

        if (response.success) {
            return res.status(200).json({ success: true, user: response.user });
        } else {
            return res.status(401).json({ success: false, message: response.message });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve user details' });
    }
};


export const update = async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    try {
        const response = await updateUser(id, updatedUser);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'User update failed. Please try again later.' });
    }
};

export const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await deleteUser(id);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'User deletion failed. Please try again later.' });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    try {
        const response = await forgotPassword(email, newPassword);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Password reset failed. Please try again later.' });
    }
};
