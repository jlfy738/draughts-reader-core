var Game = require('./core/Game');


console.log("--------------------------------------");
console.log("Game");
console.log("--------------------------------------");

function testGame() {
    var game = new Game();
    // ---
    game.setPosition(Piece.PAWN_WHITE, [33, 38, 39, 43, 44]);
    game.setPosition(Piece.PAWN_BLACK, [12, 13, 14, 22, 24]);
    game.setPosition(Piece.DAME_WHITE, []);
    game.setPosition(Piece.DAME_BLACK, []);
    // ---
    game.addMove(33, 29);
    game.addMove(24, 42, [33]);
    game.addMove(43, 38);
    game.addMoveTxt("42x33");
    game.addMoveTxt("39x10");
    // ---

    game.debugFull();
}


testGame();