const prisma = require('../lib/prisma');

function listProducts({ onlyActive = true } = {}) {
  return prisma.product.findMany({
    where: onlyActive ? { active: true } : undefined,
    orderBy: { id: 'asc' },
  });
}

function createProduct(data) {
  return prisma.product.create({ data });
}

function updateProduct(id, data) {
  return prisma.product.update({ where: { id: Number(id) }, data });
}

function deleteProduct(id) {
  return prisma.product.delete({ where: { id: Number(id) } });
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct };
