(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./../utils/symbols":3}],2:[function(require,module,exports){
var Case = require('./constructors/Case');

(new Case(0)).debug();
},{"./constructors/Case":1}],3:[function(require,module,exports){
exports.Piece = {
  EMPTY : 0,
  PAWN_WHITE : 1,
  PAWN_BLACK : 2,
  DAME_WHITE: 3,
  DAME_BLACK : 4
};

exports.Color = {
  NONE : 0,
  WHITE : 1,
  BLACK : 2
};

exports.Diago = {
  DG : 0,
  TT : 1
};
},{}]},{},[2]);
