// Database connection and API handlers
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'professor_website',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

testDatabaseConnection();

// API Routes

// Get professor info
app.get('/api/professor', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM professor_info LIMIT 1');

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor information not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching professor data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching professor data',
            error: error.message
        });
    }
});

// Get education info
app.get('/api/education', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM education ORDER BY year DESC');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching education data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching education data',
            error: error.message
        });
    }
});

// Get research areas
app.get('/api/research', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM research_areas');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching research data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching research data',
            error: error.message
        });
    }
});

// Get research projects
app.get('/api/projects', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM research_projects ORDER BY year DESC');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching projects data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching projects data',
            error: error.message
        });
    }
});

// Get publications
app.get('/api/publications', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM publications ORDER BY year DESC, id DESC');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching publications data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching publications data',
            error: error.message
        });
    }
});

// Get awards
app.get('/api/awards', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM awards ORDER BY year DESC, id DESC');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching awards data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching awards data',
            error: error.message
        });
    }
});

// Get speeches
app.get('/api/speeches', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM speeches ORDER BY year DESC, id DESC');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching speeches data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching speeches data',
            error: error.message
        });
    }
});

// Check professor's office hours
app.get('/api/office-hours', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM office_hours WHERE professor_id = 1');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching office hours data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching office hours data',
            error: error.message
        });
    }
});

// Fallback route to serve the main index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;