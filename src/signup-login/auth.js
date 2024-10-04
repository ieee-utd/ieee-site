const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock database for users
const users = []; // This should be replaced with a real database in a production app

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id; // Store user ID in session
    return res.redirect('/');
  }
  res.send('Invalid credentials');
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id; // Store user ID in session
        return res.redirect('/');
    }
    res.send('Invalid credentials');
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('Error logging out');
    res.redirect('/');
  });
    req.session.destroy(err => {
        if (err) return res.send('Error logging out');
        res.redirect('/');
    });
});

// Register route (for demonstration purposes)
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ id: users.length + 1, username, password: hashedPassword });
  res.send('User registered');
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ id: users.length + 1, username, password: hashedPassword });
    res.send('User registered');
});

module.exports = router;
