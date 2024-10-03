
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const session = require('express-session');

const app = express();

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session management configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 15 * 60 * 1000 } // Session cookie expires after 15 minutes
}));

// Serve the login HTML file from the 'components' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle user sign-up
app.post('/auth/signup', (req, res) => {
    const { username, password } = req.body;
    console.log(`User signed up: ${username}`);
    res.send('Sign up successful!');
});

// Handle user sign-in
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`User logged in: ${username}`);
    res.send('Login successful!');
});

// Use the authentication routes
app.use('/auth', authRoutes);

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
