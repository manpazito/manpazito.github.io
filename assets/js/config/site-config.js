(function (window) {
  'use strict';

  var PROJECT_ROUTE_ICON =
    '<svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<circle cx="20" cy="16" r="3" fill="currentColor" opacity="0.9" />' +
    '<circle cx="20" cy="4" r="2" fill="currentColor" opacity="0.6" />' +
    '<circle cx="35" cy="10" r="2" fill="currentColor" opacity="0.6" />' +
    '<circle cx="32" cy="28" r="2" fill="currentColor" opacity="0.6" />' +
    '<circle cx="8" cy="28" r="2" fill="currentColor" opacity="0.6" />' +
    '<circle cx="5" cy="10" r="2" fill="currentColor" opacity="0.6" />' +
    '<path d="M20,16 L20,4 L35,10 L32,28 L20,16" stroke="currentColor" stroke-width="1.8" opacity="0.4" fill="none" />' +
    '<path d="M20,16 L5,10 L8,28 L20,16" stroke="currentColor" stroke-width="1.8" opacity="0.4" fill="none" />' +
    '<circle class="route-star" r="1.5" fill="currentColor" opacity="0.85">' +
    '<animate attributeName="r" values="1.3;1.8;1.3" dur="1.15s" repeatCount="indefinite" />' +
    '<animateMotion dur="3s" repeatCount="indefinite" path="M20,16 L20,4 L35,10 L32,28 L20,16" />' +
    '</circle>' +
    '<circle class="route-star" r="1.5" fill="currentColor" opacity="0.85">' +
    '<animate attributeName="r" values="1.3;1.8;1.3" dur="1.15s" repeatCount="indefinite" />' +
    '<animateMotion dur="2.2s" repeatCount="indefinite" path="M20,16 L5,10 L8,28 L20,16" />' +
    '</circle>' +
    '</svg>';

  var LINKEDIN_ICON =
    '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>';

  var GITHUB_ICON =
    '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>';

  window.SiteConfig = {
    footer: {
      homeTemplate: 'Last updated {date} · Hosted on GitHub Pages.',
      homeFallbackDate: 'March 19, 2026',
      default: 'Hosted on GitHub Pages.',
      iconCreditLabel: 'Icons by',
      iconCreditHref: 'https://lordicon.com/',
      iconCreditText: 'Lordicon',
    },
    navigation: [
      {
        key: 'home',
        label: 'Home',
        href: '/',
        indicatorClass: 'home-icon',
        indicator: {
          type: 'lottie',
          src: '/assets/img/icons/home.json',
        },
      },
      {
        key: 'projects',
        label: 'Projects',
        href: '/projects/',
        indicatorClass: 'cvrp-model',
        indicator: {
          type: 'svg',
          svg: PROJECT_ROUTE_ICON,
        },
      },
      {
        key: 'cv',
        label: 'Resume',
        href: '/cv/',
        indicatorClass: 'doc-verified',
        indicator: {
          type: 'lottie',
          src: '/assets/img/icons/resume.json',
        },
      },
      {
        key: 'contact',
        label: 'Contact',
        href: '/contact/',
        indicatorClass: 'contact-icon',
        indicator: {
          type: 'lottie',
          src: '/assets/img/icons/contact.json',
        },
      },
    ],
    projects: [
      {
        slug: 'drone-battery',
        label: 'Drone Battery',
        href: '/projects/drone-battery/',
      },
      {
        slug: 'cvrp-ml',
        label: 'CVRP ML',
        href: '/projects/cvrp-ml/',
      },
      {
        slug: 'cal-transpo',
        label: 'Cal Transpo Ops',
        href: '/projects/cal-transpo/',
      },
      {
        slug: 'ca-college-going-cep',
        label: 'CA College-Going & CEP',
        href: '/projects/ca-college-going-cep/',
      },
      {
        slug: 'wind-turbine',
        label: 'Wind Turbine',
        href: '/projects/wind-turbine/',
      },
      {
        slug: 'plane-boarding',
        label: 'Plane Boarding',
        href: '/projects/plane-boarding/',
      },
      {
        slug: '311-equity',
        label: '311 Equity',
        href: '/projects/311-equity/',
      },
      {
        slug: 'predicting-homelessness',
        label: 'Predicting Homelessness',
        href: '/projects/predicting-homelessness/',
      },
    ],
    socialLinks: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/manpazito',
        ariaLabel: 'LinkedIn',
        icon: LINKEDIN_ICON,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/manpazito',
        ariaLabel: 'GitHub',
        icon: GITHUB_ICON,
      },
    ],
    contact: {
      email: 'manpazito@berkeley.edu',
      recaptchaSiteKey: '6LeSu3QsAAAAAG4NmlTL3GkFBmFfikYrCcdcyYHX',
      formspreeEndpoint: 'https://formspree.io/f/xnjbonvv',
      submitCooldownMs: 60000,
      maxSubmissionsPerHour: 10,
      toastDurationMs: 4000,
    },
    cv: {
      pdfUrl: '/assets/cv/ManuelMartinezGarciaResume2026.pdf',
      pdfWorkerUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
      downloadFilename: 'ManuelMartinezGarcia_Resume.pdf',
    },
  };
})(window);
