const db = require('./db');

const Usuario = {
  findByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    return rows[0];
  },

  create: async (username, passwordHash) => {
    const [result] = await db.query(
      'INSERT INTO usuarios (username, passwordHash) VALUES (?, ?)',
      [username, passwordHash]
    );
    return result;
  }
};

module.exports = Usuario;