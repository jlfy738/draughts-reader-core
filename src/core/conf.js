var conf = {
    '10x10':{},
    '8x8'  :{},
    '12x12':{}
};

// The greatest square number
conf['10x10']['SQ_MAX_NUM'] = 50;
conf['8x8']['SQ_MAX_NUM']   = 32;
conf['12x12']['SQ_MAX_NUM'] = 72;

// Number of active square per line
conf['10x10']['SQ_ACTIVE_PER_LINE'] = 5;
conf['8x8']['SQ_ACTIVE_PER_LINE']   = 4;
conf['12x12']['SQ_ACTIVE_PER_LINE'] = 6;

// Black initial position
conf['10x10']['B_POSITION'] = [1, 20];
conf['8x8']['B_POSITION']   = [1, 12];
conf['12x12']['B_POSITION'] = [1, 30];

// White initial position
conf['10x10']['W_POSITION'] = [31, 50];
conf['8x8']['W_POSITION']   = [21, 32];
conf['12x12']['W_POSITION'] = [43, 72];

// White pieces are crowned on this interval
conf['10x10']['W_CROWNED'] = [1, 5];
conf['8x8']['W_CROWNED']   = [1, 4];
conf['12x12']['W_CROWNED'] = [1, 12];

// Black pieces are crowned on this interval
conf['10x10']['W_CROWNED'] = [46, 50];
conf['8x8']['W_CROWNED']   = [29, 32];
conf['12x12']['W_CROWNED'] = [61, 72]


/** Liste des diagonales parallèles à la Grande Diagonale. */
conf['10x10']['DIAGONALS_GD'] = [
    [ 6, 1 ], 
    [ 16, 11, 7, 2 ], 
    [ 26, 21, 17, 12, 8, 3 ], 
    [ 36, 31, 27, 22, 18, 13, 9, 4 ], 
    [ 46, 41, 37, 32, 28, 23, 19, 14, 10, 5 ],
    [ 47, 42, 38, 33, 29, 24, 20, 15 ], 
    [ 48, 43, 39, 34, 30, 25 ], 
    [ 49, 44, 40, 35 ], 
    [ 50, 45 ] 
];

/** Liste des diagonales parallèles au Tric Trac. */
conf['10x10']['DIAGONALS_TT'] = [ 
    [ 5 ], 
    [ 15, 10, 4 ], 
    [ 25, 20, 14, 9, 3 ], 
    [ 35, 30, 24, 19, 13, 8, 2 ], 
    [ 45, 40, 34, 29, 23, 18, 12, 7, 1 ], 
    [ 50, 44, 39, 33, 28, 22, 17, 11, 6 ],
    [ 49, 43, 38, 32, 27, 21, 16 ], 
    [ 48, 42, 37, 31, 26 ], 
    [ 47, 41, 36 ], 
    [ 46 ] 
];


exports.Conf = conf;

