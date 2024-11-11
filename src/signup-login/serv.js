const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const session = require('express-session');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const app = express();

// Google OAuth client set
const CLIENT_ID = 'PUT_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(CLIENT_ID);

// Middleware for parsing request bodies
app.use(cors());
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

// Use the authentication routes
app.use('/auth', authRoutes);

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
