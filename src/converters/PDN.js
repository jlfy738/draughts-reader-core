var
    symbols = require('../core/symbols'),
    Game = require('../core/Game'),
    PDNParser = require('../../../pdn-jsparser/src/PDNParser'),
    Piece = symbols.Piece
;

function PDN(pdnText) {
    this.parser = new PDNParser();
    this.parser.setPDNText(pdnText);
};

PDN.prototype.getGameCount = function(){
    return this.parser.getGameCount();
};

PDN.prototype.getTitle = function(numGame, pattern){
    return this.parser.getTitle(numGame, pattern);
};

PDN.prototype.getTitles = function(pattern){
    return this.parser.getTitles(pattern);
};

PDN.prototype.getGame = function(numGame) {
    var game = new Game();

    var nbGame = this.getGameCount();
    if (nbGame > 0){
        var pdnObj = this.parser.parse(numGame);
                
        // ----------------------
        // Position
        // ----------------------
        if (!pdnObj.hasFEN()) {
            game.board.setInitialPosition();
        } else {
            var lst = pdnObj.getFENList("WP");
            game.board.setPosition(Piece.PAWN_WHITE, lst);
            
            lst = pdnObj.getFENList("BP");
            game.board.setPosition(Piece.PAWN_BLACK, lst);

            lst = pdnObj.getFENList("WK");
            game.board.setPosition(Piece.DAME_WHITE, lst);

            lst = pdnObj.getFENList("BK");
            game.board.setPosition(Piece.DAME_BLACK, lst);
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
};


module.exports = PDN;
