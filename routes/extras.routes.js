const express = require('express');
const {
  getExtras,
  getExtraById,
  createExtra,
  updateExtra,
  deleteExtra
} = require('../controllers/extras.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', getExtras);
router.get('/:uuid', getExtraById);
router.post('/', authMiddleware, createExtra);
router.put('/:uuid', authMiddleware, updateExtra);
router.delete('/:uuid', authMiddleware, deleteExtra);

module.exports = router;