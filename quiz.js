import { generateTickets, flattenAllQuestions, sampleRandomQuestions, manualOverrides, applyOverrides } from './data.js';

function qs(sel) { return document.querySelector(sel); }

function parseQuery() {
  const params = new URLSearchParams(location.search);
  const ticket = params.get('ticket');
  const mode = params.get('mode'); // 'random' optional
  return { ticket: ticket ? Number(ticket) : null, mode };
}

function createState(questions) {
  return {
    questions,
    currentIndex: 0,
    score: 0,
    answered: false,
    canAdvance: false,
    watchdogMode: false,
  };
}

function render(state) {
  const q = state.questions[state.currentIndex];
  const qEl = qs('#question');
  const optsEl = qs('#options');
  const progressEl = qs('#progress');
  const badgeEl = qs('#badge');
  const revealEl = qs('#reveal');

  progressEl.textContent = `${state.currentIndex + 1} / ${state.questions.length}`;
  qEl.textContent = q.text;

  optsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.textContent = opt;
    btn.addEventListener('click', () => onAnswer(state, i));
    optsEl.appendChild(btn);
  });

  badgeEl.className = 'badge hidden';
  badgeEl.textContent = '';
  revealEl.classList.add('hidden');
  revealEl.textContent = '';
}

function onAnswer(state, chosenIndex) {
  if (state.answered) return;
  state.answered = true;
  const q = state.questions[state.currentIndex];
  const options = Array.from(document.querySelectorAll('.option'));
  options.forEach((el, idx) => {
    if (idx === q.correctIndex) el.classList.add('correct');
    if (idx === chosenIndex && chosenIndex !== q.correctIndex) el.classList.add('incorrect');
  });

  const badgeEl = qs('#badge');
  const revealEl = qs('#reveal');
  const isCorrect = chosenIndex === q.correctIndex;
  
  if (isCorrect) {
    state.score++;
    state.canAdvance = true;
    badgeEl.className = 'badge green';
    badgeEl.textContent = 'Верно';
  } else {
    badgeEl.className = 'badge red';
    badgeEl.textContent = 'Неверно';
    revealEl.classList.remove('hidden');
    revealEl.textContent = `Правильный ответ: ${q.options[q.correctIndex]}`;
    
    if (state.watchdogMode) {
      // В режиме "смотритель" остаемся на том же вопросе
      state.answered = false;
      state.canAdvance = false;
      return;
    } else {
      // В обычном режиме позволяем перейти к следующему вопросу
      state.canAdvance = true;
    }
  }

  // Auto-advance to next question after short delay (only if correct or in normal mode)
  setTimeout(() => goNext(state), 900);
}

function goNext(state) {
  if (!state.canAdvance) return; // stay until correct
  state.answered = false;
  state.canAdvance = false;
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex++;
    render(state);
  } else {
    finish(state);
  }
}

function finish(state) {
  const container = qs('#quiz');
  container.innerHTML = '';
  const done = document.createElement('div');
  done.innerHTML = `<h2>Тест завершён</h2><p>Результат: <strong>${state.score}</strong> из ${state.questions.length}</p><div class="controls"><a class="btn" href="index.html">На главную</a></div>`;
  container.appendChild(done);
}

function mount() {
  const { ticket, mode } = parseQuery();
  // Start from generated placeholders, then apply manual overrides
  const tickets = applyOverrides(generateTickets(), manualOverrides);
  let questions;
  if (mode === 'random') {
    const all = flattenAllQuestions(tickets);
    questions = sampleRandomQuestions(all, 20);
  } else if (ticket) {
    questions = tickets.find(t => t.id === ticket).questions;
  } else {
    questions = tickets[0].questions;
  }

  const state = createState(questions);
  render(state);

  qs('#next').addEventListener('click', () => goNext(state));
  
  // Обработчик для переключателя режима "смотритель"
  const watchdogToggle = qs('#watchdog-mode');
  const modeDescription = qs('#mode-description');
  
  if (watchdogToggle && modeDescription) {
    watchdogToggle.addEventListener('change', function() {
      state.watchdogMode = this.checked;
      modeDescription.textContent = this.checked 
        ? 'Режим "Смотритель": нельзя перейти к следующему вопросу пока не ответишь правильно'
        : 'Обычный режим: можно переходить к следующему вопросу даже при неправильном ответе';
    });
  }
}

document.addEventListener('DOMContentLoaded', mount);


