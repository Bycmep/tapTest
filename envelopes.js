// format for a specification -
// array, all dimensions are in inches:
// name (to be shown in the list),
// width, height,
// then groups of 5 numbers each describing a rectangular window in the envelope:
// x position (distance from the left), y position (distance from the top), width, height, radius of the circle that creates rounded corner
// (the radius is never in the specifications; from samples I see that 1/3" works well for larger windows, 1/4" for smaller ones)
// the first window is where the recepient's address (and barcode) is meant to be
// if there is the last value that is a string, it is deemed to be a comment (it is shown under the drop-down list after the selection is made).

// format for an envelope -
// array, all dimensions are in inches:
// name (to be shown in the list),
// if the next value is a string, it is treated as a reference to a specification, and the rest of the data will be taken from there
// otherwise (non-standard envelope), the rest of the values are just like in the specification: width, height, etc.
// again, if there is the last value that is a string, it is deemed to be a comment (it is shown under the drop-down list after the selection is made).

const specifications = [
    [ "House #10", 9+1/2, 4+1/8,
        7/8, 2, 4+1/2, 1+1/2, 1/3,
        7/8, 7/16, 3+1/4, 1+1/16, 1/4 ],
    [ "Custom #10", 9+1/2, 4+1/8,
        7/8, 2, 4+1/2, 1+1/2, 1/3 ],
    [ "House #9", 8+7/8, 3+7/8,
        4+3/8, 1+1/2, 4, 1, 1/3 ],
    [ "House 6x9", 9+1/2, 6,
        7/8, 2+3/8, 4+1/2, 1+1/2, 1/3,
        7/8, 13/16, 3+1/4, 1+1/16, 1/4 ],
    [ "Custom 6x9", 9+1/2, 6,
        7/8, 2+3/8, 4+1/2, 1+1/2, 1/3 ],
    [ "House 9x12", 9, 12,
        1/2, 3/4, 4+1/4, 3+1/4, 1/3 ],
    [ "Custom 9x12", 9, 12,
        1/2, 2+1/2, 4+1/4, 1+1/2, 1/3 ],
];

const envelopes = [
    [ "4401", "House #10", "Permit. No markings." ],
    [ "4402", "House #10" ],
    [ "4403", "House #9" ],
    [ "4404", "House #10", "Tax envelope, permit." ],
    [ "4406", "House 9x12", "No permit." ],
    [ "4408", "House 6x9" ],
    [ "4411", "House 9x12", "TX version of 4406." ],
    [ "4412", "House 6x9" ],
    [ "4413", 9+1/2, 4+1/8,
        3/4, 2, 4+1/2, 1+1/2, 1/3,
        3/8, 5/16, 5+1/2, 1+3/8, 1/3, "INFO, non-standard." ],
    [ "4414", "House 9x12", "Permit." ],
    [ "4415", "House #10", "Tax envelope, non-permit." ],
    [ "4416", 9, 11+1/2,
        3+3/4, 13/16+2+1/4, 4+1/2, 1+3/4, 1/3,
        3+3/4, 13/16, 3+1/4, 4, 1/3,
        9/16, 15/16, 2, 3/4, 1/4, "INFO, non-standard." ],
    [ "5186", 8+3/4, 11+5/16,
        5/8, 2+1/4, 4+1/2, 1, 1/3, "FRST, non-standard." ],
    [ "5188*", 9+1/2, 4+1/8,
        9/16, 2, 4+1/2, 1+1/2, 1/4, "GCBK, permit, return service requested.<br/>On the last client reorder, their vendor used the wrong specifications. This should be corrected on the next reorder." ],
    [ "5205", 9+1/2, 4+1/8,
        7/8, 1/2, 4+1/4, 2, 1/3, "FCBT, non-standard, TX. Permit." ],
    [ "5207", 9+1/2, 4+1/8,
        7/8, 2+7/16, 4+1/2, 1+1/8, 1/3, "FRST, non-standard." ],
    [ "5208", 9+1/2, 4+1/8,
        7/8, 1/2, 4+1/4, 2, 1/3, "FCBT, non-standard, TX." ],
    [ "5248", "House #10", "SNCU non-permit" ],
    [ "5295", 9+1/2, 4+1/8,
        7/8, 2+1/2, 4+1/2, 1+1/8, 1/3, "CAIG, non-standard." ],
    [ "5296", 9+1/2, 6,
        1+1/8, 2+1/4, 3+3/8, 1+1/4, 1/3, "CAIG, non-standard." ],
    [ "5297", 8+9/16, 3+5/8,
        1+1/2, 1+5/8, 4, 1, 1/3, "CAIG, non-standard." ],
    [ "5301", 9, 12,
        1, 2+7/8, 3+1/8, 1+3/8, 1/3, "CAIG, non-standard." ],
    [ "5302", 9+1/2, 11+5/8,
        1+1/8, 2+1/2, 3, 1+1/4, 1/3, "CAIG, non-standard." ],
    [ "5303", 9, 12,
        7/8, 2+5/16, 3, 1+1/4, 1/3, "CAIG, non-standard." ],
    [ "5309", 9+1/2, 12+1/2,
        1, 1+1/16, 3+3/4, 3, 1/3, "UFC, non-standard, TX. Permit." ],
    [ "5624", "Custom #10", "RWCU, permit." ],
    [ "5652", 9+1/2, 4+1/8,
        5/8, 2+1/4, 4+1/2, 1+1/4, 1/3, "RWCU, non-standard." ],
    [ "5665", 9+1/2, 4+1/8,
        3/4, 2+3/8, 4+1/4, 1+1/4, 1/3, "TFCU, non-standard." ],
    [ "5701", "House #10", "SNCU permit" ],
    [ "6084", 8+7/8, 3+7/8,
        4+7/16, 2+1/8, 4, 1+1/8, 1/3, "UCCU, non-standard." ],
];
