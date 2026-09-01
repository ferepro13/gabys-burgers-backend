const Producto = require('../models/producto.model');
const Extra = require('../models/extra.model');

/**
 * Descuenta el stock de productos y extras según el pedido.
 * Retorna un objeto con éxito y mensaje de error si falta stock.
 */
const decreaseStock = async (order) => {
  const { productos, extras } = order;

  // Descontar productos
  for (const item of productos) {
    const success = await Producto.decreaseStock(item.uuid, item.quantity);
    console.log(item.name, success)
    if (item.uuid && !success) {
      return { success: false, message: `Stock insuficiente para el producto ${item.name}` };
    }
  }

  // Descontar extras
  /*for (const item of extras) {
    const success = await Extra.decreaseStock(item.uuid, item.quantity);
    if (!success) {
      return { success: false, message: `Stock insuficiente para el extra ${item.name}` };
    }
  }
  */
  return { success: true };
};

module.exports = { decreaseStock };