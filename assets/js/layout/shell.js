(function (window) {
  'use strict';

  var config = window.SiteConfig || {};
  var utils = window.SiteUtils || {};

  var navigation = config.navigation || [];
  var projects = config.projects || [];
  var socialLinks = config.socialLinks || [];
  var footerConfig = config.footer || {};

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function inferPage(pathname) {
    if (pathname === '/' || pathname === '/index.html') {
      return 'home';
    }
    if (pathname.indexOf('/projects/') === 0) {
      return 'projects';
    }
    if (pathname.indexOf('/cv/') === 0) {
      return 'cv';
    }
    return '';
  }

  function inferProjectSlug(pathname) {
    var match = pathname.match(/^\/projects\/([^/]+)\/?$/);
    return match ? match[1] : '';
  }

  function renderIndicator(item) {
    var indicator = item.indicator || {};

    if (indicator.type === 'svg') {
      return indicator.svg || '';
    }

    if (indicator.type === 'lottie' && indicator.src) {
      return (
        '<lottie-player src="' +
        escapeHtml(indicator.src) +
        '" background="transparent" speed="0.8" class="nav-lottie-player"></lottie-player>'
      );
    }

    return '';
  }

  function renderProjectDropdown(activeProject) {
    return (
      '<ul class="project-dropdown">' +
      projects
        .map(function (project) {
          var currentAttr = activeProject === project.slug ? ' aria-current="page"' : '';
          return (
            '<li><a href="' +
            escapeHtml(project.href) +
            '" class="project-dropdown-link"' +
            currentAttr +
            '>' +
            escapeHtml(project.label) +
            '</a></li>'
          );
        })
        .join('') +
      '</ul>'
    );
  }

  function renderNav(currentPage, activeProject) {
    return (
      '<nav id="nav" aria-label="Main navigation">' +
      '<ul class="nav-list">' +
      navigation
        .map(function (item) {
          var currentAttr = item.key === currentPage ? ' aria-current="page"' : '';
          var dropdown = item.key === 'projects' ? renderProjectDropdown(activeProject) : '';

          return (
            '<li>' +
            '<a href="' +
            escapeHtml(item.href) +
            '" class="nav-link"' +
            currentAttr +
            '>' +
            '<span class="nav-label">' +
            escapeHtml(item.label) +
            '</span>' +
            '<span class="nav-indicator ' +
            escapeHtml(item.indicatorClass || '') +
            '">' +
            renderIndicator(item) +
            '</span>' +
            '</a>' +
            dropdown +
            '</li>'
          );
        })
        .join('') +
      '</ul>' +
      '</nav>'
    );
  }

  function renderSocialLinks() {
    return (
      '<div class="social-links">' +
      socialLinks
        .map(function (link) {
          var humanCheckAttrs = '';
          var externalAttrs = ' target="_blank" rel="noopener noreferrer"';

          if (link.humanCheck) {
            humanCheckAttrs =
              ' data-human-check="email" data-email-user="' +
              escapeHtml(link.emailUser || '') +
              '" data-email-domain="' +
              escapeHtml(link.emailDomain || '') +
              '"';
            externalAttrs = '';
          }

          return (
            '<a href="' +
            escapeHtml(link.href) +
            '" class="social-link"' +
            externalAttrs +
            humanCheckAttrs +
            ' aria-label="' +
            escapeHtml(link.ariaLabel || link.label || '') +
            '">' +
            (link.icon || '') +
            escapeHtml(link.label) +
            '</a>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function closeHumanCheckDialog() {
    var overlay = document.querySelector('.human-check-overlay');
    if (!overlay) {
      return;
    }

    var previousFocusSelector = overlay.getAttribute('data-previous-focus');
    overlay.remove();
    document.body.classList.remove('human-check-open');

    if (previousFocusSelector) {
      var previousFocus = document.querySelector(previousFocusSelector);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    }
  }

  function buildMailtoFromLink(link) {
    var user = link.getAttribute('data-email-user') || '';
    var domain = link.getAttribute('data-email-domain') || '';

    if (!user || !domain) {
      return '';
    }

    return 'mailto:' + user + '@' + domain;
  }

  function openHumanCheckDialog(link) {
    closeHumanCheckDialog();

    var firstNumber = Math.floor(Math.random() * 7) + 3;
    var secondNumber = Math.floor(Math.random() * 6) + 2;
    var answer = firstNumber + secondNumber;
    var titleId = 'human-check-title';
    var inputId = 'human-check-answer';
    var previousFocusId = 'human-check-return-' + Date.now();

    if (!link.id) {
      link.id = previousFocusId;
    }

    var overlay = document.createElement('div');
    overlay.className = 'human-check-overlay';
    overlay.setAttribute('data-previous-focus', '#' + link.id);
    overlay.innerHTML =
      '<div class="human-check-dialog" role="dialog" aria-modal="true" aria-labelledby="' +
      titleId +
      '">' +
      '<button type="button" class="human-check-close" aria-label="Close human check">X</button>' +
      '<h2 id="' +
      titleId +
      '">Human Check</h2>' +
      '<p>Answer this quick check before opening your email app.</p>' +
      '<form class="human-check-form">' +
      '<label for="' +
      inputId +
      '">What is ' +
      firstNumber +
      ' + ' +
      secondNumber +
      '?</label>' +
      '<input id="' +
      inputId +
      '" class="human-check-input" type="number" inputmode="numeric" autocomplete="off" required />' +
      '<p class="human-check-error" role="alert" hidden>Not quite. Please try again.</p>' +
      '<button type="submit" class="btn btn-primary human-check-submit">Open Email</button>' +
      '</form>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.classList.add('human-check-open');

    var input = overlay.querySelector('.human-check-input');
    var form = overlay.querySelector('.human-check-form');
    var error = overlay.querySelector('.human-check-error');
    var closeButton = overlay.querySelector('.human-check-close');

    if (input) {
      input.focus();
    }

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        closeHumanCheckDialog();
      }
    });

    closeButton.addEventListener('click', closeHumanCheckDialog);

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (Number(input.value) !== answer) {
        error.hidden = false;
        input.select();
        return;
      }

      var mailto = buildMailtoFromLink(link);
      closeHumanCheckDialog();

      if (mailto) {
        window.location.href = mailto;
      }
    });
  }

  function bindHumanCheckLinks(root) {
    root.querySelectorAll('[data-human-check="email"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        openHumanCheckDialog(link);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeHumanCheckDialog();
      }
    });
  }

  function renderSidebar(currentPage, activeProject) {
    return renderNav(currentPage, activeProject) + renderSocialLinks();
  }

  function formatFooterDate(value) {
    var parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime())) {
      return '';
    }
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function getHomeLastUpdatedDate() {
    return formatFooterDate(new Date()) || '';
  }

  function getHomeFooterText() {
    var template = footerConfig.homeTemplate || footerConfig.home || 'Last updated {date} · Hosted on GitHub Pages.';
    if (template.indexOf('{date}') === -1) {
      return template;
    }
    return template.replace('{date}', getHomeLastUpdatedDate());
  }

  function renderFooter(currentPage) {
    var primaryText = currentPage === 'home' ? getHomeFooterText() : footerConfig.default;

    if (!primaryText) {
      primaryText = 'Hosted on GitHub Pages.';
    }

    var creditLabel = footerConfig.iconCreditLabel || 'Icons by';
    var creditHref = footerConfig.iconCreditHref || 'https://lordicon.com/';
    var creditText = footerConfig.iconCreditText || 'Lordicon';

    return (
      '<div id="footer-text">' +
      escapeHtml(primaryText) +
      '</div>' +
      '<div id="footer-text"><small>' +
      escapeHtml(creditLabel) +
      ' <a href="' +
      escapeHtml(creditHref) +
      '">' +
      escapeHtml(creditText) +
      '</a></small></div>'
    );
  }

  function getPrimaryContentTargetId() {
    if (document.getElementById('main-content')) {
      return 'main-content';
    }
    if (document.getElementById('main-body')) {
      return 'main-body';
    }
    return 'content';
  }

  function ensureSkipLink() {
    if (document.querySelector('.skip-link')) {
      return;
    }

    var targetId = getPrimaryContentTargetId();
    var targetElement = document.getElementById(targetId);

    if (targetElement && !targetElement.hasAttribute('tabindex')) {
      targetElement.setAttribute('tabindex', '-1');
    }

    var skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#' + targetId;
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  var body = document.body;
  var currentPage = body.getAttribute('data-page') || inferPage(window.location.pathname);
  var activeProject = body.getAttribute('data-project') || inferProjectSlug(window.location.pathname);

  var sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) {
    sidebarEl.innerHTML = renderSidebar(currentPage, activeProject);
  }

  var footerEl = document.getElementById('footer');
  if (footerEl) {
    footerEl.innerHTML = renderFooter(currentPage);
  }

  ensureSkipLink();

  if (typeof utils.bindNavLottieHover === 'function') {
    utils.bindNavLottieHover(document);
  }

  bindHumanCheckLinks(document);
})(window);
