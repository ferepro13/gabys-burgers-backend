const express = require("express");

const {
    getDomicilios,
    getDomicilioById,
    createDomicilio,
    updateDomicilio,
    deleteDomicilio
} = require("../controllers/domicilio.controller")

const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', getDomicilios);
router.get('/:uuid', getDomicilioById);
router.post('/', authMiddleware, createDomicilio);
router.put('/:uuid', authMiddleware, updateDomicilio);
router.delete('/:uuid', authMiddleware, deleteDomicilio);

module.exports = router;