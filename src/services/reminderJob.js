const cron = require('node-cron');
const dayjs = require('dayjs');
const appointmentService = require('./appointmentService');

const remindedIds = new Set();

function startReminderJob(client) {
  cron.schedule('* * * * *', async () => {
    try {
      const upcoming = await appointmentService.findUpcomingForReminder(60);
      for (const appointment of upcoming) {
        if (remindedIds.has(appointment.id)) continue;
        remindedIds.add(appointment.id);

        const text = [
          `⏰ Lembrete: você tem "${appointment.service.name}" agendado para`,
          `${dayjs(appointment.date).format('DD/MM/YYYY HH:mm')}.`,
        ].join(' ');

        await client.sendMessage(appointment.customerPhone, text);
      }
    } catch (err) {
      console.error('Erro ao enviar lembretes:', err);
    }
  });
}

module.exports = { startReminderJob };
