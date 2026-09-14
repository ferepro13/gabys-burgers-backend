const Domicilio = require("../models/domicilio.model")

const getDomicilios = async (req, res) => {
    try {
        const domicilios = await Domicilio.findAll();
        res.json(domicilios);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDomicilioById = async (req, res) => {
    try {
        const domicilio = await Domicilio.findById(req.params.uuid);
        if (!domicilio) return res.status(404).json({error: "Domicilio no encontrado"});
        res.json(domicilio)
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

const createDomicilio = async (req, res) => {
    try {
        const result = await Domicilio.create(req.body);
        res.status(201).json({ message: 'Detalles de domicilio creados', id: result.insertId });
        console.log(result, req.body)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

const updateDomicilio = async (req, res) => {
    try {
        const {locationName, price} = req.body;
        const updateData = {}
        if (locationName !== undefined) updateData.locationName = locationName;
        if (price !== undefined) updateData.price = price;
        
        const result = await Domicilio.update(req.params.uuid, updateData);
        if (result.affectedRows === 0) return res.status(404).json({error: "Domicilio no encontrado"});
        res.json({ message: "Domicilio actualizado exitosamente"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const deleteDomicilio = async (req, res) => {
  try {
    const result = await Domicilio.delete(req.params.uuid);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Domicilio no encontrado' });
    res.json({ message: 'Domicilio eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDomicilios, getDomicilioById, createDomicilio, updateDomicilio, deleteDomicilio };