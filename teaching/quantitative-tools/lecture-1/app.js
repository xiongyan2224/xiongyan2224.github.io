const TOTAL_SLIDES = 49;
const image = document.querySelector('#currentSlide');
const stage = document.querySelector('#slide-stage');
const loading = document.querySelector('#loading');
const counter = document.querySelector('#counter');
const progressBar = document.querySelector('#progressBar');
const previousButton = document.querySelector('#previousButton');
const nextButton = document.querySelector('#nextButton');
const startButton = document.querySelector('#startButton');
const overviewButton = document.querySelector('#overviewButton');
const fullscreenButton = document.querySelector('#fullscreenButton');
const viewer = document.querySelector('.viewer');
const viewerShell = document.querySelector('.viewer-shell');
const filmstrip = document.querySelector('#filmstrip');

let current = Math.min(TOTAL_SLIDES, Math.max(1, Number(location.hash.replace('#slide-', '')) || 1));

if (new URLSearchParams(location.search).has('embed')) {
  document.documentElement.classList.add('embed-mode');
}

function slidePath(number) {
  return `slides/slide-${number}.png`;
}

function showSlide(number, updateHistory = true) {
  const next = Math.min(TOTAL_SLIDES, Math.max(1, number));
  if (next === current && image.dataset.ready === 'true') return;
  current = next;
  loading.classList.add('visible');
  image.dataset.ready = 'false';
  image.src = slidePath(current);
  image.alt = `Slide ${current} of ${TOTAL_SLIDES}`;
  counter.textContent = `${String(current).padStart(2, '0')} / ${TOTAL_SLIDES}`;
  progressBar.style.width = `${(current / TOTAL_SLIDES) * 100}%`;
  previousButton.disabled = current === 1;
  nextButton.disabled = current === TOTAL_SLIDES;
  document.querySelectorAll('.thumb').forEach((thumb, index) => {
    thumb.classList.toggle('active', index + 1 === current);
    thumb.setAttribute('aria-current', index + 1 === current ? 'true' : 'false');
  });
  if (updateHistory) history.replaceState(null, '', `#slide-${current}`);
  [current + 1, current - 1].filter(n => n > 0 && n <= TOTAL_SLIDES).forEach(n => {
    const preload = new Image();
    preload.src = slidePath(n);
  });
}

function buildFilmstrip() {
  const fragment = document.createDocumentFragment();
  for (let n = 1; n <= TOTAL_SLIDES; n += 1) {
    const button = document.createElement('button');
    button.className = 'thumb';
    button.type = 'button';
    button.setAttribute('aria-label', `Go to slide ${n}`);
    button.innerHTML = `<img src="${slidePath(n)}" alt="" loading="lazy"><span>Slide ${String(n).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => {
      showSlide(n);
      stage.focus({ preventScroll: true });
    });
    fragment.append(button);
  }
  filmstrip.append(fragment);
}

function toggleOverview() {
  const isOpen = viewerShell.classList.toggle('overview-open');
  overviewButton.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) document.querySelectorAll('.thumb')[current - 1]?.scrollIntoView({ block: 'nearest' });
}

image.addEventListener('load', () => {
  image.dataset.ready = 'true';
  loading.classList.remove('visible');
});
previousButton.addEventListener('click', () => showSlide(current - 1));
nextButton.addEventListener('click', () => showSlide(current + 1));
startButton.addEventListener('click', () => {
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => stage.focus({ preventScroll: true }), 400);
});
overviewButton.addEventListener('click', toggleOverview);
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else viewer.requestFullscreen?.();
});
document.addEventListener('fullscreenchange', () => {
  fullscreenButton.textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
});
document.addEventListener('keydown', event => {
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    if (event.target instanceof HTMLButtonElement && event.key === ' ') return;
    event.preventDefault();
    showSlide(current + 1);
  }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    showSlide(current - 1);
  }
  if (event.key === 'Home') showSlide(1);
  if (event.key === 'End') showSlide(TOTAL_SLIDES);
  if (event.key.toLowerCase() === 'o') toggleOverview();
});
window.addEventListener('hashchange', () => showSlide(Number(location.hash.replace('#slide-', '')) || 1, false));

buildFilmstrip();
showSlide(current, false);
