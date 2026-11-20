(function (window) {
  'use strict';

  var pdfUrl = '/assets/presentations/cvrp-machine-learning-approaches.pdf';
  var pdfWorkerUrl = '/assets/js/lib/pdfjs/pdf.worker.min.js';
  var currentSlide = 1;
  var pdfDocument;
  var renderTask;

  function showError(message) {
    var container = document.getElementById('presentation-viewer-container');
    if (container) container.innerHTML = '<p class="presentation-error">' + message + '</p>';
  }

  function initViewer() {
    if (!window.pdfjsLib) {
      showError('The presentation viewer could not load. Please download the presentation instead.');
      return;
    }

    var canvas = document.getElementById('presentation-canvas');
    var wrapper = document.getElementById('presentation-canvas-wrapper');
    var previousButton = document.getElementById('prev-slide');
    var nextButton = document.getElementById('next-slide');
    var currentSlideElement = document.getElementById('current-slide');
    var totalSlidesElement = document.getElementById('total-slides');

    if (!canvas || !wrapper || !previousButton || !nextButton || !currentSlideElement || !totalSlidesElement) {
      return;
    }

    var context = canvas.getContext('2d');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

    function updateNavigation() {
      currentSlideElement.textContent = currentSlide;
      previousButton.disabled = currentSlide === 1;
      nextButton.disabled = currentSlide === pdfDocument.numPages;
    }

    function renderSlide(slideNumber) {
      if (renderTask) renderTask.cancel();

      pdfDocument.getPage(slideNumber).then(function (page) {
        var unscaledViewport = page.getViewport({ scale: 1 });
        var availableWidth = Math.max(wrapper.clientWidth - 32, 1);
        var scale = Math.min(availableWidth / unscaledViewport.width, 1.5);
        var viewport = page.getViewport({ scale: scale });
        var outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        renderTask = page.render({
          canvasContext: context,
          transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
          viewport: viewport,
        });

        renderTask.promise
          .then(function () {
            renderTask = null;
            updateNavigation();
          })
          .catch(function (error) {
            if (error && error.name !== 'RenderingCancelledException') {
              console.error('Error rendering presentation slide:', error);
            }
          });
      });
    }

    function goToSlide(slideNumber) {
      if (slideNumber < 1 || slideNumber > pdfDocument.numPages || slideNumber === currentSlide) return;
      currentSlide = slideNumber;
      renderSlide(currentSlide);
    }

    window.pdfjsLib
      .getDocument(pdfUrl)
      .promise.then(function (loadedPdf) {
        pdfDocument = loadedPdf;
        totalSlidesElement.textContent = pdfDocument.numPages;
        updateNavigation();
        renderSlide(currentSlide);

        previousButton.addEventListener('click', function () {
          goToSlide(currentSlide - 1);
        });
        nextButton.addEventListener('click', function () {
          goToSlide(currentSlide + 1);
        });
        document.addEventListener('keydown', function (event) {
          if (event.target.closest('button, a, input, textarea, select')) return;
          if (event.key === 'ArrowLeft') goToSlide(currentSlide - 1);
          if (event.key === 'ArrowRight') goToSlide(currentSlide + 1);
        });
      })
      .catch(function (error) {
        console.error('Error loading presentation PDF:', error);
        showError('The presentation could not be loaded. Please download the presentation instead.');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
  } else {
    initViewer();
  }
})(window);
