import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import bookRoutes from './src/routes/bookRoutes.js';
import borrowRoutes from './src/routes/borrowRoutes.js';
import { checkConnection } from './src/config/db.js';
import createAllTable from './src/utils/dbUtils.js';

const app = express();

// ✅ Middleware Setup
app.use(cors());
app.use(express.json());

// ✅ Use Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.listen(3000, async () => {
  console.log('Server running on port 3000');
  try {
    await checkConnection();
    await createAllTable();
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});
