const inset = 0.04; // gap between paper and envelope, inches
// format for an envelope:
// array, parameters are in inches,
// name (to be shown in the list), width, height,
// address window: left position, top position, width, height, radius for rounded corner,
// return address window: left position, top position, width, height, radius for rounded corner,  (-1 if no window)
// description/comment
const envelopes = [
    [ "4401", 9.5, 4.125,
        0.875, 2, 4.5, 1.5, 0.33,
        0.875, 0.4375, 3.25, 1.0625, 0.25,
        "Generic 2-window envelope" ],
    [ "4402", 9.5825, 4.1875,
        0.8875, 2.0425, 4.52, 1.5, 0.2525,
        0.8875, 0.475, 3.2625, 1.0625, 0.25,
        "The sample I tried to measure looks crooked" ],
    [ "4403", 8.9375, 3.8875,
        4.4275, 1.5625, 4, 1, 0.2525,
        -1, -1, -1, -1, -1,
        "" ],
    [ "4404", 9.5062, 4.1862,
        0.8925, 2.1075, 4.5, 1.5, 0.2525,
        0.8925, 0.5275, 3.25, 1.0625, 0.25,
        "Tax document envelope, permit. The sample was very crooked." ],
    [ "4408", 9.5625, 6,
        0.9375, 2.25, 4.5, 1.5, 0.2525,
        0.9375, 0.6875, 3.25, 1.0625, 0.25,
        "" ],
    [ "4412", 9.53, 6.05,
        0.89, 2.25, 4.5, 1.5, 0.2525,
        0.89, 0.6875, 3.25, 1.0625, 0.25,
        "" ],
    [ "4415", 9.5, 4.125, 0.8975,
        2, 4.5, 1.5, 0.2525, 0.8975, 0.4375,
        3.25, 1.0625, 0.25,
        "Tax document, non-permit, type 10 envelope." ],
    [ "5624", 9.535, 4.135,
        0.905, 1.9825, 4.5125, 1.5, 0.2375,
        -1, -1, -1, -1, -1,
        "RWCU, permit, type 10 envelope." ]
];
