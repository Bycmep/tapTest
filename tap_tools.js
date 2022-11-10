function showOMR() {
    if (!omrOn) {
        eOMR.innerHTML = ""; return;
    } 
    const OMR_XPOS = 0.45;
    let omr_code = "<path fill='white' stroke='none' d='M" + (0.425*DPI + PADDING) + " " + (2.025*DPI + PADDING) +
        " v" + 2.05*DPI + " h" + 0.55*DPI + " v-" + 2.05*DPI + " h-" + 0.55*DPI + "'/>";
    const omrCode = [ 'TPC 8', 'TPC 4', 'TPC 2', 'TPC 1', 'SEL 5', 'SEL 4', 'SEL 3', 'QC', 'DVRT', 'SFTY', 'SEL 2', 'SEL 1', 'SEQ 2', 'SEQ 1', 'EOC', 'BM' ];
    for (let i = 0; i < 16; i ++) {
        omr_code += "<text class='left' stroke='green' fill='green' x='" + (0.45*DPI + PADDING) + "' y='" + ((i*0.125 + 2.15)*DPI + PADDING) + "'>" + omrCode[i] + "</text>";
    }
    eOMR.innerHTML = omr_code;
}

function chgPages(delta) {
    if (slip) {
        inset = INSET_PG0 + INSET_PG;
        ePagesMinus.disabled = ePagesPlus.disabled = true;
        ePagesNum.innerHTML = pages = 1;
        return;
    }
    
    pages += delta;
    inset = INSET_PG0 + INSET_PG*pages*fold;
    if ((pageHeightIn/fold + 2*inset) > envelopeHeightIn) {
        pages = Math.floor(((envelopeHeightIn - pageHeightIn/fold)/2 - INSET_PG0)/INSET_PG/fold);
    }
    if ((pageWidthIn + 2*inset) > envelopeWidthIn) {
        pages = Math.floor(((envelopeWidthIn - pageWidthIn)/2 - INSET_PG0)/INSET_PG/fold);
    }
    if (pages == 0) pages = 1;
    inset = INSET_PG0 + INSET_PG*pages*fold;
    ePagesMinus.disabled = (pages > 1) ? false : true;
    ePagesPlus.disabled = (pageHeightIn/fold + 2*(inset + INSET_PG*fold) > envelopeHeightIn || pageWidthIn + 2*(inset + INSET_PG*fold) > envelopeWidthIn) ? true : false;
    ePagesNum.innerHTML = pages;
    if (delta != 0) showE();
}

function zum(z) {
    if (z < 0) zoom /= zoomStep;
    if (z > 0) zoom *= zoomStep;
    eZoom.innerHTML = Math.round(zoom*100);
    eZoomMinus.disabled = (zoom/zoomStep < 0.5) ? true : false;
    eZoomPlus.disabled = (zoom*zoomStep*screenDPI/DPI > 1) ? true : false;
    pageScale = zoom*screenDPI/DPI;
    ePage.style.transform = eEnvelope.style.transform = 'scale(' + pageScale + ')';
}

function setDPI(n) {
    if (n < 72) n = 72; if (n > 400) n = 400;
    screenDPI = n; eDPIbox.value = screenDPI;
    zum(0);
}

const WHITELEVEL = 0.75;
const MARGIN = 3/16;
const M = Math.round(MARGIN*DPI);
function checkMargins() {
    if (eMarginCheck.innerHTML != '') { eMarginCheck.innerHTML =  ''; return; }
    showEnvelope(0);
    const dx = pageWidthIn*DPI, dy = pageHeightIn*DPI;
    let raster = ctx.getImageData(0, 0, dx, dy);
    mark = '<path fill="none" stroke="red" d="';
    mark += checkArea(raster.data, 0, 0, dx, M);
    mark += checkArea(raster.data, 0, dy - M, dx, dy);
    mark += checkArea(raster.data, 0, M, M, dy - M);
    mark += checkArea(raster.data, dx - M, M, dx, dy - M);
    mark += '"/><path fill="none" stroke="green" d="M' + (M + PADDING) + ' ' + (M + PADDING) +
        ' h' + (pageWidthIn*DPI - 2*M) + ' v' + (pageHeightIn*DPI - 2*M) +
        ' h-' + (pageWidthIn*DPI - 2*M) + ' v-' + (pageHeightIn*DPI - 2*M) + '"/>';
    eMarginCheck.innerHTML =  mark;
}

function checkArea(pixels, x0, y0, x1, y1) {
    let out = '';
    for (let j = y0; j < y1; j++) {
        let p = Math.round((j*pageWidthIn*DPI + x0)*4);
        let line = false, xs;
        for (let i = x0; i < x1; i++) {
            let light = (pixels[p]*77 + pixels[p + 1]*151 + pixels[p + 2]*28)/65536; p += 4;
            if (light < WHITELEVEL && !line) { xs = i; line = true; }
            if (line && (light >= WHITELEVEL || i == x1 - 1)) {
                line = false;
                out += ' M' + (xs + PADDING) + ' ' + (j + PADDING) + ' h' + (i - xs + 1);
            }
        }
    }
    return out;
}
