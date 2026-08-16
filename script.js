const toggle = document.querySelector('.filter-toggle');
const older = document.querySelector('#older-publications');

toggle?.addEventListener('click', () => {
  const opening = older.hidden;
  older.hidden = !opening;
  toggle.setAttribute('aria-expanded', String(opening));
  toggle.textContent = opening ? 'Show selected' : 'Show all 12';
});

document.querySelector('#year').textContent = new Date().getFullYear();
