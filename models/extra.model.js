const db = require('./db');

const Extra = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM extras');
    return rows;
  },
  findById: async (uuid) => {
    const [rows] = await db.query('SELECT * FROM extras WHERE uuid = ?', [uuid]);
    return rows[0];
  },
  create: async (data) => {
    const { name, price, isAvailable } = data;
    const [result] = await db.query(
      'INSERT INTO extras (name, price, isAvailable) VALUES (?, ?, ?)',
      [name, price, isAvailable]
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
    values.push(uuid);
    const sql = `UPDATE extras SET ${fields.join(', ')} WHERE uuid = ?`;
    const [result] = await db.query(sql, values);
    return result;
  },
  delete: async (uuid) => {
    const [result] = await db.query('DELETE FROM extras WHERE uuid = ?', [uuid]);
    return result;
  },
  decreaseStock: async (uuid, quantity) => {
    const [result] = await db.query(
      'UPDATE extras SET stock = stock - ? WHERE uuid = ? AND stock >= ?',
      [quantity, uuid, quantity]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Extra;