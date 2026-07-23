require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PRODUCTS = [
  { name: 'Shampoo Hidratante 300ml', description: 'Limpeza suave com hidratação profunda.', price: 39.9 },
  { name: 'Óleo de Argan Finalizador', description: 'Reduz frizz e dá brilho aos fios.', price: 54.9 },
  { name: 'Máscara de Hidratação Capilar', description: 'Tratamento intensivo semanal.', price: 45.0 },
  { name: 'Kit Escova e Pente Profissional', description: 'Kit para finalização em casa.', price: 29.9 },
];

const SERVICES = [
  { name: 'Corte de Cabelo', description: 'Corte feminino ou masculino.', price: 50.0, durationMin: 30 },
  { name: 'Coloração', description: 'Coloração completa com produtos profissionais.', price: 120.0, durationMin: 90 },
  { name: 'Escova Modelada', description: 'Escova com modelagem e finalização.', price: 40.0, durationMin: 40 },
  { name: 'Manicure', description: 'Cuidados e esmaltação das unhas das mãos.', price: 35.0, durationMin: 45 },
  { name: 'Limpeza de Pele', description: 'Limpeza de pele profunda facial.', price: 80.0, durationMin: 60 },
];

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@exemplo.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} já existe.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.admin.create({
    data: { name: 'Administrador', email, password: hashed },
  });

  console.log(`Admin criado: ${email} / senha: ${password}`);
}

async function seedProducts() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log('Produtos já cadastrados, pulando.');
    return;
  }
  await prisma.product.createMany({ data: PRODUCTS });
  console.log(`${PRODUCTS.length} produtos de exemplo criados.`);
}

async function seedServices() {
  const count = await prisma.service.count();
  if (count > 0) {
    console.log('Serviços já cadastrados, pulando.');
    return;
  }
  await prisma.service.createMany({ data: SERVICES });
  console.log(`${SERVICES.length} serviços de exemplo criados.`);
}

async function main() {
  await seedAdmin();
  await seedProducts();
  await seedServices();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
