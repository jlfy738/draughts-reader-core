var
    symbols = require('./symbols'),
    Piece = symbols.Piece,
    Color = symbols.Color
;


function Square(number, piece) {
    this.number = number;
    this.piece = piece ? piece : Piece.EMPTY;
}

Square.prototype.isPawn = function() {
    return (this.piece === Piece.PAWN_WHITE || this.piece === Piece.PAWN_BLACK);
};
Square.prototype.isDame = function() {
    return (this.piece === Piece.DAME_WHITE || this.piece === Piece.DAME_BLACK);
};
Square.prototype.isWhite = function() {
    return (this.piece === Piece.PAWN_WHITE || this.piece === Piece.DAME_WHITE);
};
Square.prototype.isBlack = function() {
    return (this.piece === Piece.PAWN_BLACK || this.piece === Piece.DAME_BLACK);
};
Square.prototype.isEmpty = function() {
    return (this.piece === Piece.EMPTY);
};

Square.prototype.getColor = function() {
    var c = Color.NONE;

    if (this.isWhite()) {
        c = Color.WHITE;
    } else if (this.isBlack()) {
        c = Color.BLACK;
    }
    return c;
};

Square.prototype.debug = function() {
    console.log("Square #" + this.number + " (" + this.piece + ")");
};

module.exports = Square;
