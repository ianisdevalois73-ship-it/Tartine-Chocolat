// --- Configuration ---
const DELAY_MS = 6000; // 6 secondes

// --- Sélecteurs ---
const diapo = document.getElementById('diaporama');
const slides = Array.from(document.querySelectorAll('.slides .slide'));
const prevBtn = document.querySelector('.diapo-btn.prev');
const nextBtn = document.querySelector('.diapo-btn.next');
const indicatorsContainer = document.querySelector('.diapo-indicators');

let current = 0;
let intervalId = null;
let isPaused = false;

// --- Préchargement des images ---
slides.forEach(img => {
    const preload = new Image();
    preload.src = img.src;
});

// --- Création des indicateurs dynamiquement ---
slides.forEach((_, idx) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Aller à l'image ${idx + 1}`);
    btn.dataset.index = idx;
    btn.addEventListener('click', () => goToSlide(idx, true));
    indicatorsContainer.appendChild(btn);
});

// --- Mise à jour visuelle ---
function updateUI() {
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    const indicators = Array.from(indicatorsContainer.children);
    indicators.forEach((b, i) => b.classList.toggle('active', i === current));
    diapo.setAttribute('aria-label', `Diaporama - image ${current + 1} sur ${slides.length}`);
}

// --- Fonctions de navigation ---
function nextSlide(manual = false) {
    current = (current + 1) % slides.length;
    updateUI();
    if (manual) resetInterval();
}

function prevSlide(manual = false) {
    current = (current - 1 + slides.length) % slides.length;
    updateUI();
    if (manual) resetInterval();
}

function goToSlide(index, manual = false) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    updateUI();
    if (manual) resetInterval();
}

// --- Intervalle automatique ---
function startInterval() {
    if (intervalId) return;
    intervalId = setInterval(() => {
        if (!isPaused) nextSlide();
    }, DELAY_MS);
}

function stopInterval() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
}

function resetInterval() {
    stopInterval();
    startInterval();
}

// --- Pause au survol/focus ---
diapo.addEventListener('mouseover', () => { isPaused = true; });
diapo.addEventListener('mouseout', () => { isPaused = false; });
diapo.addEventListener('focusin', () => { isPaused = true; });
diapo.addEventListener('focusout', () => { isPaused = false; });

// --- Boutons précédent/suivant ---
prevBtn.addEventListener('click', () => prevSlide(true));
nextBtn.addEventListener('click', () => nextSlide(true));

// --- Navigation clavier ---
document.addEventListener('keydown', (e) => {
    if (document.activeElement && diapo.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') prevSlide(true);
        if (e.key === 'ArrowRight') nextSlide(true);
    }
});

// --- Démarrage ---
updateUI();
startInterval();
