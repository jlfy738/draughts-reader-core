var expect = require('chai').expect;
var rewire = require('rewire');

var config = require('./../../../src/utils/conf');
var conf = config.Conf['10x10'];

var Square = rewire('./../../../src/core/Square');
var Diagonal = rewire('./../../../src/brain/Diagonal');


var testPawnSimpleMovement = function(whiteToPlay, msgPrefix, diago, wp, bp, startNum, result){
    var msg = msgPrefix;
    if (whiteToPlay && bp) {
        msg += ' & BP[' + bp + ']';
    } else if (!whiteToPlay && wp) {
        msg += ' & WP[' + wp + ']';
    }

    if (whiteToPlay){
        msg += ' with WP in ' + wp;
    } else {
        msg += ' with BP in ' + bp;
    }
    msg += ' == [' + result + '] OK';

    it(msg, function(){
        if (wp) { diago._getSquareByNumber(wp).piece = Piece.PAWN_WHITE; }
        if (bp) { diago._getSquareByNumber(bp).piece = Piece.PAWN_BLACK; }
        
        var liste = diago.getSimpleMovements(startNum);
        expect(liste).to.eql(result);
        
        // R.A.Z
        if (wp) { diago._getSquareByNumber(wp).piece = Piece.EMPTY; }
        if (bp) { diago._getSquareByNumber(bp).piece = Piece.EMPTY; }
    });
}


describe('constructor', function () {

    
    it('should be a function', function(){
        expect(Diagonal).to.be.a('function');
    });

    describe('instance', function(){

        var diagoGD;
        var diagoTT;

        beforeEach(function(){
            diagoGD = new Diagonal(true);
            diagoTT = new Diagonal(false);
        });

        it('should return an object', function(){
            expect(diagoGD).to.be.an('object');
            expect(diagoTT).to.be.an('object');
        });


        it("should have the squares property initialized to []", function() {
            var diago = new Diagonal(true);
            expect(diago).to.have.property('squares');
            expect(diago.squares).to.be.an('array').to.have.length(0);
        });

        describe("#addSquare", function() {
            var sq = new Square(1, Piece.PAWN_WHITE);
            var diago = new Diagonal(true);
            diago.addSquare(sq);

            it('should squares property length change', function(){
                expect(diago.squares).to.have.length(1);
            });
            
            it('should squares property have square which has just been added', function(){
                expect(diago.squares[0]).to.equal(sq);
            });
        });


        describe("#getSimpleMovements", function() {
            
            var diagNumsGD4 = conf['DIAGONALS_GD'][4]; // GD
            var diagoGD4 = new Diagonal(true);
            var msgPrefix = 'should GD [' + diagNumsGD4 + ']';
            
            for (var i = 0; i < diagNumsGD4.length; i++) {
                diagoGD4.addSquare(new Square(diagNumsGD4[i], Piece.EMPTY));
            }

            testPawnSimpleMovement(true, msgPrefix, diagoGD4, 46, null, 46, [41]);
            testPawnSimpleMovement(true, msgPrefix, diagoGD4, 41, null, 41, [37]);
            testPawnSimpleMovement(true, msgPrefix, diagoGD4, 10, null, 10, [5]);
            testPawnSimpleMovement(true, msgPrefix, diagoGD4,  5, null,  5, []);
            // ---
            testPawnSimpleMovement(true, msgPrefix, diagoGD4,  46, 41, 46, []);
            testPawnSimpleMovement(true, msgPrefix, diagoGD4,  46, 37, 46, [41]);
            testPawnSimpleMovement(true, msgPrefix, diagoGD4,  14,  5, 14, [10]);
            testPawnSimpleMovement(true, msgPrefix, diagoGD4,  10,  5, 10, []);
            // ---
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, null, 46, 46, []);
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, null, 41, 41, [46]);
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, null, 10, 10, [14]);
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, null,  5,  5, [10]);
            // ---
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, 46, 37, 37, [41]);
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, 46, 41, 41, []);
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, 14,  5,  5, [10]);
            testPawnSimpleMovement(false, msgPrefix, diagoGD4, 10,  5,  5, []);


            // -----
            var diagNumsGD8 = conf['DIAGONALS_GD'][8]; // Last (2 squares)
            var diagoGD8 = new Diagonal(true);
            msgPrefix = 'should GD [' + diagNumsGD8 + ']';
            
            for (var i = 0; i < diagNumsGD8.length; i++) {
                diagoGD8.addSquare(new Square(diagNumsGD8[i], Piece.EMPTY));
            }

            testPawnSimpleMovement(true, msgPrefix, diagoGD8, 50, null, 50, [45]);
            testPawnSimpleMovement(true, msgPrefix, diagoGD8, 45, null, 45, []);
            testPawnSimpleMovement(true, msgPrefix, diagoGD8, 50,   45, 50, []);
            // ---
            testPawnSimpleMovement(false, msgPrefix, diagoGD8, null, 45, 45, [50]);
            testPawnSimpleMovement(false, msgPrefix, diagoGD8, null, 50, 50, []);
            testPawnSimpleMovement(false, msgPrefix, diagoGD8,   50, 45, 45, []);


            // -----
            var diagNumsTT5 = conf['DIAGONALS_TT'][5]; // TT
            var diagoTT5 = new Diagonal(false);
            msgPrefix = 'should TT [' + diagNumsTT5 + ']';
            
            for (var i = 0; i < diagNumsTT5.length; i++) {
                diagoTT5.addSquare(new Square(diagNumsTT5[i], Piece.EMPTY));
            }

            testPawnSimpleMovement(true, msgPrefix, diagoTT5, 50, null, 50, [44]);
            testPawnSimpleMovement(true, msgPrefix, diagoTT5, 44, null, 44, [39]);
            testPawnSimpleMovement(true, msgPrefix, diagoTT5, 11, null, 11, [6]);
            testPawnSimpleMovement(true, msgPrefix, diagoTT5,  6, null,  6, []);
            // ---
            testPawnSimpleMovement(true, msgPrefix, diagoTT5, 50, 39, 50, [44]);
            testPawnSimpleMovement(true, msgPrefix, diagoTT5, 50, 44, 50, []);
            testPawnSimpleMovement(true, msgPrefix, diagoTT5, 17,  6, 17, [11]);
            testPawnSimpleMovement(true, msgPrefix, diagoTT5, 17, 11, 17, []);
            // ---
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, null,  6,  6, [11]);
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, null, 11, 11, [17]);
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, null, 44, 44, [50]);
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, null, 50, 50, []);
            // ---
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, 17,  6,  6, [11]);
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, 17, 11, 11, []);
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, 50, 39, 39, [44]);
            testPawnSimpleMovement(false, msgPrefix, diagoTT5, 50, 44, 44, []);


            // -----
            var diagNumsTT8 = conf['DIAGONALS_TT'][8]; // TT (3 squares)
            var diagoTT8 = new Diagonal(false);
            msgPrefix = 'should TT [' + diagNumsTT8 + ']';
            
            for (var i = 0; i < diagNumsTT8.length; i++) {
                diagoTT8.addSquare(new Square(diagNumsTT8[i], Piece.EMPTY));
            }

            testPawnSimpleMovement(true, msgPrefix, diagoTT8, 41, null, 41, [36]);
            testPawnSimpleMovement(true, msgPrefix, diagoTT8, 36, null, 36, []);
            // ---
            testPawnSimpleMovement(true, msgPrefix, diagoTT8, 47, 36, 47, [41]);
            testPawnSimpleMovement(true, msgPrefix, diagoTT8, 41, 36, 41, []);
            // ---
            testPawnSimpleMovement(false, msgPrefix, diagoTT8, null, 41, 41, [47]);
            testPawnSimpleMovement(false, msgPrefix, diagoTT8, null, 47, 47, []);
            // ---
            testPawnSimpleMovement(false, msgPrefix, diagoTT8, 47, 36, 36, [41]);
            testPawnSimpleMovement(false, msgPrefix, diagoTT8, 47, 41, 41, []);

            
            // -----
            var diagNumsTT9 = conf['DIAGONALS_TT'][9]; // TT (1 square)
            var diagoTT9 = new Diagonal(false);
            msgPrefix = 'should TT [' + diagNumsTT9 + ']';
            
            for (var i = 0; i < diagNumsTT9.length; i++) {
                diagoTT9.addSquare(new Square(diagNumsTT9[i], Piece.EMPTY));
            }

            testPawnSimpleMovement(true, msgPrefix, diagoTT9, 46, null, 46, []);
            testPawnSimpleMovement(false, msgPrefix, diagoTT9, null, 46, 46, []);

        });

    });
    


});
