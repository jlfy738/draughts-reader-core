var
    conf = require('../utils/conf'),
    symbols = require('../utils/symbols'),
    Square =  require('./Square'),
    Piece = symbols.Piece,
    Conf = conf.Conf
;

function DraughtBoard(boardSize) {
    this.conf = null;
    if (boardSize == 8){
        this.conf = Conf['8x8']; // Bresilien
    } else if (boardSize == 12){
        this.conf = Conf['12x12']; // Canadien
    } else {
        this.conf = Conf['10x10']; // Default is International 10x10
    }


    /** Active Squares */
    this.squares = []; // [Square]

    
    /** Initialize active squares */
    for (var k = 1; k <= this.conf['SQ_MAX_NUM']; k++) {
        var c = new Square(k);
        this.squares.push(c);
    }
}




/** Initial position */
DraughtBoard.prototype.setInitialPosition = function() {
    for (var num = this.conf['B_POSITION'][0]; num <= this.conf['B_POSITION'][1]; num++) {
        this.setPiece(num, Piece.PAWN_BLACK);
    }

    for (var num = this.conf['W_POSITION'][0]; num <= this.conf['W_POSITION'][1]; num++) {
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
    var c = this.getSquare(number);
    c.piece = piece;
};

/** Retourne une case. */
DraughtBoard.prototype.getSquare = function(number) {
    return this.squares[number - 1];
};

/** Retourne une case. */
DraughtBoard.prototype.getSquares = function() {
    return this.squares;
};

/** Connaitre la pièce se trouvant sur une case. */
DraughtBoard.prototype.isPiece = function(number, piece) {
    return (this.getPiece(number) === piece);
};

/** Retourne la pièce. */
DraughtBoard.prototype.getPiece = function(number) {
    return this.getSquare(number).piece;
};

DraughtBoard.prototype.getColor = function(number) {
    return this.getSquare(number).getColor();
};


/** Applique le mouvement sur le damier. */
DraughtBoard.prototype.applyMove = function(move) {
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
DraughtBoard.prototype.applyMoveRev = function(move) {
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
            var p = this.getSquare(num).piece;

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
