function canShow(raster, img) {
    let myCanvas = document.getElementById('myCanvas');
    let myCanvasX = myCanvas.getContext('2d');
    myCanvas.height = img.dy;
    myCanvas.width = img.dx;
    let p1 = 0, p2 = 0;
    for (let j = 0; j < img.dy; j++) {
        for (let i = 0; i < img.dx; i++) {
            let c = Math.round(img.data[p2++]*255);
            raster.data[p1++] = c; raster.data[p1++] = c; raster.data[p1++] = c; p1++;
        }
    }
    myCanvasX.putImageData(raster, 0, 0);
}


function scanBarcode() {
    let x = Math.round(edata[3]*DPI - parseFloat(ePageMv.style.left)), y = Math.round(edata[4]*DPI - parseFloat(ePageMv.style.top));
    let dx = Math.round(edata[5]*DPI), dy = Math.round(edata[6]*DPI);
    if (x < 0) { dx += x; x = 0; }
    if (y < 0) { dy += y; y = 0; }
    if (x + dx > canvas.width) { dx = canvas.width - x; }
    if (y + dy > canvas.height) { dy = canvas.height - y; }

//    let x = 1*DPI - parseInt(ePageMv.style.left), y = Math.round(3.21*DPI) - parseInt(ePageMv.style.top), dx = 3.2*DPI, dy = 0.04*DPI;
    let raster = ctx.getImageData(x, y, dx, dy);
    let pixels = raster.data;

//    let myCanvas = document.getElementById('myCanvas');
//    let myCanvasX = myCanvas.getContext('2d');
//    myCanvas.height = dy;
//    myCanvas.width = dx;
//    myCanvasX.putImageData(raster, 0, 0);
//    console.log(dx, dy);

    let img = { data: Array(dx*dy), dx: dx, dy: dy };
    for (let i = 0, p = 0; i < dx*dy; i ++, p += 4)
        img.data[i] = (pixels[p]*77 + pixels[p + 1]*151 + pixels[p + 2]*28)/65536;

//    let img1 = imgRotate(img, aa);
//    console.log(img1);
//    canShow(raster, img1);
//    aa += 0.001;

    

    let location = findLocation(img);
}

function imgRotate(img, alpha) {
    let img1 = { data: Array(img.dx*img.dy).fill(1), dx: img.dx, dy: img.dy };
    for (let j = 0; j < img.dy; j++) {
        for (let i = 0; i < img.dx; i++) {
            let nx = img.dx/2 + (i - img.dx/2)*Math.cos(alpha) - (j - img.dy/2)*Math.sin(alpha);
            let ny = img.dy/2 + (i - img.dx/2)*Math.sin(alpha) + (j - img.dy/2)*Math.cos(alpha);
            let x = Math.floor(nx), y = Math.floor(ny), dx = nx - x, dy = ny - y;
            let c = 1 - img.data[j*img.dx + i];
            if (x >= 0 && x < img.dx && y >=0 && y < img.dy)
                img1.data[y*img.dx + x] -= c*(1 - dx)*(1 - dy);
            if (x + 1 >= 0 && x + 1 < img.dx && y >=0 && y < img.dy)
                img1.data[y*img.dx + x + 1] -= c*dx*(1 - dy);
            if (x >= 0 && x < img.dx && y + 1 >=0 && y + 1 < img.dy)
                img1.data[(y + 1)*img.dx + x] -= c*(1 - dx)*dy;
            if (x + 1 >= 0 && x + 1 < img.dx && y + 1 >=0 && y + 1 < img.dy)
                img1.data[(y + 1)*img.dx + x + 1] -= c*dx*dy;
        }
    }
    return img1;
}

function findLocation(img) {
    const TOLERANCE = 0.75;
    let location = { x, y, dx, nlines, white, black };

    for (let j = 0; j < dy; j ++) {
        let i = 0;
        while (img[j*dx + i] == 1 && i < dx) i++;
        let prev = 0, seqX = i, seqLen = 1, l = 1;
        let seqN = [0, 0], seqL = [-1, -1], seqS = [0, 0];
        i++;
        while (i <= dx) {
            let pix = (i == dx) ? 1 - prev : img[j*dx + i];
            if (pix == prev) l++;
            else {
                if (l > 2 && l < dx/16 && (seqL[prev] == -1 ||
                    (l > seqL[prev]*TOLERANCE && l < seqL[prev]/TOLERANCE))) {
                    seqN[prev]++; seqS[prev] += l; seqL[prev] = seqS[prev]/seqN[prev]; seqLen++;
                    if (prev == 0 && seqL[prev] == -1) seqX = i - l;
                    if (seqLen > max && prev == 0) {
                        max = seqLen; location.x = seqX; location.y = j; location.black = seqL[0]; location.white = seqL[1]; location.dx = seqS[0] + seqS[1];
                    }
                }
                else {
                    seqLen = (prev == 0) ? 1 : 0;
                    seqL[0] = (prev == 0) ? l : -1;
                    seqS[0] = (prev == 0) ? l : 0;
                    seqN[0] = (prev == 0) ? 1 : 0;
                    if (prev == 0) seqX = i - l;
                }
                l = 1; 
            }
            i++; prev = pix;
        }
    }

    return location;
}

function tryDecode() {

    const lineMatch = 0.95;
    let lineY1;
    for (lineY1 = seqYMax; lineY1 > 0; lineY1--) {
        let match = 0;
        for (let i = 0; i < seqSMax; i++) {
            if (img[lineY1*dx + i] == img[(lineY1 - 1)*dx + i]) match++;
        }
        if (match < lineMatch * seqSMax) break;
    }
    let lineY2;
    for (lineY2 = seqYMax; lineY2 < dy - 1; lineY2++) {
        let match = 0;
        for (let i = 0; i < seqSMax; i++) {
            if (img[lineY2*dx + i] == img[(lineY2 + 1)*dx + i]) match++;
        }
        if (match < lineMatch * seqSMax) break;
    }
    let lineY0;
    for (lineY0 = lineY1; lineY0 >= 0; lineY0--) {
        let white = 0;
        for (let i = 0; i < seqSMax; i++) {
            if (img[lineY0*dx + i] == 1) white++;
        }
        if (white > lineMatch * seqSMax) { lineY0++; break; }
    }
    let lineY3;
    for (lineY3 = lineY2; lineY3 < dy - 1; lineY3++) {
        let white = 0;
        for (let i = 0; i < seqSMax; i++) {
            if (img[lineY3*dx + i] == 1) white++;
        }
        if (white > lineMatch * seqSMax) { lineY3--; break; }
    }

    seqLenMax--;
    let value = Array(3*seqLenMax).fill(0), total = Array(3*seqLenMax).fill(0);
    for (let j = lineY0; j <= lineY3; j++ ) {
        let line = (j < lineY1) ? 0 : ((j > lineY2) ? 2 : 1);
        let c = 0, l = 0, p = 0;
        for (let i = seqXMax; i <= seqXMax + seqSMax; i++ ) {
            value[p + line] += img[j*dx + i];
            total[p + line]++;
            l++;
            if(l >= seqLMax[c]) {
                l -= seqLMax[c]; c = 1 - c; p += 3;
            }
        }
    }
    for (let j = 0; j < 3; j++) {
        let s = '';
        for (let i = 0; i < seqLenMax; i++) {
            value[i*3 + j] = (value[i*3 + j] < total[i*3 + j]/2) ? 1 : 0;
            s += (value[i*3 + j] == 1) ? '#' : ' ';
        }
        console.log(s);
    }

    let s = '';
    const codes = [ ' ', 'X', 'S', 'A', 'X', 'X', 'D', 'F' ];
    for (let i = 0; i < seqLenMax*3; i+=6) {
        s += codes [value[i] + value[i+1]*2 + value[i+2]*4];
    }
    console.log(s);
    console.log(decode_barcode(s));

//    let ht = lineY2 - lineY1 + 1;
//    let value = Array(3*seqLenMax).fill(0), total = Array(3*seqLenMax).fill(0);
    let ymin = lineY0; let ymax = lineY3;
    let xmin = seqXMax, xmax = xmin + seqSMax;
    document.getElementById("test").innerHTML = "<path stroke='lightgreen' fill='none' d='M" + 
        (x + xmin - 1 + PADDING) + " " + (y + ymin - 1 + PADDING) + " h" + (xmax - xmin + 2) + " v" + (ymax - ymin + 2) + " h-" + (xmax - xmin + 2) + " v-" + (ymax - ymin + 2) + "'/>";

}

