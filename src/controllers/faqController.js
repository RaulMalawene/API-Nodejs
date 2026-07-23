const faqService = require('../services/faqService');

async function list(req, res) {
  const faqs = await faqService.listFaqs();
  res.json(faqs);
}

async function create(req, res) {
  const faq = await faqService.createFaq(req.body);
  res.status(201).json(faq);
}

async function update(req, res) {
  const faq = await faqService.updateFaq(req.params.id, req.body);
  res.json(faq);
}

async function remove(req, res) {
  await faqService.deleteFaq(req.params.id);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
