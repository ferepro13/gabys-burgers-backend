const db = require('./db');

const Pedido = {
  findAll: async (filters = {}) => {
    let sql = 'SELECT * FROM pedidos';
    const conditions = [];
    const values = [];
    if (filters.orderState) {
      conditions.push('orderState = ?');
      values.push(filters.orderState);
    }
    if (filters.fromDate) {
      conditions.push('atDate >= ?');
      values.push(filters.fromDate);
    }
    if (filters.toDate) {
      conditions.push('atDate <= ?');
      values.push(filters.toDate);
    }
    if (conditions.length) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY createdAt DESC';
    const [rows] = await db.query(sql, values);
    return rows;
  },

  findById: async (uuid) => {
    const [rows] = await db.query('SELECT * FROM pedidos WHERE uuid = ?', [uuid]);
    return rows[0];
  },

  create: async (data) => {
    const { clientName, clientPhone, atDate, toDate, time, direction, orderDetails, orderTotalCost } = data;
    const [result] = await db.query(
      `INSERT INTO pedidos 
       (clientName, clientPhone, atDate, toDate, time, direction, \`order\`, orderTotalCost) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [clientName, clientPhone, atDate, toDate, time, direction, JSON.stringify(order), orderTotalCost]
    );
    return result;
  },

  updateState: async (uuid, newState) => {
    const [result] = await db.query(
      'UPDATE pedidos SET orderState = ? WHERE uuid = ?',
      [newState, uuid]
    );
    return result;
  },

  // Para métricas: obtener todos los pedidos en un rango de fechas
  findByDateRange: async (startDate, endDate) => {
    const [rows] = await db.query(
      'SELECT * FROM pedidos WHERE atDate BETWEEN ? AND ?',
      [startDate, endDate]
    );
    return rows;
  }
};

module.exports = Pedido;