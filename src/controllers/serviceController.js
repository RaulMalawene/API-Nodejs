const serviceService = require('../services/serviceService');

async function list(req, res) {
  const services = await serviceService.listServices({ onlyActive: req.query.all !== 'true' });
  res.json(services);
}

async function create(req, res) {
  const service = await serviceService.createService(req.body);
  res.status(201).json(service);
}

async function update(req, res) {
  const service = await serviceService.updateService(req.params.id, req.body);
  res.json(service);
}

async function remove(req, res) {
  await serviceService.deleteService(req.params.id);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
