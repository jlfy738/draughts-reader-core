var assert = require('node:assert/strict');
var rewire = require('rewire');
var { describe, it, beforeEach } = require('node:test');

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
        assert.strictEqual(typeof PathFinder, 'function');
    });

    describe('instance', function(){

        var pf;

        beforeEach(function(){
            pf = new PathFinder();
        });

        it('should return an object', function(){
            assert.strictEqual(typeof pf, 'object');
        });

        
        describe('_getDiagonalGD() method', function(){
            var pf = new PathFinder();
            var board = new DraughtBoard();
            
            it('should return true if it exists a DiagonalGD for each square #1 to #50', function(){
                for (var num = 1; num <= 50; num++) {
                    var len = pf._getDiagonalGD(board, num).squares.length;
                    assert.ok(len >= 2 && len <= 10);
                }
            });
        });

        describe('_getDiagonalTT() method', function(){
            var pf = new PathFinder();
            var board = new DraughtBoard();

            it('should return true if it exists a DiagonalTT for each square #1 to #50', function(){
                for (var num = 1; num <= 50; num++) {
                    var len = pf._getDiagonalTT(board, num).squares.length;
                    assert.ok(len >= 1 && len <= 9);
                }
            });
        });

    });

});
