const Pedido = require('../models/pedido.model');

/**
 * Calcula el total de ventas en un período (por defecto últimos 30 días).
 */
const getSalesMetrics = async (startDate, endDate) => {
  const pedidos = await Pedido.findByDateRange(startDate, endDate);
  
  let totalVentas = 0;
  const productCount = {}; // uuid -> cantidad
  const extraCount = {};

  pedidos.forEach(pedido => {
    totalVentas += parseFloat(pedido.orderTotalCost); // pedido.order or pedido.orderDetails, according to database field
    const order = typeof pedido.orderDetails === 'string' ? JSON.parse(pedido.orderDetails) : pedido.orderDetails;
    // Productos
    order.productos.forEach(p => {
      productCount[p.uuid] = (productCount[p.uuid] || 0) + p.quantity;
    });
    // Extras
    if (order.extras) {
      order.extras.forEach(e => {
        extraCount[e.uuid] = (extraCount[e.uuid] || 0) + e.quantity;
      });
    }
  });

  // Ordenar para obtener los más vendidos
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([uuid, quantity]) => ({ uuid, quantity }));

  const topExtras = Object.entries(extraCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([uuid, quantity]) => ({ uuid, quantity }));

  return {
    totalVentas,
    totalPedidos: pedidos.length,
    topProducts,
    topExtras
  };
};

module.exports = { getSalesMetrics };