const Pedido = require('../models/pedido.model');
const { decreaseStock } = require('../services/stock.service');
const { sendOrderToWhatsApp } = require('../utils/whatsapp'); // Opcional
const Producto = require('../models/producto.model');
const Extra = require('../models/extra.model');

/*
const createPedido = async (req, res) => {
  try {
    const { name:clientName, phone:clientPhone, date:toDate, time, location: direction, items:productos, orderTotal:orderTotalCost, notes } = req.body;

    // Validar que productos y extras sean arrays
    if (!productos || !Array.isArray(productos) || productos?.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    // Calcular total y construir objeto order
    //let orderTotalCost = 0;
    const orderDetails = { productos: [], extras: [] };

    let extrasFromProducts = [];
    
    productos.forEach(p => {
      if (!p?.extras?.length) return
      p?.extras.forEach(extra => {
        if (!extrasFromProducts.some(({uuid, quantity}) => uuid===extra.id)) {
          extrasFromProducts.push({uuid:extra.id, quantity:1})
        }
        else {
          extrasFromProducts.map(({uuid,quantity}) => uuid===extra.id ? {uuid,quantity:quantity+1} : {uuid,quantity:quantity+1} )
        }
      })
    })

    // Descontar stock
    const stockResult = await decreaseStock({ productos });
    if (!stockResult.success) {
      console.log(stockResult)
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
      order: orderDetails, // Puedes rellenar con los nombres y cantidades
      orderTotalCost,
      notes
    };

    // Rellenar orderDetails con nombres y cantidades (para historial)
    // Aquí deberías obtener los nombres de los productos y extras desde la BD
    // Pero por ahora usamos lo que venga del frontend (debe incluir name)
    pedidoData.orderDetails = { productos, extras: extrasFromProducts };
    await Pedido.create(pedidoData);

    // Enviar mensaje por WhatsApp (opcional)
    // sendOrderToWhatsApp({ clientName, clientPhone, ... });

    res.status(201).json({ message: 'Pedido creado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message)
  }
};
*/

const createPedido = async (req, res) => {
  try {
    const { name: clientName, phone: clientPhone, date: toDate, time, location: direction, items, notes, orderTotal: orderTotalCost } = req.body;

    // 1. Filtrar items válidos (con productId)
    const validItems = (items || []).filter(item => item.productId && item.productId.trim() !== '');
    if (validItems.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    // 2. Obtener todos los productos y extras de la BD (para nombres y precios)
    const allProducts = await Producto.findAll(); // asumiendo que existe el modelo
    const allExtras = await Extra.findAll();     // asumiendo que existe el modelo

    // Crear mapas para búsqueda rápida
    const productMap = Object.fromEntries(allProducts.map(p => [p.uuid, p]));
    const extraMap = Object.fromEntries(allExtras.map(e => [e.uuid, e]));

    // 3. Construir orderDetails y calcular total
    //let orderTotalCost = 0;
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

      const quantity = Number(item.quantity) || 1;

      // Verificar stock
      if (Number(product.stock) < Number(quantity)) {
        return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      }

      // Calcular subtotal del producto
      //const productSubtotal = Number(product.price) * quantity;
      //orderTotalCost += productSubtotal;

      // Guardar producto en detalle
      orderDetails.productos.push({
        uuid: product.uuid,
        name: product.name,
        price: Number(product.price),
        quantity: quantity,
        extras: item?.extras || []
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

module.exports = { createPedido, getPedidos, updatePedidoState };