var
    symbols = require('./symbols'),
    Square =  require('./Square'),
    Diagonal =  require('./Diagonal'),
    Piece = symbols.Piece,
    Diago = symbols.Diago
;

function DraughtBoard() {

    /** Les 50 cases noires du damier. */
    this.squares = []; // [Square]

    /** Liste des diagonales parallèles à la Grande Diagonale. */
    this.diagonalsGD = [
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

    /** Liste des diagonale parallèle au Tric Trac. */
    this.diagonalsTT = [ 
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

    /** Initialisation des 50 cases noires. */
    for (var k = 1; k <= 50; k++) {
        var c = new Square(k);
        this.squares.push(c);
    }
}




/** Position initiale : 20 x 20 */
DraughtBoard.prototype.setPosition20x20 = function() {
    for (var num = 1; num <= 20; num++) {
        this.setPiece(num, Piece.PAWN_BLACK);
    }

    for (var num = 31; num <= 50; num++) {
        this.setPiece(num, Piece.PAWN_WHITE);
    }
};

/** Pose des pièces sur le damier */
DraughtBoard.prototype.setPosition = function(piece, numbers) {
    for (var k = 0; k < numbers.length; k++) {
        this.setPiece(numbers[k], piece);
    }
};

/** Ajouter une pièce sur une case. */
DraughtBoard.prototype.setPiece = function(number, piece) {
    var c = this.getCase(number);
    c.piece = piece;
};

/** Retourne une case. */
DraughtBoard.prototype.getCase = function(number) {
    return this.squares[number - 1];
};

/** Connaitre la pièce se trouvant sur une case. */
DraughtBoard.prototype.isPiece = function(number, piece) {
    return (this.getPiece(number) === piece);
};

/** Retourne la pièce. */
DraughtBoard.prototype.getPiece = function(number) {
    return this.getCase(number).piece;
};

/** Retourne la diagonaleGD contenant une case donnée. */
DraughtBoard.prototype.getDiagonalGD = function(number) {
    var diag = [];
    loop: 
    for (var i = 0; i < this.diagonalsGD.length; i++) {
        var diagonal = this.diagonalsGD[i];
        for (var j = 0; j < diagonal.length; j++) {
            if (diagonal[j] === number) {
                diag = diagonal;
                break loop;
            }
        }
    }

    var diago = new Diagonal(Diago.GD);
    for (var i = 0; i < diag.length; i++) {
        var c = this.getCase(diag[i]);
        diago.addCase(c);
    }

    return diago;
};

/** Retourne la diagonaleTT contenant une case donnée. */
DraughtBoard.prototype.getDiagonalTT = function(number) {
    var diag = [];
    loop: 
    for (var i = 0; i < this.diagonalsTT.length; i++) {
        var diagonal = this.diagonalsTT[i];
        for (var j = 0; j < diagonal.length; j++) {
            if (diagonal[j] === number) {
                diag = diagonal;
                break loop;
            }
        }
    }

    var diago = new Diagonal(Diago.TT);
    for (var i = 0; i < diag.length; i++) {
        var c = this.getCase(diag[i]);
        diago.addCase(c);
    }

    return diago;
};

DraughtBoard.prototype.cloneDraughtBoard = function() {
    var d = new DraughtBoard();

    for (var k = 0; k < this.squares.length; k++) {
        var c = this.squares[k];
        d.setPiece(c.number, c.piece);
    }

    return d;
};

/** Applique le mouvement sur le damier. */
DraughtBoard.prototype.play = function(move) {
    var piecePlayed = this.getPiece(move.startingSquareNum);

    // Retirer la pièce de la case de départ
    this.setPiece(move.startingSquareNum, Piece.EMPTY);

    // Retirer les pièces des cases prises
    for (var i = 0; i < move.capturedSquares.length; i++) {
        var c = move.capturedSquares[i];
        this.setPiece(c.number, Piece.EMPTY);
    }

    // Poser la pièce sur la case d'arrivée
    if (!move.isCrowned) {
        this.setPiece(move.endingSquareNum, piecePlayed);
    }
    // Ce mouvement promeu en Dame
    else {
        if (piecePlayed == Piece.PAWN_WHITE) {
            this.setPiece(move.endingSquareNum, Piece.DAME_WHITE);
        } else if (piecePlayed == Piece.PAWN_BLACK) {
            this.setPiece(move.endingSquareNum, Piece.DAME_BLACK);
        }
    }
};

/** Annule le mouvement sur le damier. */
DraughtBoard.prototype.playInv = function(move) {
    var piecePlayed = this.getPiece(move.endingSquareNum);

    // Retirer la pièce de la case d'arrivée
    this.setPiece(move.endingSquareNum, Piece.EMPTY);

    // Remettre les pièces qui avaient été prises.
    for (var i = 0; i < move.capturedSquares.length; i++) {
        var c = move.capturedSquares[i];
        this.setPiece(c.number, c.piece);
    }

    // Remettre la pièce sur la case de départ
    if (!move.isCrowned) {
        this.setPiece(move.startingSquareNum, piecePlayed);
    }

    // La dame redevient pion
    else {
        if (piecePlayed == Piece.DAME_WHITE) {
            this.setPiece(move.startingSquareNum, Piece.PAWN_WHITE);
        } else if (piecePlayed == Piece.DAME_BLACK) {
            this.setPiece(move.startingSquareNum, Piece.PAWN_BLACK);
        }
    }
};

DraughtBoard.prototype.debugDraughtBoard = function() {
    var row = "";

    console.log("================================");
    for (var k = 0; k < 10; k++) {
        row += "|";
        for (var l = 1; l <= 5; l++) {

            var num = 5 * k + l;
            var p = this.getCase(num).piece;

            if (k == 0 || k == 2 || k == 4 || k == 6 || k == 8) {
                row += "   ";
            }

            switch (p) {
            case Piece.PAWN_WHITE:
                row += " o ";
                break;
            case Piece.PAWN_BLACK:
                row += " x ";
                break;
            case Piece.DAME_WHITE:
                row += " O ";
                break;
            case Piece.DAME_BLACK:
                row += " X ";
                break;
            default:
                row += " . ";
            }

            if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9) {
                row += "   ";
            }
        }
        row += "|";

        console.log(row);
        row = "";
    }
    console.log("================================");
};

module.exports = DraughtBoard;