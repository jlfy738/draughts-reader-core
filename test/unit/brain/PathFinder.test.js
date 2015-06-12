var expect = require('chai').expect;
var rewire = require('rewire');

var PathFinder = rewire('./../../../src/brain/PathFinder');
var DraughtBoard = rewire('./../../../src/core/DraughtBoard');

describe('The PathFinder constructor', function () {

    var PieceMock;

    beforeEach(function(){
        PieceMock = {};

        PieceMock.EMPTY = 0;
        PieceMock.PAWN_WHITE = 1;
        PieceMock.PAWN_BLACK = 2;
        PieceMock.DAME_WHITE = 3;
        PieceMock.DAME_BLACK = 4;

        PathFinder.__set__('Piece', PieceMock);
    });

    it('should be a function', function(){
        expect(PathFinder).to.be.a('function');
    });

    describe('instance', function(){

        var pf;

        beforeEach(function(){
            pf = new PathFinder();
        });

        it('should return an object', function(){
            expect(pf).to.be.an('object');
        });

        
        describe('_getDiagonalGD() method', function(){
            var pf = new PathFinder();
            var board = new DraughtBoard();
            
            it('should return true if it exists a DiagonalGD for each square #1 to #50', function(){
                for (var num = 1; num <= 50; num++) {
                    expect(pf._getDiagonalGD(board, num).squares).to.have.length.within(2, 10);;
                }
            });
        });

        describe('_getDiagonalTT() method', function(){
            var pf = new PathFinder();
            var board = new DraughtBoard();

            it('should return true if it exists a DiagonalTT for each square #1 to #50', function(){
                for (var num = 1; num <= 50; num++) {
                    expect(pf._getDiagonalTT(board, num).squares).to.have.length.within(1, 9);;
                }
            });
        });

    });

});
