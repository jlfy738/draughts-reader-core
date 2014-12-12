var
    DraughtBoard = require('./DraughtBoard'),
    Arbiter = require('./Arbiter')
;

function Game() {
    this.board = new DraughtBoard();
    this.moves = []; // [Move]
    this.index = -1;
}


/** Définition de la position */
Game.prototype.setPosition = function(piece, numbers) {
    this.board.setPosition(piece, numbers);
};

Game.prototype.setPosition20x20 = function() {
    this.board.setPosition20x20();
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

        var m = Arbiter.getMove(this.board, startNum, endNum, middleSquaresNum);
        // console.log("addMove(" + startNum + ">" + endNum + ") => mouvement=" + m);

        this.moves.push(m);
    } else {
        console.log("addMove: ERREUR");
    }
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

Game.prototype.next = function() {
    if (this.hasNext()) {
        this.index++;
        var m = this.moves[this.index];
        if (m.status) {
            this.board.play(m);
        } else {
            this.index--;
        }
    }
};

Game.prototype.prev = function() {
    if (this.hasPrev()) {
        var m = this.moves[this.index];
        if (m.status) {
            this.board.playInv(m);
            this.index--;
        }
    }
}

Game.prototype.start = function() {
    this._setIndex(-1);
};

Game.prototype.end = function() {
    this._setIndex(this._getLastIndex());
};

/** Position initiale = 0 ; Premier coup = 1. */
Game.prototype.setCursor = function(position) {
    this._setIndex(position - 1);
};

/** Position initiale = -1 ; premier coup = 0 */
Game.prototype._setIndex = function(idx) {
    idx = this._constrainIndex(idx);

    if (this.index < idx) {
        while (this.index < idx) {
            this.next();
        }
    } else if (this.index > idx) {
        while (this.index > idx) {
            this.prev();
        }
    }
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
    for (var k = 1; k <= this.moves.length - 2; k++) {
        var m = this.moves[k];
        if (!m.status) {
            err = true;
            break;
        }
    }
    return err;
};

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