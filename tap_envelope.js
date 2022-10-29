var slip = false, fold;
var tapState = true, envelopeWidthIn, envelopeHeightIn, leftTap, rightTap, edata = null, inset;

function showSpec(a) {
    eEnvelopeList.value = ' ';
    if (a == 0) edata = null;
    else { 
        edata = deepCopy(specifications[a - 1]);
        eEnvelopeDesc.innerHTML = (edata.length > 2 && typeof edata[edata.length - 1] == 'string') ? edata[edata.length - 1] : '';
//        checkMod();
    }
    showE();
}

function showEnvelope(a) {
    eSpecsList.value = ' ';
    if (a == 0) edata = null;
    else {
        edata = deepCopy(envelopes[a - 1]);
        eEnvelopeDesc.innerHTML = (edata.length > 2 && typeof edata[edata.length - 1] == 'string') ? edata[edata.length - 1] : '';
        if (typeof edata[1] == 'string') {
            let i;
            for (i = 0; i < specifications.length; i++)
            if (specifications[i][0] == edata[1]) break;
            if (i == specifications.length) {
                alert('Cannot find envelope specification "' + edata[1] + '".');
                edata = null;
            } else {
                eSpecsList.value = edata[1];
                edata = deepCopy(specifications[i]);
            }
        }
//        checkMod();
    }
    showE();
}

function checkMod() {
    slip = false;
    if (typeof edata[1] == 'object') {
        if (edata[1].includes('slip')) slip = true;
        for (let i = 2; i < edata.length; i++) edata[i - 1] = edata[i];
        edata.length = edata.length - 1;
    }
}

function deepCopy(a) { // that was only needed for checkMod
    b = [];
    for (let i = 0; i < a.length; i++) b[i] = a[i];
    return b;
}

function showE() {
    if (edata == null) {
      eEnvelopePath.setAttribute('d', "M0 0");
      ePageMv.style.left = ePageMv.style.top = '0px';
      eFoldlinesPath.setAttribute('d', '');
      eTolerancePath.setAttribute('d', '');
      eEnvelopeControls.style.display = 'none';
      let r = rulerOn; rulerOn = false; showRuler(); rulerOn = r;
    }
    else {
        fold = 1; while (edata[2] < pageHeightIn/fold) fold++;
        envelopeWidthIn = edata[1];
        envelopeHeightIn = edata[2];
        chgPages(0);

        let v = envelopeHeightIn*DPI, h = envelopeWidthIn*DPI;
        eEnvelopeSvg.style.width = h + 2*PADDING + 'px'; eEnvelopeSvg.style.height = v + 2*PADDING + 'px';

        let w = 3, path = 'M' + PADDING + ' ' + PADDING + ' v' + v + ' h' + h + ' v-' + v + ' h-' + h;
        while (edata[w] != NaN && typeof edata[w] == 'number') {
            let x = edata[w]*DPI, y = edata[w + 1]*DPI, dx = edata[w + 2]*DPI, dy = edata[w + 3]*DPI, r = edata[w + 4]*DPI, rc = r*ROUNDQ;
            path += ' M' + (PADDING + x + r) + ' ' + (PADDING + y) + ' h' + (dx - 2*r) + ' c' + rc + ' 0,' + r + ' ' + (r - rc) + ',' + r + ' ' + r +
                ' v' + (dy - 2*r) + ' c0 ' + rc + ',-' + (r - rc) + ' ' + r + ',-' + r + ' ' + r +
                ' h-' + (dx - 2*r) + ' c-' + rc + ' 0,-' + r + ' -' + (r - rc) + ',-' + r + ' -' + r +
                ' v-' + (dy - 2*r) + ' c0 -' + rc + ',' + (r - rc) + ' -' + r + ',' + r + ' -' + r;
            w += 5;
        }
        eEnvelopePath.setAttribute('d', path);

        path = 'M0 0 ';
        for (let i = 1; i < fold; i++) {
            path += " M" + (PADDING + 4) + " " + (PADDING + pageHeightIn*i/fold*DPI) + " h" + (pageWidthIn*DPI - 8);
        }
        eFoldlinesPath.setAttribute('d', path);
        
        eEnvelopeControls.style.display = 'block';

        ePageMv.style.top = (slip) ? ((envelopeHeightIn - pageHeightIn - inset)*DPI) + 'px' : ((envelopeHeightIn - pageHeightIn/fold - inset)*DPI) + 'px';
        leftTap = inset*DPI + "px";
        rightTap = (envelopeWidthIn - pageWidthIn - inset)*DPI + "px";
        tapState = !tapState;
        tap(!tapState);
        showTolerance();
        isRuler = false; if (rulerOn) showRuler();
    }
}

function tap(state) {
    if (state == tapState) return;
    tapState = state;
    eTapLeft.disabled = state;
    eTapRight.disabled = !state;
    ePageMv.style.left = (state) ? leftTap : rightTap;
}

function showTolerance() {
    if (!toleranceOn) {
      eTolerancePath.setAttribute('d', ''); return;
    }
    eTolerancePath.setAttribute('d', 'M' + ((edata[3] + 1/8)*DPI + PADDING) + ' ' + ((edata[4] + 1/8)*DPI + PADDING) +
        ' v' +  (edata[6] - 1/4)*DPI + ' h' + (edata[5] - 1/4)*DPI + ' v-' +  (edata[6] - 1/4)*DPI);
}
