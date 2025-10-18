
export function generateTickets() {
  const tickets = [];
  for (let t = 1; t <= 13; t++) {
    const questions = [];
    for (let q = 1; q <= 20; q++) {
      const correctIndex = Math.floor(Math.random() * 4);
      const text = `Билет ${t}, Вопрос ${q}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
      const options = new Array(4).fill(0).map((_, i) => `Вариант ${i + 1}: Lorem ipsum dolor.`);
      questions.push({ id: `${t}-${q}`, text, options, correctIndex });
    }
    tickets.push({ id: t, title: `Билет ${t}`, questions });
  }
  return tickets;
}
export const manualOverrides = {};

export function applyOverrides(baseTickets, overrides) {
  if (!overrides || typeof overrides !== 'object') return baseTickets;
  return baseTickets.map(ticket => {
    const o = overrides[ticket.id];
    if (!o) return ticket;
    const title = o.title ?? ticket.title;
    const questions = ticket.questions.map((q, idx) => {
      const qo = o.questions && o.questions[idx + 1];
      if (!qo) return q;
      return {
        ...q,
        text: qo.text ?? q.text,
        options: Array.isArray(qo.options) && qo.options.length === 4 ? qo.options : q.options,
        correctIndex: Number.isInteger(qo.correctIndex) ? qo.correctIndex : q.correctIndex
      };
    });
    return { ...ticket, title, questions };
  });
}

export function flattenAllQuestions(tickets) {
  const arr = [];
  tickets.forEach(ticket => {
    ticket.questions.forEach((q, idx) => {
      arr.push({ ...q, ticketId: ticket.id, questionNumber: idx + 1 });
    });
  });
  return arr;
}

export function sampleRandomQuestions(allQuestions, count) {
  const copy = [...allQuestions];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}


