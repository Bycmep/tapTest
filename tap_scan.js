function scanBarcode() {

    function showPopup() {
            document.getElementById('bar_status').style.display = 'block';
            document.getElementById('bar_status').innerHTML = 'Searching for barcode...';
            document.getElementById('bar_breakdown').style.display = 'none';
            document.getElementById('bar_dismiss').style.display = 'none';
            document.getElementById('barcode').style.display = 'block';

    }

    function scanBarcode_() {
        let x = Math.round(edata[3]*DPI - parseFloat(ePageMv.style.left)), y = Math.round(edata[4]*DPI - parseFloat(ePageMv.style.top));
        let dx = Math.round(edata[5]*DPI), dy = Math.round(edata[6]*DPI);
        if (x < 0) { dx += x; x = 0; }
        if (y < 0) { dy += y; y = 0; }
        if (x + dx > canvas.width) { dx = canvas.width - x; }
        if (y + dy > canvas.height) { dy = canvas.height - y; }

        let raster = ctx.getImageData(x, y, dx, dy);
        let pixels = raster.data;

        let img = { data: Array(dx*dy), x: x, y: y, dx: dx, dy: dy };
        for (let i = 0, p = 0; i < dx*dy; i ++, p += 4)
            img.data[i] = (pixels[p]*77 + pixels[p + 1]*151 + pixels[p + 2]*28)/65536;

        let alpha = 0;
        let result;
        do {
            result = tryRead(imgRotate(img, alpha));
            if (alpha >= 0) { alpha = -alpha - 0.005; }
            else { alpha = -alpha; }
        } while ((result.fail || result.barcode.message == 'Invalid barcode.') && alpha < 0.1);
        if (result.fail) { 
            document.getElementById('bar_status').innerHTML = 'Failed to read IMB barcode.';
        } else {
            document.getElementById('bar_status').style.display = 'none';
            document.getElementById('bar_breakdown').style.display = 'block';
            document.getElementById('b_barcodeid').innerHTML = result.barcode.barcode_id;
            document.getElementById('b_servtypeid').innerHTML = result.barcode.service_type;
            document.getElementById('b_mailerid').innerHTML = result.barcode.mailer_id;
            document.getElementById('b_snumber').innerHTML = result.barcode.serial_num;
            document.getElementById('b_zip').innerHTML = result.barcode.zip;
            document.getElementById('b_zip4').innerHTML = result.barcode.plus4;
            document.getElementById('b_dp').innerHTML = result.barcode.delivery_pt;
            if (typeof result.barcode.message !== 'undefined') {
                document.getElementById('bar_info').innerHTML = result.barcode.message;
            }
        }
        document.getElementById('bar_dismiss').style.display = 'block';
    }
    setTimeout(showPopup, 0);
    setTimeout(scanBarcode_, 100);

}

function tryRead(img)
{
    let result = { fail: true, barcode: 0 };
    let location = findLocation(img);
    if (location.nlines < 30) return result;
    let code = formCode(img, location);
    for (let i = 0; i < code.length; i++) {
        if (code[i] == 'X') return result;
        if (i%2 == 0 && code[i] == ' ') return result;
        if (i%2 == 1 && code[i] != ' ') return result;
    }
    result.fail = false;
    result.barcode = decode_barcode(code);
    return result;
}

function imgRotate(img, alpha) {
    let img1 = { data: Array(img.dx*img.dy).fill(1), x: img.x, y: img.y, dx: img.dx, dy: img.dy };
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

function dotBW(img, x, y) {
    const THRESHOLD = 0.5;
    if (x >= img.dx) return -1;
    return (img.data[y*img.dx + x] >= THRESHOLD) ? 1 : 0;
}

function dotGrey(img, x, y) {
    return img.data[y*img.dx + x];
}

function findLocation(img) {
    const TOLERANCE = 0.75;
    let location = { x: 0, y: 0, dx: 0, nlines: 0, width: [ 0, 0 ] };
    for (let j = 0; j < img.dy; j ++) {
        let num = [ 0, 0 ], sum = [ 0, 0 ], len = [ -1, -1 ];
        let prev = 1, l = 0;
        for (let i = 0; i <= img.dx; i ++) {
            let current = dotBW(img, i, j);
            if (current == prev) l++;
            else {
                if (len[prev] == -1) {
                    if (prev == 0 || len[0] != -1) {
                        num[prev] = 1; sum[prev] = l; len[prev] = l;
                    }
                } else {
                    if (l*TOLERANCE <= len[prev] && l/TOLERANCE >= len[prev]) {
                        num[prev] ++; sum[prev] += l; len[prev] = sum[prev]/num[prev];
                    } else {
                        if (location.nlines < num[0] && len[0] > 2) {
                            location.x = i - l - sum[0] - sum[1]; location.y = j;
                            location.dx = sum[0] + sum[1]; location.nlines = num[0];
                            location.width[0] = len[0]; location.width[1] = len[1];
                        }
                        num[1] = 0; sum[1] = 0; len[1] = -1;
                        num[0] = (prev == 0) ? 1 : 0;
                        sum[0] = (prev == 0) ? l : 0;
                        len[0] = (prev == 0) ? l : -1;
                    }
                }
                prev = current; l = 1;
            }
        }
    }
    return location;
}

function formCode(img, location) {
    const QMATCH = 0.95;
    let lineY1;
    for (lineY1 = location.y - 1; lineY1 >= 0; lineY1 --) {
        let match = 0;
        for (let i = location.x; i < location.x + location.dx; i ++) {
            if (dotBW(img, i, lineY1) == dotBW(img, i, location.y)) match ++;
        }
        if (match < QMATCH * location.dx) break;
    }
    let lineY2;
    for (lineY2 = location.y + 1; lineY2 < img.dy; lineY2 ++) {
        let match = 0;
        for (let i = location.x; i < location.x + location.dx; i ++) {
            if (dotBW(img, i, lineY2) == dotBW(img, i, location.y)) match ++;
        }
        if (match < QMATCH * location.dx) break;
    }
    let lineY0;
    for (lineY0 = lineY1; lineY0 >= 0; lineY0 --) {
        let white = 0;
        for (let i = location.x; i < location.x + location.dx; i ++) {
            if (dotBW(img, i, lineY0) == 1) white ++;
        }
        if (white > QMATCH * location.dx) { lineY0 ++; break; }
    }
    let lineY3;
    for (lineY3 = lineY2; lineY3 < img.dy - 1; lineY3 ++) {
        let white = 0;
        for (let i = location.x; i < location.x + location.dx; i ++) {
            if (dotBW(img, i, lineY3) == 1) white ++;
        }
        if (white > QMATCH * location.dx) { lineY3 --; break; }
    }

    if (lineY2 - lineY1 < 2) return 'X';
    if (lineY3 - lineY0 < 8) return 'X';
    if (lineY1 - lineY0 < (lineY3 - lineY0 + 1)/5) lineY1 = Math.round(lineY0 + (lineY3 - lineY0 + 1)/3);
    if (lineY3 - lineY2 < (lineY3 - lineY0 + 1)/5) lineY2 = Math.round(lineY3 - (lineY3 - lineY0 + 1)/3);

    let value = Array(location.nlines*6).fill(0), total = Array(location.nlines*6).fill(0);
    for (let j = lineY0; j <= lineY3; j ++ ) {
        let line = (j < lineY1) ? 0 : ((j > lineY2) ? 2 : 1);
        let seg = 0, color = 0, l = 0.5;
        for (let i = location.x; i < location.x + location.dx; i ++) {
            value[seg + line] += dotGrey(img, i, j);
            total[seg + line] ++;
            l ++;
            if(l >= location.width[color]) {
                l -= location.width[color]; color = 1 - color; seg += 3;
            }
        }
    }

    for (let i = 0; i < location.nlines*6 - 3; i ++)
        value[i] = (value[i] < total[i]/2) ? 1 : 0;

    let s = '';
    const codes = [ ' ', 'X', 'S', 'A', 'X', 'X', 'D', 'F' ];
    for (let i = 0; i < location.nlines*6 - 3; i += 3) {
        s += codes[value[i] + value[i + 1]*2 + value[i + 2]*4];
    }
    return s;
}
