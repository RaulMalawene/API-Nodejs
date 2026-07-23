const prisma = require('../lib/prisma');

async function getState(phone) {
  let state = await prisma.conversationState.findUnique({ where: { phone } });
  if (!state) {
    state = await prisma.conversationState.create({
      data: { phone, step: 'menu', data: null },
    });
  }
  return state;
}

async function setState(phone, step, data) {
  return prisma.conversationState.update({
    where: { phone },
    data: {
      step,
      data: data !== undefined ? JSON.stringify(data) : undefined,
    },
  });
}

function readData(state) {
  if (!state.data) return {};
  try {
    return JSON.parse(state.data);
  } catch {
    return {};
  }
}

module.exports = { getState, setState, readData };
