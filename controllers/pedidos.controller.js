const Pedido = require('../models/pedido.model');
const { decreaseStock } = require('../services/stock.service');
const { sendOrderToWhatsApp } = require('../utils/whatsapp'); // Opcional
const Producto = require('../models/producto.model');
const Extra = require('../models/extra.model');
const Domicilio = require("../models/domicilio.model")

const createPedido = async (req, res) => {
  try {
    const { name: clientName, phone: clientPhone, date: toDate, time, location: direction, items, notes, delivery, orderTotal } = req.body;

    // 1. Filtrar items válidos (con productId)
    const validItems = (items || []).filter(item => item.productId && item.productId.trim() !== '');
    if (validItems.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    // 2. Obtener todos los productos, extras y domicilios de la BD (para nombres y precios)
    const allProducts = await Producto.findAll();
    const allExtras = await Extra.findAll();     
    const allDeliveries = await Domicilio.findAll();

    // Crear mapas para búsqueda rápida
    const productMap = Object.fromEntries(allProducts.map(p => [p.uuid, p]));
    const extraMap = Object.fromEntries(allExtras.map(e => [e.uuid, e]));

    const deliveryData = allDeliveries.find(d => d.uuid === delivery);

    // 3. Construir orderDetails y calcular total
    let orderTotalCost = 0;
    const orderDetails = {
      productos: [],
      extras: []
    };

    // Procesar cada item válido
    for (const item of validItems) {
      const product = productMap[item.productId];
      if (!product) {
        return res.status(400).json({ error: `Producto ${item.productId} no encontrado` });
      }

      const quantity = (Number.isInteger(item.quantity) && Number(item.quantity) > 0) ? Number(item.quantity) : 1

      // Verificar stock
      if (Number(product.stock) < Number(quantity)) {
        return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      }

      const extrasTotalPrice = item?.extras?.length ? item.extras.reduce((sum, e) => {
        const extra = extraMap[e.extraId];
        return sum + (Number(extra?.price) || 0);
      }, 0) : 0;
      
      // Calcular subtotal del producto
      const productSubtotal = (Number(product.price) + extrasTotalPrice) * Number(quantity);
      orderTotalCost += productSubtotal;

      // Guardar producto en detalle
      orderDetails.productos.push({
        uuid: product.uuid,
        name: product.name,
        price: Number(product.price),
        quantity: Number(quantity),
        extras: item?.extras?.map(e=> extraMap[e.extraId]) || []
      });

      // Procesar extras de este producto
      const extras = item.extras || [];
      for (const extraItem of extras) {
        const extra = extraMap[extraItem.extraId];
        if (!extra) continue;
        if (!extra.isAvailable) {
          return res.status(400).json({ error: `Extra ${extra.name} no disponible` });
        }
        //orderTotalCost += Number(extra.price);
        orderDetails.extras.push({
          uuid: extra.uuid,
          name: extra.name,
          price: Number(extra.price)
        });
      }
    }
    orderTotalCost += deliveryData ? Number(deliveryData.price) : 0;

    if (orderTotal !== orderTotalCost) {
      console.log(`Error al calcular el costo total del pedido:
          Valor recibido del cliente: ${orderTotal}
          Valor calculado por el backend: ${orderTotalCost}
        `)
    }

    // 4. Descontar stock (solo productos)
    const stockResult = await decreaseStock({ productos: orderDetails.productos });
    if (!stockResult.success) {
      return res.status(400).json({ error: stockResult.message });
    }

    // 5. Guardar pedido en BD
    const atDate = new Date().toISOString().split('T')[0];
    const pedidoData = {
      clientName,
      clientPhone,
      atDate,
      toDate: toDate || atDate,
      time: time || '00:00',
      direction: direction || '',
      orderDetails,
      orderTotalCost,
      deliveryData, // {uuid, locationName, price}
      notes: notes || ''
    };

    await Pedido.create(pedidoData);

    res.status(201).json({ message: 'Pedido creado con éxito', pedido: pedidoData });
  } catch (err) {
    console.error('Error en createPedido:', err);
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

const deletePedido = async (req, res) => {
  try {
    const { uuid } = req.params;
    const result = await Pedido.delete(uuid)
    if (result.affectedRows === 0) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json({ message: "Pedido borrado correctamente"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPedido, getPedidos, updatePedidoState, deletePedido };