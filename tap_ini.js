const ePanel = document.getElementById("panel");
const ePage = document.getElementById("page");
const ePageMv = document.getElementById("page_mv");
const eEnvelope = document.getElementById("envelope");
const eEnvelopeList = document.getElementById("envelope_list");
const eSpecsList = document.getElementById("specs_list");
const eButtonPrev = document.getElementById("button_prev");
const eButtonNext = document.getElementById("button_next");
const ePageWidth = document.getElementById("page_width");
const ePageHeight = document.getElementById("page_height");
const eControls = document.getElementById("controls");
const eSvgPage = document.getElementById("svg_page");
const eEnvelopePath = document.getElementById("envelope_path");
const eFoldlinesPath = document.getElementById("fold-lines");
const eTolerancePath = document.getElementById("tolerance_path");
const eTapLeft = document.getElementById("tap_left");
const eTapRight = document.getElementById("tap_right");
const eEnvelopeControls = document.getElementById("env_controls");
const eRulerControls = document.getElementById("ruler_controls");
const eEnvelopeDesc = document.getElementById("envelope_desc");
const eSvgRuler = document.getElementById("svg_ruler");
const eCoordsDesc = document.getElementById("coords_desc");
const ePagesMinus = document.getElementById("pg_minus");
const ePagesPlus = document.getElementById("pg_plus");
const ePagesNum = document.getElementById("pages_num");
const eEnvelopeSvg = document.getElementById("envelope_svg");
const eRulerX = [ document.getElementById("svg_ruler_x1"), document.getElementById("svg_ruler_x2") ];
const eRulerY = [ document.getElementById("svg_ruler_y1"), document.getElementById("svg_ruler_y2") ];
const eDiff = document.getElementById("svg_ruler_diff");
const eZoomMinus = document.getElementById("zoom_minus");
const eZoomPlus = document.getElementById("zoom_plus");
const eZoom = document.getElementById("zoom");
const eDPIbox = document.getElementById("sdpi");
const eOMR = document.getElementById("svg_omr");


const canvas = document.getElementById('the-canvas');
const ctx = canvas.getContext('2d');

const DPI = 300;
const PANEL_WIDTH = 300;
const PADDING = 80;
const ROUNDQ = 0.55;
const INSET_PG = 0.01;
const INSET_PG0 = 0.01;
var screenDPI, zoom = 1;
const zoomStep = 1.2;

var svgPageWidth, svgPageHeight;
var pageScale;
var omrOn = false, toleranceOn = false, pages = 1;

ePanel.style.width = eEnvelope.style.left = PANEL_WIDTH + 'px';
ePage.style.left = PANEL_WIDTH + 'px';
ePage.style.top = eEnvelope.style.top = '0px';
canvas.style.marginTop = canvas.style.marginLeft = PADDING + 'px';

eSpecsList.innerHTML += "<option> </option>";
for (let i = 0; i < specifications.length; i ++) {
    eSpecsList.innerHTML += "<option>" + specifications[i][0] + " </option>";
}
eEnvelopeList.innerHTML += "<option> </option>";
for (let i = 0; i < envelopes.length; i ++) {
    eEnvelopeList.innerHTML += "<option>" + envelopes[i][0] + " </option>";
}

screenDPI = window.localStorage.getItem('taptest_screendpi');
if (screenDPI == null) screenDPI = 96; else screenDPI = parseInt(screenDPI);
eDPIbox.addEventListener("keyup", function (event) {
    if(event.key == "Enter") {
        setDPI(eDPIbox.value); eDPIbox.blur();
        window.localStorage.setItem('taptest_screendpi', '' + screenDPI);
    }
});
eDPIbox.value = screenDPI;
