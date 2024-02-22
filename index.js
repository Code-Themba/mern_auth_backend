// Package Imports
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('colors');

// User Defined Package Imports
const { errorHandler, notFound } = require('./backend/middleware/errorMiddleware');
const userRoutes = require('./backend/routes/userRoutes')


// Variable Initialization
const port = process.env.PORT || 5000;
const app = express();

//Establish Database Connection
require('./backend/config/db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/account', userRoutes);

// Error Middleware
app.use(errorHandler);
app.use(notFound);

// Server
app.listen(port, console.log(`Server running on port ${port}`));