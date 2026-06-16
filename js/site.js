/* BE MY A11Y — site.js
   Shared header/footer injection, mobile nav, contact form, live regions.
   No dependencies. */

(function () {
  'use strict';

  /* ── Shared Header & Footer ─────────────────────────────── */
  var headerHTML = [
    '<div class="container">',
    '  <a href="/" class="site-logo" aria-label="BE MY A11Y — Home">',
    '    <img src="/images/logo.png" alt="" class="site-logo-img">',
    '  </a>',
    '  <button id="nav-toggle" class="nav-toggle" aria-controls="primary-nav" aria-expanded="false" aria-label="Open navigation menu">',
    '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">',
    '      <line x1="3" y1="6"  x2="21" y2="6"/>',
    '      <line x1="3" y1="12" x2="21" y2="12"/>',
    '      <line x1="3" y1="18" x2="21" y2="18"/>',
    '    </svg>',
    '  </button>',
    '  <nav id="primary-nav" class="site-nav" aria-label="Primary navigation">',
    '    <a href="/services">Services</a>',
    '    <a href="/accessibility">Accessibility</a>',
    '    <a href="/about">About</a>',
    '    <a href="/contact">Contact</a>',
    '  </nav>',
    '</div>'
  ].join('\n');

  var footerHTML = [
    '<div class="container">',
    '  <div class="footer-grid">',
    '    <div class="footer-brand">',
    '      <img src="/images/logo.png" alt="BE MY A11Y" class="footer-logo">',
    '      <p>Inclusive design and AI-powered accessibility services — built to make the web work for everyone.</p>',
    '    </div>',
    '    <nav aria-label="Footer pages">',
    '      <div class="footer-col">',
    '        <h3>Pages</h3>',
    '        <ul>',
    '          <li><a href="/">Home</a></li>',
    '          <li><a href="/services">Services</a></li>',
    '          <li><a href="/accessibility">Accessibility</a></li>',
    '          <li><a href="/about">About</a></li>',
    '          <li><a href="/contact">Contact</a></li>',
    '        </ul>',
    '      </div>',
    '    </nav>',
    '    <div class="footer-col">',
    '      <h3>Contact</h3>',
    '      <ul>',
    '        <li><a href="mailto:contact@bemya11y.com">contact@bemya11y.com</a></li>',
    '        <li>Nationwide — remote-friendly</li>',
    '        <li>Response within 1 business day</li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '  <div class="footer-meta">',
    '    <p class="footer-copyright">&copy; 2026 BE MY A11Y, LLC. All rights reserved.</p>',
    '  </div>',
    '</div>'
  ].join('\n');

  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) { siteHeader.innerHTML = headerHTML; }

  var siteFooter = document.querySelector('.site-footer');
  if (siteFooter) { siteFooter.innerHTML = footerHTML; }

  /* ── Mobile Nav Toggle ──────────────────────────────────── */
  var toggle = document.getElementById('nav-toggle');
  var nav    = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Mark active nav link ───────────────────────────────── */
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Contact Form ───────────────────────────────────────── */
  var form = document.getElementById('contact-form');
  if (form) {
    var liveRegion = document.getElementById('live-region');

    function announce(msg) {
      if (liveRegion) {
        liveRegion.textContent = '';
        requestAnimationFrame(function () {
          liveRegion.textContent = msg;
        });
      }
    }

    function showError(input, msg) {
      input.setAttribute('aria-invalid', 'true');
      var errId = input.getAttribute('aria-describedby');
      var errEl = errId ? document.getElementById(errId) : null;
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('is-visible');
      }
    }

    function clearError(input) {
      input.removeAttribute('aria-invalid');
      var errId = input.getAttribute('aria-describedby');
      var errEl = errId ? document.getElementById(errId) : null;
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('is-visible');
      }
    }

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
        if (input.value.trim()) { clearError(input); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

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

      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('https://formspree.io/f/xykaveor', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(function (res) {
        if (res.ok) {
          var successEl = document.getElementById('form-success');
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
