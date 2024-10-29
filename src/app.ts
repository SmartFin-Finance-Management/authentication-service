// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/userRoutes';
import connectDB from './config/database';

dotenv.config();

const app = express();

// Connect to the database
connectDB()

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use('/', authRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('API is running');
});

export default app;
