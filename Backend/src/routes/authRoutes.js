// routes/userRoutes.js
import express from 'express';
import { getUserDetails, login, register, update, remove, resetPassword } from '../controllers/authController.js';


const router = express.Router();

router.post('/register-user', register);
router.post('/login', login);
router.get('/get-userDetails', getUserDetails);
// Update User by ID
router.put('/update-user/:id', update);

// Delete User by ID
router.delete('/delete-user/:id', remove);
router.post('/forgot-password', resetPassword);


export default router;
