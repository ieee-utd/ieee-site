const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');

// Google client ID
const CLIENT_ID = 'PUT_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(CLIENT_ID);

// Mock database for users (Replace with a real database in production)
const users = [];

// Login route (Manual login)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id; // Store user ID in session
    req.session.cookie.maxAge = 15 * 60 * 1000;
    return res.redirect('/');
  }
  res.status(401).send('Invalid credentials');
});

// Google login route
router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email } = payload;

    // Check if user exists, if not create a new user
    let user = users.find((user) => user.email === email);
    if (!user) {
      user = { id: users.length + 1, email, googleId: sub };
      users.push(user);
      console.log(`New Google user registered: ${email}`);
    } else {
      console.log(`Google user logged in: ${email}`);
    }

    req.session.userId = user.id;
    req.session.cookie.maxAge = 15 * 60 * 1000;
    res.send('Google login successful');
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(400).send('Google login failed');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('Error logging out');
    res.redirect('/');
  });
});

// Register route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // Check if username already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).send('Username already exists');
  }

  users.push({ id: users.length + 1, username, password: hashedPassword });
  console.log(`User registered: ${username}`);
  res.send('User registered');
});

module.exports = router;