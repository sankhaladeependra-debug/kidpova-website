/* Kidpova website: draws the wordmark's star tag and handles the notify-me form. */
(function () {
  'use strict';

  /* ---------- Wordmark ----------
     Pova's yellow star tag (from the collar) is the dot of the "i", as in the app's wordmark. */
  var STAR = '<svg viewBox="-11 -11 22 21" aria-hidden="true" focusable="false">' +
    '<path d="M0-9.5 2.47-3.4 9.04-2.94 3.99 1.3 5.58 7.69 0 4.2-5.58 7.69-3.99 1.3-9.04-2.94-2.47-3.4Z" fill="#FFDD3C" stroke="#0868BE" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<ellipse cx="-1.6" cy="-2.6" rx="1.7" ry="1.1" fill="#FFF7B5"/></svg>';
  document.querySelectorAll('.wm .i').forEach(function (el) { el.insertAdjacentHTML('beforeend', STAR); });

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
