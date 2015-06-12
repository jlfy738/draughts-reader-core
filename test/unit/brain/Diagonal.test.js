var expect = require('chai').expect;
var rewire = require('rewire');

var config = require('./../../../src/utils/conf');
var conf = config.Conf['10x10'];

var Square = rewire('./../../../src/core/Square');
var Diagonal = rewire('./../../../src/brain/Diagonal');


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
            
            var diagNums = conf['DIAGONALS_GD'][4]; // GD
            var diago = new Diagonal(true);
            
            for (var i = 0; i < diagNums.length; i++) {
                diago.addSquare(new Square(diagNums[i], Piece.EMPTY));
            }

            it('should GD [' + diagNums + '] with WP in 46 == [41] OK', function(){
                diago._getSquareByNumber(46).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(46);
                expect(liste).to.eql([41]);
                diago._getSquareByNumber(46).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] with WP in 41 == [37] OK', function(){
                diago._getSquareByNumber(41).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(41);
                expect(liste).to.eql([37]);
                diago._getSquareByNumber(41).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] with WP in 10 == [5] OK', function(){
                diago._getSquareByNumber(10).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(10);
                expect(liste).to.eql([5]);
                diago._getSquareByNumber(10).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] with WP in 5 == [] OK', function(){
                diago._getSquareByNumber(5).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(5);
                expect(liste).to.eql([]);
                diago._getSquareByNumber(5).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & BP[41] with WP in 46 == [] OK', function(){
                diago._getSquareByNumber(46).piece = Piece.PAWN_WHITE;
                diago._getSquareByNumber(41).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(46);
                expect(liste).to.eql([]);
                diago._getSquareByNumber(46).piece = Piece.EMPTY;
                diago._getSquareByNumber(41).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & BP[37] with WP in 46 == [41] OK', function(){
                diago._getSquareByNumber(46).piece = Piece.PAWN_WHITE;
                diago._getSquareByNumber(37).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(46);
                expect(liste).to.eql([41]);
                diago._getSquareByNumber(46).piece = Piece.EMPTY;
                diago._getSquareByNumber(37).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & BP[5] with WP in 14 == [10] OK', function(){
                diago._getSquareByNumber(14).piece = Piece.PAWN_WHITE;
                diago._getSquareByNumber(5).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(14);
                expect(liste).to.eql([10]);
                diago._getSquareByNumber(14).piece = Piece.EMPTY;
                diago._getSquareByNumber(5).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & BP[5] with WP in 10 == [] OK', function(){
                diago._getSquareByNumber(10).piece = Piece.PAWN_WHITE;
                diago._getSquareByNumber(5).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(10);
                expect(liste).to.eql([]);
                diago._getSquareByNumber(10).piece = Piece.EMPTY;
                diago._getSquareByNumber(5).piece = Piece.EMPTY;
            });

            //----

            it('should GD [' + diagNums + '] with BP in 46 == [] OK', function(){
                diago._getSquareByNumber(46).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(46);
                expect(liste).to.eql([]);
                diago._getSquareByNumber(46).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] with BP in 41 == [46] OK', function(){
                diago._getSquareByNumber(41).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(41);
                expect(liste).to.eql([46]);
                diago._getSquareByNumber(41).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] with BP in 10 == [14] OK', function(){
                diago._getSquareByNumber(10).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(10);
                expect(liste).to.eql([14]);
                diago._getSquareByNumber(10).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] with BP in 5 == [10] OK', function(){
                diago._getSquareByNumber(5).piece = Piece.PAWN_BLACK;
                var liste = diago.getSimpleMovements(5);
                expect(liste).to.eql([10]);
                diago._getSquareByNumber(5).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & WP[46] with BP in 37 == [41] OK', function(){
                diago._getSquareByNumber(37).piece = Piece.PAWN_BLACK;
                diago._getSquareByNumber(46).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(37);
                expect(liste).to.eql([41]);
                diago._getSquareByNumber(37).piece = Piece.EMPTY;
                diago._getSquareByNumber(46).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & WP[46] with BP in 41 == [] OK', function(){
                diago._getSquareByNumber(41).piece = Piece.PAWN_BLACK;
                diago._getSquareByNumber(46).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(41);
                expect(liste).to.eql([]);
                diago._getSquareByNumber(41).piece = Piece.EMPTY;
                diago._getSquareByNumber(46).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & WP[14] with BP in 5 == [10] OK', function(){
                diago._getSquareByNumber(5).piece = Piece.PAWN_BLACK;
                diago._getSquareByNumber(14).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(5);
                expect(liste).to.eql([10]);
                diago._getSquareByNumber(5).piece = Piece.EMPTY;
                diago._getSquareByNumber(14).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums + '] & WP[10] with BP in 5 == [] OK', function(){
                diago._getSquareByNumber(5).piece = Piece.PAWN_BLACK;
                diago._getSquareByNumber(10).piece = Piece.PAWN_WHITE;
                var liste = diago.getSimpleMovements(5);
                expect(liste).to.eql([]);
                diago._getSquareByNumber(5).piece = Piece.EMPTY;
                diago._getSquareByNumber(10).piece = Piece.EMPTY;
            });

            // -----
            diagNums8 = conf['DIAGONALS_GD'][8]; // Last (2 squares)
            var diago8 = new Diagonal(true);
            
            for (var i = 0; i < diagNums8.length; i++) {
                diago8.addSquare(new Square(diagNums8[i], Piece.EMPTY));
            }

            it('should GD [' + diagNums8 + '] with WP in 50 == [45] OK', function(){
                diago8._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                var liste = diago8.getSimpleMovements(50);
                expect(liste).to.eql([45]);
                diago8._getSquareByNumber(50).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums8 + '] with WP in 45 == [] OK', function(){
                diago8._getSquareByNumber(45).piece = Piece.PAWN_WHITE;
                var liste = diago8.getSimpleMovements(45);
                expect(liste).to.eql([]);
                diago8._getSquareByNumber(45).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums8 + '] & BP[45] with WP in 50 == [] OK', function(){
                diago8._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                diago8._getSquareByNumber(45).piece = Piece.PAWN_BLACK;
                var liste = diago8.getSimpleMovements(50);
                expect(liste).to.eql([]);
                diago8._getSquareByNumber(50).piece = Piece.EMPTY;
                diago8._getSquareByNumber(45).piece = Piece.EMPTY;
            });

            // ---

            it('should GD [' + diagNums8 + '] with BP in 45 == [50] OK', function(){
                diago8._getSquareByNumber(45).piece = Piece.PAWN_BLACK;
                var liste = diago8.getSimpleMovements(45);
                expect(liste).to.eql([50]);
                diago8._getSquareByNumber(45).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums8 + '] with BP in 50 == [] OK', function(){
                diago8._getSquareByNumber(50).piece = Piece.PAWN_BLACK;
                var liste = diago8.getSimpleMovements(50);
                expect(liste).to.eql([]);
                diago8._getSquareByNumber(50).piece = Piece.EMPTY;
            });

            it('should GD [' + diagNums8 + '] & WP[50] with BP in 45 == [] OK', function(){
                diago8._getSquareByNumber(45).piece = Piece.PAWN_BLACK;
                diago8._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                var liste = diago8.getSimpleMovements(45);
                expect(liste).to.eql([]);
                diago8._getSquareByNumber(45).piece = Piece.EMPTY;
                diago8._getSquareByNumber(50).piece = Piece.EMPTY;
            });


            // -----

            diagNums = conf['DIAGONALS_TT'][5]; // TT
            var diagoTT5 = new Diagonal(false);
            
            for (var i = 0; i < diagNums.length; i++) {
                diagoTT5.addSquare(new Square(diagNums[i], Piece.EMPTY));
            }

            it('should TT [' + diagNums + '] with WP in 50 == [44] OK', function(){
                diagoTT5._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(50);
                expect(liste).to.eql([44]);
                diagoTT5._getSquareByNumber(50).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with WP in 44 == [39] OK', function(){
                diagoTT5._getSquareByNumber(44).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(44);
                expect(liste).to.eql([39]);
                diagoTT5._getSquareByNumber(44).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with WP in 11 == [6] OK', function(){
                diagoTT5._getSquareByNumber(11).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(11);
                expect(liste).to.eql([6]);
                diagoTT5._getSquareByNumber(11).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with WP in 6 == [] OK', function(){
                diagoTT5._getSquareByNumber(6).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(6);
                expect(liste).to.eql([]);
                diagoTT5._getSquareByNumber(6).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & BP[39] with WP in 50 == [44] OK', function(){
                diagoTT5._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                diagoTT5._getSquareByNumber(39).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(50);
                expect(liste).to.eql([44]);
                diagoTT5._getSquareByNumber(50).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(39).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & BP[44] with WP in 50 == [] OK', function(){
                diagoTT5._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                diagoTT5._getSquareByNumber(44).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(50);
                expect(liste).to.eql([]);
                diagoTT5._getSquareByNumber(50).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(44).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & BP[6] with WP in 17 == [11] OK', function(){
                diagoTT5._getSquareByNumber(17).piece = Piece.PAWN_WHITE;
                diagoTT5._getSquareByNumber(6).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(17);
                expect(liste).to.eql([11]);
                diagoTT5._getSquareByNumber(17).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(6).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & BP[11] with WP in 17 == [] OK', function(){
                diagoTT5._getSquareByNumber(17).piece = Piece.PAWN_WHITE;
                diagoTT5._getSquareByNumber(11).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(17);
                expect(liste).to.eql([]);
                diagoTT5._getSquareByNumber(17).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(11).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with BP in 6 == [11] OK', function(){
                diagoTT5._getSquareByNumber(6).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(6);
                expect(liste).to.eql([11]);
                diagoTT5._getSquareByNumber(6).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with BP in 11 == [17] OK', function(){
                diagoTT5._getSquareByNumber(11).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(11);
                expect(liste).to.eql([17]);
                diagoTT5._getSquareByNumber(11).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with BP in 44 == [50] OK', function(){
                diagoTT5._getSquareByNumber(44).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(44);
                expect(liste).to.eql([50]);
                diagoTT5._getSquareByNumber(44).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with BP in 50 == [] OK', function(){
                diagoTT5._getSquareByNumber(50).piece = Piece.PAWN_BLACK;
                var liste = diagoTT5.getSimpleMovements(50);
                expect(liste).to.eql([]);
                diagoTT5._getSquareByNumber(50).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & WP[17] with BP in 6 == [11] OK', function(){
                diagoTT5._getSquareByNumber(6).piece = Piece.PAWN_BLACK;
                diagoTT5._getSquareByNumber(17).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(6);
                expect(liste).to.eql([11]);
                diagoTT5._getSquareByNumber(6).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(17).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & WP[17] with BP in 11 == [] OK', function(){
                diagoTT5._getSquareByNumber(11).piece = Piece.PAWN_BLACK;
                diagoTT5._getSquareByNumber(17).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(11);
                expect(liste).to.eql([]);
                diagoTT5._getSquareByNumber(11).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(17).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & WP[50] with BP in 39 == [44] OK', function(){
                diagoTT5._getSquareByNumber(39).piece = Piece.PAWN_BLACK;
                diagoTT5._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(39);
                expect(liste).to.eql([44]);
                diagoTT5._getSquareByNumber(39).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(50).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & WP[50] with BP in 44 == [] OK', function(){
                diagoTT5._getSquareByNumber(44).piece = Piece.PAWN_BLACK;
                diagoTT5._getSquareByNumber(50).piece = Piece.PAWN_WHITE;
                var liste = diagoTT5.getSimpleMovements(44);
                expect(liste).to.eql([]);
                diagoTT5._getSquareByNumber(44).piece = Piece.EMPTY;
                diagoTT5._getSquareByNumber(50).piece = Piece.EMPTY;
            });

            // ---

            diagNums = conf['DIAGONALS_TT'][8]; // TT (3 squares)
            var diagoTT8 = new Diagonal(false);
            
            for (var i = 0; i < diagNums.length; i++) {
                diagoTT8.addSquare(new Square(diagNums[i], Piece.EMPTY));
            }

            it('should TT [' + diagNums + '] with WP in 41 == [36] OK', function(){
                diagoTT8._getSquareByNumber(41).piece = Piece.PAWN_WHITE;
                var liste = diagoTT8.getSimpleMovements(41);
                expect(liste).to.eql([36]);
                diagoTT8._getSquareByNumber(41).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with WP in 36 == [] OK', function(){
                diagoTT8._getSquareByNumber(36).piece = Piece.PAWN_WHITE;
                var liste = diagoTT8.getSimpleMovements(36);
                expect(liste).to.eql([]);
                diagoTT8._getSquareByNumber(36).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & BP[36] with WP in 47 == [41] OK', function(){
                diagoTT8._getSquareByNumber(47).piece = Piece.PAWN_WHITE;
                diagoTT8._getSquareByNumber(36).piece = Piece.PAWN_BLACK;
                var liste = diagoTT8.getSimpleMovements(47);
                expect(liste).to.eql([41]);
                diagoTT8._getSquareByNumber(47).piece = Piece.EMPTY;
                diagoTT8._getSquareByNumber(36).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & BP[36] with WP in 41 == [] OK', function(){
                diagoTT8._getSquareByNumber(41).piece = Piece.PAWN_WHITE;
                diagoTT8._getSquareByNumber(36).piece = Piece.PAWN_BLACK;
                var liste = diagoTT8.getSimpleMovements(41);
                expect(liste).to.eql([]);
                diagoTT8._getSquareByNumber(41).piece = Piece.EMPTY;
                diagoTT8._getSquareByNumber(36).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with BP in 41 == [47] OK', function(){
                diagoTT8._getSquareByNumber(41).piece = Piece.PAWN_BLACK;
                var liste = diagoTT8.getSimpleMovements(41);
                expect(liste).to.eql([47]);
                diagoTT8._getSquareByNumber(41).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with BP in 47 == [] OK', function(){
                diagoTT8._getSquareByNumber(47).piece = Piece.PAWN_BLACK;
                var liste = diagoTT8.getSimpleMovements(47);
                expect(liste).to.eql([]);
                diagoTT8._getSquareByNumber(47).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & WP[47] with BP in 36 == [41] OK', function(){
                diagoTT8._getSquareByNumber(47).piece = Piece.PAWN_WHITE;
                diagoTT8._getSquareByNumber(36).piece = Piece.PAWN_BLACK;
                var liste = diagoTT8.getSimpleMovements(36);
                expect(liste).to.eql([41]);
                diagoTT8._getSquareByNumber(47).piece = Piece.EMPTY;
                diagoTT8._getSquareByNumber(36).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] & WP[47] with BP in 41 == [] OK', function(){
                diagoTT8._getSquareByNumber(47).piece = Piece.PAWN_WHITE;
                diagoTT8._getSquareByNumber(41).piece = Piece.PAWN_BLACK;
                var liste = diagoTT8.getSimpleMovements(41);
                expect(liste).to.eql([]);
                diagoTT8._getSquareByNumber(47).piece = Piece.EMPTY;
                diagoTT8._getSquareByNumber(41).piece = Piece.EMPTY;
            });

            // -----

            diagNums = conf['DIAGONALS_TT'][9]; // TT (1 square)
            var diagoTT9 = new Diagonal(false);
            
            for (var i = 0; i < diagNums.length; i++) {
                diagoTT9.addSquare(new Square(diagNums[i], Piece.EMPTY));
            }

            it('should TT [' + diagNums + '] with WP in 46 == [] OK', function(){
                diagoTT9._getSquareByNumber(46).piece = Piece.PAWN_WHITE;
                var liste = diagoTT9.getSimpleMovements(46);
                expect(liste).to.eql([]);
                diagoTT9._getSquareByNumber(46).piece = Piece.EMPTY;
            });

            it('should TT [' + diagNums + '] with BP in 46 == [] OK', function(){
                diagoTT9._getSquareByNumber(46).piece = Piece.PAWN_BLACK;
                var liste = diagoTT9.getSimpleMovements(46);
                expect(liste).to.eql([]);
                diagoTT9._getSquareByNumber(46).piece = Piece.EMPTY;
            });


        });

    });
    


});
