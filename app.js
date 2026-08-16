const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

dotenv.config();

const app = express();

/*
if (process.env.NODE_ENV === 'development') {
  app.use(helmet({
    contentSecurityPolicy: false, // Desactiva CSP en desarrollo
  }));
} else {
  app.use(helmet()); // CSP activo en producción
}
  */

// Middlewares
app.use(helmet());
app.use(cors());
/*
app.use(cors({
  origin: 'https://gabys-frontend.onrender.com' // o usa '*' para pruebas
}));
*/
app.use(morgan('dev'));
app.use(express.json());

// Ruta de bienvenida (para que / no devuelva 404)
app.get('/', (req, res) => {
  res.json({ 
    message: '🍔 Gaby\'s Burgers API',
    version: '1.0.0',
    endpoints: {
      productos: '/api/productos',
      extras: '/api/extras',
      pedidos: '/api/pedidos',
      auth: '/api/auth',
      metrics: '/api/metrics'
    }
  });
});

// Rutas
app.use('/api', routes);

// Manejo de errores global
app.use(errorHandler);

module.exports = app;