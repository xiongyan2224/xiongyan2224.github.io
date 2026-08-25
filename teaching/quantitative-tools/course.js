const sessions = {
  1: {
    title: 'Lecture 1 · Introduction to Artificial Intelligence',
    file: 'lecture-1/index.html?embed=1',
    download: 'lecture-1/Lecture1.pdf'
  },
  2: { title: 'Lecture 2 · From Chatbots to Working Agents' },
  3: { title: 'Lecture 3 · CPI Market Response Lab', target: '#lab' },
  4: { title: 'Lecture 4 · Building a Reusable Research Skill' },
  5: { title: 'Lecture 5 · Post-Earnings Announcement Drift' }
};

const viewer = document.querySelector('#lecture-viewer');
const frame = document.querySelector('#slide-frame');
const placeholder = document.querySelector('#viewer-placeholder');
const viewerTitle = document.querySelector('#viewer-title');
const viewerDownload = document.querySelector('#viewer-download');

function selectSession(number) {
  const session = sessions[number];
  document.querySelectorAll('.session').forEach((item) => item.classList.toggle('active', item.dataset.session === String(number)));
  if (session.target) {
    document.querySelector(session.target)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  viewerTitle.textContent = session.title;
  if (session.file) {
    frame.src = `${session.file}#view=FitH`;
    frame.hidden = false;
    placeholder.hidden = true;
    viewerDownload.href = session.download || session.file;
    viewerDownload.setAttribute('download', '');
    viewerDownload.hidden = false;
  } else {
    frame.hidden = true;
    placeholder.hidden = false;
    document.querySelector('#placeholder-number').textContent = String(number).padStart(2, '0');
    document.querySelector('#placeholder-title').textContent = session.title;
    viewerDownload.hidden = true;
  }
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('.session').forEach((item) => {
  const open = () => selectSession(Number(item.dataset.session));
  item.addEventListener('click', open);
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });
});

const surprise = document.querySelector('#surprise');
const regimeInputs = document.querySelectorAll('input[name=regime]');

function format(value, suffix, digits = 2) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(digits)}${suffix}`;
}

function setBar(id, value, scale) {
  const bar = document.querySelector(id);
  const width = Math.min(48, Math.abs(value) / scale * 48);
  bar.style.width = `${width}%`;
  bar.style.left = value >= 0 ? '50%' : `${50 - width}%`;
  bar.style.background = value >= 0 ? '#bf5b3f' : '#5d829c';
}

function updateLab() {
  const value = Number(surprise.value);
  const regime = document.querySelector('input[name=regime]:checked').value;
  const multiplier = regime === 'reactive' ? 1.65 : 1;
  const equity = -1.8 * value * multiplier;
  const yieldMove = 16 * value * multiplier;
  const fx = .7 * value * multiplier;
  document.querySelector('#surprise-value').textContent = format(value, ' pp');
  document.querySelector('#equity-result').textContent = format(equity, '%');
  document.querySelector('#yield-result').textContent = format(yieldMove, ' bp', 1);
  document.querySelector('#fx-result').textContent = format(fx, '%');
  setBar('#equity-bar', equity, 1.5);
  setBar('#yield-bar', yieldMove, 14);
  setBar('#fx-bar', fx, .7);
  const direction = value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero';
  const text = direction === 'positive'
    ? 'A positive inflation surprise increases expected policy tightening: equities weaken while short-term yields and the dollar rise.'
    : direction === 'negative'
      ? 'A negative inflation surprise reduces expected policy tightening: equities strengthen while short-term yields and the dollar fall.'
      : 'With no inflation surprise, the simple model predicts no systematic same-day response through this channel.';
  document.querySelector('#interpretation').textContent = text;
}

surprise.addEventListener('input', updateLab);
regimeInputs.forEach((input) => input.addEventListener('change', updateLab));
updateLab();
