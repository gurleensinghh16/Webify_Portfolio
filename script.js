// ── MOBILE MENU ──
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu   = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  hamburgerBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});
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
// ── PROCESS STEPPER — typewriter + 3D tilt ──
const stepRows = document.querySelectorAll('.step-row');

function typeStepText(el, text, speed, onDone) {
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(t);
      el.classList.remove('typing');
      el.classList.add('done');
      if (onDone) onDone();
    }
  }, speed);
}

function showStepTags(row) {
  const tags = row.querySelectorAll('.step-tag');
  tags.forEach((tag, i) => {
    setTimeout(() => tag.classList.add('show'), i * 130);
  });
}

// scroll trigger — each row individually observed
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const row = entry.target;
    const idx = Array.from(stepRows).indexOf(row);

    setTimeout(() => {
      row.classList.add('visible');
      const desc = row.querySelector('.step-desc');
      if (desc && desc.dataset.text && !desc._typed) {
        desc._typed = true;
        setTimeout(() => {
          typeStepText(desc, desc.dataset.text, 22, () => {
            showStepTags(row);
          });
        }, 500);
      }
    }, idx * 180);

    stepObserver.unobserve(row);
  });
}, { threshold: 0.25 });

stepRows.forEach(r => stepObserver.observe(r));

// 3D tilt on each card
document.querySelectorAll('.step-body').forEach(card => {
  const row = card.closest('.step-row');

  row.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease';
  });

  row.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateX(${dy * -6}deg) rotateY(${dx * 8}deg) translateZ(14px)`;
  });

  row.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease';
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
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
// ── SERVICES 3D ENTRANCE + FLOAT ──
const srvCards = document.querySelectorAll('.srv-card');

function resetServiceCards() {
  srvCards.forEach(card => {
    card.classList.remove('in-view', 'floating');
    card.style.transition = 'none';
    card.style.opacity = '0';
    card.style.transform = 'translateX(-100vw) rotateY(-25deg)';
  });
}

function launchServiceCards() {
  srvCards.forEach((card, i) => {
    setTimeout(() => {
      // re-enable transition before animating
      card.style.transition = '';
      card.style.opacity = '';
      card.style.transform = '';
      card.classList.add('in-view');

      setTimeout(() => {
        card.classList.add('floating');
      }, 1000);
    }, i * 180);
  });
}

const srvSection = document.querySelector('#services');
let srvAnimating = false;

const srvObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !srvAnimating) {
      srvAnimating = true;
      resetServiceCards();
      // tiny delay after reset so browser repaints before animating
      setTimeout(() => {
        launchServiceCards();
        setTimeout(() => {
          srvAnimating = false;
        }, srvCards.length * 180 + 1000);
      }, 80);
    }
  });
}, { threshold: 0.1 });

if (srvSection) srvObserver.observe(srvSection);