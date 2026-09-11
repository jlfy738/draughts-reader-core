var assert = require('node:assert/strict');
var rewire = require('rewire');
var { describe, it, beforeEach } = require('node:test');

var DraughtBoard = rewire('./../../../src/core/DraughtBoard');

describe('The DraughtBoard constructor', function () {

    var PieceMock;

    beforeEach(function(){
        PieceMock = {};

        PieceMock.EMPTY = 0;
        PieceMock.PAWN_WHITE = 1;
        PieceMock.PAWN_BLACK = 2;
        PieceMock.DAME_WHITE = 3;
        PieceMock.DAME_BLACK = 4;

        DraughtBoard.__set__('Piece', PieceMock);
    });

    it('should be a function', function(){
        assert.strictEqual(typeof DraughtBoard, 'function');
    });

    describe('instance', function(){

        var board;

        beforeEach(function(){
            board = new DraughtBoard();
        });

        it('should return an object', function(){
            assert.strictEqual(typeof board, 'object');
        });

        it('should have the given \'squares\' array property', function(){
            assert.ok(Array.isArray(board.squares));
        });

        it('should have 50 \'squares\'', function(){
            assert.strictEqual(board.squares.length, 50);
        });

        
        describe('setInitialPosition() method', function(){
            var board = new DraughtBoard();
            board.setInitialPosition();

            it('should return true if \'piece\' on squares #1 to #20 are set to PAWN_BLACK symbol', function(){
                for (var num = 1; num <= 20; num++) {
                    assert.strictEqual(board.getPiece(num), PieceMock.PAWN_BLACK);
                }
            });


            it('should return true if \'piece\' on squares #21 to #30 are set to EMPTY symbol', function(){
                for (var num = 21; num <= 30; num++) {
                    assert.strictEqual(board.getPiece(num), PieceMock.EMPTY);
                }
            });


            it('should return true if \'piece\' on squares #31 to #50 are set to PAWN_WHITE symbol', function(){
                for (var num = 31; num <= 50; num++) {
                    assert.strictEqual(board.getPiece(num), PieceMock.PAWN_WHITE);
                }
            });

        });

        describe('isPiece() method', function(){
            var board = new DraughtBoard();
            
            PieceMock = {};
            PieceMock.PAWN_WHITE = 1;
            PieceMock.PAWN_BLACK = 2;
            
            board.setPiece(3, PieceMock.PAWN_WHITE)
            
            it('should return true if there is PAWN_WHITE on #3', function(){
                assert.strictEqual(board.isPiece(3, PieceMock.PAWN_WHITE), true);
            });

            it('should return false if there is PAWN_BLACK on #3', function(){
                assert.strictEqual(board.isPiece(3, PieceMock.PAWN_BLACK), false);
            });
        });

    });

});
