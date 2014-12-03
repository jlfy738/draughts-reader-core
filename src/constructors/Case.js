var
  Piece = require('./../utils/symbols').Piece,
  Color = require('./../utils/symbols').Color,
  Diago = require('./../utils/symbols').Diago
;

function Case(ref, piece){
  this.ref = ref;
  this.piece = piece ? piece : Piece.EMPTY;
}

Case.prototype.getRef = function() {
  return this.ref;
};
Case.prototype.setRef = function(ref) {
  this.ref = ref;
};
Case.prototype.getPiece = function() {
  return this.piece;
};
Case.prototype.setPiece = function(piece) {
  this.piece = piece;
};
Case.prototype.isPawn = function() {
  return (this.piece === Piece.PAWN_WHITE || this.piece === Piece.PAWN_BLACK);
};
Case.prototype.isDame = function() {
  return (this.piece === Piece.DAME_WHITE || this.piece === Piece.DAME_BLACK);
};
Case.prototype.isWhite = function() {
  return (this.piece === Piece.PAWN_WHITE || this.piece === Piece.DAME_WHITE);
};
Case.prototype.isBlack = function() {
  return (this.piece === Piece.PAWN_BLACK || this.piece === Piece.DAME_BLACK);
};
Case.prototype.isEmpty = function() {
  return (this.piece === Piece.EMPTY);
};
Case.prototype.getColor = function() {

  var c = Color.NONE;

  if (this.isWhite()) {
      c = Color.WHITE;
  } else if (this.isNoir()) {
      c = Color.BLACK;
  }

  return c;

};
Case.prototype.debug = function() {
  console.log("Case #" + this.ref + " (" + this.piece + ")");
};

module.exports = Case;
