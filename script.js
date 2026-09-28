document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // ---------- Theme toggle (persisted) ----------
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('aryam-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  const updateThemeIcon = () => {
    if (!themeToggle) return;
    themeToggle.innerHTML = root.dataset.theme === 'dark'
      ? '<i class="ri-sun-line"></i>'
      : '<i class="ri-moon-line"></i>';
  };
  updateThemeIcon();

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aryam-theme', root.dataset.theme);
    updateThemeIcon();
  });

  // ---------- Language toggle (systematic — every .lang-target element is
  // translated from its data-en / data-ar attributes; nothing is hand-picked) ----------
  const langToggle = document.getElementById('langToggle');

  const applyLang = (lang) => {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('.lang-target').forEach(el => {
      const value = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (value !== null) el.innerHTML = value;
    });

    document.querySelectorAll('[data-en-attr-title], [data-ar-attr-title]').forEach(el => {
      const value = lang === 'ar' ? el.getAttribute('data-ar-attr-title') : el.getAttribute('data-en-attr-title');
      if (value) el.setAttribute('title', value);
    });
    document.querySelectorAll('[data-en-attr-aria], [data-ar-attr-aria]').forEach(el => {
      const value = lang === 'ar' ? el.getAttribute('data-ar-attr-aria') : el.getAttribute('data-en-attr-aria');
      if (value) el.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-en-attr-placeholder], [data-ar-attr-placeholder]').forEach(el => {
      const value = lang === 'ar' ? el.getAttribute('data-ar-attr-placeholder') : el.getAttribute('data-en-attr-placeholder');
      if (value) el.setAttribute('placeholder', value);
    });

    if (langToggle) langToggle.textContent = lang === 'ar' ? 'EN' : 'عر';
    localStorage.setItem('aryam-lang', lang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  };

  let currentLang = localStorage.getItem('aryam-lang') || 'en';
  applyLang(currentLang);

  langToggle?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyLang(currentLang);
  });

  // ---------- Custom cursor ----------
  const cursor = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
  if (cursor && ring && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
    });
  }
  // ---------- Mobile menu (links collapse into a dropdown at <= 900px) ----------
  const nav = document.querySelector('nav');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const MENU_LABELS = {
    en: { open: 'Open menu', close: 'Close menu' },
    ar: { open: 'فتح القائمة', close: 'إغلاق القائمة' }
  };
  const setMenu = (open, returnFocus = false) => {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    const labels = MENU_LABELS[root.lang === 'ar' ? 'ar' : 'en'];
    menuToggle.setAttribute('aria-label', open ? labels.close : labels.open);
    if (!open && returnFocus) menuToggle.focus();
  };
  const menuIsOpen = () => !!nav && nav.classList.contains('menu-open');
  menuToggle?.addEventListener('click', () => setMenu(!menuIsOpen()));
  navLinks?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuIsOpen()) setMenu(false, true); });
  document.addEventListener('click', e => { if (menuIsOpen() && !nav.contains(e.target)) setMenu(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  document.addEventListener('langchange', () => setMenu(menuIsOpen()));
  setMenu(false);

  // ---------- Contact form (Formspree — existing endpoint, set in links.js / form action) ----------
  const form = document.getElementById('contactForm');
  if (form) {
    const statusEl = document.getElementById('cf-status');
    const submitBtn = document.getElementById('cf-submit');
    const fields = ['name', 'email', 'message'].map(n => ({
      name: n,
      input: form.elements[n],
      error: document.getElementById('cf-' + n + '-err')
    }));
    const contactEmail = (typeof SITE_LINKS !== 'undefined' && SITE_LINKS.email) || 'ariam.gis@outlook.com';
    const T = {
      en: {
        name: 'Please enter your name.',
        email: 'Please enter a valid email address.',
        message: 'Please write a message (at least 10 characters).',
        fix: 'Please check the highlighted fields.',
        sending: 'Sending…',
        success: 'Thank you — your message has been sent.',
        error: 'Sorry, your message could not be sent. Please try again, or email ' + contactEmail + ' directly.'
      },
      ar: {
        name: 'الرجاء إدخال الاسم.',
        email: 'الرجاء إدخال بريد إلكتروني صحيح.',
        message: 'الرجاء كتابة رسالة (10 أحرف على الأقل).',
        fix: 'الرجاء مراجعة الحقول المحددة.',
        sending: 'جارٍ الإرسال…',
        success: 'شكراً لك — تم إرسال رسالتك.',
        error: 'عذراً، تعذّر إرسال رسالتك. حاول مرة أخرى أو راسل ' + contactEmail + ' مباشرة.'
      }
    };
    const t = () => T[root.lang === 'ar' ? 'ar' : 'en'];
    const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Without JavaScript the browser's own validation + a normal POST to Formspree still work;
    // with JavaScript we validate here so messages follow the site language.
    form.setAttribute('novalidate', '');

    const setStatus = (text, kind) => {
      statusEl.textContent = text;
      statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
    };
    const setFieldError = (f, msg) => {
      f.error.textContent = msg;
      f.error.hidden = !msg;
      if (msg) f.input.setAttribute('aria-invalid', 'true');
      else f.input.removeAttribute('aria-invalid');
    };
    const validate = () => {
      let first = null;
      fields.forEach(f => {
        const v = f.input.value.trim();
        let bad = false;
        if (f.name === 'name') bad = v.length === 0;
        if (f.name === 'email') bad = !emailShape.test(v) || !f.input.validity.valid;
        if (f.name === 'message') bad = v.length < 10;
        setFieldError(f, bad ? t()[f.name] : '');
        if (bad && !first) first = f;
      });
      return first;
    };
    fields.forEach(f => f.input.addEventListener('input', () => setFieldError(f, '')));

    form.addEventListener('submit', async e => {
      e.preventDefault();
      setStatus('', '');
      const firstBad = validate();
      if (firstBad) {
        setStatus(t().fix, 'error');
        firstBad.input.focus();
        return;
      }
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      setStatus(t().sending, '');
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(form.getAttribute('action'), {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
          signal: ctrl.signal
        });
        if (res.ok) {
          form.reset();
          fields.forEach(f => setFieldError(f, ''));
          setStatus(t().success, 'success');
        } else {
          let data = null;
          try { data = await res.json(); } catch (_) { /* non-JSON error body */ }
          const errs = data && Array.isArray(data.errors) ? data.errors : [];
          const bad = errs.map(x => fields.find(f => f.name === x.field)).filter(Boolean);
          if (bad.length) {
            bad.forEach(f => setFieldError(f, t()[f.name]));
            setStatus(t().fix, 'error');
            bad[0].input.focus();
          } else {
            setStatus(t().error, 'error');
          }
        }
      } catch (_) {
        setStatus(t().error, 'error');   // network failure or 15 s timeout
      } finally {
        clearTimeout(timer);
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
      }
