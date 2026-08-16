const { getSalesMetrics } = require('../services/metrics.service');

const getMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    // Si no se proporcionan fechas, usar últimos 30 días
    const today = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 30);
    const start = startDate || defaultStart.toISOString().split('T')[0];
    const end = endDate || today.toISOString().split('T')[0];

    const metrics = await getSalesMetrics(start, end);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMetrics };