// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

// Protected route example (requires authentication)
router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'Protected data', user: req.user });
});

module.exports = router;
