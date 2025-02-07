const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors()); // Enable CORS to allow requests from other origins
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/employeeDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    position: String,
    salary: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);

// API Routes
// 1. GET all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees); // Send the employees as JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST a new employee
app.post('/api/employees', async (req, res) => {
    const { name, email, position, salary } = req.body;
    const newEmployee = new Employee({ name, email, position, salary });

    try {
        await newEmployee.save();
        res.status(201).json(newEmployee); // Return the newly created employee
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start the Server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
