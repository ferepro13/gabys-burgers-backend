const Producto = require('../models/producto.model');
const cloudinary = require('../utils/cloudinary');
const sharp = require('sharp');
//const upload = require('../middlewares/upload');

const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.uuid);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProducto = async (req, res) => { // agregar category si aplica
  try {
    let imageUrl = null;
    if (req.file) {
      const compressedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

      // Subir a Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'gabys/productos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(compressedBuffer);
      });

      // Guardar la URL en la BD
      imageUrl = result.secure_url;
    }

    const { name, description, category, price, stock } = req.body;
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        error: 'name, price y stock son obligatorios'
      });
    }
    const result = await Producto.create({name, description, category, price, stock, imageUrl}); // agregar category si aplica

    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProducto = async (req, res) => { // agregar category si aplica
  try {
    const { name, description, category, price, stock } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;

    if (req.file) {
      const compressedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

      // Subir a Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'gabys/productos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(compressedBuffer);
      });

      updateData.imageUrl = result.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'No se proporcionaron datos para actualizar'
      });
    }

    const result = await Producto.update(req.params.uuid, updateData);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Subir imagen para un producto
/*const uploadImage = async (req, res) => {
  try {
    const { uuid } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    // Comprimir y convertir a WebP (para ahorrar espacio)
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'gabys/productos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(compressedBuffer);
    });

    // Guardar la URL en la BD
    await Producto.update(uuid, { imageUrl: result.secure_url });

    res.json({ message: 'Imagen subida correctamente', imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

const deleteProducto = async (req, res) => {
  try {
    const result = await Producto.delete(req.params.uuid);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };

