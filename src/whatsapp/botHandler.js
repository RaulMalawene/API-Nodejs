const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const conversationService = require('../services/conversationService');
const faqService = require('../services/faqService');
const productService = require('../services/productService');
const serviceService = require('../services/serviceService');
const appointmentService = require('../services/appointmentService');

dayjs.extend(customParseFormat);

const MAIN_MENU = [
  'Olá! 👋 Sou o assistente virtual. Escolha uma opção:',
  '1️⃣ Perguntas frequentes',
  '2️⃣ Catálogo de produtos/serviços',
  '3️⃣ Agendar horário',
  '0️⃣ Falar com um atendente',
].join('\n');

async function handleMessage(client, message) {
  const phone = message.from;
  const text = (message.body || '').trim();
  const state = await conversationService.getState(phone);

  if (/^(menu|oi|ol[aá]|in[ií]cio)$/i.test(text)) {
    await conversationService.setState(phone, 'menu', {});
    return message.reply(MAIN_MENU);
  }

  switch (state.step) {
    case 'menu':
      return handleMenu(phone, text, message);
    case 'faq':
      return handleFaq(phone, text, message);
    case 'catalog':
      return handleCatalog(phone, text, message);
    case 'schedule_service':
      return handleScheduleService(phone, text, message);
    case 'schedule_date':
      return handleScheduleDate(phone, text, message, state);
    case 'schedule_name':
      return handleScheduleName(phone, text, message, state);
    default:
      await conversationService.setState(phone, 'menu', {});
      return message.reply(MAIN_MENU);
  }
}

async function handleMenu(phone, text, message) {
  switch (text) {
    case '1':
      await conversationService.setState(phone, 'faq', {});
      return message.reply(
        'Digite sua dúvida e eu tento responder. Digite "menu" a qualquer momento para voltar.'
      );
    case '2': {
      const [products, services] = await Promise.all([
        productService.listProducts(),
        serviceService.listServices(),
      ]);
      await conversationService.setState(phone, 'menu', {});
      return message.reply(formatCatalog(products, services));
    }
    case '3': {
      const services = await serviceService.listServices();
      if (services.length === 0) {
        return message.reply('No momento não há serviços disponíveis para agendamento.');
      }
      await conversationService.setState(phone, 'schedule_service', {});
      return message.reply(formatServiceList(services));
    }
    case '0':
      await conversationService.setState(phone, 'menu', {});
      return message.reply('Certo! Em breve um atendente humano irá continuar por aqui. 🙌');
    default:
      return message.reply(`Não entendi. \n\n${MAIN_MENU}`);
  }
}

async function handleFaq(phone, text, message) {
  const match = await faqService.findBestMatch(text);
  if (match) {
    return message.reply(`${match.answer}\n\nDigite "menu" para voltar ao início.`);
  }
  return message.reply(
    'Não encontrei uma resposta para isso. Tente reformular ou digite "menu" para voltar ao início.'
  );
}

async function handleCatalog(phone, text, message) {
  await conversationService.setState(phone, 'menu', {});
  return message.reply(MAIN_MENU);
}

async function handleScheduleService(phone, text, message) {
  const services = await serviceService.listServices();
  const index = Number(text) - 1;
  const service = services[index];
  if (!service) {
    return message.reply(`Opção inválida.\n\n${formatServiceList(services)}`);
  }
  await conversationService.setState(phone, 'schedule_date', { serviceId: service.id });
  return message.reply(
    `Você escolheu: ${service.name}.\nInforme a data e hora desejada no formato DD/MM/AAAA HH:mm (ex: 25/12/2026 14:30).`
  );
}

async function handleScheduleDate(phone, text, message, state) {
  const data = conversationService.readData(state);
  const parsed = dayjs(text, 'DD/MM/YYYY HH:mm', true);
  if (!parsed.isValid()) {
    return message.reply('Data inválida. Use o formato DD/MM/AAAA HH:mm (ex: 25/12/2026 14:30).');
  }
  await conversationService.setState(phone, 'schedule_name', {
    ...data,
    date: parsed.toISOString(),
  });
  return message.reply('Perfeito! Agora, qual o seu nome completo?');
}

async function handleScheduleName(phone, text, message, state) {
  const data = conversationService.readData(state);
  if (!text) {
    return message.reply('Por favor, informe um nome válido.');
  }

  try {
    const appointment = await appointmentService.createAppointment({
      customerName: text,
      customerPhone: phone,
      serviceId: data.serviceId,
      date: data.date,
    });
    await conversationService.setState(phone, 'menu', {});
    return message.reply(
      [
        '✅ Agendamento solicitado com sucesso!',
        `Serviço: ${appointment.service.name}`,
        `Data: ${dayjs(appointment.date).format('DD/MM/YYYY HH:mm')}`,
        'Aguarde a confirmação do estabelecimento.',
        '\nDigite "menu" para voltar ao início.',
      ].join('\n')
    );
  } catch (err) {
    return message.reply(`Não foi possível agendar: ${err.message}`);
  }
}

function formatCatalog(products, services) {
  const lines = [];
  if (products.length) {
    lines.push('🛍️ *Produtos*');
    products.forEach((p) => lines.push(`- ${p.name}: R$ ${p.price.toFixed(2)}`));
  }
  if (services.length) {
    if (lines.length) lines.push('');
    lines.push('💈 *Serviços*');
    services.forEach((s) => lines.push(`- ${s.name}: R$ ${s.price.toFixed(2)} (${s.durationMin} min)`));
  }
  if (!lines.length) {
    lines.push('Nenhum item cadastrado no momento.');
  }
  lines.push('\nDigite "menu" para voltar ao início.');
  return lines.join('\n');
}

function formatServiceList(services) {
  const lines = ['Escolha um serviço digitando o número correspondente:'];
  services.forEach((s, i) => lines.push(`${i + 1}️⃣ ${s.name} - R$ ${s.price.toFixed(2)}`));
  return lines.join('\n');
}

module.exports = { handleMessage };
