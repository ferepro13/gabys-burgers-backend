const Extra = require('../models/extra.model');

const getExtras = async (req, res) => {
  try {
    const onlyAvailable = req.query.available === 'true';
    const extras = await Extra.findAll(onlyAvailable);
    res.json(extras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getExtraById = async (req, res) => {
  try {
    const extra = await Extra.findById(req.params.uuid);
    if (!extra) return res.status(404).json({ error: 'Extra no encontrado' });
    res.json(extra);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createExtra = async (req, res) => {
  try {
    const result = await Extra.create(req.body);
    res.status(201).json({ message: 'Extra creado', id: result.insertId });
    console.log(result, result.insertId)
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error creando extra: ", err.message)
  }
};

const updateExtra = async (req, res) => {
  try {
    const { name, price, isAvailable } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    const result = await Extra.update(req.params.uuid, updateData);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Extra no encontrado' });
    res.json({ message: 'Extra actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteExtra = async (req, res) => {
  try {
    const result = await Extra.delete(req.params.uuid);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Extra no encontrado' });
    res.json({ message: 'Extra eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getExtras, getExtraById, createExtra, updateExtra, deleteExtra };