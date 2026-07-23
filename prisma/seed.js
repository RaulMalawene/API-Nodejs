require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
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

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
