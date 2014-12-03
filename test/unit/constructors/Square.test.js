var expect = require('chai').expect;
var rewire = require('rewire');

var Square = rewire('./../../../src/constructors/Square');

describe('The Square constructor', function () {

  var PieceMock, ColorMock, DiagoMock;

  beforeEach(function(){

    PieceMock = {};
    ColorMock = {};
    DiagoMock = {};

    Square.__set__('Piece', PieceMock);
    Square.__set__('Color', ColorMock);
    Square.__set__('Diago', DiagoMock);

  });

  it('should be a function', function(){
    expect(Square).to.be.a('function');
  });

  describe('instance', function(){

    var square;

    beforeEach(function(){
      square = new Square(7, 0);
    });

    it('should return an object', function(){
      expect(square).to.be.an('object');
    });

    it('should have the given \'ref\' property', function(){
      expect(square).to.have.property('ref', 7);
    });

    it('should have the given \'piece\' property', function(){
      expect(new Square(0, 45)).to.have.property('piece', 45);
    });

    it('should have a default \'piece\' property', function(){
      PieceMock.EMPTY = 90;
      expect(new Square(7, undefined)).to.have.property('piece', 90);
    });

    describe('isPawn() method', function(){

      it('should return true if \'piece\' is set to PAWN_WHITE symbol', function(){
        PieceMock.PAWN_WHITE = 49;
        expect( (new Square(0, 49)).isPawn() ).to.be.true;
        expect( (new Square(0, 50)).isPawn() ).to.be.false;
      });

      it('should return true if \'piece\' is set to PAWN_BLACK symbol', function(){
        PieceMock.PAWN_BLACK = 76;
        expect( (new Square(0, 76)).isPawn() ).to.be.true;
        expect( (new Square(0, 77)).isPawn() ).to.be.false;
      });

    });

    describe('isDame() method', function(){

      it('should return true if \'piece\' is set to DAME_WHITE symbol', function(){
        PieceMock.DAME_WHITE = 49;
        expect( (new Square(0, 49)).isDame() ).to.be.true;
        expect( (new Square(0, 50)).isDame() ).to.be.false;
      });

      it('should return true if \'piece\' is set to DAME_BLACK symbol', function(){
        PieceMock.DAME_BLACK = 76;
        expect( (new Square(0, 76)).isDame() ).to.be.true;
        expect( (new Square(0, 77)).isDame() ).to.be.false;
      });

    });

    describe('isWhite() method', function(){

      var
        MATCHING_SYMBOL = 49,
        MISSING__SYMBOL = 50
      ;

      it('should return true if \'piece\' is set to DAME_WHITE symbol', function(){
        PieceMock.DAME_WHITE = MATCHING_SYMBOL;
        expect( (new Square(0, MATCHING_SYMBOL)).isWhite() ).to.be.true;
        expect( (new Square(0, MISSING__SYMBOL)).isWhite() ).to.be.false;
      });

      it('should return true if \'piece\' is set to PAWN_WHITE symbol', function(){
        PieceMock.PAWN_WHITE = MATCHING_SYMBOL;
        expect( (new Square(0, MATCHING_SYMBOL)).isWhite() ).to.be.true;
        expect( (new Square(0, MISSING__SYMBOL)).isWhite() ).to.be.false;
      });

    });

    describe('isBlack() method', function(){

      var
        MATCHING_SYMBOL = 101,
        MISSING__SYMBOL = 100
      ;

      it('should return true if \'piece\' is set to DAME_BLACK symbol', function(){
        PieceMock.DAME_BLACK = MATCHING_SYMBOL;
        expect( (new Square(0, MATCHING_SYMBOL)).isBlack() ).to.be.true;
        expect( (new Square(0, MISSING__SYMBOL)).isBlack() ).to.be.false;
      });

      it('should return true if \'piece\' is set to PAWN_BLACK symbol', function(){
        PieceMock.PAWN_BLACK = MATCHING_SYMBOL;
        expect( (new Square(0, MATCHING_SYMBOL)).isBlack() ).to.be.true;
        expect( (new Square(0, MISSING__SYMBOL)).isBlack() ).to.be.false;
      });

    });

    describe('isEmpty() method', function(){

      it('should return true if \'piece\' is set to EMPTY symbol', function(){
        PieceMock.EMPTY = 49;
        expect( (new Square(0, 49)).isEmpty() ).to.be.true;
        expect( (new Square(0, 50)).isEmpty() ).to.be.false;
      });

    });

    describe('getColor() method', function(){

      var
        MATCHING_SYMBOL = 1001,
        MISSING__SYMBOL = 1000
      ;

      it('should return WHITE color symbol if Square#isWhite() returns true and Square#isBlack() returns false', function(){
        ColorMock.WHITE = MATCHING_SYMBOL;
        square = new Square(0);
        square.isWhite = function(){ return true; };
        square.isBlack = function(){ return false; };
        expect(square.getColor()).to.equal(MATCHING_SYMBOL);
      });

      it('should return BLACK color symbol if Square#isBlack() returns true and Square#isWhite() returns false', function(){
        ColorMock.BLACK = MATCHING_SYMBOL;
        square = new Square(0);
        square.isBlack = function(){ return true; };
        square.isWhite = function(){ return false; };
        expect(square.getColor()).to.equal(MATCHING_SYMBOL);
      });

      it('should return NONE color symbol if Square#isBlack() and Square#isWhite() both return false', function(){
        ColorMock.NONE = MATCHING_SYMBOL;
        square = new Square(0);
        square.isBlack = function(){ return false; };
        square.isWhite = function(){ return false; };
        expect(square.getColor()).to.equal(MATCHING_SYMBOL);
      });

    });

    describe('getColor() method', function(){
      it('should exist', function(){
        expect(new Square(0)).to.have.property('debug').that.is.a('function');
      });
    });

  });

});