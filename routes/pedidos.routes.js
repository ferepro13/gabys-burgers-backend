const express = require('express');
const { createPedido, getPedidos, updatePedidoState, deletePedido } = require('../controllers/pedidos.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

const rateLimit = require('express-rate-limit'); // pnpm add express-rate-limit

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window where can only accept 10 orders
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Ruta pública para crear pedido (desde la landing page)
router.post('/', orderLimiter, createPedido);

// Rutas protegidas para el dueño
router.get('/', authMiddleware, getPedidos);
router.put('/:uuid/state', authMiddleware, updatePedidoState);
router.delete("/:uuid", authMiddleware, deletePedido)

module.exports = router;