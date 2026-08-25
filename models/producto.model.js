const db = require('./db');

const Producto = {
  // Obtener todos los productos (solo los disponibles si se requiere)
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM productos');
    return rows;
  },

  findById: async (uuid) => {
    const [rows] = await db.query('SELECT * FROM productos WHERE uuid = ?', [uuid]);
    return rows[0];
  },

  create: async (data) => { // agregar category si aplica y otro , ?
    const { name, description, category, price, stock, imageUrl } = data; 
    const [result] = await db.query(
      'INSERT INTO productos (name, description, category, price, stock, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, category, price, stock, imageUrl]
    );
    return result;
  },

  update: async (uuid, data) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) {
      return {
        affectedRows: 0
      };
    }
    
    values.push(uuid);
    const sql = `UPDATE productos SET ${fields.join(', ')} WHERE uuid = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },

  delete: async (uuid) => {
    const [result] = await db.query('DELETE FROM productos WHERE uuid = ?', [uuid]);
    return result;
  },

  // Método para descontar stock (usado al hacer pedido)
  decreaseStock: async (uuid, quantity) => {
    const [result] = await db.query(
      'UPDATE productos SET stock = stock - ? WHERE uuid = ? AND stock >= ?',
      [quantity, uuid, quantity]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Producto;