// ── NAV scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});
 
// ── Background canvas particles ──
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
 
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
 
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.05;
    this.color = Math.random() > 0.5 ? '34,211,238' : '59,130,246';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}
 
for (let i = 0; i < 120; i++) particles.push(new Particle());
 
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(34,211,238,${0.04 * (1 - d/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
 
function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}
animate();
 
// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal, .fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));
 
// ── 3D tilt on laptop ──
const lw = document.getElementById('laptop-wrapper');
if (lw) {
  document.addEventListener('mousemove', (e) => {
    const rect = lw.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    lw.querySelector('.laptop-wrapper') && (lw.querySelector('.laptop-wrapper').style.transform = `rotateY(${dx*8}deg) rotateX(${-dy*6}deg)`);
    lw.style.transform = `perspective(900px) rotateY(${dx*6}deg) rotateX(${-dy*4}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    lw.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
  });
}
 
// ── Active nav link ──
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--white)' : '';
  });
});

// ── ACCORDION PORTFOLIO — hover + typewriter ──
const accItems = document.querySelectorAll('.acc-item');

function typeWrite(el, text, speed = 28) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
    }
  }, speed);
  el._typeInterval = interval;
}

function openItem(item) {
  accItems.forEach(i => {
    i.classList.remove('open');
    const tw = i.querySelector('.acc-typewriter');
    if (tw && tw._typeInterval) clearInterval(tw._typeInterval);
    if (tw) tw.textContent = '';
  });

  item.classList.add('open');

  const tw = item.querySelector('.acc-typewriter');
  if (tw) {
    setTimeout(() => typeWrite(tw, tw.dataset.text), 350);
  }
}
accItems.forEach(item => {
  item.addEventListener('mouseenter', () => openItem(item));
  item.addEventListener('mouseleave', () => {
    item.classList.remove('open');
    const tw = item.querySelector('.acc-typewriter');
    if (tw && tw._typeInterval) clearInterval(tw._typeInterval);
    if (tw) tw.textContent = '';
  });
});

// open first by default
if (accItems.length) openItem(accItems[0]);
// ── PROCESS ORBIT — hover opens + typewriter in popup ──
const orbitSteps = document.querySelectorAll('.orbit-step');
let currentPop = 0;
let popTimer = null;

const popupTexts = [
  "We deep-dive into your business, goals, and target audience to craft the perfect strategy for success.",
  "Pixel-perfect mockups and prototypes crafted for your approval before any code is written.",
  "Fast, responsive, scalable websites built with modern technologies and clean code practices.",
  "We deploy, test thoroughly, and stay by your side post-launch to ensure everything runs perfectly."
];

function typeText(el, text, speed = 22) {
  el.textContent = '';
  let i = 0;
  if (el._t) clearInterval(el._t);
  el._t = setInterval(() => {
    if (i < text.length) { el.textContent += text[i]; i++; }
    else clearInterval(el._t);
  }, speed);
}

function popStep(index) {
  orbitSteps.forEach((s, si) => {
    s.classList.remove('popped');
    const d = s.querySelector('.popup-desc');
    if (d && d._t) clearInterval(d._t);
    if (d) d.textContent = '';
  });

  const step = orbitSteps[index];
  step.classList.add('popped');
  const desc = step.querySelector('.popup-desc');
  if (desc) {
    setTimeout(() => typeText(desc, popupTexts[index]), 300);
  }
}

function startAuto() {
  popStep(currentPop);
  popTimer = setInterval(() => {
    currentPop = (currentPop + 1) % orbitSteps.length;
    popStep(currentPop);
  }, 3800);
}

if (orbitSteps.length) startAuto();

orbitSteps.forEach((step, i) => {
  const planet = step.querySelector('.step-planet');

  planet.addEventListener('mouseenter', () => {
    clearInterval(popTimer);
    popStep(i);
    currentPop = i;
  });

  planet.addEventListener('mouseleave', () => {
    clearInterval(popTimer);
    popStep(currentPop);
    popTimer = setInterval(() => {
      currentPop = (currentPop + 1) % orbitSteps.length;
      popStep(currentPop);
    }, 3800);
  });
});
// ── ABOUT TYPEWRITER with HTML color marks ──
function initAboutTypewriters() {
  const paras = document.querySelectorAll('.about-para.abt-typewriter');
  if (!paras.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allParas = document.querySelectorAll('.about-para.abt-typewriter');
        allParas.forEach((para, index) => {
          const fullHTML = para.dataset.text;
          if (!fullHTML || para._typed) return;
          para._typed = true;

          setTimeout(() => {
            typeHTML(para, fullHTML, 18);
          }, 600 + index * 700);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  paras.forEach(p => observer.observe(p));
}

function typeHTML(el, html, speed) {
  // parse into a temp element so we can walk real nodes
  const temp = document.createElement('div');
  temp.innerHTML = html;
  el.innerHTML = '';

  const nodes = Array.from(temp.childNodes);
  let nodeIndex = 0;
  let charIndex = 0;
  let currentTextNode = null;
  let currentMark = null;

  function next() {
    if (nodeIndex >= nodes.length) return;

    const node = nodes[nodeIndex];

    // text node
    if (node.nodeType === 3) {
      const text = node.textContent;
      if (charIndex === 0) {
        currentTextNode = document.createTextNode('');
        el.appendChild(currentTextNode);
      }
      if (charIndex < text.length) {
        currentTextNode.textContent += text[charIndex];
        charIndex++;
        setTimeout(next, speed);
      } else {
        charIndex = 0;
        nodeIndex++;
        setTimeout(next, speed);
      }
    }
    // element node (our mark highlights)
    else if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      const cls = node.className;
      const text = node.textContent;

      if (charIndex === 0) {
        currentMark = document.createElement(tag);
        currentMark.className = cls;
        currentMark.textContent = '';
        el.appendChild(currentMark);
      }
      if (charIndex < text.length) {
        currentMark.textContent += text[charIndex];
        charIndex++;
        setTimeout(next, speed);
      } else {
        charIndex = 0;
        nodeIndex++;
        setTimeout(next, speed);
      }
    }
  }

  next();
}

initAboutTypewriters();