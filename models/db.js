const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

console.log('Configuración de base de datos:');
console.log(`  Host: ${process.env.DB_HOST}`);
console.log(`  Port: ${process.env.DB_PORT || '3306 (default)'}`);
console.log(`  User: ${process.env.DB_USER}`);
console.log(`  Database: ${process.env.DB_NAME}`);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  connectTimeout: 20000,
});

// Promisify para usar async/await
const promisePool = pool.promise();

module.exports = promisePool;