var
    symbols = require('../src/utils/symbols'),
    Game = require('../src/core/Game'),
    Piece = symbols.Piece
;



function testGame() {
    var game = new Game();
    var board = game.board;
    // ---
    board.setPosition(Piece.PAWN_WHITE, [33, 38, 39, 43, 44]);
    board.setPosition(Piece.PAWN_BLACK, [12, 13, 14, 22, 24]);
    board.setPosition(Piece.DAME_WHITE, []);
    board.setPosition(Piece.DAME_BLACK, []);
    // ---
    game.addMove(33, 29);
    game.addMove(24, 42, [33]);
    game.addMove(43, 38);
    game.addMoveTxt("42x33");
    game.addMoveTxt("39x10");
    // ---


    // Set initial position
    game.start();

    // Reading some squares
    var p1 = board.getPiece(1);
    var p33 = board.getPiece(33);
    console.log(p1 == Piece.EMPTY); // true
    console.log(p33 == Piece.PAWN_WHITE); // true


    // Iterate all squares
    console.log("--------------------------------------");
    for (var k = 1; k <= board.conf['SQ_MAX_NUM']; k++) {
        var p = board.getPiece(k);
        switch (p) {
        case Piece.PAWN_WHITE:
            console.log("Square " + k + " : PAWN_WHITE");
            break;
        case Piece.PAWN_BLACK:
            console.log("Square " + k + " : PAWN_BLACK");
            break;
        case Piece.DAME_WHITE:
            console.log("Square " + k + " : DAME_WHITE");
            break;
        case Piece.DAME_BLACK:
            console.log("Square " + k + " : DAME_BLACK");
            break;
        default:
            // Empty square
        }
    }

    // What's append on next move ?
    var m = game.getNextMove();
    console.log("--------------------------------------");
    console.log(m);

    // We apply it.
    game.next();

    // What's append on next move ?
    m = game.getNextMove();
    console.log("--------------------------------------");
    console.log(m);

    
    // Reading game
    console.log("--------------------------------------");
    game.start();
    while (game.hasNext()){
        var m = game.getNextMove();
        console.log(m.getNotation());
        
        game.next();
    }


    // ---
    console.log("--------------------------------------");
    console.log("Game");
    console.log("--------------------------------------");
    game.debugFull();
    console.log("");
    console.log("");
}



testGame();
