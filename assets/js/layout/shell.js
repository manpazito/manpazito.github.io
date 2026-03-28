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
    if (pathname.indexOf('/contact/') === 0) {
      return 'contact';
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
        '" background="transparent" speed="0.8" style="width:40px;height:40px"></lottie-player>'
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
          return (
            '<a href="' +
            escapeHtml(link.href) +
            '" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="' +
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

  function renderSidebar(currentPage, activeProject) {
    return renderNav(currentPage, activeProject) + renderSocialLinks();
  }

  function renderFooter(currentPage) {
    var primaryText = currentPage === 'home' ? footerConfig.home : footerConfig.default;

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

  if (typeof utils.bindNavLottieHover === 'function') {
    utils.bindNavLottieHover(document);
  }
})(window);
