var
  Piece = require('./../utils/symbols').Piece,
  Color = require('./../utils/symbols').Color,
  Diago = require('./../utils/symbols').Diago
;

function Square(ref, piece){
  this.ref = ref;
  this.piece = piece ? piece : Piece.EMPTY;
}

Square.prototype.getRef = function() {
  return this.ref;
};
Square.prototype.setRef = function(ref) {
  this.ref = ref;
};
Square.prototype.getPiece = function() {
  return this.piece;
};
Square.prototype.setPiece = function(piece) {
  this.piece = piece;
};
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
  } else if (this.isNoir()) {
      c = Color.BLACK;
  }

  return c;

};
Square.prototype.debug = function() {
  console.log("Square #" + this.ref + " (" + this.piece + ")");
};

module.exports = Square;
