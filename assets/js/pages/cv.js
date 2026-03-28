(function (window) {
  'use strict';

  var siteConfig = window.SiteConfig || {};
  var cvConfig = siteConfig.cv || {};

  var pdfUrl = cvConfig.pdfUrl || '/assets/cv/ManuelMartinezGarciaResume2026.pdf';
  var pdfWorkerUrl =
    cvConfig.pdfWorkerUrl || 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var downloadFilename = cvConfig.downloadFilename || 'ManuelMartinezGarcia_Resume.pdf';

  function showPdfError(message) {
    var container = document.getElementById('pdf-viewer-container');
    if (!container) return;
    container.innerHTML = '<p style="color: red;">' + message + '</p>';
  }

  function initDownloadButton() {
    var downloadButton = document.getElementById('download-btn');
    if (!downloadButton) return;

    downloadButton.addEventListener('click', function () {
      var link = document.createElement('a');
      link.href = pdfUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  function initPdfViewer() {
    if (!window.pdfjsLib) {
      showPdfError('PDF viewer failed to load. Please try downloading directly.');
      return;
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

    window.pdfjsLib
      .getDocument(pdfUrl)
      .promise.then(function (pdf) {
        var currentPage = 1;
        var totalPages = pdf.numPages;

        var totalPagesElement = document.getElementById('total-pages');
        var currentPageElement = document.getElementById('current-page');
        var prevButton = document.getElementById('prev-page');
        var nextButton = document.getElementById('next-page');
        var canvas = document.getElementById('pdf-canvas');

        if (!canvas || !totalPagesElement || !currentPageElement || !prevButton || !nextButton) {
          return;
        }

        var context = canvas.getContext('2d');
        totalPagesElement.textContent = totalPages;

        function updateNavButtons() {
          prevButton.disabled = currentPage === 1;
          nextButton.disabled = currentPage === totalPages;
        }

        function renderPage(pageNum) {
          pdf.getPage(pageNum).then(function (page) {
            var scale = window.innerWidth < 768 ? 2 : 3;
            var viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            page.render({
              canvasContext: context,
              viewport: viewport,
            });

            currentPageElement.textContent = pageNum;
            updateNavButtons();
          });
        }

        renderPage(currentPage);

        prevButton.addEventListener('click', function () {
          if (currentPage > 1) {
            currentPage -= 1;
            renderPage(currentPage);
          }
        });

        nextButton.addEventListener('click', function () {
          if (currentPage < totalPages) {
            currentPage += 1;
            renderPage(currentPage);
          }
        });
      })
      .catch(function (error) {
        console.error('Error loading PDF:', error);
        showPdfError('Error loading PDF. Please try downloading directly.');
      });
  }

  function initCvPage() {
    initDownloadButton();
    initPdfViewer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCvPage);
  } else {
    initCvPage();
  }
})(window);
