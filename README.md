# API-Nodejs — Bot de WhatsApp para Atendimento

API em Node.js/Express com um bot de WhatsApp (via `whatsapp-web.js`) para atendimento automatizado:
perguntas frequentes, catálogo de produtos/serviços e agendamento de horários. Pensado para
salões, clínicas e restaurantes.

## Stack

- Express (API REST)
- whatsapp-web.js + qrcode-terminal (bot de WhatsApp via QR Code)
- Prisma + SQLite (banco de dados)
- JWT + bcryptjs (autenticação do painel administrativo)
- dayjs + node-cron (datas e lembretes de agendamento)

## Configuração inicial

```bash
npm install
cp .env.example .env      # ajuste JWT_SECRET
npm run prisma:migrate    # cria o banco SQLite e as tabelas
npm run seed               # cria um admin padrão (admin@exemplo.com / admin123)
npm run dev                 # inicia a API + bot (mostra o QR Code no terminal)
```

Escaneie o QR Code exibido no terminal usando **WhatsApp > Aparelhos conectados** no celular
que vai atender os clientes. A sessão fica salva em `.wwebjs_auth/` (não versionar).

## Fluxo do bot

Ao receber uma mensagem, o bot mantém o estado da conversa por número de telefone
(`ConversationState`) e responde a um menu:

1. Perguntas frequentes (busca por palavras-chave cadastradas em `Faq`)
2. Catálogo de produtos e serviços
3. Agendar horário (escolhe serviço → informa data/hora → informa nome → grava `Appointment`)
0. Falar com atendente

Digite `menu` a qualquer momento para reiniciar o fluxo.

## Rotas da API

Autenticação (`POST /auth/login`) retorna um JWT usado nas rotas administrativas (`Authorization: Bearer <token>`).

| Recurso        | Público            | Autenticado (admin)                          |
|----------------|---------------------|-----------------------------------------------|
| `/products`    | `GET`               | `POST`, `PUT /:id`, `DELETE /:id`             |
| `/services`    | `GET`               | `POST`, `PUT /:id`, `DELETE /:id`             |
| `/faqs`        | `GET`               | `POST`, `PUT /:id`, `DELETE /:id`             |
| `/appointments`| `POST` (criar)      | `GET` (listar), `PATCH /:id/status`           |
| `/whatsapp`    | `GET /status`       | —                                              |

## Lembretes automáticos

Um job (`node-cron`) roda a cada minuto e envia uma mensagem de lembrete via WhatsApp para
agendamentos **confirmados** que ocorrem na próxima hora.

## Observações

- `whatsapp-web.js` é uma biblioteca não oficial que automatiza o WhatsApp Web via Chromium
  (Puppeteer). Use um número dedicado para o bot — o WhatsApp pode banir números com uso
  automatizado abusivo. Para uso comercial em maior escala, considere migrar para a
  WhatsApp Business Cloud API oficial da Meta.
