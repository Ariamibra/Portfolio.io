document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Theme (single source of truth: <html data-theme>, persisted; boot script in <head> applies it before paint) ----------
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (t) => {
    root.dataset.theme = t;
    try { localStorage.setItem('aryam-theme', t); } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#082C35' : '#F7F4D5');
    themeToggle?.setAttribute('aria-pressed', String(t === 'dark'));
  };
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  // ---------- Language (one system: every .lang-target swaps from data-en / data-ar; direction follows) ----------
  const langToggle = document.getElementById('langToggle');
  const applyLang = (lang) => {
    lang = lang === 'ar' ? 'ar' : 'en';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('.lang-target').forEach(el => {
      const value = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
      if (value !== null && value !== '') el.innerHTML = value;
    });
    [['title', 'title'], ['aria', 'aria-label'], ['placeholder', 'placeholder']].forEach(([key, attr]) => {
      document.querySelectorAll('[data-en-attr-' + key + ']').forEach(el => {
        const v = el.getAttribute('data-' + lang + '-attr-' + key);
        if (v) el.setAttribute(attr, v);
      });
    });
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', desc.getAttribute('data-' + lang + '-content') || desc.content);

    if (langToggle) langToggle.textContent = lang === 'ar' ? 'English' : 'العربية';
    try { localStorage.setItem('aryam-lang', lang); } catch (_) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  };

  let currentLang = 'en';
  try { currentLang = localStorage.getItem('aryam-lang') === 'ar' ? 'ar' : 'en'; } catch (_) {}
  applyLang(currentLang);
  langToggle?.addEventListener('click', () => { currentLang = currentLang === 'en' ? 'ar' : 'en'; applyLang(currentLang); });

  // ---------- Cursor (fine pointers only) ----------
  const cursor = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
  if (cursor && ring && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
    document.body.classList.add('has-cursor');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseover', e => {
      const on = !!e.target.closest('a, button');
      cursor.classList.toggle('hover', on); ring.classList.toggle('hover', on);
    });
  }

  // ---------- Hero grid: a soft local response to the pointer ----------
  const hero = document.getElementById('hero');
  if (hero && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
      hero.classList.add('is-live');
    });
    hero.addEventListener('pointerleave', () => hero.classList.remove('is-live'));
  }

  // ---------- Mobile menu ----------
  const nav = document.getElementById('siteNav');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const MENU_LABELS = { en: { open: 'Open menu', close: 'Close menu' }, ar: { open: 'فتح القائمة', close: 'إغلاق القائمة' } };
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

  // ---------- Current section in the nav ----------
  const groups = { about: 'about', capabilities: 'capabilities', work: 'work', graduation: 'work', wejhatna: 'work', idrm: 'work', progression: 'work', recommendations: 'recommendations', certificates: 'certificates', contact: 'contact' };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const target = groups[en.target.id];
        document.querySelectorAll('#navLinks a').forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + target)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(groups).forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

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
    });
  }
});
