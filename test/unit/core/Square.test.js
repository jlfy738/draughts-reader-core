var assert = require('node:assert/strict');
var rewire = require('rewire');
var { describe, it, beforeEach } = require('node:test');

var Square = rewire('./../../../src/core/Square');

describe('The Square constructor', function () {

  var PieceMock, ColorMock;

  beforeEach(function(){

    PieceMock = {};
    ColorMock = {};

    Square.__set__('Piece', PieceMock);
    Square.__set__('Color', ColorMock);
  });

  it('should be a function', function(){
    assert.strictEqual(typeof Square, 'function');
  });

  describe('instance', function(){

    var square;

    beforeEach(function(){
      square = new Square(7, 0);
    });

    it('should return an object', function(){
      assert.strictEqual(typeof square, 'object');
    });

    it('should have the given \'number\' property', function(){
      assert.strictEqual(square.number, 7);
    });

    it('should have the given \'piece\' property', function(){
      assert.strictEqual(new Square(7, 45).piece, 45);
    });

    it('should have a default \'piece\' property', function(){
      PieceMock.EMPTY = 90;
      assert.strictEqual(new Square(7, undefined).piece, 90);
    });

    describe('isPawn() method', function(){

      it('should return true if \'piece\' is set to PAWN_WHITE symbol', function(){
        PieceMock.PAWN_WHITE = 49;
        assert.strictEqual((new Square(7, 49)).isPawn(), true);
        assert.strictEqual((new Square(7, 50)).isPawn(), false);
      });

      it('should return true if \'piece\' is set to PAWN_BLACK symbol', function(){
        PieceMock.PAWN_BLACK = 76;
        assert.strictEqual((new Square(7, 76)).isPawn(), true);
        assert.strictEqual((new Square(7, 77)).isPawn(), false);
      });

    });

    describe('isDame() method', function(){

      it('should return true if \'piece\' is set to DAME_WHITE symbol', function(){
        PieceMock.DAME_WHITE = 49;
        assert.strictEqual((new Square(7, 49)).isDame(), true);
        assert.strictEqual((new Square(7, 50)).isDame(), false);
      });

      it('should return true if \'piece\' is set to DAME_BLACK symbol', function(){
        PieceMock.DAME_BLACK = 76;
        assert.strictEqual((new Square(7, 76)).isDame(), true);
        assert.strictEqual((new Square(7, 77)).isDame(), false);
      });

    });

    describe('isWhite() method', function(){

      var
        MATCHING_SYMBOL = 49,
        MISSING__SYMBOL = 50
      ;

      it('should return true if \'piece\' is set to DAME_WHITE symbol', function(){
        PieceMock.DAME_WHITE = MATCHING_SYMBOL;
        assert.strictEqual((new Square(7, MATCHING_SYMBOL)).isWhite(), true);
        assert.strictEqual((new Square(7, MISSING__SYMBOL)).isWhite(), false);
      });

      it('should return true if \'piece\' is set to PAWN_WHITE symbol', function(){
        PieceMock.PAWN_WHITE = MATCHING_SYMBOL;
        assert.strictEqual((new Square(7, MATCHING_SYMBOL)).isWhite(), true);
        assert.strictEqual((new Square(7, MISSING__SYMBOL)).isWhite(), false);
      });

    });

    describe('isBlack() method', function(){

      var
        MATCHING_SYMBOL = 101,
        MISSING__SYMBOL = 100
      ;

      it('should return true if \'piece\' is set to DAME_BLACK symbol', function(){
        PieceMock.DAME_BLACK = MATCHING_SYMBOL;
        assert.strictEqual((new Square(7, MATCHING_SYMBOL)).isBlack(), true);
        assert.strictEqual((new Square(7, MISSING__SYMBOL)).isBlack(), false);
      });

      it('should return true if \'piece\' is set to PAWN_BLACK symbol', function(){
        PieceMock.PAWN_BLACK = MATCHING_SYMBOL;
        assert.strictEqual((new Square(7, MATCHING_SYMBOL)).isBlack(), true);
        assert.strictEqual((new Square(7, MISSING__SYMBOL)).isBlack(), false);
      });

    });

    describe('isEmpty() method', function(){

      it('should return true if \'piece\' is set to EMPTY symbol', function(){
        PieceMock.EMPTY = 49;
        assert.strictEqual((new Square(7, 49)).isEmpty(), true);
        assert.strictEqual((new Square(7, 50)).isEmpty(), false);
      });

    });

    describe('getColor() method', function(){

      var
        MATCHING_SYMBOL = 1001,
        MISSING__SYMBOL = 1000
      ;

      it('should return WHITE color symbol if Square#isWhite() returns true and Square#isBlack() returns false', function(){
        ColorMock.WHITE = MATCHING_SYMBOL;
        square = new Square(1);
        square.isWhite = function(){ return true; };
        square.isBlack = function(){ return false; };
        assert.strictEqual(square.getColor(), MATCHING_SYMBOL);
      });

      it('should return BLACK color symbol if Square#isBlack() returns true and Square#isWhite() returns false', function(){
        ColorMock.BLACK = MATCHING_SYMBOL;
        square = new Square(1);
        square.isBlack = function(){ return true; };
        square.isWhite = function(){ return false; };
        assert.strictEqual(square.getColor(), MATCHING_SYMBOL);
      });

      it('should return NONE color symbol if Square#isBlack() and Square#isWhite() both return false', function(){
        ColorMock.NONE = MATCHING_SYMBOL;
        square = new Square(1);
        square.isBlack = function(){ return false; };
        square.isWhite = function(){ return false; };
        assert.strictEqual(square.getColor(), MATCHING_SYMBOL);
      });

    });

    describe('debug() method', function(){
      it('should exist', function(){
        assert.strictEqual(typeof (new Square(1)).debug, 'function');
      });
    });

  });

});
