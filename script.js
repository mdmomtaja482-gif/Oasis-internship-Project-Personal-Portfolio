/* ============================================================
   Md Momtaj Ansari — Portfolio Interactions
   Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  const root       = document.documentElement;
  const header     = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-link');
  const backToTop  = document.getElementById('backToTop');
  const themeBtn   = document.getElementById('themeToggle');
  const toast      = document.getElementById('toast');
  const toastMsg   = document.getElementById('toastMessage');
  const yearEl     = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');

  /* ----------------------------------------------------------
     THEME
     ---------------------------------------------------------- */
  const THEME_KEY = 'momtaj-theme';

  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia &&
             window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ----------------------------------------------------------
     MOBILE MENU
     ---------------------------------------------------------- */
  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('is-open')) return;
      if (navLinks.contains(e.target) || menuToggle.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ----------------------------------------------------------
     SCROLL — header shadow + back-to-top
     ---------------------------------------------------------- */
  function handleScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 500);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     SCROLL SPY
     ---------------------------------------------------------- */
  const sections = Array.prototype.slice.call(
    document.querySelectorAll('section[id]')
  );

  function setActiveLink(id) {
    navAnchors.forEach(function (link) {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === '#' + id);
    });
  }

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const ro = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------------
     TOAST
     ---------------------------------------------------------- */
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3000);
  }

  /* ----------------------------------------------------------
     CONTACT FORM VALIDATION
     ---------------------------------------------------------- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function setFieldState(field, valid, message) {
    const wrap = field.closest('.form-field');
    if (!wrap) return;
    const err = wrap.querySelector('.form-error');
    wrap.classList.toggle('has-error', !valid);
    wrap.classList.toggle('is-valid', valid && field.value.trim() !== '');
    if (err) err.textContent = valid ? '' : message;
  }

  if (contactForm) {
    const name    = contactForm.querySelector('#name');
    const email   = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');

    function vName() {
      const v = name.value.trim();
      if (!v) return setFieldState(name, false, 'Please enter your name.'), false;
      if (v.length < 2) return setFieldState(name, false, 'Name is too short.'), false;
      setFieldState(name, true); return true;
    }
    function vEmail() {
      const v = email.value.trim();
      if (!v) return setFieldState(email, false, 'Please enter your email.'), false;
      if (!isValidEmail(v)) return setFieldState(email, false, 'Enter a valid email address.'), false;
      setFieldState(email, true); return true;
    }
    function vMsg() {
      const v = message.value.trim();
      if (!v) return setFieldState(message, false, 'Please write a message.'), false;
      if (v.length < 10) return setFieldState(message, false, 'Message is a bit short.'), false;
      setFieldState(message, true); return true;
    }

    [name, email, message].forEach(function (f) {
      f.addEventListener('blur', function () {
        if (f === name) vName();
        if (f === email) vEmail();
        if (f === message) vMsg();
      });
      f.addEventListener('input', function () {
        const wrap = f.closest('.form-field');
        if (wrap && wrap.classList.contains('has-error')) {
          if (f === name) vName();
          if (f === email) vEmail();
          if (f === message) vMsg();
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const ok = vName() && vEmail() && vMsg();
      if (!ok) {
        const first = contactForm.querySelector('.form-field.has-error input, .form-field.has-error textarea');
        if (first) first.focus();
        return;
      }
      showToast('Thanks! I\u2019ll get back to you soon. ✨');
      contactForm.reset();
      contactForm.querySelectorAll('.form-field').forEach(function (f) {
        f.classList.remove('is-valid', 'has-error');
      });
    });
  }

  /* ----------------------------------------------------------
     RESIZE
     ---------------------------------------------------------- */
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 720) closeMenu();
    }, 150);
  });

  /* ----------------------------------------------------------
     AUTO YEAR
     ---------------------------------------------------------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();