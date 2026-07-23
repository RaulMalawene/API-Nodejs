const productService = require('../services/productService');

async function list(req, res) {
  const products = await productService.listProducts({ onlyActive: req.query.all !== 'true' });
  res.json(products);
}

async function create(req, res) {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
}

async function update(req, res) {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json(product);
}

async function remove(req, res) {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
