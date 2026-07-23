const appointmentService = require('../services/appointmentService');

async function list(req, res) {
  const appointments = await appointmentService.listAppointments({ status: req.query.status });
  res.json(appointments);
}

async function create(req, res) {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateStatus(req, res) {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }
  const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status);
  res.json(appointment);
}

module.exports = { list, create, updateStatus };
