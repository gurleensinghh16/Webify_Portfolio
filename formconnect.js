// ── GOOGLE FORM SILENT CONNECTION ──
// Connects Webify contact form to Google Sheets via Google Forms

(function () {

  const FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSdZx2dKqaeBGx1qKwYGBCaH9VzYyKO6Fwrfd89QadgU0VrXLQ/formResponse";

  const FIELDS = {
    name:    "entry.1208475192",
    email:   "entry.1997746973",
    phone:   "entry.972266540",
    service: "entry.444565847",
    message: "entry.1279937314"
  };

  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Create persistent hidden iframe ONCE on page load
  const iframe = document.createElement('iframe');
  iframe.name = 'google_form_iframe';
  iframe.id   = 'google_form_iframe';
  iframe.style.cssText = 'display:none;width:0;height:0;border:0;position:absolute;top:-9999px;left:-9999px;';
  document.body.appendChild(iframe);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get values
    const name    = form.querySelector('input[name="name"]').value.trim();
    const email   = form.querySelector('input[name="email"]').value.trim();
    const phone   = form.querySelector('input[name="phone"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    // Get checked services
    const checkedServices = form.querySelectorAll('input[name="service"]:checked');
    const services = Array.from(checkedServices).map(i => i.value);

    // Validation
    if (!name)    { showToast('❌ Please enter your name.', 'error');            return; }
    if (!email)   { showToast('❌ Please enter your email.', 'error');           return; }
    if (!message) { showToast('❌ Please enter project details.', 'error');      return; }

    // Show loading
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent   = 'Sending...';
    btn.disabled      = true;
    btn.style.opacity = '0.7';

    // Build hidden form targeting iframe
    const hiddenForm = document.createElement('form');
    hiddenForm.method  = 'POST';
    hiddenForm.action  = FORM_ACTION;
    hiddenForm.target  = 'google_form_iframe';
    hiddenForm.style.cssText = 'display:none;position:absolute;top:-9999px;';

    function addInput(name, value) {
      const input = document.createElement('input');
      input.type  = 'hidden';
      input.name  = name;
      input.value = value;
      hiddenForm.appendChild(input);
    }

    addInput(FIELDS.name,    name);
    addInput(FIELDS.email,   email);
    addInput(FIELDS.phone,   phone);
    addInput(FIELDS.message, message);

    if (services.length > 0) {
      services.forEach(s => addInput(FIELDS.service, s));
    } else {
      addInput(FIELDS.service, 'Not specified');
    }

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    // Wait then show success
    setTimeout(() => {
      btn.textContent   = originalText;
      btn.disabled      = false;
      btn.style.opacity = '1';
      form.reset();
      document.body.removeChild(hiddenForm);
      showToast('✅ Message sent! We will get back to you within 24 hours.', 'success');
    }, 2000);

  });

  // ── TOAST NOTIFICATION ──
  function showToast(message, type) {
    const existing = document.getElementById('webify-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'webify-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: ${type === 'success'
        ? 'linear-gradient(135deg,rgba(16,185,129,0.95),rgba(6,182,212,0.95))'
        : 'linear-gradient(135deg,rgba(239,68,68,0.95),rgba(245,158,11,0.95))'};
      color: #ffffff;
      padding: 16px 32px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      z-index: 9999;
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      border: 1px solid ${type === 'success'
        ? 'rgba(16,185,129,0.4)'
        : 'rgba(239,68,68,0.4)'};
      backdrop-filter: blur(12px);
      opacity: 0;
      transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
      max-width: 90%;
      text-align: center;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 4000);
  }

})();