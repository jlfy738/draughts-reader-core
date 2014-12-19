var
    symbols = require('./core/symbols'),
    Game = require('./core/Game'),
    DamWeb = require('./converters/DamWeb'),
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

function testDamWeb() {
    var game = DamWeb.getGame("WMWP1627283233343537384045BP0712141819212324252629", "343025343731263732412143353024443322233222171221162914194137071237321218454019234034");
    
    console.log("--------------------------------------");
    console.log("DamWeb");
    console.log("--------------------------------------");
    game.debugFull();
    console.log("");
    console.log("");

    console.log(game.getNotation());
}



testGame();
testDamWeb();

