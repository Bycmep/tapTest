# tapTest
This is a simple tool I created to estimate tap test results from pdf scans.
(Seeing that we like to work remotely...)

# How to use:
1. Open taptest.html with a browser (Chrome, Edge or Firefox should work).
2. Open a pdf file by clicking "Choose File" or "Browse" button.
3. Go to the required page by clicking "Previous" or "Next" buttons.
4. Select an envelope from the drop-down list.
5. Click "Tap Left" or "Tap Right" button as needed.

# Notes:
1. The assumptions are that the scan has letter paper size (8.5" by 11", as it happens to be by default),
 and is 1 page.
2. The results are rather approximate, mainly because:
- our scanner is not perfect at aligning pages;
- envelopes are not manufactured with great accuracy
  (there ARE deviations in size, form, locations of windows).
 But they seem to be useful in general, and notable issues should be visible.
3. New envelopes can be added; I may be doing this from time to time as needed.
 The procedure is not too difficult, and involves making a scan of the envelope,
  running addenvelope.html on it and manually adding the resulting line of code to envelopes.js file.

# History:
v1. Initial attempt.
v2. Added ruler (inches) and OMR codes.
  Envelopes can have different sizes now,
   and the app calculates how many times the paper is folded.
