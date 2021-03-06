var
    symbols = require('../utils/symbols'),
    DraughtBoard = require('./DraughtBoard'),
    Arbiter = require('../brain/Arbiter'),
    Color = symbols.Color
;

function Game(boardSize) {
    this.board = new DraughtBoard(boardSize);
    this.moves = []; // [Move]
    this.index = -1;
}

Game.prototype.hasMove = function() {
    return (this.moves.length > 0);
};

/**
 * Définition des mouvements
 *
 * @param startNum
 *            Numéro de la case de départ (REQUIS)
 * @param endNum
 *            Numéro de la case d'arrivée (REQUIS)
 * @param middleSquaresNum
 *            Liste des cases intermédiaires (Facultatif)
 */
Game.prototype.addMove = function(startNum, endNum, middleSquaresNum) {
    middleSquaresNum = middleSquaresNum ? middleSquaresNum : null;

    if (!this._hasError()) {

        // Positionner le damier
        this.end();

        // Remember previous color played.
        var iLast = this._getLastIndex();
        var previousColorPlayed = null;
        if (iLast > -1){
            previousColorPlayed = this.moves[iLast].color;
        }

        var m = Arbiter.getMove(this.board, startNum, endNum, middleSquaresNum, previousColorPlayed);

        this.moves.push(m);
    } else {
        console.log("addMove(" + startNum + ", " + endNum + ") : ERROR");
    }
    return this;
};



/**
 * Exemples : <br />
 * Prise : 24x22 ou 24x33x22 ou 24x13x...x22 <br />
 * Déplacement : 24-29
 * */
Game.prototype.addMoveTxt = function(move) {
    if (move != null) {

        move = move.toLowerCase();
        move = move.replace(" ", "");

        var sep = "";
        if (move.indexOf("-") > -1) {
            sep = "-";
        } else if (move.indexOf("x") > -1) {
            sep = "x";
        }

        if (sep != "") {
            var list = move.split(sep);
            var nb = list.length;
            if (nb > 1) {
                var error = false;
                var iStart = parseInt(list[0], 10);
                var iEnd = parseInt(list[nb - 1], 10);
                var iInters = [];

                if (iStart === null || iEnd === null) {
                    error = true;
                } else {
                    if (nb > 2) {
                        for (var i = 1; i <= nb - 2; i++) {
                            var inter = parseInt(list[i], 10);
                            if (inter != null) {
                                iInters.push(inter);
                            } else {
                                error = true;
                            }
                        }
                    }
                }
                if (!error) {
                    this.addMove(iStart, iEnd, iInters);
                } else {
                    console.log("addMove: ERREUR (4)");
                }

            } else {
                console.log("addMove: ERREUR (3)");
            }
        } else {
            console.log("addMove: ERREUR (2)");
        }

    } else {
        console.log("addMove: ERREUR (1)");
    }
    return this;
};

Game.prototype._getStatusNextIndex = function() {
    var status = true;
    if (this.index < this._getLastIndex()) {
        var m = this.moves[this.index + 1];
        status = m.status;
    }
    return status;
};

Game.prototype._getStatusPrevIndex = function() {
    var status = true;
    if (this.index > 0) {
        var m = this.moves[this.index - 1];
        status = m.status;
    }
    return status;
};

Game.prototype.hasNext = function() {
    return this._getStatusNextIndex() && this.index < this._getLastIndex();
};

Game.prototype.hasPrev = function() {
    return this._getStatusPrevIndex() && this.index > -1;
};

Game.prototype.getCurrentMove = function() {
    var m = null;
    if (this.index > -1){
        m = this.moves[this.index];
    }
    return m;
};

Game.prototype.getNextMove = function() {
    var m = null;
    if (this.hasNext()) {
        m = this.moves[this.index + 1];
    }
    return m;
};

Game.prototype.getPrevMove = function() {
    var m = null;
    if (this.hasPrev()) {
        m = this.moves[this.index - 1];
    }
    return m;
};

Game.prototype.next = function() {
    var isOk = true;
    if (isOk = this.hasNext()) {
        this.index++;
        var m = this.moves[this.index];
        if (m.status) {
            this.board.applyMove(m);
        } else {
            this.index--;
        }
    }
    return isOk;
};

Game.prototype.prev = function() {
    var isOk = true;
    if (isOk = this.hasPrev()) {
        var m = this.moves[this.index];
        if (m.status) {
            this.board.applyMoveRev(m);
            this.index--;
        }
    }
    return isOk;
}

Game.prototype.start = function() {
    this._setIndex(-1);
    return this;
};

Game.prototype.end = function() {
    this._setIndex(this._getLastIndex());
    return this;
};

/** Position initiale = 0 ; Premier coup = 1. */
Game.prototype.setCursor = function(position) {
    this._setIndex(position - 1);
    return this;
};

/** Position initiale = -1 ; premier coup = 0 */
Game.prototype._setIndex = function(idx) {
    idx = this._constrainIndex(idx);

    var isOk = true;
    if (this.index < idx) {
        while (isOk && (this.index < idx)) {
            isOk = this.next();
        }
    } else if (this.index > idx) {
        while (isOk && (this.index > idx)) {
            isOk = this.prev();
        }
    }
    return this;
};

Game.prototype._getLastIndex = function() {
    return this.moves.length - 1;
};

Game.prototype._constrainIndex = function(idx) {
    if (idx < 0) {
        idx = -1;
    } else if (idx > this._getLastIndex()) {
        idx = this._getLastIndex();
    }

    return idx;
};

Game.prototype._hasError = function() {
    var err = false;
    for (var k = 0; k < this.moves.length; k++) {
        var m = this.moves[k];
        if (!m.status) {
            err = true;
            break;
        }
    }
    return err;
};


// [{'number':1,
//   'white':{'move':'32x26', 'current':false},
//   'black':{'move':'32x26', 'current':false}}]
Game.prototype.getNotation = function(){
    var list = [];

    if (this.moves.length > 0){

        // is first move a black move ?
        var m = this.moves[0];
        var notation = m.getNotation();
        var shift = 0;
        if (m.color == Color.BLACK){
            var mapb = {};
            mapb['position'] = 1;
            mapb['move'] = notation;
            mapb['current'] = (0 == this.index);

            var map = {};
            map['black'] = mapb;
            map['number'] = 1;
            list.push(map);
            shift = 1;
        }

        var map = null;
        for (var k = 0 + shift; k < this.moves.length; k++) {
            var m = this.moves[k];
            var notation = m.getNotation();
            var cpt = ~~((k + shift)/2) + 1; // 1, 1, 2, 2, 3, 3

            if (m.color == Color.WHITE){
                mapw = {};
                mapw['position'] = k + 1;
                mapw['move'] = notation;
                mapw['current'] = (k == this.index);

                map = {};
                map['number'] = cpt;
                map['white'] = mapw;
            } else if (m.color == Color.BLACK){
                mapb = {};
                mapb['position'] = k + 1;
                mapb['move'] = notation;
                mapb['current'] = (k == this.index);
                map['black'] = mapb;

                list.push(map);
                map = null; // see after loop
            }
        }

        // is last move a white move ?
        if (map !== null){
            list.push(map);
        }
    }

    return list;
}


Game.prototype.debug = function() {
    console.log("Etat courant de la partie :");

    var s = "";
    for (var k = 0; k < this.moves.length; k++) {
        var m = this.moves[k];
        if (k == this.index) {
            s += "[" + m.getNotation() + "] ; ";
        } else {
            s += m.getNotation() + " ; ";
        }
    }
    console.log(s);
    this.board.debugDraughtBoard();
    console.log("");
};

Game.prototype.debugFull = function() {
    this.start();
    this.debug();

    while (this.hasNext()) {
        this.next();
        this.debug();
    }
};

module.exports = Game;
