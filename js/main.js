/* ==========================================================================
   RivenditoreAuto.com — main.js
   JavaScript vanilla: fade-in on scroll, validazione form, invio (placeholder).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  setCurrentYear();
  initFadeIn();
  initLeadForm();
  initStickyCta();
});

/* ---------- Anno corrente nel footer ---------- */
function setCurrentYear() {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------- Fade-in leggero on scroll (IntersectionObserver) ---------- */
function initFadeIn() {
  var targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
}

/* ---------- CTA sticky mobile: si nasconde quando il form è già visibile ---------- */
function initStickyCta() {
  var bar = document.getElementById('mobile-sticky-cta');
  var formSection = document.getElementById('form');
  if (!bar || !formSection || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      bar.classList.toggle('is-hidden', entry.isIntersecting);
    });
  }, { threshold: 0.15 });

  observer.observe(formSection);
}

/* ---------- Form di contatto: validazione client-side + invio ---------- */
function initLeadForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('.btn-submit');

  var requiredFields = [
    { id: 'fullname', message: 'Inserisci il tuo nome e cognome.' },
    { id: 'phone', message: 'Inserisci un numero di telefono valido.', validator: isValidPhone },
    { id: 'email', message: 'Inserisci un indirizzo email valido.', validator: isValidEmail },
    { id: 'company', message: 'Inserisci il nome della tua attività.' },
    { id: 'zone', message: 'Indica la zona o città della tua attività.' },
    { id: 'employees', message: 'Seleziona il numero di persone in azienda.' }
  ];

  // Rimuove l'errore visivo appena l'utente ricomincia a digitare/scegliere
  requiredFields.forEach(function (field) {
    var el = document.getElementById(field.id);
    if (!el) return;
    el.addEventListener('input', function () { clearFieldError(field.id); });
    el.addEventListener('change', function () { clearFieldError(field.id); });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setStatus('', '');

    var isValid = true;
    requiredFields.forEach(function (field) {
      var el = document.getElementById(field.id);
      if (!el) return;
      var value = el.value.trim();
      var fieldValid = value.length > 0 && (!field.validator || field.validator(value));

      if (!fieldValid) {
        isValid = false;
        showFieldError(field.id, field.message);
      } else {
        clearFieldError(field.id);
      }
    });

    if (!isValid) {
      setStatus('Controlla i campi evidenziati e riprova.', 'error');
      return;
    }

    submitLead(form, submitBtn, statusEl);
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^[0-9+\s()./-]{6,}$/.test(value);
}

function showFieldError(fieldId, message) {
  var el = document.getElementById(fieldId);
  var errorEl = document.getElementById('error-' + fieldId);
  if (el) el.classList.add('invalid');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldId) {
  var el = document.getElementById(fieldId);
  var errorEl = document.getElementById('error-' + fieldId);
  if (el) el.classList.remove('invalid');
  if (errorEl) errorEl.textContent = '';
}

function setStatus(message, type) {
  var statusEl = document.getElementById('form-status');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove('success', 'error');
  if (type) statusEl.classList.add(type);
}

/**
 * Invio del lead.
 *
 * PLACEHOLDER — al momento la funzione simula soltanto l'invio (nessun dato
 * viene trasmesso a un server esterno). Da sostituire con l'integrazione
 * definitiva quando sarà decisa, ad esempio:
 *
 *   fetch('https://formspree.io/f/XXXXXXX', {
 *     method: 'POST',
 *     headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload)
 *   })
 *
 * oppure un endpoint backend proprietario.
 */
function submitLead(form, submitBtn, statusEl) {
  var payload = {
    fullname: form.fullname.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    company: form.company.value.trim(),
    zone: form.zone.value.trim(),
    employees: form.employees.value,
    partners: (form.querySelector('input[name="partners"]:checked') || {}).value || '',
    notes: form.notes.value.trim()
  };

  if (submitBtn) submitBtn.setAttribute('disabled', 'disabled');
  setStatus('Invio in corso...', '');

  // Simulazione di una chiamata di rete asincrona (placeholder).
  window.setTimeout(function () {
    // In assenza di un endpoint reale, il payload viene solo loggato in console
    // per facilitare il debug in fase di sviluppo.
    console.log('Lead da inviare (integrazione da collegare):', payload);

    if (submitBtn) submitBtn.removeAttribute('disabled');
    setStatus('Richiesta inviata. Un consulente ti ricontatterà entro 24 ore lavorative per verificare la disponibilità nella tua zona.', 'success');
    form.reset();
  }, 700);
}
