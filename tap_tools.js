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