const express = require('express');
const { createPedido, getPedidos, updatePedidoState, deletePedido } = require('../controllers/pedidos.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Ruta pública para crear pedido (desde la landing page)
router.post('/', createPedido);

// Rutas protegidas para el dueño
router.get('/', authMiddleware, getPedidos);
router.put('/:uuid/state', authMiddleware, updatePedidoState);
router.delete("/:uuid", authMiddleware, deletePedido)

module.exports = router;