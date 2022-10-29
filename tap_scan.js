function scanBarcode() {
//    let x = Math.round((edata[3] + 1/16)*DPI - parseFloat(ePageMv.style.left)), y = Math.round((edata[4] + 1/16)*DPI - parseFloat(ePageMv.style.top));
//    let dx = Math.round((edata[5] - 1/8)*DPI), dy = Math.round((edata[6] - 1/8)*DPI);

    let x = 1*DPI - parseInt(ePageMv.style.left), y = Math.round(3.21*DPI) - parseInt(ePageMv.style.top), dx = 3.2*DPI, dy = 0.04*DPI;
    let raster = ctx.getImageData(x, y, dx, dy);
    let pixels = raster.data;

    let img = Array(dx*dy);
    let p = 0;
    for (let i = 0, p = 0; i < dx*dy; i ++, p += 4)
        img[i] = Math.floor(pixels[p]*77 + pixels[p + 1]*151 + pixels[p + 2]*28) >> 15;

    let line = Array(dy).fill(0), hline = Array(dx*dy);
    for (let i = 0; i < dx; i ++) {   // hline = length of black horizontal line that ends in that point; if not ends - 0
        p = i;
        for (let j = 0; j < dy; j ++) {
            if (img[p] == 0) {
                line[j] ++;
                hline[p] = line[j];
                if (j > 0 && hline[p - 1] > 0) hline[p - 1] = 0;
            }
            else {
                line[j] = 0;
                hline[p] = 0;
            }
            p += dx;
        }
    }


    console.log(dx, dy);
    let str = '';
    
    for (p = 0; p < dx*dy; p++) str += img[p] + ', ';
    console.log(str);

    // find patterns of black and white alternating
    let seqNum = 0, seqLen = 0, seqX = 0, seqMaxNum = 0, seqMaxLen, seqMaxX, seqMaxY, prevX, black, white;
    p = 0;
    for (let j = 0; j < dy; j ++) {
        seqLen = -1; seqSum = 0; seqNum = 0; prevX = -1;
        for (let i = 0; i < dx; i ++) {
            black = hline[p];
            if (black > 0) {
                if (prevX > 0) {
                    white = i - prevX - black;
                    if (white < seqLen*1.25 && white > seqLen*0.75) {
                        seqNum++; seqSum += white;
                        seqLen = seqSum/seqNum;
                    } else {
                        if (seqNum > seqMaxNum) {
                            seqMaxNum = seqNum; seqMaxLen = seqLen; seqMaxX = i - white - seqSum; seqMaxY = j;
//                            console.log('>>>>>>>', seqMaxNum, seqMaxLen, seqMaxX, seqMaxY);
                        }
                        seqLen = white; seqSum = white; seqNum = 1;
                    }
                }
                prevX = i;

                if (black > 2 && black < seqLen*1.25 && black > seqLen*0.75) {
                    seqNum++; seqSum += black;
                    seqLen = seqSum/seqNum;
                } else {
                    if (seqNum > seqMaxNum) {
                        seqMaxNum = seqNum; seqMaxLen = seqLen; seqMaxX = i - black - seqSum; seqMaxY = j;
//                        console.log('>>>>>>>>', seqMaxNum, seqMaxLen, seqMaxX, seqMaxY);
                    }
                    seqLen = black; seqSum = black; seqNum = 1;
                }

//                console.log(i, j, white, black, seqLen, seqNum);

            }
            p ++;
        }
    }






    /*
    p = 0;
    for (let i = b1; i < b2; i ++) {
        for (let j = 0; j < dx; j ++) {
            if (hline[p] == mostFreqNum || hline[p] == mostFreqNum - 1 || hline[p] == mostFreqNum + 1) {
                xmap[i] ++;
            }
            p++;
        }
    }
    sumx = 0;
    for (let i = 0; i < dx; i++) sumx += xmap[i];
    suma = 0, a1 = 0, a2 = dx, share = sumx/100;
    for (let i = 0; i < dx; i++) {
        suma += xmap[i];
        if (suma > share) break;
        a1 = i + 1;
    }
    suma = 0;
    for (let i = dx - 1; i > 0; i--) {
        suma += xmap[i];
        if (suma > share) break;
        a2 = i;
    }
*/
//    console.log (xmap);
//    console.log (ymap);
/*    console.log(x, y, dx, dy);
    console.log(x + a1, y + b1, a2 - a1, b2 - b1);
    let s = "<path stroke='green' fill='none' d='M" + (x+PADDING) + " " + (y+PADDING) + " h" + dx + " v" + dy + " h-" + dx + " v-" + dy +
    " M" + (x+a1+PADDING) + " " + (y+b1+PADDING) + " h" + (a2-a1) + " v" + (b2-b1) + " h-" + (a2-a1) + " v-" + (b2-b1) + "'/>";
    console.log(s);
    document.getElementById("test").innerHTML = s;
*/


/*




    p = 0;
    for (let i = 0; i < dy; i ++) {
        let o = [];
        for (let j = 0; j < dx; j ++) o[j] = hline[p ++];
        console.log(o);
    } 

    p = 0;
    for (let i = 0; i < dy; i ++) {
        let o = '';
        for (let j = 0; j < dx; j ++) {
            if (img[p] == 0) o += '#';
            else if (img[p] == 1) o += ' ';
            else o += '&';
            p++;
        }
        console.log(o);
    } 


    let num = Array(dx + 1).fill(0);  // find the most common length of black horizontal segment, supposing it's bar width
    p = 0;
    for (let i = 0; i < dy; i ++) {
        for (let j = 0; j < dx; j ++) {
            if (hline[p] > 0) num[hline[p]] ++;
            p++;
        }
    } 
    let mostFreqNum = 0, freq = 0;
    for (let i = 1; i < dx; i++) {
        if (num[i] > freq) {
            mostFreqNum = i; freq = num[i];
        }
    }
    if (mostFreqNum == 0) return;

    console.log(mostFreqNum - 1, num[mostFreqNum - 1]);
    console.log(mostFreqNum, num[mostFreqNum]);
    console.log(mostFreqNum + 1, num[mostFreqNum + 1]);

    let xmap = Array(dx).fill(0), ymap = Array(dy).fill(0);
    let a1 = 0, a2 = dx, b1 = 0, b2 = dy, sumx, sumy = 0, suma, sumb, share;
    
    p = 0;
    for (let i = 0; i < dy; i ++) {
        for (let j = 0; j < dx; j ++) {
            if (hline[p] == mostFreqNum || hline[p] == mostFreqNum - 1 || hline[p] == mostFreqNum + 1) {
                ymap[i] ++;
            }
            p++;
        }
    }

    for (let i = 0; i < dy; i ++) {
        if (ymap[i] > 0) {
            console.log(y + i, ymap[i]);
        }
    }


    for (let i = 0; i < dy; i++) sumy += ymap[i];
    sumb = 0; share = sumy/100;
    for (let i = 0; i < dy; i++) {
        sumb += ymap[i];
        if (sumb > share) break;
        b1 = i + 1;
    }
    sumb = 0;
    for (let i = dy - 1; i > 0; i--) {
        sumb += ymap[i];
        if (sumb > share) break;
        b2 = i;
    }




*/


}





function Test() {
      const area = ctx.getImageData(466, 1183, 200, 69); // 1390
      console.log(area);
      console.log(area.data);
      const pixels = area.data;
      let bw = [], p = 0;
      for (let y = 0; y < area.height; y++) {
        let row = [];
        let str = "";
        for (let x = 0; x < area.width; x++) {
          row[x] = Math.round((pixels[p]*30 + pixels[p + 1]*59 + pixels[p + 2]*11)/25500); p += 4;
          str += (row[x] > 0) ? ' ' : '#';
        }
        bw[y] = row;
        console.log(str);
      }
    }

    /*    
    let vline = Array(dx*dy), line1 = Array(dx).fill(0);
    p = 0;
    for (let j = 0; j < dy; j ++) {
        for (let i = 0; i < dx; i ++) {
            if (img[p] == 0) {
                line1[i] ++;
                vline[p] = line1[i];
            }
            else {
                vline[p] = 0; line1[i] = 0;
            }
            p ++;
        }
    }

    let line2 = Array(dy);
    p = 0;
    for (let j = 0; j < dy; j ++) {
        line2[j] = vline[p]; p += dx;
    }

    for (let i = 1; i < dx; i ++) {
        p = i;
        for (let j = 0; j < dy; j ++) {
            if (vline[p] > 0) {
                line2[j] += vline[p];
                vline[p] = line2[j];
            }
            else {
                line2[j] = 0;
            }
            p += dx;
        }
    }



    

*/
/*    
    //console.log(img);
    let pattern = [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1 ], patterxW = 14, patternH = 14;
    let match = Array(dx*dy);

    p = 0;
    for (let i = 0; i < dy; i ++) {
        for (let j = 0; j < dx - patternW; j ++) {
            let m = 0;
            for (let k = 0; k < patterxW; k++) {
                if (img[p + j + k] == pattern[k]) m++;
            }
            match[p + j] = m;
        }
        p += dx;
    }
    console.log(match);



    let vline = Array(dx*dy), line1 = Array(dx).fill(0);
    p = 0;
    for (let j = 0; j < dy; j ++) {
        for (let i = 0; i < dx; i ++) {
            if (img[p] == 0) {
                line1[i] ++;
                vline[p] = line1[i];
            }
            else {
                vline[p] = 0; line1[i] = 0;
            }
            p ++;
        }
    }

    let patmax = 0, patline = 0, patstep = 0;
    const allow = 0.2, lineDetect = 13;
    p = 0;
    for (let j = 0; j < dy; j ++) {
        let white = true, n = 0, ngap = 0, v;
        for (let i = 0; i < dx; i ++) {
            v = vline[p ++];
            if (v == 0) {
                if (white) {
                    white = false;
                    if (m )
                }
            }

        }
        



    }


    */

