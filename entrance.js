// ── WEBIFY ENTRANCE ANIMATION ──
// 1. WEBIFY letters fly in and snap into place
// 2. Hero content staggers in beautifully

(function () {

  // ── STEP 1: SPLIT WEBIFY LOGO INTO LETTERS ──
  function splitLogoLetters() {
    const logoName = document.querySelector('.logo-name');
    if (!logoName) return;

    const text = 'WEBIFY';
    logoName.innerHTML = '';

    text.split('').forEach((letter, i) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.classList.add('logo-letter');
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        position: relative;
        transition: none;
      `;

      // Random starting positions for each letter
      const directions = [
        { x: -200, y: -150 },  // W — top left
        { x: 150,  y: -200 },  // E — top right
        { x: -180, y: 100  },  // B — bottom left
        { x: 200,  y: -100 },  // I — top right
        { x: -150, y: 200  },  // F — bottom left
        { x: 180,  y: 150  },  // Y — bottom right
      ];

      const dir = directions[i];
      span.style.transform = `translate(${dir.x}px, ${dir.y}px) scale(0.3) rotate(${(Math.random() - 0.5) * 40}deg)`;

     // Only IFY (index 3,4,5) gets cyan gradient, WEB stays white
if (i >= 3) {
  span.style.background = 'linear-gradient(135deg, #22d3ee, #3b82f6)';
  span.style.webkitBackgroundClip = 'text';
  span.style.webkitTextFillColor = 'transparent';
} else {
  span.style.color = '#ffffff';
}

      logoName.appendChild(span);
    });
  }

  // ── STEP 2: ANIMATE WEBIFY LETTERS INTO PLACE ──
  function animateLogoLetters() {
    const letters = document.querySelectorAll('.logo-letter');
    if (!letters.length) return;

    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.style.transition = `
          transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
          opacity 0.4s ease,
          text-shadow 0.4s ease
        `;
        letter.style.opacity = '1';
        letter.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';

        // Cyan glow flash on landing
        setTimeout(() => {
          letter.style.textShadow = '0 0 20px rgba(34,211,238,0.9), 0 0 40px rgba(34,211,238,0.5)';
          letter.style.filter = 'brightness(1.4)';
// Settle into permanent subtle glow
setTimeout(() => {
  letter.style.textShadow = '';
  letter.style.filter = '';
}, 300);
        }, 550);

      }, i * 80);
    });
  }

  // ── STEP 3: SPLIT HERO TITLE INTO WORDS ──
  function splitHeroTitle() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    // Word definitions with fly-in directions
    const words = [
      { text: 'We',           dx: -120, dy: 0,     delay: 0    },
      { text: 'Build',        dx: 0,    dy: -100,   delay: 80   },
      { text: 'Websites',     dx: 120,  dy: 0,      delay: 160  },
      { text: 'That',         dx: -120, dy: 0,      delay: 240  },
      { text: 'Grow',         dx: 0,    dy: 100,    delay: 320  },
      { text: 'Businesses',   dx: 120,  dy: 0,      delay: 400, glow: true },
    ];

    // Build new HTML
    title.innerHTML = '';

    // Line 1: We Build Websites
    const line1 = document.createElement('div');
    line1.style.cssText = 'display:block;';

    // Line 2: That Grow Businesses
    const line2 = document.createElement('div');
    line2.style.cssText = 'display:block;';

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.classList.add('hero-word');
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translate(${word.dx}px, ${word.dy}px) scale(0.8);
        transition: none;
        margin-right: 0.25em;
      `;

      if (word.glow) {
        // "Businesses" gets gradient
        const inner = document.createElement('span');
        inner.className = 'grad';
        inner.textContent = word.text;
        span.appendChild(inner);
      } else {
        span.textContent = word.text;
      }

      span._wordData = word;

      if (i < 3) {
        line1.appendChild(span);
      } else {
        line2.appendChild(span);
      }
    });

    title.appendChild(line1);
    title.appendChild(line2);
  }

  // ── STEP 4: ANIMATE HERO WORDS ──
  function animateHeroWords(baseDelay) {
    const words = document.querySelectorAll('.hero-word');
    if (!words.length) return;

    words.forEach((word) => {
      const data = word._wordData;
      setTimeout(() => {
        word.style.transition = `
          transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
          opacity 0.5s ease
        `;
        word.style.opacity = '1';
        word.style.transform = 'translate(0, 0) scale(1)';
      }, baseDelay + data.delay);
    });
  }

  // ── STEP 5: ANIMATE REST OF HERO ──
  function animateHeroContent(baseDelay) {
    const elements = [
      { sel: '.hero-badge',  delay: 0,   dy: 30  },
      { sel: '.hero-desc',   delay: 500, dy: 25  },
      { sel: '.hero-btns',   delay: 700, dy: 25  },
      { sel: '.hero-tags',   delay: 900, dy: 20  },
    ];

    elements.forEach(el => {
      const node = document.querySelector(el.sel);
      if (!node) return;

      // Override existing animation
      node.style.cssText += `
        opacity: 0 !important;
        transform: translateY(${el.dy}px) !important;
        animation: none !important;
        transition: none;
      `;

      setTimeout(() => {
        node.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      }, baseDelay + el.delay);
    });
  }

  // ── STEP 6: ANIMATE HERO RIGHT (GLOBE) ──
  function animateGlobe(baseDelay) {
    const globe = document.querySelector('.hero-right');
    if (!globe) return;
    globe.style.cssText += 'opacity:0 !important; animation:none !important; transition:none;';
    setTimeout(() => {
      globe.style.transition = 'opacity 1s ease';
      globe.style.opacity = '1';
    }, baseDelay + 600);
  }

  // ── MASTER SEQUENCE ──
  function runEntrance() {
    // Split elements
    splitLogoLetters();
    splitHeroTitle();

    // Phase 1: WEBIFY letters snap in (0ms - 600ms)
    setTimeout(() => animateLogoLetters(), 100);

    // Phase 2: Hero badge appears (400ms)
    // Phase 3: Hero words fly in (600ms - 1000ms)
    animateHeroWords(600);

    // Phase 4: Rest of hero staggers in
    animateHeroContent(700);

    // Phase 5: Globe fades in
    animateGlobe(800);
  }

  // ── START ON DOM READY ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntrance);
  } else {
    runEntrance();
  }

})();