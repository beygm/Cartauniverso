// =========================================================
// PERSONALIZA TU CARTA AQUÍ
// Cambia los textos de ejemplo por tus propias palabras.
// Cada elemento de LETTER_PAGES es una parte de la carta.
// =========================================================
const LETTER_PAGES = [
  [
    "Mi niña, mi universo…",
    "Sinceramente no sé cómo funcionan muchas cosas en el espacio, pero algo que me encanta del universo son las supernovas: son el cierre de la vida de ciertas estrellas que terminan en una gigante y violenta explosión, la cual puede brillar más que una galaxia entera durante días.",
    "Tu amor produce que mi corazón estalle de tal manera que mi sonrisa brille durante un mes...",
    "Simplemente déjame amarte desde la creación del universo. Déjame amarte desde lo más remoto del universo..."
  ],
  [
    "Eres mi estrella favorita…",
    "Eres ese cometa que un día cambió mi mundo entero. Ámame ahora, ámame después, ámame en cada uno de los instantes de tu vida...",
    "Esto no es un sueño, lo que sentí se siente tan real que mi mente parece el universo lleno de galaxias, donde en cada una hay universos donde solo me nace decirte: déjame amarte, déjame hacerte sonreír, déjame amarte y brillar junto a ti en cada segundo.",
    "Siento que cada día soy más feliz solo con recordar que estamos juntos. Sé que si es posible estaríamos juntos en esta y más vidas; no puedes dejar de ser tan especial para mí."
  ],
  [
    "Un mes en nuestro universo…",
    "Escribo esto y siento que mi corazón se acelera solo con pensar que ya llevamos un mes, un mes donde nos ha pasado de todo, pero se siente como si fuera más de un mes.",
    "Por eso creo que nuestro amor es como el universo: pasa un año, pero dentro de él pasan diez; se siente tan hermoso que, sin decir «te amo» o expresarlo de esa manera, nuestros actos y nuestras ocurrencias nos demuestran ese amor.",
    "Gracias, muchas gracias por estar conmigo, aguantarme y —no es prometerte, pero da por hecho que— cuidaré tu brillo, tu amor; cuidaré todo de ti con todo mi amor por muchísimos años más juntos, mi vida. TE AMO, MI NIÑA."
  ]
];

// Cambia esta firma por la que tú quieras.
const SIGNATURE_HTML = 'Con todo mi amor,<br><span>BEY ♡</span>';

// Cambia este mensaje final por una frase tuya.
const FINAL_MESSAGE = 'No sé todo lo que nos espera, pero sí sé que quiero seguir descubriéndolo contigo, paso a paso, sueño a sueño y de la mano.';

const screens = [...document.querySelectorAll('.screen')];
const progressFill = document.getElementById('progressFill');
const stepLabel = document.getElementById('stepLabel');
const letterContent = document.getElementById('letterContent');
const letterPageLabel = document.getElementById('letterPageLabel');
const prevLetter = document.getElementById('prevLetter');
const nextLetter = document.getElementById('nextLetter');
let currentScreen = 0;
let currentPage = 0;

function showScreen(id) {
  screens.forEach((screen, index) => {
    screen.classList.toggle('active', screen.id === id);
    if (screen.id === id) currentScreen = index;
  });
  progressFill.style.width = `${((currentScreen + 1) / screens.length) * 100}%`;
  stepLabel.textContent = `${String(currentScreen + 1).padStart(2, '0')} / ${String(screens.length).padStart(2, '0')}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderLetterPage() {
  const page = LETTER_PAGES[currentPage] || [];
  letterContent.innerHTML = page.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('');
  letterPageLabel.textContent = `Parte ${currentPage + 1} de ${LETTER_PAGES.length}`;
  prevLetter.style.visibility = currentPage === 0 ? 'hidden' : 'visible';
  nextLetter.style.visibility = currentPage === LETTER_PAGES.length - 1 ? 'hidden' : 'visible';
  document.getElementById('signature').innerHTML = SIGNATURE_HTML;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}

document.getElementById('startJourney').addEventListener('click', () => showScreen('journey'));
document.getElementById('openLetter').addEventListener('click', () => {
  currentPage = 0; renderLetterPage(); showScreen('letter');
});
prevLetter.addEventListener('click', () => {
  if (currentPage > 0) { currentPage--; renderLetterPage(); }
});
nextLetter.addEventListener('click', () => {
  if (currentPage < LETTER_PAGES.length - 1) { currentPage++; renderLetterPage(); }
});
document.getElementById('toFinal').addEventListener('click', () => {
  document.getElementById('finalMessage').textContent = FINAL_MESSAGE;
  showScreen('finale');
});
document.getElementById('replay').addEventListener('click', () => showScreen('welcome'));
document.querySelectorAll('[data-back]').forEach(button => {
  button.addEventListener('click', () => showScreen(button.dataset.back));
});

// Fondo animado de estrellas, sin librerías externas.
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let width = 0, height = 0, dpr = 1;
function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(220, Math.floor((width * height) / 5500));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width, y: Math.random() * height,
    radius: Math.random() * 1.35 + .2, phase: Math.random() * Math.PI * 2,
    speed: Math.random() * .018 + .004
  }));
}
function drawStars() {
  ctx.clearRect(0, 0, width, height);
  const now = performance.now() / 1000;
  for (const star of stars) {
    const alpha = .3 + (Math.sin(now * star.speed * 60 + star.phase) + 1) * .34;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(235, 218, 255, ${alpha})`;
    ctx.shadowBlur = star.radius > 1.1 ? 8 : 0;
    ctx.shadowColor = '#c89aff';
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  requestAnimationFrame(drawStars);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();
renderLetterPage();
document.getElementById('finalMessage').textContent = FINAL_MESSAGE;
