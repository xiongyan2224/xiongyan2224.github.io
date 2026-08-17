const toggle = document.querySelector('.filter-toggle');
const older = document.querySelector('#older-publications');

toggle?.addEventListener('click', () => {
  const opening = older.hidden;
  older.hidden = !opening;
  toggle.setAttribute('aria-expanded', String(opening));
  toggle.textContent = opening ? 'Show selected' : 'Show all 12';
});

document.querySelector('#year').textContent = new Date().getFullYear();

const mediaTrack = document.querySelector('.media-track');
document.querySelectorAll('[data-carousel]').forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.carousel === 'next' ? 1 : -1;
    mediaTrack?.scrollBy({ left: direction * 346, behavior: 'smooth' });
  });
});

document.querySelectorAll('.papers h3 a').forEach((titleLink) => {
  const articleUrl = titleLink.href;
  const title = titleLink.textContent;
  const paper = titleLink.closest('li');
  const journal = paper?.querySelector('.journal');

  titleLink.parentElement.textContent = title;
  journal?.querySelector('.pdf-pending')?.remove();

  if (journal) {
    const actions = document.createElement('span');
    actions.className = 'paper-actions';

    const article = document.createElement('a');
    article.href = articleUrl;
    article.textContent = 'Article';

    const pdf = document.createElement('span');
    pdf.className = 'pdf-disabled';
    pdf.textContent = 'PDF soon';

    actions.append(article, pdf);
    journal.append(actions);
  }
});
