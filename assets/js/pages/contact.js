(function (window) {
  'use strict';

  var siteConfig = window.SiteConfig || {};
  var contactConfig = siteConfig.contact || {};

  var emailAddress = contactConfig.email || 'manpazito@gmail.com';
  var recaptchaSiteKey = contactConfig.recaptchaSiteKey || '';
  var formspreeEndpoint = contactConfig.formspreeEndpoint || 'https://formspree.io/f/xnjbonvv';
  var submitCooldownMs = contactConfig.submitCooldownMs || 60000;
  var maxSubmissionsPerHour = contactConfig.maxSubmissionsPerHour || 10;
  var toastDurationMs = contactConfig.toastDurationMs || 4000;
  var recaptchaReadyPromise = null;

  function ensureRecaptchaReady() {
    if (!recaptchaSiteKey) {
      return Promise.resolve(false);
    }

    if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
      return new Promise(function (resolve) {
        window.grecaptcha.ready(function () {
          resolve(true);
        });
      });
    }

    if (!recaptchaReadyPromise) {
      recaptchaReadyPromise = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(recaptchaSiteKey);
        script.async = true;
        script.defer = true;
        script.onload = function () {
          if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
            window.grecaptcha.ready(function () {
              resolve(true);
            });
          } else {
            reject(new Error('reCAPTCHA loaded but grecaptcha is unavailable.'));
          }
        };
        script.onerror = function () {
          reject(new Error('Failed to load reCAPTCHA script.'));
        };
        document.head.appendChild(script);
      });
    }

    return recaptchaReadyPromise;
  }

  function showToast(message, type, duration) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    var status = type || 'success';
    var displayDuration = duration || toastDurationMs;

    toast.textContent = message;
    toast.className = 'toast toast-' + status + ' show';

    if (status === 'error') {
      var notif = document.getElementById('error-notification');
      if (notif) {
        notif.style.display = 'block';
        notif.play();
        window.setTimeout(function () {
          notif.style.display = 'none';
          notif.stop();
        }, displayDuration);
      }
    }

    window.setTimeout(function () {
      toast.classList.remove('show');
    }, displayDuration);
  }

  function initCopyEmailButton() {
    var emailButton = document.getElementById('email-copy-btn');
    if (!emailButton) return;

    function fallbackCopy(text) {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();

      var copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        copied = false;
      }

      document.body.removeChild(textArea);
      return copied;
    }

    emailButton.addEventListener('click', function () {
      var originalText = emailButton.textContent;

      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard
          .writeText(emailAddress)
          .then(function () {
            emailButton.textContent = 'Copied!';
            window.setTimeout(function () {
              emailButton.textContent = originalText;
            }, 2000);
          })
          .catch(function (error) {
            console.error('Failed to copy:', error);
            if (fallbackCopy(emailAddress)) {
              emailButton.textContent = 'Copied!';
              window.setTimeout(function () {
                emailButton.textContent = originalText;
              }, 2000);
            }
          });
      } else if (fallbackCopy(emailAddress)) {
        emailButton.textContent = 'Copied!';
        window.setTimeout(function () {
          emailButton.textContent = originalText;
        }, 2000);
      }

      var mailtoUrl = 'mailto:' + emailAddress;
      var popupFeatures = 'noopener,noreferrer,width=520,height=620';
      var popupWindow = window.open(mailtoUrl, '_blank', popupFeatures);

      if (!popupWindow) {
        // Fallback when popups are blocked by the browser.
        window.location.href = mailtoUrl;
      }
    });
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var lastSubmitTime = 0;
    var submissionTimestamps = [];

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var submitButton = form.querySelector('button[type="submit"]');

      if (submitButton) {
        submitButton.disabled = true;
      }

      var now = Date.now();
      submissionTimestamps = submissionTimestamps.filter(function (time) {
        return now - time < 3600000;
      });

      if (submissionTimestamps.length >= maxSubmissionsPerHour) {
        showToast('Too many submissions. Please try again later.', 'error');
        if (submitButton) submitButton.disabled = false;
        return;
      }

      if (now - lastSubmitTime < submitCooldownMs) {
        var remainingTime = Math.ceil((submitCooldownMs - (now - lastSubmitTime)) / 1000);
        showToast('Please wait ' + remainingTime + ' seconds before submitting again.', 'error');
        if (submitButton) submitButton.disabled = false;
        return;
      }

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var subject = document.getElementById('subject').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all required fields.', 'error');
        if (submitButton) submitButton.disabled = false;
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        if (submitButton) submitButton.disabled = false;
        return;
      }

      var spamPatterns = [
        /viagra|cialis|casino|lottery|prize/i,
        /<script|javascript|onclick/i,
        /http:\/\/|https:\/\//i,
      ];

      for (var i = 0; i < spamPatterns.length; i += 1) {
        if (spamPatterns[i].test(name + subject + message)) {
          showToast('Your message was flagged as spam. Please review and try again.', 'error');
          if (submitButton) submitButton.disabled = false;
          return;
        }
      }

      lastSubmitTime = now;
      submissionTimestamps.push(now);

      var recaptchaToken = '';
      if (recaptchaSiteKey) {
        try {
          await ensureRecaptchaReady();
          recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {
            action: 'submit',
          });
        } catch (error) {
          console.warn('reCAPTCHA unavailable:', error);
          showToast('Spam protection could not load. Please refresh and try again.', 'error');
          if (submitButton) submitButton.disabled = false;
          return;
        }
      }

      var formData = new FormData(form);
      formData.append('_from_name', name);
      formData.append('_reply_to', email);
      if (recaptchaToken) {
        formData.append('g-recaptcha-response', recaptchaToken);
      }

      try {
        var response = await fetch(formspreeEndpoint, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          showToast("Thank you for your message! I'll get back to you soon.", 'success');
          form.reset();
        } else {
          showToast('There was an error sending your message. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast(
          'There was an error sending your message. Please try again or email me directly.',
          'error'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  function initContactPage() {
    initCopyEmailButton();
    initContactForm();
    if (recaptchaSiteKey) {
      ensureRecaptchaReady().catch(function (error) {
        console.warn('reCAPTCHA preload failed:', error);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactPage);
  } else {
    initContactPage();
  }
})(window);
