const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module

dotenv.config();  // Load environment variables from .env file

const app = express();  // Initialize the express app

// Enable CORS for all origins (or specify specific origins as needed)
app.use(cors());  // This will allow cross-origin requests

// Serve static files (e.g., CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);  // Exit the process if the connection fails
  });

// Middleware
app.use(bodyParser.json());  // Parse incoming JSON requests

// API Routes
app.use('/api/auth', authRoutes);  // Authentication routes (login, register)
app.use('/api/transactions', transactionRoutes);  // Transaction routes (add, get transactions)

// Default route
app.get('/', (req, res) => {
  res.send("Welcome to the backend!");
});

// Define the port from environment variable or fallback to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
