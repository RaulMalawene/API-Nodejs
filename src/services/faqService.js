const prisma = require('../lib/prisma');

function listFaqs() {
  return prisma.faq.findMany({ orderBy: { id: 'asc' } });
}

function createFaq(data) {
  return prisma.faq.create({ data });
}

function updateFaq(id, data) {
  return prisma.faq.update({ where: { id: Number(id) }, data });
}

function deleteFaq(id) {
  return prisma.faq.delete({ where: { id: Number(id) } });
}

async function findBestMatch(text) {
  const faqs = await listFaqs();
  const normalized = text.toLowerCase();
  return faqs.find((faq) => {
    const keywords = (faq.keywords || '')
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    return keywords.some((k) => normalized.includes(k));
  });
}

module.exports = { listFaqs, createFaq, updateFaq, deleteFaq, findBestMatch };
