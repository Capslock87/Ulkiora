function renderTickets() {
  const ticketsContainer = document.getElementById('tickets');
  const ticketsList = document.getElementById('tickets-list');
  const frag = document.createDocumentFragment();
  for (let i = 1; i <= 13; i++) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = `ticket.html?ticket=${i}`;
    a.innerHTML = `<strong>🎫 Билет ${i}</strong><div class="footer">20 вопросов по гос-экзамену</div>`;
    frag.appendChild(a);
  }
  ticketsContainer.appendChild(frag);

  if (ticketsList) {
    for (let i = 1; i <= 13; i++) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `ticket.html?ticket=${i}`;
      link.textContent = `Билет ${i}`;
      li.appendChild(link);
      ticketsList.appendChild(li);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderTickets);
} else {
  renderTickets();
}


