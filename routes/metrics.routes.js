const express = require('express');
const { getMetrics } = require('../controllers/metrics.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', authMiddleware, getMetrics);

module.exports = router;