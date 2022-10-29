This is a simple tool I created to estimate tap test results from pdf scans.
(Seeing that we like to work remotely...)

How to use:
1.  Open taptest.html with a browser (Chrome, Edge or Firefox should work).
2.  Open a pdf file by clicking "Open PDF" button.
3.  Go to the required page by clicking "Previous" or "Next" buttons.
4.  Select an envelope from the "Envelope #" drop-down list,
    or the specification it is made by from the "Specifications" drop-down list.
5.  Click "Tap Left" or "Tap Right" button as needed.
6.  Check "Ruler" check-box to show rulers; drag movable rulers by handles to measure distances,
    so that you learn the amount to shift a problematic element by.
    By default rulers snap to 1/16"-step grid; for finer measuring, uncheck "Snap to fractions" check-box.
7.  Check "OMR codes" check-box to show descriptions for OMR codes on the left edge of the page.
8.  Check "Address window tolerance" check-box to see the limits for the barcode position set by the USPS.
9.  If needed, increase or decrease the supposed number of pages in the envelope using +/- buttons by "Pages" field
    and see the result.
10. Use +/- buttons by "Zoom" field to zoom in/out the page.
    The correct number in the "Screen resolution" field will show the document at its actual size at 100%,
    and it has to be figured out experimentally (not really useful for anything else - but you only need to set it once).
11. Check "Detachable bottom part" check-box to do tap test on a detachable coupon that is printed at the bottom of the page.

Notes:
1.  The results are rather approximate, mainly because:
    - our scanner is not perfect at aligning pages;
    - envelopes are not manufactured with great accuracy
      (there ARE deviations in size, form, locations of windows).
    But they seem to be useful in general, and notable issues should be visible.
2.  New envelopes can be added. They are stored in envelopes.js file.
    Read the instructions in the comments there. You'll need the dimensions of the envelope and its windows.
    The format has some rules. Ask me if you get confused.

Changelog:
v4. - The envelopes are based on specifications.
      One can select either the envelope by number, or the specification it uses.
      There are also non-standard envelopes in the list, and they have dimensions of their own.
    - Envelopes used for return of detachable materials have a special attribute and are tapped differently.
    - One can zoom the working area in and out. One can also match the document dimensions on screen at 100%
      with those of the hard copy by specifying the correct screen resolution (but it's not really necessary).
    - The tool can simulate the position of the document if it has more than one page. Again, it's approximate.
    - Rulers are affixed to the envelope for convenience.
v3. - The ruler is improved and measuring can snap to 1/16th of inches.
    - Added tolerance ruler for the barcode inside the address window (it should be some distance from the edge).
    - Envelope data format is changed to be based on inches, so parameters of
      an envelope can be manually adjusted in the envelope.js file (if they are known);
      description / comments can be added.
    - Theoretically, paper can be any size now (just the orientation must
      match that of the envelope).
    - Updated to work with the latest pdf.js library and included it with the tool.
v2. - Added ruler (inches) and OMR codes.
    - Envelopes can have different sizes now,
      and the app calculates how many times the paper is folded.
v1. - Initial attempt.

Enjoy!
Alex