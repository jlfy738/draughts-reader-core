var
    symbols = require('../core/symbols'),
    Game = require('../core/Game'),
    PDNParser = require('../../../pdn-jsparser/src/PDNParser'),
    Piece = symbols.Piece
;

function PDN() {
}

PDN.getGame = function(texte) {

    // We need a PDN Parser
    var pdnParser = new PDNParser();
    pdnParser.setPDNText(texte);
    
    // pdnParser.debugCutGames();
    // pdnParser.parse(1);

    var game = new Game();

    var nbGame = pdnParser.getGameCount();
    if (nbGame > 0){
        var pdnObj = pdnParser.parse(1); // pending future dev...
        pdnObj.debugOfficialTags();

        
        // ----------------------
        // Position
        // ----------------------
        if (!pdnObj.hasFEN()) {
            game.board.setPosition20x20();
        } else {
            // FIXME : on doit pouvoir eviter la boucle en utilisant setPosition
            
            var lst = pdnObj.getFENList("WP");
            for (var k = 0; k < lst.length; k++) {
                game.board.setPiece(lst[k], Piece.PAWN_WHITE);
            }
            
            lst = pdnObj.getFENList("BP");
            for (var k = 0; k < lst.length; k++) {
                game.board.setPiece(lst[k], Piece.PAWN_BLACK);
            }

            lst = pdnObj.getFENList("WK");
            for (var k = 0; k < lst.length; k++) {
                game.board.setPiece(lst[k], Piece.DAME_WHITE);
            }

            lst = pdnObj.getFENList("BK");
            for (var k = 0; k < lst.length; k++) {
                game.board.setPiece(lst[k], Piece.DAME_BLACK);
            }
        } 


        // ----------------------
        // Notation
        // ----------------------
        var moves = pdnObj.getMoves();
        for (var k = 0; k < moves.length; k++){
            var move = moves[k];
            var move1 = move["move1"];
            var move2 = move["move2"];

            if (move1 != "") {
                game.addMoveTxt(move1);
            }

            if (move2 != "") {
                game.addMoveTxt(move2);
            }
        }
    }

    return game;
}


module.exports = PDN;
