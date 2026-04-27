// ── FLOATING SOCIAL BUTTONS ──
// WhatsApp + Instagram floating buttons bottom right

(function () {

  // ── CONFIG ──
  const WHATSAPP_NUMBER  = '919034092625';
  const WHATSAPP_MESSAGE = 'Hi Webify! I\'m interested in your services.';
  const INSTAGRAM_URL    = 'https://www.instagram.com/webify_in';

  // ── BUILD WRAPPER ──
  const wrapper = document.createElement('div');
  wrapper.id = 'social-float';
  wrapper.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 9999;
    align-items: center;
  `;

  // ── BUILD BUTTON FUNCTION ──
  function createBtn(href, bgColor, glowColor, svgPath, label) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    `;

    // Label tooltip
    const tip = document.createElement('span');
    tip.textContent = label;
    tip.style.cssText = `
      background: rgba(6,8,22,0.92);
      border: 1px solid rgba(255,255,255,0.08);
      color: #f0f6ff;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      padding: 6px 12px;
      border-radius: 8px;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
      backdrop-filter: blur(12px);
      letter-spacing: 0.02em;
    `;

    // Button
    const btn = document.createElement('a');
    btn.href   = href;
    btn.target = '_blank';
    btn.rel    = 'noopener noreferrer';
    btn.style.cssText = `
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: ${bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px ${glowColor},
                  0 0 0 0px ${glowColor};
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      flex-shrink: 0;
      animation: floatBtn 3s ease-in-out infinite;
    `;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'white');
    svg.style.cssText = 'width:24px;height:24px;';
    svg.innerHTML = svgPath;
    btn.appendChild(svg);

    // Hover
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.15) translateY(-3px)';
      btn.style.boxShadow = `0 8px 30px ${glowColor}, 0 0 0 4px ${glowColor}`;
      tip.style.opacity   = '1';
      tip.style.transform = 'translateX(0)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = `0 4px 20px ${glowColor}, 0 0 0 0px ${glowColor}`;
      tip.style.opacity   = '0';
      tip.style.transform = 'translateX(8px)';
    });

    wrapper.appendChild(tip);
    wrapper.appendChild(btn);
    return wrapper;
  }

  // ── INSTAGRAM BUTTON ──
  const igBtn = createBtn(
    INSTAGRAM_URL,
    'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    'rgba(253,29,29,0.4)',
    `<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>`,
    'Instagram'
  );

  // ── WHATSAPP BUTTON ──
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  const waBtn = createBtn(
    waUrl,
    'linear-gradient(135deg, #25d366, #128c7e)',
    'rgba(37,211,102,0.4)',
    `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>`,
    'WhatsApp'
  );

  wrapper.appendChild(igBtn);
  wrapper.appendChild(waBtn);
  document.body.appendChild(wrapper);

  // ── PULSE ANIMATION ──
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatBtn {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-6px); }
    }

    #social-float a:hover {
      animation-play-state: paused !important;
    }

    /* Mobile size */
    @media(max-width: 768px) {
      #social-float {
        bottom: 100px;
        right: 16px;
        gap: 10px;
      }
      #social-float a {
        width: 46px !important;
        height: 46px !important;
      }
      #social-float a svg {
        width: 20px !important;
        height: 20px !important;
      }
    }
  `;
  document.head.appendChild(style);

})();