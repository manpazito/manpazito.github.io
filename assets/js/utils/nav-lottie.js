(function (window) {
  'use strict';

  window.SiteUtils = window.SiteUtils || {};

  function bindNavLottieHover(scope) {
    var root = scope || document;
    var links = root.querySelectorAll('.nav-link');

    links.forEach(function (link) {
      var player = link.querySelector('lottie-player');
      if (!player) return;

      link.addEventListener('mouseenter', function () {
        player.play();
      });

      link.addEventListener('mouseleave', function () {
        player.stop();
      });

      link.addEventListener('focusin', function () {
        player.play();
      });

      link.addEventListener('focusout', function () {
        player.stop();
      });
    });
  }

  window.SiteUtils.bindNavLottieHover = bindNavLottieHover;
})(window);
