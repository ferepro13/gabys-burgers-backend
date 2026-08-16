const Pedido = require('../models/pedido.model');
const { decreaseStock } = require('../services/stock.service');
const { sendOrderToWhatsApp } = require('../utils/whatsapp'); // Opcional

const createPedido = async (req, res) => {
  try {
    const { clientName, clientPhone, toDate, time, direction, productos, extras } = req.body;

    // Validar que productos y extras sean arrays
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    // Calcular total y construir objeto order
    let orderTotalCost = 0;
    const orderDetail = { productos: [], extras: [] };

    let extrasFromProducts = [];
    if (!extras) {
      productos.forEach(p => {
        if (!p?.extras.length) return
        p?.extras.forEach(extra => {
          if (!extrasFromProducts.some(({uuid, quantity}) => uuid===extra.id)) {
            extrasFromProducts.push({uuid:extra.id, quantity:1})
          }
          else {
            extrasFromProducts.map(({uuid,quantity}) => uuid===extra.id ? {uuid,quantity:quantity+1} : {uuid,quantity:quantity+1} )
          }
        })
      })
    }

    // Obtener precios de productos y extras para calcular total
    // (Se puede hacer consultando a la BD, aquí simplificamos)
    // En una implementación real, aquí se verifica que los productos existan y se obtiene su precio.
    // Pero asumimos que el frontend envía el precio o lo calculamos con una consulta.

    // Por simplicidad, el frontend ya envía el total (orderTotalCost) o lo calculamos.

    // Descontar stock
    const stockResult = await decreaseStock({ productos, extras: extras?.length ? extras : extrasFromProducts });
    if (!stockResult.success) {
      return res.status(400).json({ error: stockResult.message });
    }

    // Crear pedido en BD
    const atDate = new Date().toISOString().split('T')[0]; // Fecha actual
    const pedidoData = {
      clientName,
      clientPhone,
      atDate,
      toDate,
      time,
      direction,
      order: orderDetail, // Puedes rellenar con los nombres y cantidades
      orderTotalCost: req.body.orderTotalCost || 0
    };

    // Rellenar orderDetail con nombres y cantidades (para historial)
    // Aquí deberías obtener los nombres de los productos y extras desde la BD
    // Pero por ahora usamos lo que venga del frontend (debe incluir name)
    pedidoData.orderDetails = { productos, extras: extras?.length ? extras : extrasFromProducts };

    await Pedido.create(pedidoData);

    // Enviar mensaje por WhatsApp (opcional)
    // sendOrderToWhatsApp({ clientName, clientPhone, ... });

    res.status(201).json({ message: 'Pedido creado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rutas protegidas para el dueño
const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll(req.query);
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePedidoState = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { orderState } = req.body;
    if (!['pendiente', 'hecho'].includes(orderState)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const result = await Pedido.updateState(uuid, orderState);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPedido, getPedidos, updatePedidoState };