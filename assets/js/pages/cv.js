(function (window) {
  'use strict';

  var cvConfig = (window.SiteConfig || {}).cv || {};
  var viewer = document.getElementById('pdf-viewer-container');
  var canvas = document.getElementById('pdf-canvas');
  var previous = document.getElementById('prev-page');
  var next = document.getElementById('next-page');
  var current = document.getElementById('current-page');
  var total = document.getElementById('total-pages');
  var status = document.getElementById('pdf-status');
  var download = document.getElementById('download-btn');
  var choices = [document.getElementById('cv-link'), document.getElementById('resume-link')];
  var loading;
  var rendering;
  var pdf;
  var pageNumber = 1;
  var version = 0;

  async function renderPage() {
    var request = version;
    previous.disabled = next.disabled = true;
    try {
      var page = await pdf.getPage(pageNumber);
      if (request !== version) return;
      var viewport = page.getViewport({ scale: window.innerWidth < 768 ? 2 : 3 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      rendering = page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport });
      await rendering.promise;
      if (request !== version) return;
      current.textContent = pageNumber;
      total.textContent = pdf.numPages;
      viewer.hidden = false;
      status.textContent = '';
      previous.disabled = pageNumber === 1;
      next.disabled = pageNumber === pdf.numPages;
    } catch (error) {
      if (request === version) status.textContent = 'Could not display the PDF. Please download it directly.';
    }
  }

  async function selectDocument(resume) {
    var request = ++version;
    var name = resume ? 'Resume' : 'CV';
    var url = '/assets/cv/ManuelMartinezGarcia' + name + '2026.pdf';

    choices.forEach(function (link, index) {
      if (index === Number(resume)) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    download.href = url;
    download.download = 'ManuelMartinezGarcia_' + name + '.pdf';
    download.textContent = 'Download ' + name + ' (PDF)';
    previous.disabled = next.disabled = true;
    if (viewer.hidden) status.textContent = 'Loading ' + name + '…';
    if (rendering) rendering.cancel();
    if (loading) loading.destroy().catch(function () {});

    try {
      if (!window.pdfjsLib) throw new Error('PDF.js unavailable');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = cvConfig.pdfWorkerUrl;
      loading = window.pdfjsLib.getDocument(url);
      var documentPdf = await loading.promise;
      if (request !== version) return;
      pdf = documentPdf;
      pageNumber = 1;
      await renderPage();
    } catch (error) {
      if (request === version) status.textContent = 'Could not load the PDF. Please download it directly.';
    }
  }

  previous.addEventListener('click', function () {
    pageNumber -= 1;
    renderPage();
  });
  next.addEventListener('click', function () {
    pageNumber += 1;
    renderPage();
  });

  choices.forEach(function (link, index) {
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (link.hasAttribute('aria-current')) return;
      selectDocument(index === 1);
    });
  });
  selectDocument(new URLSearchParams(window.location.search).get('document') === 'resume');
})(window);
