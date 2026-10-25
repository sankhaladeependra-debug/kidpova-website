/* Kidpova website: renders Pova art from assets/pova.js and handles the notify-me form. */
(function () {
  'use strict';

  /* ---------- Pova art ----------
     <div class="pova" data-pova='{"beak":"smile"}' data-label="..."></div>
     or data-expression="goodbye" to use a named expression from the character sheet. */
  var K = window.Kidpova;
  if (K) {
    document.querySelectorAll('[data-pova],[data-expression]').forEach(function (el) {
      var opts = {};
      if (el.dataset.expression) {
        var found = K.EXPRESSIONS.filter(function (x) { return x.id === el.dataset.expression; })[0];
        if (found) opts = Object.assign({}, found.o);
      }
      if (el.dataset.pova) opts = Object.assign(opts, JSON.parse(el.dataset.pova));
      opts.back = K.SH + (opts.back || '');
      opts.label = el.dataset.label || 'Pova, the Kidpova penguin';
      el.innerHTML = K.svg(opts, 'width="100%" height="100%" focusable="false"');
    });

    // Wordmark sprouts (the dot of the "i").
    document.querySelectorAll('.wm .i').forEach(function (el) {
      el.insertAdjacentHTML('beforeend', '<svg viewBox="-2 0 46 35" aria-hidden="true" focusable="false">' + K.sproutMark() + '</svg>');
    });
  }

  /* ---------- Notify-me form ---------- */
  var form = document.getElementById('notify-form');
  if (!form) return;
  var email = form.elements.email;
  var adult = form.elements.adult;
  var status = document.getElementById('form-status');
  var button = form.querySelector('button[type="submit"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, id, msg) {
    document.getElementById(id).textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function showStatus(title, text, isError) {
    status.className = 'form-status' + (isError ? ' is-error' : '');
    status.innerHTML = '<strong></strong><span></span>';
    status.querySelector('strong').textContent = title;
    status.querySelector('span').textContent = text;
  }

  email.addEventListener('input', function () { if (email.getAttribute('aria-invalid') === 'true' && EMAIL_RE.test(email.value.trim())) setError(email, 'email-error'); });
  adult.addEventListener('change', function () { if (adult.checked) setError(adult, 'adult-error'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = email.value.trim();
    var ok = true;
    if (!EMAIL_RE.test(value)) { setError(email, 'email-error', 'Please enter an email address like name@example.com.'); ok = false; }
    else setError(email, 'email-error');
    if (!adult.checked) { setError(adult, 'adult-error', 'Please confirm you are a parent or guardian, 18 or older.'); ok = false; }
    else setError(adult, 'adult-error');
    if (!ok) { (email.getAttribute('aria-invalid') === 'true' ? email : adult).focus(); return; }

    // Honeypot: real people never fill this. Pretend success, send nothing.
    if (form.elements.website.value) { showStatus('Thank you!', 'We will write when Kidpova is ready.'); form.reset(); return; }

    var endpoint = (window.SIGNUP_ENDPOINT || '').trim();
    if (!endpoint) {
      showStatus('Sign-ups open soon', 'Thank you for wanting to hear from us. Our list opens in a few days. Please check back soon. Nothing was sent or saved.');
      return;
    }

    var age = form.querySelector('input[name="age"]:checked');
    var body = new URLSearchParams({ email: value, age: age ? age.value : '', website: '' });
    button.disabled = true;
    button.textContent = 'Sending…';
    // Data goes in the POST body (never the URL). Form encoding keeps this a "simple" request with no CORS preflight.
    fetch(endpoint, { method: 'POST', body: body })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error('not ok');
        form.reset();
        showStatus('You are on the list!', 'We will send one email when Kidpova is ready on Android. Pova says namaste!');
      })
      .catch(function () {
        showStatus('That did not go through', 'Please check your connection and try again in a moment.', true);
      })
      .then(function () { button.disabled = false; button.textContent = 'Notify me at launch'; });
  });
})();
