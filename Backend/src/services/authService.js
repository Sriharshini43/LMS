// services/userService.js
import { pool } from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = '76348734687346874363443434343443333333333'; 

// Register User
export const registerUser = async (user) => {
    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [user.email]);
        if (existingUser.length > 0) {
            return { success: false, message: 'User already exists' };
        }
        
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const query = `INSERT INTO users (name, email, mobile, password, userType) VALUES (?, ?, ?, ?,?)`;
        const values = [user.username, user.email, user.mobile, hashedPassword,user.userType];
        await pool.query(query, values);
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: 'Registration failed. Please try again later.' };
    }
};

// Login User with JWT token
export const loginUser = async (email, password) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return { success: false, message: 'User not found' };
        }
        
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return { success: false, message: 'Incorrect password' };
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, userType:user.userType },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("Generated token:", token); // For debugging
        
        return { 
            success: true, 
            message: 'Login successful', 
            token, 
            user: { id: user.id, email: user.email, userType:user.userType } 
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: 'Login failed. Please try again later.' };
    }
};

// Get User Details from Token
export const getUserFromToken = async (token) => {
    try {
        const trimmedToken = token.trim();
        console.log("Received token:", trimmedToken);

        // Verify token (no `await` needed here)
        const decoded = jwt.verify(trimmedToken, JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Retrieve user details from the database
        const [rows] = await pool.query('SELECT id, name, email, mobile, userType FROM users WHERE id = ?', [decoded.id]);

        if (rows.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const user = rows[0];
        return { success: true, user };
    } catch (error) {
        console.error("Token verification error:", error);
        return { success: false, message: 'Invalid or expired token' };
    }
};

export const updateUser = async (id, updatedUser) => {
    try {
        const query = `UPDATE users SET name = ?, email = ?, mobile = ?, userType = ? WHERE id = ?`;
        const values = [updatedUser.name, updatedUser.email, updatedUser.mobile, updatedUser.userType, id]; // ✅ Use updatedUser.name
        await pool.query(query, values);
        return { success: true, message: 'User updated successfully' };
    } catch (error) {
        console.error("Update error:", error); // Check console for exact DB error
        return { success: false, message: 'User update failed. Please try again later.' };
    }
};

// Delete User
export const deleteUser = async (id) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: 'User deletion failed. Please try again later.' };
    }
};

export const forgotPassword = async (email, newPassword) => {
    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        return { success: true, message: 'Password reset successfully' };
    } catch (error) {
        console.error("Password reset error:", error);
        return { success: false, message: 'Password reset failed. Please try again later.' };
    }
};