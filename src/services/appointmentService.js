const dayjs = require('dayjs');
const prisma = require('../lib/prisma');

function listAppointments({ status } = {}) {
  return prisma.appointment.findMany({
    where: status ? { status } : undefined,
    include: { service: true },
    orderBy: { date: 'asc' },
  });
}

async function createAppointment({ customerName, customerPhone, serviceId, date }) {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    throw new Error('Data inválida. Use o formato DD/MM/AAAA HH:mm.');
  }
  if (parsedDate.isBefore(dayjs())) {
    throw new Error('Não é possível agendar para uma data no passado.');
  }

  const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
  if (!service || !service.active) {
    throw new Error('Serviço não encontrado ou indisponível.');
  }

  return prisma.appointment.create({
    data: {
      customerName,
      customerPhone,
      serviceId: Number(serviceId),
      date: parsedDate.toDate(),
      status: 'pending',
    },
    include: { service: true },
  });
}

function updateAppointmentStatus(id, status) {
  return prisma.appointment.update({ where: { id: Number(id) }, data: { status } });
}

async function findUpcomingForReminder(withinMinutes) {
  const now = dayjs();
  const limit = now.add(withinMinutes, 'minute');
  return prisma.appointment.findMany({
    where: {
      status: 'confirmed',
      date: { gte: now.toDate(), lte: limit.toDate() },
    },
    include: { service: true },
  });
}

module.exports = {
  listAppointments,
  createAppointment,
  updateAppointmentStatus,
  findUpcomingForReminder,
};
