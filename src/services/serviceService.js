const prisma = require('../lib/prisma');

function listServices({ onlyActive = true } = {}) {
  return prisma.service.findMany({
    where: onlyActive ? { active: true } : undefined,
    orderBy: { id: 'asc' },
  });
}

function getService(id) {
  return prisma.service.findUnique({ where: { id: Number(id) } });
}

function createService(data) {
  return prisma.service.create({ data });
}

function updateService(id, data) {
  return prisma.service.update({ where: { id: Number(id) }, data });
}

function deleteService(id) {
  return prisma.service.delete({ where: { id: Number(id) } });
}

module.exports = { listServices, getService, createService, updateService, deleteService };
