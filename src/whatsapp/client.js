const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./botHandler');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

let isReady = false;

function initWhatsapp() {
  client.on('qr', (qr) => {
    console.log('Escaneie o QR Code abaixo com o WhatsApp (Aparelhos conectados):');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    isReady = true;
    console.log('Cliente do WhatsApp conectado e pronto.');
  });

  client.on('disconnected', (reason) => {
    isReady = false;
    console.warn('WhatsApp desconectado:', reason);
  });

  client.on('message', async (message) => {
    try {
      if (message.isStatus || message.from === 'status@broadcast') return;
      await handleMessage(client, message);
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
    }
  });

  client.initialize();
  return client;
}

function isWhatsappReady() {
  return isReady;
}

module.exports = { client, initWhatsapp, isWhatsappReady };
