const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productoRoutes = require('./productos.routes');
const extraRoutes = require('./extras.routes');
const pedidoRoutes = require('./pedidos.routes');
const metricsRoutes = require('./metrics.routes');
const domicilioRoutes = require("./domicilio.routes")

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/extras', extraRoutes);
router.use('/pedidos', pedidoRoutes);
router.use("/domicilio", domicilioRoutes)
router.use('/metrics', metricsRoutes);

module.exports = router;