var isRuler = false, rulerOn = false, snap = true;
var rulerXin = [ 1, 2 ], rulerYin = [ 1, 2 ], rulerDragged, iniPos, iniCoord;

function showRuler() {
    if(!rulerOn) {
      eSvgRuler.style.display = eCoordsDesc.style.display = eRulerControls.style.display = 
        eRulerX[0].style.display = eRulerX[1].style.display = eRulerY[0].style.display = eRulerY[1].style.display = eDiff.style.display = "none";
      return;
    }
    buildRuler();
    eSvgRuler.style.display = eCoordsDesc.style.display = eRulerControls.style.display = 
        eRulerX[0].style.display = eRulerX[1].style.display = eRulerY[0].style.display = eRulerY[1].style.display = eDiff.style.display = "block";
  }
  
  function buildRuler() {
    if (isRuler) return;
    let code = "<path stroke='blue' fill='none' d='";
    for (let i = 1; i < envelopeHeightIn*16; i ++)
      code += ' M' + (envelopeWidthIn*DPI + PADDING) + ' ' + (i*DPI/16 + PADDING) + ' h-' + ((i%16 == 0) ? 75 : (i%8 == 0) ? 60 : (i%4 == 0) ? 45 : (i%2 == 0) ? 30 : 15);
    for (let i = 1; i < envelopeWidthIn*16 - 5; i ++)
        code += ' M' + (i*DPI/16 + PADDING) + ' ' + PADDING + ' v' + ((i%16 == 0) ? 75 : (i%8 == 0) ? 60 : (i%4 == 0) ? 45 : (i%2 == 0) ? 30 : 15);
    code += "'/>";
    for (let i = 1; i < envelopeHeightIn; i ++)
      code += "<text stroke='blue' fill='blue' style='text-anchor:end' x='" + (envelopeWidthIn*DPI - 90 + PADDING) + "' y='" + (i*DPI + 9 + PADDING) + "'>" + i + "</text>";
    for (let i = 1; i < (envelopeWidthIn*16 - 5)/16; i ++)
      code += "<text stroke='blue' fill='blue' style='text-anchor:middle' x='" + (i*DPI + PADDING) + "' y='" + (120 + PADDING) + "'>" + i + "</text>";
    eSvgRuler.innerHTML = code;
    for (let i = 0; i < 2; i++) {
        if (rulerXin[i] > envelopeWidthIn) rulerXin[i] = envelopeWidthIn;
        if (rulerYin[i] > envelopeHeightIn) rulerYin[i] = envelopeHeightIn;
        eRulerX[i].innerHTML = '<path class="handle" id="hx' + i + '" d="M2 2 h60 l-30 60 l-30 -60"/>' +
            '<path class="line" d="M32 62 v' + envelopeHeightIn*DPI + '"/>';
        eRulerY[i].innerHTML = '<path class="handle" id="hy' + i + '" d="M2 2 v60 l60 -30 l-60 -30"/>' +
            '<path class="line" d="M62 32 h' + envelopeWidthIn*DPI + '"/>';
        eRulerX[i].setAttribute('transform', 'translate(' + (PADDING - 32 + rulerXin[i] * DPI) + ',' + (PADDING - 62) + ')');
        eRulerY[i].setAttribute('transform', 'translate(' + (PADDING - 62) + ',' + (PADDING - 32 + rulerYin[i] * DPI) + ')');
    }
    document.getElementById('hx0').onmousedown = document.getElementById('hx1').onmousedown = dragX;
    document.getElementById('hy0').onmousedown = document.getElementById('hy1').onmousedown = dragY;
    updateCoords();
    isRuler = true;
  }
  
  
  function dragX(e) {
    rulerDragged = parseInt(this.getAttribute("id")[2]);
    iniPos = e.clientX;
    iniCoord = rulerXin[rulerDragged];
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = endDrag;
    document.onmousemove = moveX;
  }
  
  function moveX(e) {
      e = e || window.event;
      e.preventDefault();
      let x = iniCoord + (e.clientX - iniPos)/screenDPI/zoom;
      if (x < 0) x = 0;
      if (x > envelopeWidthIn) x = envelopeWidthIn;
      if (snap) x = Math.round(x*16)/16;
      rulerXin[rulerDragged] = x;
      eRulerX[rulerDragged].setAttribute('transform', 'translate(' + (PADDING - 32 + x * DPI) + ',' + (PADDING - 62) + ')');
      updateCoords();
  }
  
  function dragY(e) {
    rulerDragged = parseInt(this.getAttribute("id")[2]);
    iniPos = e.clientY;
    iniCoord = rulerYin[rulerDragged];
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = endDrag;
    document.onmousemove = moveY;
  }
  
  function moveY(e) {
      e = e || window.event;
      e.preventDefault();
      let y = iniCoord + (e.clientY - iniPos)/screenDPI/zoom;
      if (y < 0) y = 0;
      if (y > envelopeHeightIn) y = envelopeHeightIn;
      if (snap) y = Math.round(y*16)/16;
      rulerYin[rulerDragged] = y;
      eRulerY[rulerDragged].setAttribute('transform', 'translate(' + (PADDING - 62) + ',' + (PADDING - 32 + y * DPI) + ')');
      updateCoords();
  }
  
  function endDrag() {
      document.onmouseup = null;
      document.onmousemove = null;
  }
  
  function updateCoords() {
    let x1i = (rulerXin[0] < rulerXin[1]) ? rulerXin[0] : rulerXin[1];
    let x2i = (rulerXin[0] < rulerXin[1]) ? rulerXin[1] : rulerXin[0];
    let y1i = (rulerYin[0] < rulerYin[1]) ? rulerYin[0] : rulerYin[1];
    let y2i = (rulerYin[0] < rulerYin[1]) ? rulerYin[1] : rulerYin[0];
    let x1 = x1i*DPI, x2 = x2i*DPI, y1 = y1i*DPI, y2 = y2i*DPI;
  
    diff = "<ellipse cx='" + ((x1 + x2)/2 + PADDING) + "' cy='" + (220 + PADDING) + "' rx='80' ry='40'/>" +
        "<ellipse cx='" + (180 + PADDING) + "' cy='" + ((y1 + y2)/2 + PADDING) + "' rx='80' ry='40'/>";
    if (snap)
      diff += outputFraction(x2i - x1i, (x1 + x2)/2 + PADDING, 240 + PADDING);
    else {
      diff += "<text stroke='blue' fill='blue' x='" + ((x1 + x2)/2 + PADDING) + "' y='" + (240 + PADDING) + "'>" + 
      (x2i - x1i).toFixed(2) + "\"</text>";
    }
    diff += "<path stroke='blue' fill='none' d='M" + (x1 + PADDING) + " " + (170 + PADDING) + " ";
    if (x2 - x1 > 50)
        diff += "l20 -20 l-20 20 l20 20 l-20 -20 h" + (x2 - x1) + " l-20 -20 l20 20 l-20 20 l20 -20'/>";
    else
        diff += "l-20 -20 m0 40 l20 -20 h-40 m" + (x2 - x1 + 80) + " 0 h-40 l20 -20 m0 40 l-20 -20'/>";
  
    if (snap)
      diff += outputFraction(y2i - y1i, 180 + PADDING, (y1 + y2 + 25)/2 + PADDING);
    else {
      diff += "<text stroke='blue' fill='blue' x='" + (180 + PADDING) + "' y='" + ((y1 + y2 + 25)/2 + PADDING) + "'>" + (y2i - y1i).toFixed(2) + "\"</text>";
    }
  
    diff += "<path stroke='blue' fill='none' d='M" + (70 + PADDING) + " " + (y1 + PADDING);
    if (y2 - y1 > 50)
        diff += "l-20 20 l20 -20 l20 20 l-20 -20 v" + (y2 - y1) + " l-20 -20 l20 20 l20 -20 l-20 20'/>";
    else
        diff += "l-20 -20 m40 0 l-20 20 v-40 m0 " + (y2 - y1 + 80) + " v-40 l-20 20 m40 0 l-20 -20'/>";
    eDiff.innerHTML = diff;
  
    if (snap) {
      eCoordsDesc.innerHTML = "<table class='t1'><tr><td>X1: " + outputFractionText(x1i) + "\"</td><td>X2: " + outputFractionText(x2i) + "\"</td><td>DX: " + outputFractionText(x2i - x1i) + "\"</td></tr>" +
        "<tr><td>Y1: " + outputFractionText(y1i) + "\"</td><td>Y2: " + outputFractionText(y2i) + "\"</td><td>DY: " + outputFractionText(y2i - y1i) + "\"</td></tr></table>";
    } else {
      eCoordsDesc.innerHTML = "<table class='t1'><tr><td>X1: " + x1i.toFixed(2) + "\"</td><td>X2: " + x2i.toFixed(2) + "\"</td><td>DX: " + (x2i - x1i).toFixed(2) + "\"</td></tr>" +
        "<tr><td>Y1: " + y1i.toFixed(2) + "\"</td><td>Y2: " + y2i.toFixed(2) + "\"</td><td>DY: " + (y2i - y1i).toFixed(2) + "\"</td></tr></table>";
    }
    
  }
  
  function fractionsOf2(n) {
      let p0 = Math.round(n*16)/16;
      let p1 = Math.floor(p0);
      let p2 = Math.round((p0 - p1)*16);
      let p3 = 16;
      if (p2 > 0)
        while (p2%2 == 0) { p2 /= 2; p3 /= 2; }
      return [ p1, p2, p3 ];
  }
  
  function outputFraction(n, x, y) {
    let p = fractionsOf2(n);
  
    pos = 1;
    if (p[1] == 0 || p[0] > 0) pos ++;
    if (p[0] > 9) pos ++;
    if (p[1] > 0) pos += 1.6;
    const charw = 30, charh = 15;
    let offset = x - pos*charw/2;
    let out = "<g stroke='blue' fill='blue'>";
  
    if (p[1] == 0 || p[0] > 0) {
      if (p[0] > 9) {
        out += "<text class='left' x='" + offset + "' y='" + y + "'>" + Math.floor(p[0]/10) + "</text>";
        offset += charw;
      }
      out += "<text class='left' x='" + offset + "' y='" + y + "'>" + p[0]%10 + "</text>";
      offset += charw;
    }
    if (p[1] != 0) {
      offset += charw*0.8;
      out += "<text class='small' x='" + offset + "' y='" + (y - charh - 5) + "'>" + p[1] + "</text>";
      out += "<text class='small' x='" + offset + "' y='" + (y + charh - 5) + "'>" + p[2] + "</text>";
      out += "<path fill='none' d='M" + (offset - charw/2) + " " + (y - charh) + " h" + charw +"'/>";
      offset += charw*0.8;
    }
    out += "<text class='left' x='" + offset + "' y='" + y + "'>\"</text></g>";
    return out;
  }
  
  function outputFractionText(n) {
    let p = fractionsOf2(n), out = "";
    if (p[0] > 0 || p[1] == 0) out += p[0];
    if (p[0] > 0 && p[1] > 0) out += ' ';
    if (p[1] > 0) out += p[1] + '/' + p[2];
    return out;
  }
  