var
    symbols = require('./utils/symbols'),
    Game = require('./core/Game'),
    Piece = symbols.Piece
;



function testGame() {
    var game = new Game();
    // ---
    game.board.setPosition(Piece.PAWN_WHITE, [33, 38, 39, 43, 44]);
    game.board.setPosition(Piece.PAWN_BLACK, [12, 13, 14, 22, 24]);
    game.board.setPosition(Piece.DAME_WHITE, []);
    game.board.setPosition(Piece.DAME_BLACK, []);
    // ---
    game.addMove(33, 29);
    game.addMove(24, 42, [33]);
    game.addMove(43, 38);
    game.addMoveTxt("42x33");
    game.addMoveTxt("39x10");
    // ---

    console.log("--------------------------------------");
    console.log("Game");
    console.log("--------------------------------------");
    game.debugFull();
    console.log("");
    console.log("");
}



testGame();
