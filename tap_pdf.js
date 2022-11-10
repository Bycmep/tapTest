var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';
var pdfDoc = null, pageNum = 1, pageRendering = false, pageNumPending = null;

var pageWidthIn = -1, pageHeightIn = -1;

function renderPage(num) {
    eButtonPrev.disabled = (num > 1) ? false : true;
    eButtonNext.disabled = (num < pdfDoc.numPages) ? false : true;
    
    pageRendering = true;

    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
        let pageWidthOld = pageWidthIn, pageHeightOld = pageHeightIn;
        var viewport = page.getViewport({scale: DPI / 72});
        pageWidthIn = viewport.width/DPI;
        pageHeightIn = viewport.height/DPI;
        ePageWidth.innerHTML = pageWidthIn.toFixed(2);
        ePageHeight.innerHTML = pageHeightIn.toFixed(2);
        pageScale = zoom*screenDPI/DPI;
        ePage.style.transform = eEnvelope.style.transform = 'scale(' + pageScale + ')';
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        svgPageWidth = eSvgPage.style.width = viewport.width + 2*PADDING;
        svgPageHeight = eSvgPage.style.height = viewport.height + 2*PADDING;
        eMarginCheck.innerHTML =  '';

        if ((pageWidthOld != pageWidthIn || pageHeightOld != pageHeightIn) && edata != null) {
            showE();
            showTolerance();
        }

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
            pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

// Update page counters
    document.getElementById('page_num').textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

 /**
 * Asynchronously downloads PDF file
 */
function openPDF(f) {
    pageNum = 1;

    pdfjsLib.getDocument(URL.createObjectURL(f)).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;

        // Initial/first page rendering
        renderPage(pageNum);

        ePage.style.display = 'block';
        eControls.style.display = 'block';
    });
}
