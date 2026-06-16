/* BE MY A11Y — site.js
   Accessible interactions: mobile nav, contact form, live regions
   No dependencies. */

(function () {
  'use strict';

  /* ── Mobile Nav Toggle ──────────────────────────────────── */
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    /* Close when a nav link is activated */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Mark active nav link ───────────────────────────────── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    const href = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Contact Form ───────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    const liveRegion = document.getElementById('live-region');

    function announce(msg) {
      if (liveRegion) {
        liveRegion.textContent = '';
        /* Force re-read by toggling */
        requestAnimationFrame(function () {
          liveRegion.textContent = msg;
        });
      }
    }

    function showError(input, msg) {
      input.setAttribute('aria-invalid', 'true');
      const errId = input.getAttribute('aria-describedby');
      const errEl = errId ? document.getElementById(errId) : null;
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('is-visible');
      }
    }

    function clearError(input) {
      input.removeAttribute('aria-invalid');
      const errId = input.getAttribute('aria-describedby');
      const errEl = errId ? document.getElementById(errId) : null;
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('is-visible');
      }
    }

    /* Inline validation on blur */
    form.querySelectorAll('[required]').forEach(function (input) {
      input.addEventListener('blur', function () {
        if (!input.value.trim()) {
          showError(input, input.dataset.errorRequired || 'This field is required.');
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          showError(input, 'Please enter a valid email address.');
        } else {
          clearError(input);
        }
      });

      input.addEventListener('input', function () {
        if (input.value.trim()) {
          clearError(input);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      let firstInvalid = null;

      form.querySelectorAll('[required]').forEach(function (input) {
        clearError(input);
        if (!input.value.trim()) {
          showError(input, input.dataset.errorRequired || 'This field is required.');
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          showError(input, 'Please enter a valid email address.');
          valid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!valid) {
        firstInvalid.focus();
        announce('Please fix the errors in the form before submitting.');
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('https://formspree.io/f/xykaveor', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(function (res) {
        if (res.ok) {
          const successEl = document.getElementById('form-success');
          if (successEl) {
            successEl.classList.add('is-visible');
            successEl.focus();
            announce('Your message was sent successfully. We\'ll be in touch within one business day.');
            form.reset();
          }
        } else {
          announce('Something went wrong. Please email us directly at contact@bemya11y.com.');
        }
      })
      .catch(function () {
        announce('Something went wrong. Please email us directly at contact@bemya11y.com.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
    });
  }

})();
