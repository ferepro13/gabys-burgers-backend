const express = require('express');
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productos.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

const rateLimit = require('express-rate-limit'); // pnpm add express-rate-limit

const productLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window where can only take 20 requests for products to load
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Rutas públicas (lectura)
router.get('/', productLimiter,getProductos);
router.get('/:uuid', getProductoById);

// Rutas protegidas (CRUD)
//router.post('/', authMiddleware, createProducto);
//router.put('/:uuid', authMiddleware, updateProducto);

router.post('/', authMiddleware, upload.single('image'), createProducto);
router.put('/:uuid', authMiddleware, upload.single('image'), updateProducto);

router.delete('/:uuid', authMiddleware, deleteProducto);


// Subir imagen
//router.post('/:uuid/imagen', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;