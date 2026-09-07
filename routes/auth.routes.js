const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const router = express.Router();

const rateLimit = require('express-rate-limit'); // pnpm add express-rate-limit

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window where can only accept 5 attempts to login
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV !== 'production') {
    router.post('/register', register);
}
router.post('/login', loginLimiter, login);

module.exports = router;