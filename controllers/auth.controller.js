const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const dotenv = require('dotenv');
dotenv.config();

// Registro de nuevo usuario (dueño)
const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan username o password' });
  }

  // Verificar si ya existe
  const existing = await Usuario.findByUsername(username);
  if (existing) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  // Generar hash de la contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // Guardar en BD
  await Usuario.create(username, passwordHash);

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan credenciales' });
  }

  const user = await Usuario.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ username: user.username, id: user?.id || user?.uuid }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token });
};

module.exports = { register, login };

/* // Para generar el hash de una contraseña, con la consola de Node
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('tu_password', 10);
console.log(hash);
*/