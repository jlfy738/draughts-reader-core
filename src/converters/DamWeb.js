var
    symbols = require('../core/symbols'),
    Game = require('../core/Game'),
    Piece = symbols.Piece
;

function DamWeb() {
}

DamWeb.getGame = function(position, notation){
    var game = new Game();

    // ----------------------
    // Position
    // ----------------------
    if (!position) {
        game.setPosition20x20();
    } else {
        var wp = this._getPositionWP(position);
        var wk = this._getPositionWK(position);
        var bp = this._getPositionBP(position);
        var bk = this._getPositionBK(position);

        var tabWP = this._getNumPosition(wp);
        var tabWK = this._getNumPosition(wk);
        var tabBP = this._getNumPosition(bp);
        var tabBK = this._getNumPosition(bk);

        game.setPosition(Piece.PAWN_WHITE, tabWP);
        game.setPosition(Piece.DAME_WHITE, tabWK);
        game.setPosition(Piece.PAWN_BLACK, tabBP);
        game.setPosition(Piece.DAME_BLACK, tabBK);
    }

    // ----------------------
    // Notation
    // ----------------------
    if (notation) {
        var l = notation.length;
        var nb = l / 4;

        for (var i = 0; i < nb; i++) {
            var sMove = notation.substring(4 * i, 4 * i + 4);
            var iStart = parseInt(sMove.substring(0, 2), 10) || null;
            var iEnd = parseInt(sMove.substring(2), 10) || null;

            if (iStart != null && iEnd != null) {
                game.addMove(iStart, iEnd);
            } else {
                break;
            }
        }
    }

    return game;
};

DamWeb._getNumPosition = function(s) {
    var list = [];

    if (s) {
        var l = s.length;
        var nb = l / 2;

        for (var i = 0; i < nb; i++) {
            var sNum = s.substring(2 * i, 2 * i + 2);
            var num = parseInt(sNum, 10) || null;
            if (num != null) {
                list.push(num);
            }
        }
    }

    return list;
};

DamWeb._getPositionWP = function(position) {
    var pattern = /[BW]M.*?WP(.*?)(?:WK|BP|BK|$).*/;
    return this._extractSubString(position, pattern);
};

DamWeb._getPositionBP = function(position) {
    var pattern = /[BW]M.*?BP(.*?)(?:WP|WK|BK|$).*/;
    return this._extractSubString(position, pattern);
};

DamWeb._getPositionWK = function(position) {
    var pattern = /[BW]M.*?WK(.*?)(?:WP|BP|BK|$).*/;
    return this._extractSubString(position, pattern);
};

DamWeb._getPositionBK = function(position) {
    var pattern = /[BW]M.*?BK(.*?)(?:WP|BP|WK|$).*/;
    return this._extractSubString(position, pattern);
};

DamWeb._extractSubString = function(position, pattern) {
    var s = "";

    var m = position.match(pattern);
    if (m && m.length > 1) {
        s = m[1];
    }
    return s;
};

module.exports = DamWeb;
